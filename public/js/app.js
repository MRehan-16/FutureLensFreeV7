/* ═══════════════════════════════════════════════════
   FutureLens — Main Application JS  v7 (All Free)
═══════════════════════════════════════════════════ */

/* ── ALL FEATURES UNLOCKED ──────────────────────── */
let CURRENT_PLAN = 'premium'; // everything unlocked

/* ── STATE ──────────────────────────────────────── */
const state = {
  interests: [], career: '', salary: 0,
  budget: '', age: '', education: '',
  skill: '', country: 'UAE', motivation: '',
  currencySymbol: 'AED', currencyCode: 'AED',
  chosenCareer: ''
};

/* ── COUNTRY → CURRENCY ─────────────────────────── */
const COUNTRY_CURRENCY = {
  'uae':{'symbol':'AED','code':'AED'},'united arab emirates':{'symbol':'AED','code':'AED'},
  'saudi arabia':{'symbol':'SAR','code':'SAR'},'ksa':{'symbol':'SAR','code':'SAR'},
  'qatar':{'symbol':'QAR','code':'QAR'},'kuwait':{'symbol':'KWD','code':'KWD'},
  'bahrain':{'symbol':'BHD','code':'BHD'},'oman':{'symbol':'OMR','code':'OMR'},
  'egypt':{'symbol':'EGP','code':'EGP'},'jordan':{'symbol':'JOD','code':'JOD'},
  'lebanon':{'symbol':'USD','code':'USD'},'turkey':{'symbol':'₺','code':'TRY'},
  'uk':{'symbol':'£','code':'GBP'},'united kingdom':{'symbol':'£','code':'GBP'},
  'usa':{'symbol':'$','code':'USD'},'united states':{'symbol':'$','code':'USD'},
  'canada':{'symbol':'CAD','code':'CAD'},'australia':{'symbol':'AUD','code':'AUD'},
  'germany':{'symbol':'€','code':'EUR'},'france':{'symbol':'€','code':'EUR'},
  'india':{'symbol':'₹','code':'INR'},'pakistan':{'symbol':'₨','code':'PKR'},
};
function getCurrency(country) {
  const key = Object.keys(COUNTRY_CURRENCY).find(k => k === (country||'').toLowerCase().trim());
  return key ? COUNTRY_CURRENCY[key] : { symbol:'AED', code:'AED' };
}

/* ── CAREER SALARY HINTS ─────────────────────────── */
const CAREER_SALARY_HINTS = {
  'Software Engineer':     {min:8000, max:45000, typical:18000},
  'Data Scientist':        {min:10000,max:50000, typical:22000},
  'AI/ML Engineer':        {min:12000,max:55000, typical:25000},
  'Cybersecurity Analyst': {min:10000,max:40000, typical:20000},
  'Cloud Architect':       {min:15000,max:55000, typical:28000},
  'Mobile App Developer':  {min:8000, max:40000, typical:18000},
  'UX/UI Designer':        {min:7000, max:30000, typical:14000},
  'Product Designer':      {min:8000, max:35000, typical:16000},
  'Product Manager':       {min:12000,max:50000, typical:24000},
  'Business Analyst':      {min:8000, max:30000, typical:16000},
  'Mechanical Engineer':   {min:7000, max:30000, typical:14000},
  'Civil Engineer':        {min:7000, max:28000, typical:13000},
  'Electrical Engineer':   {min:8000, max:32000, typical:15000},
  'Aerospace Engineer':    {min:12000,max:45000, typical:22000},
  'Doctor':                {min:15000,max:60000, typical:30000},
  'Surgeon':               {min:25000,max:80000, typical:45000},
  'Pharmacist':            {min:8000, max:25000, typical:14000},
  'Game Developer':        {min:7000, max:30000, typical:15000},
  'Financial Analyst':     {min:8000, max:35000, typical:17000},
  'Investment Banker':     {min:15000,max:70000, typical:30000},
  'Digital Marketer':      {min:6000, max:25000, typical:12000},
  'Content Creator':       {min:4000, max:30000, typical:10000},
  'Lawyer':                {min:10000,max:45000, typical:20000},
  'Teacher':               {min:5000, max:18000, typical:9000},
};
function getCareerSalaryHint(career) {
  if (CAREER_SALARY_HINTS[career]) return CAREER_SALARY_HINTS[career];
  const key = Object.keys(CAREER_SALARY_HINTS).find(k =>
    career.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(career.toLowerCase())
  );
  return key ? CAREER_SALARY_HINTS[key] : {min:4000,max:60000,typical:12000};
}

/* ── CLOCK ──────────────────────────────────────── */
function updateClock() {
  const n=new Date();
  const te=document.getElementById('clock-time'), de=document.getElementById('clock-date');
  if(te) te.textContent=n.toLocaleTimeString('en-GB');
  if(de) de.textContent=n.toLocaleDateString('en-GB',{weekday:'short',year:'numeric',month:'short',day:'numeric'});
}
updateClock(); setInterval(updateClock,1000);

/* ── SCREEN NAV ─────────────────────────────────── */
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s=>{s.classList.remove('active');s.style.display='none';});
  const el=document.getElementById(id);
  el.style.display='flex';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    el.classList.add('active');
    window.scrollTo({top:0,behavior:'instant'});
  }));
  const nav=document.getElementById('main-nav');
  if(nav) nav.style.display=(id==='s-landing')?'flex':'none';
}
function scrollTo(id) { const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }

/* ── INTERESTS ──────────────────────────────────── */
function toggleInterest(el,val) {
  el.classList.toggle('selected');
  state.interests = el.classList.contains('selected')
    ? [...state.interests,val]
    : state.interests.filter(i=>i!==val);
}

/* ── CAREER SUGGESTIONS ─────────────────────────── */
const careerMap = {
  Technology:    ['Software Engineer','Data Scientist','Cybersecurity Analyst','AI/ML Engineer','Cloud Architect','Mobile App Developer'],
  Business:      ['Entrepreneur','Product Manager','Business Analyst','Management Consultant','Operations Director','Startup Founder'],
  Design:        ['UX/UI Designer','Brand Designer','Motion Designer','Product Designer','Creative Director','3D Artist'],
  Engineering:   ['Mechanical Engineer','Civil Engineer','Electrical Engineer','Aerospace Engineer','Robotics Engineer','Structural Engineer'],
  Medicine:      ['Doctor','Surgeon','Pharmacist','Medical Researcher','Dentist','Physiotherapist'],
  Gaming:        ['Game Developer','Game Designer','Level Designer','Esports Manager','Game Producer','QA Engineer'],
  Finance:       ['Financial Analyst','Investment Banker','Actuary','Portfolio Manager','FinTech Developer','CFO'],
  'Art & Media': ['Film Director','Content Creator','Video Editor','Animator','Journalist','Photographer'],
  Science:       ['Research Scientist','Biotechnologist','Environmental Scientist','Data Analyst','Chemist','Physicist'],
  Education:     ['Teacher','Curriculum Designer','Education Technologist','Corporate Trainer','University Lecturer'],
  Law:           ['Lawyer','Legal Consultant','Compliance Officer','Corporate Counsel','Paralegal'],
  Marketing:     ['Digital Marketer','Brand Strategist','Growth Hacker','SEO Specialist','Social Media Manager','CMO']
};
function buildCareerChips() {
  const wrap=document.getElementById('career-chips'); if(!wrap) return;
  const seen=new Set(),suggestions=[];
  state.interests.forEach(i=>(careerMap[i]||[]).forEach(c=>{if(!seen.has(c)){seen.add(c);suggestions.push(c);}}));
  wrap.innerHTML=suggestions.slice(0,14).map(s=>`<div class="chip" onclick="pickCareer('${s.replace(/'/g,"\\'")}')"> ${s}</div>`).join('');
}
function pickCareer(val) {
  state.career=val;
  const inp=document.getElementById('career-input');
  if(inp) inp.value=val;
  updateSalaryForCareer(val);
}
function syncCareer(val) { state.career=val; updateSalaryForCareer(val); }

/* ── SALARY SLIDER ──────────────────────────────── */
function updateSalaryForCareer(career) {
  if(!career) return;
  const hint=getCareerSalaryHint(career);
  const slider=document.getElementById('salary-slider'); if(!slider) return;
  slider.min=hint.min; slider.max=hint.max; slider.value=hint.typical;
  state.salary=hint.typical;
  updateSalaryDisplay(hint.typical);
  const scale=document.getElementById('salary-scale');
  if(scale) {
    const sym=state.currencySymbol;
    const fmt=v=>v>=1000?`${sym}${Math.round(v/1000)}k`:`${sym}${v}`;
    scale.innerHTML=`<span>${fmt(hint.min)}</span><span>${fmt(Math.round((hint.min+hint.max)/2))}</span><span>${fmt(hint.max)}</span>`;
  }
  const ctx=document.getElementById('salary-career-ctx');
  if(ctx) {
    const sym=state.currencySymbol;
    ctx.innerHTML=`
      <div class="sal-item"><div class="sal-v">${sym}${Math.round(hint.min/1000)}k–${Math.round(hint.min*1.5/1000)}k</div><div class="sal-l">Entry Level</div></div>
      <div class="sal-item"><div class="sal-v">${sym}${Math.round(hint.typical*0.8/1000)}k–${Math.round(hint.typical*1.2/1000)}k</div><div class="sal-l">Mid Level</div></div>
      <div class="sal-item"><div class="sal-v">${sym}${Math.round(hint.max*0.6/1000)}k–${Math.round(hint.max/1000)}k+</div><div class="sal-l">Senior Level</div></div>`;
  }
}
function updateSalaryDisplay(v) {
  const val=parseInt(v); state.salary=val;
  const el=document.getElementById('salary-display');
  if(el) el.innerHTML=`${state.currencySymbol} ${val.toLocaleString()} <span class="salary-period">/ month</span>`;
  const slider=document.getElementById('salary-slider');
  if(slider) {
    const min=parseInt(slider.min)||2000,max=parseInt(slider.max)||60000;
    const pct=Math.round(Math.max(0,Math.min(100,(val-min)/(max-min)*100)));
    slider.style.setProperty('--pct',pct+'%');
  }
}
function updateSalary(v) { updateSalaryDisplay(v); }

function onCountryChange(val) {
  state.country=val;
  const cur=getCurrency(val);
  state.currencySymbol=cur.symbol;
  state.currencyCode=cur.code;
  updateSalaryDisplay(state.salary);
  if(state.career) updateSalaryForCareer(state.career);
}

/* ── SELECT HELPERS ─────────────────────────────── */
function selectCard(el,gs,val,sk){document.querySelectorAll(gs).forEach(c=>c.classList.remove('selected'));el.classList.add('selected');state[sk]=val;}
function selectEdu(el,val)  {selectCard(el,'#edu-grid .sel-card',val,'education');}
function selectSkill(el,val){selectCard(el,'#skill-grid .sel-card',val,'skill');}
function selectMotiv(el,val){selectCard(el,'#motiv-grid .sel-card',val,'motivation');}

/* ── HOW IT WORKS PREVIEW ───────────────────────── */
const howPreviews=[
  {label:'Your Interests',  pct:32,chips:['Technology','Design','Gaming','Business']},
  {label:'Career Goal',     pct:58,chips:['Software Engineer','Game Developer','AI Engineer']},
  {label:'Salary & Budget', pct:48,chips:['Local currency','Free resources','Courses']},
  {label:'Choose Your Path',pct:75,chips:['Option 1','Option 2','Option 3']},
  {label:'Your Full Plan',  pct:95,chips:['Timeline','Skills','Resources','Actions']}
];
let howActive=0;
function setHowStep(i){
  howActive=i;
  document.querySelectorAll('.how-step').forEach((s,j)=>s.classList.toggle('active',j===i));
  const p=howPreviews[i];
  const label=document.getElementById('prev-label'),bar=document.getElementById('prev-bar'),chips=document.getElementById('prev-chips');
  if(!label) return;
  label.textContent=p.label; bar.style.width='0%';
  setTimeout(()=>{bar.style.width=p.pct+'%';},80);
  chips.innerHTML=p.chips.map(c=>`<div class="preview-chip">${c}</div>`).join('');
  setTimeout(()=>document.querySelectorAll('.preview-chip').forEach((el,j)=>setTimeout(()=>el.classList.add('lit'),j*110)),350);
}
window.addEventListener('DOMContentLoaded',()=>{
  setHowStep(0);
  setInterval(()=>setHowStep((howActive+1)%5),3000);
  updateSalaryDisplay(12000);
});

/* ── VALIDATION ─────────────────────────────────── */
function showErr(id,show){const el=document.getElementById(id);if(el)el.style.display=show?'block':'none';}
function nextInterests(){
  if(state.interests.length===0){showErr('int-err',true);return;}
  showErr('int-err',false);buildCareerChips();goTo('s-career');
}
function nextCareer(){
  const v=(document.getElementById('career-input')?.value||'').trim();
  if(v) state.career=v;
  if(!state.career){showErr('career-err',true);return;}
  showErr('career-err',false);goTo('s-salary');
}
function nextSalary(){goTo('s-budget');}
function nextBudget(){
  state.budget=document.getElementById('budget-input')?.value||'';
  state.age=document.getElementById('age-input')?.value||'';
  const ci=document.getElementById('country-input');
  if(ci) onCountryChange(ci.value||'UAE');
  if(!state.budget||!state.age||!state.education){showErr('budget-err',true);return;}
  showErr('budget-err',false);goTo('s-skill');
}
function nextSkill(){
  if(!state.skill){showErr('skill-err',true);return;}
  showErr('skill-err',false);goTo('s-motivation');
}
function nextMotivation(){
  if(!state.motivation){showErr('motiv-err',true);return;}
  showErr('motiv-err',false);startAnalysis();
}

/* ── LOADING ANIMATION ──────────────────────────── */
function animateLoadSteps(cb){
  const ids=['ls1','ls2','ls3','ls4','ls5'];
  let i=0;
  function tick(){
    if(i>0){const prev=document.getElementById(ids[i-1]);if(prev){prev.classList.remove('active');prev.classList.add('done');prev.querySelector('.load-step-icon').textContent='✓';}}
    if(i<ids.length){const cur=document.getElementById(ids[i]);if(cur)cur.classList.add('active');i++;setTimeout(tick,1400+Math.random()*300);}
    else{if(cb)cb();}
  }
  tick();
}

/* ── STEP 1: FETCH 3 OPTIONS ────────────────────── */
async function fetchOptions(){
  const res=await fetch('/api/generate-options',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({interests:state.interests,career:state.career,salary:state.salary,budget:state.budget,age:state.age,education:state.education,skill:state.skill,country:state.country,motivation:state.motivation,currency:state.currencyCode})
  });
  const data=await res.json();
  if(!res.ok||!data.success) throw new Error(data.error||'Failed to get career options');
  return data.options;
}

/* ── STEP 2: FETCH FULL PLAN ────────────────────── */
async function fetchPlan(chosenCareer){
  const res=await fetch('/api/generate-plan',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({interests:state.interests,career:chosenCareer,salary:state.salary,budget:state.budget,age:state.age,education:state.education,skill:state.skill,country:state.country,motivation:state.motivation,currency:state.currencyCode})
  });
  const data=await res.json();
  if(!res.ok||!data.success) throw new Error(data.error||'Failed to generate plan');
  return data.plan;
}

/* ── START ANALYSIS ─────────────────────────────── */
function startAnalysis(){
  ['ls1','ls2','ls3','ls4','ls5'].forEach((id,i)=>{
    const el=document.getElementById(id);if(!el)return;
    el.classList.remove('active','done');
    el.querySelector('.load-step-icon').textContent='◈';
    if(i===0)el.classList.add('active');
  });
  goTo('s-loading');
  let animDone=false,optionsDone=false,optionsResult=null;
  animateLoadSteps(()=>{animDone=true;if(optionsDone)showPickerScreen(optionsResult);});
  fetchOptions()
    .then(opts=>{optionsResult={ok:true,opts};optionsDone=true;if(animDone)showPickerScreen(optionsResult);})
    .catch(err=>{optionsResult={ok:false,error:err.message};optionsDone=true;if(animDone)showPickerScreen(optionsResult);});
}

/* ── SHOW PICKER — all 3 unlocked ──────────────── */
const DEMAND_COLOR={High:'var(--green)',Growing:'var(--gold)',Stable:'var(--blue)'};

function showPickerScreen(result){
  if(!result.ok){
    goTo('s-picker');
    document.getElementById('picker-cards').innerHTML=`<div class="res-error">${result.error}<br><br><button class="btn-restart" onclick="startAnalysis()">↻ Try Again</button></div>`;
    return;
  }
  const opts=result.opts||[];
  window._lastOptions={ok:true,opts};
  goTo('s-picker');
  const container=document.getElementById('picker-cards');
  container.innerHTML=opts.map((opt,idx)=>`
    <div class="picker-card ${idx===0?'picker-card-featured':''}" onclick="selectCareerOption(${idx},'${opt.title.replace(/'/g,"\\'")}')" id="pcard-${idx}">
      ${idx===0?'<div class="picker-first-tag">Best Match</div>':''}
      ${idx===1?'<div class="picker-alt-tag">Alternative</div>':''}
      ${idx===2?'<div class="picker-alt-tag">Explore</div>':''}
      <div class="picker-card-inner">
        <div class="picker-icon">${opt.icon||'🎯'}</div>
        <div class="picker-body">
          <div class="picker-title">${opt.title}</div>
          <div class="picker-tagline">${opt.tagline}</div>
          <div class="picker-meta">
            <span class="picker-meta-item"><span style="color:var(--gold)">💰</span> ${opt.salaryRange}</span>
            <span class="picker-meta-item"><span style="color:var(--text3)">⏱</span> ${opt.timeToTarget}</span>
            <span class="picker-meta-item" style="color:${DEMAND_COLOR[opt.demandLevel]||'var(--text2)'}">▲ ${opt.demandLevel} Demand</span>
            <span class="picker-meta-item"><span style="color:var(--text3)">🧠</span> ${opt.topSkill}</span>
          </div>
          <div class="picker-why">${opt.why}</div>
        </div>
        <div class="picker-select-btn" id="psel-${idx}">Select →</div>
      </div>
    </div>`).join('');
}

/* ── SELECT CAREER OPTION ───────────────────────── */
let selectedOptionIdx=null;
function selectCareerOption(idx,title){
  selectedOptionIdx=idx;
  state.chosenCareer=title;
  document.querySelectorAll('.picker-card').forEach((c,i)=>c.classList.toggle('picker-card-selected',i===idx));
  document.querySelectorAll('[id^="psel-"]').forEach((b,i)=>{
    b.textContent=i===idx?'✓ Selected':'Select →';
    b.style.background=i===idx?'var(--gold)':'';
    b.style.color=i===idx?'#080A0E':'';
  });
  setTimeout(()=>buildFullPlan(title),400);
}

function buildFullPlan(career){
  const loading=document.getElementById('picker-loading');
  const cards=document.getElementById('picker-cards');
  if(loading) loading.style.display='block';
  if(cards){cards.style.opacity='0.3';cards.style.pointerEvents='none';}
  fetchPlan(career)
    .then(plan=>showResults({ok:true,plan}))
    .catch(err=>showResults({ok:false,error:err.message}));
}

/* ═══════════════════════════════════════════════════
   RENDER RESULTS — all features unlocked
═══════════════════════════════════════════════════ */
function showResults(result){
  goTo('s-results');
  document.getElementById('res-actions').style.display='flex';

  if(!result.ok){
    document.getElementById('results-body').innerHTML=`
      <div class="res-error"><strong>Could not generate your plan.</strong><br><br>${result.error}<br><br>
        <button class="btn-restart" onclick="startAnalysis()" style="margin-top:10px;">↻ Try Again</button>
      </div>`;
    return;
  }

  const d=result.plan;
  const sym=state.currencySymbol;
  const careerName=state.chosenCareer||state.career;

  document.getElementById('res-title').textContent    = d.careerTitle||careerName;
  document.getElementById('res-headline').textContent = d.headline||'';

  const score=Math.min(95,Math.max(5,d.readinessScore||50));
  const offset=(Math.PI*2*44)*(1-score/100);
  setTimeout(()=>{
    const c=document.getElementById('score-circle'),t=document.getElementById('score-num');
    if(c) c.style.strokeDashoffset=offset;
    if(t) t.textContent=score+'%';
  },400);

  document.getElementById('res-tags').innerHTML=[
    `<span class="rtag rtag-gold">${d.timeline||'—'}</span>`,
    `<span class="rtag rtag-dark">${state.skill}</span>`,
    `<span class="rtag rtag-dark">${state.country}</span>`,
    `<span class="rtag rtag-green">Readiness: ${score}%</span>`
  ].join('');

  /* SKILLS */
  const skillsHTML=(d.skills||[]).map((s,i)=>{
    const bc=s.priority==='Essential'?'badge-e':s.priority==='Important'?'badge-i':'badge-u';
    return `<div class="skill-row">
      <div class="skill-num">${i+1}</div>
      <div class="skill-name">${s.name}${s.why?`<div style="font-size:11px;color:var(--text3);margin-top:2px;font-weight:400;">${s.why}</div>`:''}</div>
      <div class="skill-badges"><span class="badge ${bc}">${s.priority}</span></div>
      <div class="skill-time">${s.timeToLearn}</div>
    </div>`;
  }).join('');

  /* ROADMAP — all 4 phases fully visible */
  const roadHTML=(d.roadmap||[]).map((r,i)=>`
    <div class="road-step">
      <div class="road-dot">0${i+1}</div>
      <div class="road-body">
        <div class="road-time">${r.timeline||r.phase}</div>
        <div class="road-title">${r.title}</div>
        <div class="road-desc">${r.description}</div>
        ${r.tasks?`<ul class="road-tasks">${r.tasks.map(t=>`<li>${t}</li>`).join('')}</ul>`:''}
        ${r.milestone?`<div class="road-milestone">🎯 ${r.milestone}</div>`:''}
      </div>
    </div>`).join('');

  /* RESOURCES */
  const freeHTML=(d.freeLearning||[]).map(r=>`
    <div class="res-item">
      <span class="res-item-name">
        ${r.url?`<a href="${r.url}" target="_blank" rel="noopener" class="res-link">${r.name} ↗</a>`:r.name}
        <div style="font-size:11px;color:var(--text3);margin-top:2px;">${r.description||''}</div>
      </span>
      <span class="res-item-type">${r.type}</span>
      <span class="res-item-cost free">Free</span>
    </div>`).join('');

  const paidHTML=(d.paidLearning||[]).map(r=>`
    <div class="res-item">
      <span class="res-item-name">
        ${r.url?`<a href="${r.url}" target="_blank" rel="noopener" class="res-link">${r.name} ↗</a>`:r.name}
        <div style="font-size:11px;color:var(--text3);margin-top:2px;">${r.roi||''}</div>
      </span>
      <span class="res-item-type">${r.type}</span>
      <span class="res-item-cost">${r.cost}</span>
    </div>`).join('');

  /* BUDGET */
  const bud=parseInt(state.budget)||0;
  const allocRows=(d.budgetAllocation||[]).map(a=>{
    const pct=bud>0?Math.round((a.amount||0)/bud*100):0;
    return `<div class="budget-alloc-row">
      <div class="budget-alloc-left">
        <div class="budget-alloc-name">${a.category}</div>
        <div class="budget-alloc-desc">${a.description||''}</div>
      </div>
      <div class="budget-alloc-right">
        <div class="budget-alloc-bar"><div class="budget-alloc-fill" style="width:${Math.min(pct,100)}%"></div></div>
        <div class="budget-alloc-amount">${sym} ${(a.amount||0).toLocaleString()}</div>
      </div>
    </div>`;
  }).join('');

  /* QUICK WINS */
  const qwColors=['var(--gold)','var(--blue)','var(--green)'];
  const qwLabels=['Today','This Week','This Month'];
  const quickHTML=(d.quickWins||[]).map((w,i)=>`
    <div class="qw-item">
      <span class="qw-badge" style="color:${qwColors[i]};border-color:${qwColors[i]};">${qwLabels[i]}</span>
      <span style="font-size:13px;color:var(--text2);line-height:1.5;">${w}</span>
    </div>`).join('');

  const altHTML=(d.alternativeCareers||[]).map(a=>
    `<div class="alt-card"><div class="alt-title">${a.title}</div><div class="alt-reason">${a.reason}</div></div>`
  ).join('');

  /* COMPARE CAREERS — fully unlocked */
  const compareSection=`
    <div class="res-section">
      <div class="res-sec-header"><div class="res-sec-icon">⚔️</div><div class="res-sec-title">Compare Career Paths</div></div>
      <div class="compare-tool">
        <p style="font-size:13px;color:var(--text2);margin-bottom:16px;">
          Currently viewing: <strong style="color:var(--text)">${careerName}</strong>. Enter another career below to compare salaries, timelines, skills, and more side by side.
        </p>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          <input class="field-input" id="compare-input" placeholder="e.g. Data Scientist, Product Manager..." style="flex:1;min-width:200px;padding:12px 14px;">
          <button onclick="runComparison()" id="compare-btn" style="padding:12px 22px;background:var(--gold);color:#080A0E;border:none;border-radius:4px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;">Compare →</button>
        </div>
        <div id="compare-result" style="margin-top:20px;"></div>
      </div>
    </div>`;

  document.getElementById('results-body').innerHTML=`
    ${d.motivationalNote?`<div class="mot-card"><div class="mot-label">A Note For You</div><div class="mot-text">"${d.motivationalNote}"</div></div>`:''}

    <div class="res-section">
      <div class="res-sec-header"><div class="res-sec-icon">📊</div><div class="res-sec-title">Salary Progression — ${state.country}</div></div>
      <div class="metrics-row">
        <div class="metric-card"><div class="metric-label">Starting Salary</div><div class="metric-value">${d.startingSalary||'—'}</div><div class="metric-note">Year 1 expectation</div></div>
        <div class="metric-card"><div class="metric-label">3 Years In</div><div class="metric-value">${d.midSalary||'—'}</div><div class="metric-note">With consistent effort</div></div>
        <div class="metric-card"><div class="metric-label">Target</div><div class="metric-value">${d.peakSalary||'—'}</div><div class="metric-note">${d.timeline||'Long-term'}</div></div>
      </div>
      ${d.readinessNote?`<div style="margin-top:12px;padding:12px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);font-size:13px;color:var(--text2);">${d.readinessNote}</div>`:''}
    </div>

    <div class="res-section">
      <div class="res-sec-header"><div class="res-sec-icon">🧠</div><div class="res-sec-title">Skills to Master</div></div>
      <div class="skills-list">${skillsHTML}</div>
    </div>

    <div class="res-section">
      <div class="res-sec-header"><div class="res-sec-icon">🗺️</div><div class="res-sec-title">Your Full Roadmap</div></div>
      <div class="roadmap">${roadHTML}</div>
    </div>

    <div class="res-section">
      <div class="res-sec-header"><div class="res-sec-icon">📚</div><div class="res-sec-title">Learning Resources</div></div>
      <div class="resources-grid">
        <div class="res-card"><div class="res-card-header">Free Resources</div>${freeHTML}</div>
        <div class="res-card"><div class="res-card-header">Paid Resources</div>${paidHTML}</div>
      </div>
    </div>

    <div class="res-section">
      <div class="res-sec-header"><div class="res-sec-icon">💸</div><div class="res-sec-title">Budget Plan — ${sym} ${bud.toLocaleString()}/month</div></div>
      <div class="budget-alloc-wrap">${allocRows}</div>
      ${d.budgetAdvice?`<div class="budget-advice">${d.budgetAdvice}</div>`:''}
    </div>

    <div class="res-section">
      <div class="res-sec-header"><div class="res-sec-icon">⚡</div><div class="res-sec-title">Quick Wins — Start Now</div></div>
      <div class="quick-wins">${quickHTML}</div>
    </div>

    ${altHTML?`<div class="res-section">
      <div class="res-sec-header"><div class="res-sec-icon">🔀</div><div class="res-sec-title">Alternative Paths</div></div>
      <div class="alt-grid">${altHTML}</div>
    </div>`:''}

    ${compareSection}
  `;
  window._lastResult=result;
}

/* ── COMPARE FEATURE — detailed side by side ─────── */
async function runComparison(){
  const input=document.getElementById('compare-input');
  const career2=(input?.value||'').trim();
  if(!career2){
    input.style.borderColor='var(--red)';
    input.focus();
    return;
  }
  input.style.borderColor='';
  const btn=document.getElementById('compare-btn');
  const result=document.getElementById('compare-result');
  btn.textContent='Comparing...';
  btn.disabled=true;
  result.innerHTML=`
    <div style="padding:32px;text-align:center;color:var(--text3);">
      <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.1em;color:var(--gold);margin-bottom:8px;">GENERATING COMPARISON</div>
      Building detailed comparison for <strong style="color:var(--text)">${career2}</strong>...
    </div>`;

  try {
    const p2=await fetchPlan(career2);
    const d1=window._lastResult?.plan;
    if(!d1) throw new Error('Original plan not found');

    const career1=state.chosenCareer||state.career;
    const sym=state.currencySymbol;

    // Score each on key dimensions for a visual indicator
    const score1=d1.readinessScore||50;
    const score2=p2.readinessScore||50;

    result.innerHTML=`
      <!-- HEADER -->
      <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;margin-bottom:20px;">
        <div style="background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:8px;padding:16px 18px;text-align:center;">
          <div style="font-size:11px;color:var(--gold);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">Your Choice</div>
          <div style="font-size:16px;font-weight:600;color:var(--text);">${d1.careerTitle||career1}</div>
        </div>
        <div style="font-size:20px;color:var(--text3);text-align:center;">VS</div>
        <div style="background:var(--blue-dim);border:1px solid rgba(91,155,213,.25);border-radius:8px;padding:16px 18px;text-align:center;">
          <div style="font-size:11px;color:var(--blue);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">Compared Career</div>
          <div style="font-size:16px;font-weight:600;color:var(--text);">${p2.careerTitle||career2}</div>
        </div>
      </div>

      <!-- SALARY COMPARISON -->
      <div class="compare-block">
        <div class="compare-block-title">💰 Salary Comparison</div>
        <div class="compare-row">
          <div class="compare-cell c-left">
            <div class="compare-val">${d1.startingSalary||'—'}</div><div class="compare-sublabel">Starting</div>
            <div class="compare-val" style="color:var(--gold)">${d1.midSalary||'—'}</div><div class="compare-sublabel">3 Years</div>
            <div class="compare-val">${d1.peakSalary||'—'}</div><div class="compare-sublabel">Peak</div>
          </div>
          <div class="compare-divider"></div>
          <div class="compare-cell c-right">
            <div class="compare-val">${p2.startingSalary||'—'}</div><div class="compare-sublabel">Starting</div>
            <div class="compare-val" style="color:var(--blue)">${p2.midSalary||'—'}</div><div class="compare-sublabel">3 Years</div>
            <div class="compare-val">${p2.peakSalary||'—'}</div><div class="compare-sublabel">Peak</div>
          </div>
        </div>
      </div>

      <!-- TIMELINE -->
      <div class="compare-block">
        <div class="compare-block-title">⏱ Time to Target Salary</div>
        <div class="compare-row">
          <div class="compare-cell c-left"><div class="compare-big">${d1.timeline||'—'}</div></div>
          <div class="compare-divider"></div>
          <div class="compare-cell c-right"><div class="compare-big">${p2.timeline||'—'}</div></div>
        </div>
      </div>

      <!-- READINESS -->
      <div class="compare-block">
        <div class="compare-block-title">🎯 Your Readiness Score</div>
        <div class="compare-row">
          <div class="compare-cell c-left">
            <div class="compare-big" style="color:var(--gold)">${score1}%</div>
            <div class="compare-bar-wrap"><div class="compare-bar-fill" style="width:${score1}%;background:var(--gold);"></div></div>
            <div class="compare-sublabel">${d1.readinessNote||''}</div>
          </div>
          <div class="compare-divider"></div>
          <div class="compare-cell c-right">
            <div class="compare-big" style="color:var(--blue)">${score2}%</div>
            <div class="compare-bar-wrap"><div class="compare-bar-fill" style="width:${score2}%;background:var(--blue);"></div></div>
            <div class="compare-sublabel">${p2.readinessNote||''}</div>
          </div>
        </div>
      </div>

      <!-- TOP SKILLS -->
      <div class="compare-block">
        <div class="compare-block-title">🧠 Top Skills Required</div>
        <div class="compare-row" style="align-items:flex-start;">
          <div class="compare-cell c-left" style="gap:6px;">
            ${(d1.skills||[]).slice(0,4).map((s,i)=>`
              <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
                <span style="font-size:11px;color:var(--gold);font-family:'DM Mono',monospace;min-width:14px;">${i+1}</span>
                <span style="font-size:13px;color:var(--text2);">${s.name}</span>
                <span style="margin-left:auto;font-size:10px;color:var(--text3);">${s.timeToLearn}</span>
              </div>`).join('')}
          </div>
          <div class="compare-divider"></div>
          <div class="compare-cell c-right" style="gap:6px;">
            ${(p2.skills||[]).slice(0,4).map((s,i)=>`
              <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
                <span style="font-size:11px;color:var(--blue);font-family:'DM Mono',monospace;min-width:14px;">${i+1}</span>
                <span style="font-size:13px;color:var(--text2);">${s.name}</span>
                <span style="margin-left:auto;font-size:10px;color:var(--text3);">${s.timeToLearn}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- FIRST PHASE -->
      <div class="compare-block">
        <div class="compare-block-title">🗺️ First 3 Months</div>
        <div class="compare-row" style="align-items:flex-start;">
          <div class="compare-cell c-left">
            <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:6px;">${d1.roadmap?.[0]?.title||'Foundation'}</div>
            <div style="font-size:12px;color:var(--text2);line-height:1.65;">${d1.roadmap?.[0]?.description||'—'}</div>
          </div>
          <div class="compare-divider"></div>
          <div class="compare-cell c-right">
            <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:6px;">${p2.roadmap?.[0]?.title||'Foundation'}</div>
            <div style="font-size:12px;color:var(--text2);line-height:1.65;">${p2.roadmap?.[0]?.description||'—'}</div>
          </div>
        </div>
      </div>

      <!-- VERDICT -->
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:20px;margin-top:4px;">
        <div style="font-size:11px;color:var(--gold);text-transform:uppercase;letter-spacing:.1em;font-weight:600;margin-bottom:10px;">💡 Bottom Line</div>
        <div style="font-size:13px;color:var(--text2);line-height:1.75;">
          <strong style="color:var(--text)">${d1.careerTitle||career1}</strong> gives you a readiness score of <strong style="color:var(--gold)">${score1}%</strong> based on your current profile.
          <strong style="color:var(--text)">${p2.careerTitle||career2}</strong> gives you <strong style="color:var(--blue)">${score2}%</strong>.
          ${score1>=score2
            ? ` Your original choice fits your current profile better — but both are valid paths. The best career is the one you're genuinely excited to work in every day.`
            : ` The compared career actually matches your current profile slightly better. Consider whether it aligns with what motivates you.`}
        </div>
        <div style="margin-top:12px;">
          <button onclick="selectAndBuild('${career2.replace(/'/g,"\\'")}')"
            style="padding:10px 20px;background:var(--blue-dim);border:1px solid rgba(91,155,213,.3);color:var(--blue);border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;margin-right:10px;">
            Switch to ${career2.split(' ').slice(0,2).join(' ')} →
          </button>
          <button onclick="document.getElementById('compare-result').innerHTML='';document.getElementById('compare-input').value=''"
            style="padding:10px 20px;background:transparent;border:1px solid var(--border2);color:var(--text2);border-radius:4px;font-size:13px;cursor:pointer;">
            Clear
          </button>
        </div>
      </div>`;

  } catch(err) {
    result.innerHTML=`<div class="res-error">Could not compare: ${err.message}<br><button onclick="runComparison()" style="margin-top:10px;padding:8px 16px;background:var(--gold);color:#080A0E;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">Try Again</button></div>`;
  } finally {
    btn.textContent='Compare →';
    btn.disabled=false;
  }
}

function selectAndBuild(career){
  state.chosenCareer=career;
  buildFullPlan(career);
}

/* ── RESTART ────────────────────────────────────── */
function restart(){
  Object.assign(state,{interests:[],career:'',salary:12000,budget:'',age:'',education:'',skill:'',country:'UAE',motivation:'',currencySymbol:'AED',currencyCode:'AED',chosenCareer:''});
  document.querySelectorAll('.int-card,.sel-card').forEach(e=>e.classList.remove('selected'));
  ['career-input','budget-input','age-input'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const ci=document.getElementById('country-input');if(ci)ci.value='UAE';
  updateSalaryDisplay(12000);
  const sl=document.getElementById('salary-slider');if(sl){sl.min=4000;sl.max=60000;sl.value=12000;}
  document.querySelectorAll('.err-msg').forEach(e=>e.style.display='none');
  const sc=document.getElementById('score-circle'),sn=document.getElementById('score-num');
  if(sc)sc.style.strokeDashoffset='276.5';if(sn)sn.textContent='—';
  document.getElementById('results-body').innerHTML='<div class="res-loading">Your plan will appear here.</div>';
  document.getElementById('res-actions').style.display='none';
  window._lastResult=null;window._lastOptions=null;
  selectedOptionIdx=null;
  goTo('s-landing');
}
