require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const path      = require('path');
const https     = require('https');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

const planLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 20,
  message: { error: 'Too many requests. Wait an hour and try again.' },
});

app.use(express.static(path.join(__dirname, '../public')));
app.get('/',        (_q,r) => r.sendFile(path.join(__dirname, '../public/index.html')));
app.get('/pricing', (_q,r) => r.sendFile(path.join(__dirname, '../public/pages/pricing.html')));

const MODELS = [
  { id: 'llama-3.3-70b-versatile',                    label: 'Llama 3.3 70B'   },
  { id: 'meta-llama/llama-4-scout-17b-16e-instruct',  label: 'Llama 4 Scout'   },
  { id: 'moonshotai/kimi-k2-instruct',                label: 'Kimi K2'         },
  { id: 'llama-3.1-8b-instant',                       label: 'Llama 3.1 8B'    },
];

function groqRequest(apiKey, modelId, messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ model: modelId, messages, max_tokens: 3500, temperature: 0.75 });
    const req  = https.request({
      hostname: 'api.groq.com',
      path:     '/openai/v1/chat/completions',
      method:   'POST',
      headers:  {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          if (res.statusCode === 200) resolve(json);
          else { const e = new Error(json.error?.message || `HTTP ${res.statusCode}`); e.status = res.statusCode; reject(e); }
        } catch { reject(new Error(`Bad JSON: ${raw.slice(0,120)}`)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function getSym(curr) {
  const map = { GBP:'£', USD:'$', EUR:'€', INR:'₹', TRY:'₺', SAR:'SAR ', QAR:'QAR ', KWD:'KWD ', BHD:'BHD ', OMR:'OMR ', EGP:'EGP ', JOD:'JOD ' };
  return map[curr] || (curr + ' ');
}

function getBudgetAlloc(bud, sym) {
  if (bud === 0) return [
    { category:'Free Online Courses',   amount:0, description:'freeCodeCamp, Coursera audit, YouTube tutorials' },
    { category:'Practice Projects',     amount:0, description:'Build real projects using free tools and GitHub' },
    { category:'Community & Network',   amount:0, description:'Discord servers, LinkedIn, open source contributions' },
  ];
  if (bud < 100) return [
    { category:'1 Udemy Course/month',  amount:Math.floor(bud*0.6),  description:`Wait for Udemy sales — courses go as low as ${sym}15` },
    { category:'Domain & Hosting',      amount:Math.floor(bud*0.25), description:'Portfolio website domain and basic hosting' },
    { category:'Books/Resources',       amount:bud-Math.floor(bud*0.6)-Math.floor(bud*0.25), description:'1-2 e-books or premium tutorials per month' },
  ];
  if (bud < 300) return [
    { category:'Online Courses',        amount:Math.floor(bud*0.45), description:'Udemy + Coursera — buy during sales for best value' },
    { category:'Tools & Software',      amount:Math.floor(bud*0.25), description:'Career-specific software subscriptions' },
    { category:'Portfolio Hosting',     amount:Math.floor(bud*0.15), description:'Domain, hosting, and portfolio site' },
    { category:'Books & References',    amount:bud-Math.floor(bud*0.45)-Math.floor(bud*0.25)-Math.floor(bud*0.15), description:'Technical books and premium tutorials' },
  ];
  return [
    { category:'Course Platform',       amount:Math.floor(bud*0.35), description:'LinkedIn Learning, Pluralsight, or Skillshare subscription' },
    { category:'Career Tools',          amount:Math.floor(bud*0.25), description:'Professional tools actively used in this industry' },
    { category:'Certification Prep',    amount:Math.floor(bud*0.2),  description:'Study materials for high-value certifications' },
    { category:'Networking & Events',   amount:Math.floor(bud*0.1),  description:'Industry meetups and virtual conferences' },
    { category:'Portfolio & Branding',  amount:bud-Math.floor(bud*0.35)-Math.floor(bud*0.25)-Math.floor(bud*0.2)-Math.floor(bud*0.1), description:'Domain, portfolio, LinkedIn Premium trial' },
  ];
}

// ── Build prompt for ONE career plan ─────────────────────
function buildPlanPrompt({ interests, career, salary, budget, age, education, skill, country, motivation, currency }) {
  const iList = Array.isArray(interests) ? interests.join(', ') : String(interests);
  const sal   = parseInt(salary) || 8000;
  const bud   = Math.max(0, parseInt(budget) || 0);
  const curr  = currency || 'AED';
  const sym   = getSym(curr);
  const alloc = JSON.stringify(getBudgetAlloc(bud, sym));

  return `You are FutureLens, an expert career advisor for students aged 13-25.

STUDENT PROFILE:
- Interests: ${iList}
- Career Goal: ${career}
- Target Salary: ${sym}${sal.toLocaleString()}/month
- Monthly Budget: ${sym}${bud.toLocaleString()}
- Age: ${age}, Education: ${education}, Skill: ${skill}
- Country: ${country || 'UAE'}, Currency: ${curr} (symbol: ${sym})
- Motivation: ${motivation || 'career success'}

RULES:
- ALL salary values must use ${sym} — real ${country} market rates
- Use real URLs: freeCodeCamp=https://freecodecamp.org, Coursera=https://coursera.org, Udemy=https://udemy.com, YouTube=https://youtube.com, LinkedIn Learning=https://linkedin.com/learning, GitHub=https://github.com, MDN=https://developer.mozilla.org, Khan Academy=https://khanacademy.org
- Budget ${sym}0: free only. Under ${sym}100: mostly free. ${sym}100+: good mix
- Roadmap: 3-5 detailed sentences per phase + 4 specific weekly tasks each
- Be specific, encouraging, realistic

Respond with ONLY valid JSON, no markdown, no backticks:
{"careerTitle":"","headline":"one sentence max 14 words","timeline":"X-Y years","startingSalary":"${sym}X,XXX/month","midSalary":"${sym}X,XXX/month","peakSalary":"${sym}X,XXX/month","readinessScore":55,"readinessNote":"one sentence","skills":[{"name":"","priority":"Essential","timeToLearn":"","why":""},{"name":"","priority":"Essential","timeToLearn":"","why":""},{"name":"","priority":"Important","timeToLearn":"","why":""},{"name":"","priority":"Important","timeToLearn":"","why":""},{"name":"","priority":"Useful","timeToLearn":"","why":""}],"roadmap":[{"phase":"Foundation","timeline":"Months 1-3","title":"","description":"3-5 specific sentences with real resources","tasks":["task1","task2","task3","task4"],"milestone":""},{"phase":"Building","timeline":"Months 4-8","title":"","description":"3-5 specific sentences","tasks":["task1","task2","task3","task4"],"milestone":""},{"phase":"Portfolio","timeline":"Months 9-14","title":"","description":"3-5 specific sentences","tasks":["task1","task2","task3","task4"],"milestone":""},{"phase":"Launch","timeline":"Months 15-18","title":"","description":"3-5 specific sentences","tasks":["task1","task2","task3","task4"],"milestone":"first job offer"}],"freeLearning":[{"name":"","type":"Platform","url":"https://real.com","description":""},{"name":"","type":"YouTube","url":"https://youtube.com","description":""},{"name":"","type":"Website","url":"https://real.com","description":""},{"name":"","type":"Community","url":"https://real.com","description":""}],"paidLearning":[{"name":"","type":"Course","url":"https://real.com","cost":"${sym}X","roi":""},{"name":"","type":"Certification","url":"https://real.com","cost":"${sym}X","roi":""},{"name":"","type":"Program","url":"https://real.com","cost":"${sym}X","roi":""}],"budgetAllocation":${alloc},"budgetAdvice":"3-4 specific sentences about maximizing ${sym}${bud}/month for ${career} in ${country}","motivationalNote":"2-3 genuine encouraging sentences for this ${age}-year-old interested in ${iList} wanting to be a ${career}","quickWins":["free action today","action this week","goal this month"],"alternativeCareers":[{"title":"","reason":""},{"title":"","reason":""}]}`;
}

// ── Build prompt to get 3 career options summary ──────────
function buildOptionsPrompt({ interests, career, salary, budget, age, education, skill, country, motivation, currency }) {
  const iList = Array.isArray(interests) ? interests.join(', ') : String(interests);
  const sal   = parseInt(salary) || 8000;
  const curr  = currency || 'AED';
  const sym   = getSym(curr);

  return `You are FutureLens, a career advisor for students aged 13-25.

A student wants to become a "${career}" (interests: ${iList}, age: ${age}, location: ${country || 'UAE'}, target salary: ${sym}${sal.toLocaleString()}/month).

Generate exactly 3 distinct career path options related to their goal. Option 1 should be closest to their stated goal. Options 2 and 3 should be interesting related alternatives they may not have considered.

For each, provide a summary card (NOT the full plan — just enough to choose).

Respond with ONLY valid JSON, no markdown, no backticks:
{"options":[
  {"id":1,"title":"exact career title","tagline":"one exciting sentence about this path max 12 words","salaryRange":"${sym}X,XXX-XX,XXX/month","timeToTarget":"X-Y years","demandLevel":"High|Growing|Stable","topSkill":"single most important skill","why":"one sentence why this suits their interests in ${iList}","icon":"single relevant emoji"},
  {"id":2,"title":"related career title","tagline":"one exciting sentence","salaryRange":"${sym}X,XXX-XX,XXX/month","timeToTarget":"X-Y years","demandLevel":"High|Growing|Stable","topSkill":"single most important skill","why":"one sentence why this suits them","icon":"single emoji"},
  {"id":3,"title":"another related career title","tagline":"one exciting sentence","salaryRange":"${sym}X,XXX-XX,XXX/month","timeToTarget":"X-Y years","demandLevel":"High|Growing|Stable","topSkill":"single most important skill","why":"one sentence why this suits them","icon":"single emoji"}
]}`;
}

// ── Shared model caller with fallback ────────────────────
async function callWithFallback(apiKey, messages, label) {
  for (const { id, label: mLabel } of MODELS) {
    try {
      console.log(`  → [${label}] Trying ${mLabel}`);
      const result  = await groqRequest(apiKey, id, messages);
      const raw     = result.choices?.[0]?.message?.content || '';
      let   jsonStr = raw.replace(/```json\s*/gi,'').replace(/```\s*/gi,'').trim();
      const s = jsonStr.indexOf('{'), e = jsonStr.lastIndexOf('}');
      if (s !== -1 && e !== -1) jsonStr = jsonStr.slice(s, e+1);
      const parsed = JSON.parse(jsonStr);
      console.log(`  ✓ [${label}] Success with ${mLabel}`);
      return parsed;
    } catch (err) {
      const status = err.status || 0;
      const msg    = String(err.message || '').toLowerCase();
      console.log(`  ✗ [${label}] ${mLabel} — ${status}: ${err.message?.slice(0,60)}`);
      if (status === 401) throw new Error('Invalid Groq API key. Check GROQ_API_KEY in .env');
      if (status === 400 || status === 403 || status === 404 || msg.includes('decommission') || msg.includes('blocked')) continue;
      if (status === 429 || msg.includes('rate') || msg.includes('quota')) { console.log('    quota hit, trying next...'); continue; }
      continue;
    }
  }
  throw new Error('All models temporarily unavailable. Please try again in a moment.');
}

const SYS = { role:'system', content:'You are a JSON-only career advisor AI. Always respond with a single valid JSON object. No text before or after. No markdown. No backticks.' };

// ── POST /api/generate-options — step 1: get 3 options ───
app.post('/api/generate-options', planLimiter, async (req, res) => {
  const { interests, career, salary, budget, age, education, skill, country, motivation, currency } = req.body;
  if (!interests || !career || !age || !education || !skill)
    return res.status(400).json({ error: 'Missing required fields.' });

  const apiKey = (process.env.GROQ_API_KEY || '').trim();
  if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE')
    return res.status(500).json({ error: 'API key not set. Open .env and add GROQ_API_KEY=your_key then restart.' });

  try {
    const prompt  = buildOptionsPrompt({ interests, career, salary, budget, age, education, skill, country, motivation, currency });
    const result  = await callWithFallback(apiKey, [SYS, { role:'user', content:prompt }], 'options');
    return res.json({ success: true, options: result.options });
  } catch (err) {
    console.error('Options error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ── POST /api/generate-plan — step 2: full plan for chosen career ──
app.post('/api/generate-plan', planLimiter, async (req, res) => {
  const { interests, career, salary, budget, age, education, skill, country, motivation, currency } = req.body;
  if (!interests || !career || !salary || !budget || !age || !education || !skill)
    return res.status(400).json({ error: 'Missing required fields.' });

  const apiKey = (process.env.GROQ_API_KEY || '').trim();
  if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE')
    return res.status(500).json({ error: 'API key not set. Open .env and add GROQ_API_KEY=your_key then restart.' });

  try {
    const prompt = buildPlanPrompt({ interests, career, salary, budget, age, education, skill, country, motivation, currency });
    const plan   = await callWithFallback(apiKey, [SYS, { role:'user', content:prompt }], 'plan');
    return res.json({ success: true, plan });
  } catch (err) {
    console.error('Plan error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (_req, res) => {
  const key = (process.env.GROQ_API_KEY || '').trim();
  const ok  = !!(key && key !== 'YOUR_GROQ_API_KEY_HERE');
  res.json({ status:'ok', provider:'Groq', keySet:ok, models:MODELS.map(m=>m.id) });
});

app.use((_req,res) => res.status(404).sendFile(path.join(__dirname,'../public/index.html')));

app.listen(PORT, () => {
  const key = (process.env.GROQ_API_KEY || '').trim();
  const ok  = !!(key && key !== 'YOUR_GROQ_API_KEY_HERE');
  console.log(`\n  ╔══════════════════════════════════════════╗`);
  console.log(`  ║  FutureLens  →  http://localhost:${PORT}     ║`);
  console.log(`  ╚══════════════════════════════════════════╝`);
  console.log(`  Provider : Groq (free tier)`);
  console.log(ok ? `  API Key  : ✓ (${key.slice(0,6)}...${key.slice(-4)})` : `  API Key  : ⚠  NOT SET`);
  console.log(`  Models   : ${MODELS.map(m=>m.label).join(' → ')}\n`);
});
