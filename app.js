const I18N = {
  en: {
    nav_program: "Research Program",
    nav_projects: "Outputs",
    nav_members: "Members",
    nav_funding: "Funding",
    projects_title: "Outputs",
    projects_show_more: "Show more",
    projects_show_less: "Show less",
    action_data: "data",
    action_text: "text",
    action_video: "video",
    action_code: "code",
    members_title: "Members",
    funding_title: "Funding",
    funding_lede: "Research conducted within the Machina Research Network is supported by a combination of competitive grants and research contracts.",
    grant_type_grant: "Grant",
    grant_type_contract: "Contract",
    hero_title: "MACHINA RESEARCH NETWORK",
    hero_subtitle: "Computational Interdisciplinary Research",
    hero_cta: "View Outputs"
  },
  fr: {
    nav_program: "Programme de recherche",
    nav_projects: "Outputs",
    nav_members: "Membres",
    nav_funding: "Financement",
    projects_title: "Outputs",
    projects_show_more: "Voir plus",
    projects_show_less: "Voir moins",
    action_data: "données",
    action_text: "texte",
    action_video: "vidéo",
    action_code: "code",
    members_title: "Membres",
    funding_title: "Financement",
    funding_lede: "Les recherches menées au sein du Machina Research Network sont financées par un ensemble de subventions et de contrats de recherche.",
    grant_type_grant: "Subvention",
    grant_type_contract: "Contrat",
    hero_title: "MACHINA RESEARCH NETWORK",
    hero_subtitle: "Recherche Interdisciplinaire Computationnelle",
    hero_cta: "Voir les Outputs"
  }
};

let currentLang = localStorage.getItem("lang") || "en";
let dynamicData = { outputs: null, members: null, funding: null, program: null };

async function loadDynamicData() {
  try {
    const [outputs, members, funding, program] = await Promise.all([
      fetch('/api/outputs').then(r => r.json()),
      fetch('/api/members').then(r => r.json()),
      fetch('/api/funding').then(r => r.json()),
      fetch('/api/program').then(r => r.json())
    ]);
    dynamicData = { outputs, members, funding, program };
    
    if (program && program.program) {
      program.program.paragraphs.forEach(p => {
        I18N.en[p.key] = p.en;
        I18N.fr[p.key] = p.fr;
      });
      I18N.en.program_title = program.program.titleEN;
      I18N.fr.program_title = program.program.titleFR;
    }
    
    if (outputs && outputs.categories) {
      outputs.categories.forEach(cat => {
        if (cat.titleKey) {
          I18N.en[cat.titleKey] = cat.titleEN;
          I18N.fr[cat.titleKey] = cat.titleFR;
        }
        cat.outputs.forEach(o => {
          if (o.titleKey) {
            I18N.en[o.titleKey] = o.titleEN;
            I18N.fr[o.titleKey] = o.titleFR;
          }
          if (o.metaKey) {
            I18N.en[o.metaKey] = o.metaEN;
            I18N.fr[o.metaKey] = o.metaFR;
          }
        });
      });
    }
    
    if (members && members.members) {
      members.members.forEach(m => {
        if (m.taglineKey) {
          I18N.en[m.taglineKey] = m.taglineEN;
          I18N.fr[m.taglineKey] = m.taglineFR;
        }
        if (m.affiliationKey) {
          I18N.en[m.affiliationKey] = m.affiliationEN;
          I18N.fr[m.affiliationKey] = m.affiliationFR;
        }
      });
    }
    
    if (funding && funding.grants) {
      funding.grants.forEach(g => {
        if (g.titleKey) {
          I18N.en[g.titleKey] = g.titleEN || g.title;
          I18N.fr[g.titleKey] = g.titleFR || g.title;
        }
      });
    }
    
    renderDynamicContent();
  } catch (e) {
    console.log('Using static content');
  }
}

function renderDynamicContent() {
  renderMembers();
  renderFunding();
  renderProgram();
  renderOutputs();
  applyLanguage(currentLang);
  hookRoutes();
}

function renderMembers() {
  if (!dynamicData.members) return;
  const container = document.querySelector('#members .cardGrid');
  if (!container) return;
  
  const sorted = [...dynamicData.members.members].sort((a, b) => {
    const aLast = a.name.split(' ').pop().toLowerCase();
    const bLast = b.name.split(' ').pop().toLowerCase();
    return aLast.localeCompare(bLast);
  });
  
  container.innerHTML = sorted.map(m => {
    const isLink = m.linkedin && m.linkedin !== '' && m.linkedin !== '#';
    const tag = isLink ? 'a' : 'div';
    const href = isLink ? `href="${m.linkedin}" rel="noreferrer" target="_blank"` : '';
    return `
      <${tag} class="card memberCard memberCard--simple" ${href} aria-label="${m.name}">
        <div class="memberCard__name">${m.name}</div>
        <div class="memberCard__tagline" data-i18n="${m.taglineKey}"></div>
        <div class="memberCard__affiliation" data-i18n="${m.affiliationKey}"></div>
      </${tag}>
    `;
  }).join('');
}

function renderFunding() {
  if (!dynamicData.funding) return;
  const container = document.querySelector('#funding .grantList');
  if (!container) return;
  
  container.innerHTML = dynamicData.funding.grants.map(g => {
    const titleAttr = g.titleKey ? `data-i18n="${g.titleKey}"` : '';
    const typeKey = g.type === 'grant' ? 'grant_type_grant' : 'grant_type_contract';
    const links = (g.links || []).map(l => 
      `<a class="grantLink" href="${l.url}" target="_blank" rel="noreferrer">${l.label}</a>`
    ).join('');
    
    return `
      <div class="grantRow">
        <div class="grantMain">
          <div class="grantTitle" ${titleAttr}>${g.title}</div>
          <div class="grantOrg">${g.pi}</div>
          <div class="grantOrg">${g.organization}</div>
          ${links ? `<div class="grantLinks">${links}</div>` : ''}
        </div>
        <div class="grantMeta">
          <div class="grantDates">${g.dates}</div>
          <div class="grantType" data-i18n="${typeKey}">${g.type === 'grant' ? 'Grant' : 'Contract'}</div>
        </div>
        <div class="grantAmount">
          <div class="grantMoney">${g.amount}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderProgram() {
  if (!dynamicData.program) return;
  const prose = document.querySelector('#program .prose');
  if (!prose) return;
  
  prose.innerHTML = dynamicData.program.program.paragraphs.map(p => 
    `<p data-i18n="${p.key}">${p.en}</p>`
  ).join('');
}

function renderOutputs() {
  if (!dynamicData.outputs) return;
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;
  
  const container = projectsSection.querySelector('.container');
  if (!container) return;
  
  const existingTabs = container.querySelector('.teamTabs');
  const existingContent = container.querySelector('.teamTabContent');
  const existingSummary = container.querySelector('.outputsSummary');
  if (existingTabs) existingTabs.remove();
  if (existingContent) existingContent.remove();
  if (existingSummary) existingSummary.remove();
  
  const categories = dynamicData.outputs.categories;
  const activeTab = container.dataset.activeTab || categories[0]?.id || '';
  
  const typeCounts = { software: 0, paper: 0, video: 0, podcast: 0, book: 0 };
  categories.forEach(cat => {
    cat.outputs.forEach(o => {
      if (o.type && typeCounts.hasOwnProperty(o.type)) {
        typeCounts[o.type]++;
      }
    });
  });
  
  const typeLabels = {
    software: { icon: '{}', color: '#3b82f6', en: 'softwares', fr: 'logiciels' },
    paper: { icon: 'Aa', color: '#22c55e', en: 'papers', fr: 'articles' },
    video: { icon: '|>', color: '#ef4444', en: 'videos', fr: 'vidéos' },
    podcast: { icon: '))', color: '#a855f7', en: 'podcasts', fr: 'podcasts' },
    book: { icon: '[]', color: '#f59e0b', en: 'books', fr: 'livres' }
  };
  
  const summaryParts = Object.entries(typeCounts)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => {
      const info = typeLabels[type];
      const label = currentLang === 'fr' ? info.fr : info.en;
      return `<span class="summaryItem"><span class="summaryIcon" style="background:${info.color}">${info.icon}</span>${count} ${label}</span>`;
    });
  
  const introText = currentLang === 'fr' 
    ? 'Depuis 2019, Machina Research Network a produit'
    : 'Since 2019, Machina Research Network has produced';
  
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'outputsSummary';
  summaryDiv.innerHTML = `<p>${introText} ${summaryParts.join(', ')}.</p>`;
  container.appendChild(summaryDiv);
  
  const tabsHtml = categories.map(cat => {
    const label = currentLang === 'fr' ? (cat.titleFR || cat.titleEN) : cat.titleEN;
    const isActive = cat.id === activeTab;
    return `<button class="teamTab${isActive ? ' is-active' : ''}" data-tab="${cat.id}" type="button">${label}</button>`;
  }).join('');
  
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'teamTabs';
  tabsContainer.innerHTML = tabsHtml;
  container.appendChild(tabsContainer);
  
  const contentContainer = document.createElement('div');
  contentContainer.className = 'teamTabContent';
  
  categories.forEach(cat => {
    const isActive = cat.id === activeTab;
    const panelDiv = document.createElement('div');
    panelDiv.className = `teamPanel${isActive ? ' is-active' : ''}`;
    panelDiv.dataset.panel = cat.id;
    
    const outputs = [...cat.outputs].sort((a, b) => (b.year || 0) - (a.year || 0));
    const barsHtml = outputs.map(o => {
      const titleAttr = o.titleKey ? `data-i18n="${o.titleKey}"` : '';
      const descAttr = o.descKey ? `data-i18n="${o.descKey}"` : '';
      const metaAttr = o.metaKey ? `data-i18n="${o.metaKey}"` : '';
      const title = o.title || (currentLang === 'fr' ? (o.titleFR || o.titleEN) : o.titleEN) || '';
      const desc = o.desc || (currentLang === 'fr' ? (o.descFR || o.descEN) : o.descEN) || '';
      const meta = o.meta || (currentLang === 'fr' ? (o.metaFR || o.metaEN) : o.metaEN) || '';
      
      const actions = (o.actions || []).map(a => {
        if (a.type === 'route') {
          return `<button class="actionBtn" data-route="${a.route}" type="button" data-i18n="${a.labelKey}">data</button>`;
        } else {
          return `<a class="actionBtn" href="${a.url}" rel="noreferrer" target="_blank" data-i18n="${a.labelKey}">link</a>`;
        }
      }).join('');
      
      const typeIcons = {
        software: { icon: '{}', color: '#3b82f6' },
        paper: { icon: 'Aa', color: '#22c55e' },
        video: { icon: '|>', color: '#ef4444' },
        podcast: { icon: '))', color: '#a855f7' },
        book: { icon: '[]', color: '#f59e0b' }
      };
      const typeInfo = typeIcons[o.type] || { icon: '?', color: '#64748b' };
      
      return `
        <div class="outputBar" data-year="${o.year || 0}">
          <div class="outputBar__year">
            ${o.year || ''}
            <span class="outputBar__type" style="background: ${typeInfo.color}" title="${o.type || 'unknown'}">${typeInfo.icon}</span>
          </div>
          <div class="outputBar__content">
            <div class="outputBar__title" ${titleAttr}>${title}</div>
            ${desc ? `<div class="outputBar__desc" ${descAttr}>${desc}</div>` : ''}
            <div class="outputBar__meta" ${metaAttr}>${meta}</div>
          </div>
          <div class="outputBar__actions" aria-label="Actions">${actions}</div>
        </div>
      `;
    }).join('');
    
    panelDiv.innerHTML = `<div class="outputList">${barsHtml}</div>`;
    contentContainer.appendChild(panelDiv);
  });
  
  container.appendChild(contentContainer);
  
  tabsContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.teamTab');
    if (!tab) return;
    const tabId = tab.dataset.tab;
    container.dataset.activeTab = tabId;
    tabsContainer.querySelectorAll('.teamTab').forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    contentContainer.querySelectorAll('.teamPanel').forEach(p => p.classList.remove('is-active'));
    const panel = contentContainer.querySelector(`.teamPanel[data-panel="${tabId}"]`);
    if (panel) panel.classList.add('is-active');
  });
}

function applyLanguage(lang){
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    const v = I18N[lang] && I18N[lang][k];
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll(".langBtn").forEach(b => b.classList.remove("is-active"));
  const active = document.querySelector(`.langBtn[data-lang="${lang}"]`);
  if (active) active.classList.add("is-active");
  renderOutputs();
}

document.querySelectorAll(".langBtn").forEach(btn => {
  btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang")));
});

let currentTheme = localStorage.getItem("theme") || "light";
function setThemeIcon(theme){
  const icon = document.querySelector('#themeToggleBtn .themeBtn__icon');
  if (!icon) return;
  icon.textContent = (theme === "dark") ? "◑" : "◐";
}
function applyTheme(theme){
  currentTheme = theme;
  localStorage.setItem("theme", theme);
  document.body.setAttribute("data-theme", theme);
  setThemeIcon(theme);
}
const themeBtn = document.getElementById("themeToggleBtn");
if (themeBtn){
  themeBtn.addEventListener("click", () => { applyTheme(currentTheme === "dark" ? "light" : "dark"); });
}

function setRoute(route){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("is-active"));
  const el = document.getElementById(route);
  if (el) el.classList.add("is-active");
  document.querySelectorAll(".nav__link").forEach(b => b.classList.remove("is-active"));
  const btn = document.querySelector(`.nav__link[data-route="${route}"]`);
  if (btn) btn.classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "auto" });
}

function hookRoutes(){
  document.querySelectorAll("[data-route]").forEach(el => {
    el.removeEventListener("click", el._routeHandler);
    el._routeHandler = () => setRoute(el.getAttribute("data-route"));
    el.addEventListener("click", el._routeHandler);
    el.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") setRoute(el.getAttribute("data-route"));
    });
  });
}

hookRoutes();
applyTheme(currentTheme);
applyLanguage(currentLang);
setRoute("home");
loadDynamicData();
