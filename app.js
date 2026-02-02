const I18N = {
  en: {
    nav_program: "Research Program",
    nav_projects: "Outputs",
    nav_members: "Members & Partners",
    nav_funding: "Funding",
    projects_title: "Outputs",
    projects_show_more: "Show more",
    projects_show_less: "Show less",
    action_data: "data",
    action_text: "text",
    action_video: "video",
    action_code: "code",
    members_title: "Members & Partners",
    members_subsection: "Core Members",
    partners_subsection: "Partners & Collaborators",
    funding_title: "Funding",
    funding_lede: "Research conducted within the Machina Research Network is supported by a combination of competitive grants and research contracts.",
    grant_type_grant: "Grant",
    grant_type_contract: "Contract",
    hero_title: "MACHINA RESEARCH NETWORK",
    hero_subtitle: "Computational Interdisciplinary Research",
    hero_cta: "View Outputs",
    contact_title: "Get in Touch",
    contact_subtitle: "Interested in collaborating or learning more about our research?",
    contact_btn: "Contact Us"
  },
  fr: {
    nav_program: "Programme de recherche",
    nav_projects: "Outputs",
    nav_members: "Membres & Partenaires",
    nav_funding: "Financement",
    projects_title: "Outputs",
    projects_show_more: "Voir plus",
    projects_show_less: "Voir moins",
    action_data: "données",
    action_text: "texte",
    action_video: "vidéo",
    action_code: "code",
    members_title: "Membres & Partenaires",
    members_subsection: "Membres principaux",
    partners_subsection: "Partenaires & Collaborateurs",
    funding_title: "Financement",
    funding_lede: "Les recherches menées au sein du Machina Research Network sont financées par un ensemble de subventions et de contrats de recherche.",
    grant_type_grant: "Subvention",
    grant_type_contract: "Contrat",
    hero_title: "MACHINA RESEARCH NETWORK",
    hero_subtitle: "Recherche Interdisciplinaire Computationnelle",
    hero_cta: "Voir les Outputs",
    contact_title: "Nous Contacter",
    contact_subtitle: "Intéressé par une collaboration ou pour en savoir plus sur nos recherches ?",
    contact_btn: "Contactez-nous"
  }
};

let currentLang = localStorage.getItem("lang") || "en";
let dynamicData = { outputs: null, members: null, funding: null, program: null, partners: null };

async function loadDynamicData() {
  try {
    const [outputs, members, funding, program, partners] = await Promise.all([
      fetch('/api/outputs').then(r => r.json()),
      fetch('/api/members').then(r => r.json()),
      fetch('/api/funding').then(r => r.json()),
      fetch('/api/program').then(r => r.json()),
      fetch('/api/partners').then(r => r.json())
    ]);
    dynamicData = { outputs, members, funding, program, partners };
    
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
  renderPartners();
  renderFunding();
  renderProgram();
  renderOutputs();
  applyLanguage(currentLang);
  hookRoutes();
}

let selectedMemberId = null;

function renderMembers() {
  if (!dynamicData.members) return;
  const section = document.getElementById('members');
  const container = section.querySelector('.cardGrid');
  if (!container) return;
  
  let existingDetail = section.querySelector('.memberDetail');
  if (existingDetail) existingDetail.remove();
  
  const sorted = [...dynamicData.members.members].sort((a, b) => {
    const aLast = a.name.split(' ').pop().toLowerCase();
    const bLast = b.name.split(' ').pop().toLowerCase();
    return aLast.localeCompare(bLast);
  });
  
  if (selectedMemberId) {
    const member = dynamicData.members.members.find(m => m.id === selectedMemberId);
    if (member) {
      container.style.display = 'none';
      renderMemberDetail(member, section);
      return;
    }
  }
  
  container.style.display = '';
  container.innerHTML = sorted.map(m => {
    const hasLinkedin = m.linkedin && m.linkedin !== '' && m.linkedin !== '#';
    const linkedinBtn = hasLinkedin 
      ? `<a class="memberCard__linkedin" href="${m.linkedin}" rel="noreferrer" target="_blank" onclick="event.stopPropagation()" title="LinkedIn">in</a>` 
      : '';
    return `
      <div class="card memberCard memberCard--simple" data-member-id="${m.id}" role="button" tabindex="0">
        ${linkedinBtn}
        <div class="memberCard__name">${m.name}</div>
        <div class="memberCard__tagline" data-i18n="${m.taglineKey}"></div>
        <div class="memberCard__affiliation" data-i18n="${m.affiliationKey}"></div>
      </div>
    `;
  }).join('');
  
  container.querySelectorAll('.memberCard').forEach(card => {
    card.addEventListener('click', () => {
      selectedMemberId = card.dataset.memberId;
      renderMembers();
      applyTranslations();
    });
  });
}

function renderMemberDetail(member, section) {
  const bio = currentLang === 'fr' ? (member.bioFR || member.bioEN || '') : (member.bioEN || '');
  const tagline = currentLang === 'fr' ? (member.taglineFR || member.taglineEN) : member.taglineEN;
  const affiliation = currentLang === 'fr' ? (member.affiliationFR || member.affiliationEN) : member.affiliationEN;
  const hasLinkedin = member.linkedin && member.linkedin !== '' && member.linkedin !== '#';
  const linkedinLink = hasLinkedin 
    ? `<a class="memberDetail__linkedin" href="${member.linkedin}" rel="noreferrer" target="_blank">LinkedIn</a>` 
    : '';
  
  const memberOutputs = getMemberOutputs(member.name);
  const backLabel = currentLang === 'fr' ? 'Retour aux membres' : 'Back to all members';
  
  const outputsHtml = memberOutputs.length > 0 
    ? memberOutputs.map(o => {
        const title = o.title || (currentLang === 'fr' ? (o.titleFR || o.titleEN) : o.titleEN) || '';
        const typeIcons = {
          software: { icon: '{}', color: '#3b82f6' },
          paper: { icon: 'Aa', color: '#22c55e' },
          video: { icon: '|>', color: '#ef4444' },
          podcast: { icon: '))', color: '#a855f7' },
          book: { icon: '[]', color: '#f59e0b' }
        };
        const typeInfo = typeIcons[o.type] || { icon: '?', color: '#64748b' };
        return `<div class="memberOutput">
          <span class="memberOutput__type" style="background:${typeInfo.color}">${typeInfo.icon}</span>
          <span class="memberOutput__year">${o.year || ''}</span>
          <span class="memberOutput__title">${title}</span>
        </div>`;
      }).join('')
    : `<p class="memberDetail__noOutputs">${currentLang === 'fr' ? 'Aucun output associé.' : 'No associated outputs.'}</p>`;
  
  const detailDiv = document.createElement('div');
  detailDiv.className = 'memberDetail';
  detailDiv.innerHTML = `
    <button class="btn memberDetail__back" type="button">${backLabel}</button>
    <div class="memberDetail__header">
      <div>
        <h2 class="memberDetail__name">${member.name}</h2>
        <div class="memberDetail__role">${tagline} · ${affiliation}</div>
      </div>
      ${linkedinLink}
    </div>
    <p class="memberDetail__bio">${bio}</p>
    <h3 class="memberDetail__outputsTitle">${currentLang === 'fr' ? 'Contributions' : 'Contributions'}</h3>
    <div class="memberDetail__outputs">${outputsHtml}</div>
  `;
  
  section.querySelector('.container').appendChild(detailDiv);
  
  detailDiv.querySelector('.memberDetail__back').addEventListener('click', () => {
    selectedMemberId = null;
    renderMembers();
    applyTranslations();
  });
}

function getMemberOutputs(memberName) {
  if (!dynamicData.outputs) return [];
  const outputs = [];
  const nameParts = memberName.toLowerCase().split(' ');
  const lastName = nameParts[nameParts.length - 1];
  const firstName = nameParts[0];
  
  dynamicData.outputs.categories.forEach(cat => {
    cat.outputs.forEach(o => {
      const searchFields = [o.pi, o.meta, o.metaEN, o.metaFR].filter(Boolean).join(' ').toLowerCase();
      if (searchFields.includes(lastName) || searchFields.includes(firstName)) {
        outputs.push(o);
      }
    });
  });
  
  return outputs.sort((a, b) => (b.year || 0) - (a.year || 0));
}

function renderPartners() {
  const container = document.querySelector('#members .partnersGrid');
  if (!container) return;
  
  const partners = dynamicData.partners?.partners || [];
  
  if (partners.length === 0) {
    container.innerHTML = `<p class="muted">${currentLang === 'fr' ? 'Aucun partenaire pour le moment.' : 'No partners yet.'}</p>`;
    return;
  }
  
  container.innerHTML = partners.map(p => {
    const name = p.name || '';
    const description = currentLang === 'fr' ? (p.descriptionFR || p.descriptionEN || '') : (p.descriptionEN || '');
    const scope = currentLang === 'fr' ? (p.scopeFR || p.scopeEN || '') : (p.scopeEN || '');
    const logo = p.logo ? `<img class="partnerCard__logo" src="${p.logo}" alt="${name}">` : '';
    const link = p.website ? `<a class="partnerCard__link" href="${p.website}" target="_blank" rel="noreferrer">${currentLang === 'fr' ? 'Visiter le site' : 'Visit website'} →</a>` : '';
    
    return `
      <div class="partnerCard">
        ${logo}
        <div class="partnerCard__name">${name}</div>
        ${scope ? `<div class="partnerCard__scope">${scope}</div>` : ''}
        ${description ? `<div class="partnerCard__description">${description}</div>` : ''}
        ${link}
      </div>
    `;
  }).join('');
}

function calculateFundingProgress(grants) {
  const currentYear = new Date().getFullYear();
  let totalFunding = 0;
  let consumedFunding = 0;
  
  grants.forEach(g => {
    const amountMatch = g.amount.match(/([\d,]+)/);
    if (!amountMatch) return;
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    totalFunding += amount;
    
    const dates = g.dates || '';
    let startYear, endYear;
    
    if (dates.includes('-')) {
      const parts = dates.split('-');
      startYear = parseInt(parts[0]);
      endYear = parseInt(parts[1]);
    } else {
      startYear = parseInt(dates);
      endYear = startYear;
    }
    
    if (isNaN(startYear)) return;
    
    if (currentYear > endYear) {
      consumedFunding += amount;
    } else if (currentYear >= startYear && currentYear <= endYear) {
      const totalYears = endYear - startYear + 1;
      const elapsedYears = currentYear - startYear;
      const yearlyAmount = amount / totalYears;
      consumedFunding += yearlyAmount * elapsedYears;
    }
  });
  
  return {
    total: totalFunding,
    consumed: consumedFunding,
    remaining: totalFunding - consumedFunding
  };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { 
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(amount));
}

function renderFundingProgress() {
  if (!dynamicData.funding) return;
  const container = document.getElementById('fundingProgress');
  if (!container) return;
  
  const progress = calculateFundingProgress(dynamicData.funding.grants);
  const consumedPercent = progress.total > 0 ? (progress.consumed / progress.total) * 100 : 0;
  
  const titleLabel = currentLang === 'fr' ? 'Progression du financement' : 'Funding Progress';
  const totalLabel = currentLang === 'fr' ? 'Total sécurisé' : 'Total Secured';
  const consumedLabel = currentLang === 'fr' ? 'Consommé' : 'Consumed';
  const remainingLabel = currentLang === 'fr' ? 'Restant' : 'Remaining';
  
  container.innerHTML = `
    <div class="fundingProgress__header">
      <div class="fundingProgress__title">${titleLabel}</div>
      <div class="fundingProgress__total">€${formatCurrency(progress.total)} ${totalLabel}</div>
    </div>
    <div class="fundingProgress__bar">
      <div class="fundingProgress__consumed" style="width: ${consumedPercent}%"></div>
    </div>
    <div class="fundingProgress__legend">
      <div class="fundingProgress__legendItem">
        <span class="fundingProgress__legendDot fundingProgress__legendDot--consumed"></span>
        <span class="fundingProgress__legendValue">€${formatCurrency(progress.consumed)}</span>
        <span class="fundingProgress__legendLabel">${consumedLabel} (${Math.round(consumedPercent)}%)</span>
      </div>
      <div class="fundingProgress__legendItem">
        <span class="fundingProgress__legendDot fundingProgress__legendDot--remaining"></span>
        <span class="fundingProgress__legendValue">€${formatCurrency(progress.remaining)}</span>
        <span class="fundingProgress__legendLabel">${remainingLabel} (${Math.round(100 - consumedPercent)}%)</span>
      </div>
    </div>
  `;
}

function renderFunding() {
  if (!dynamicData.funding) return;
  const container = document.querySelector('#funding .grantList');
  if (!container) return;
  
  renderFundingProgress();
  
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
  
  const allMembers = dynamicData.members?.members || [];
  
  categories.forEach(cat => {
    const isActive = cat.id === activeTab;
    const panelDiv = document.createElement('div');
    panelDiv.className = `teamPanel${isActive ? ' is-active' : ''}`;
    panelDiv.dataset.panel = cat.id;
    
    const outputs = [...cat.outputs].sort((a, b) => (b.year || 0) - (a.year || 0));
    
    const teamDesc = currentLang === 'fr' ? (cat.descriptionFR || cat.descriptionEN || '') : (cat.descriptionEN || '');
    
    const piCounts = {};
    outputs.forEach(o => {
      if (o.pi) {
        const names = o.pi.split(/,|&/).map(n => n.trim()).filter(n => n);
        names.forEach(name => {
          const cleanName = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
          if (cleanName) {
            piCounts[cleanName] = (piCounts[cleanName] || 0) + 1;
          }
        });
      }
    });
    
    const sortedPIs = Object.entries(piCounts).sort((a, b) => b[1] - a[1]);
    const coreThreshold = Math.max(2, Math.floor(outputs.length * 0.2));
    
    const coreMembers = [];
    const contributors = [];
    
    sortedPIs.forEach(([name, count]) => {
      const matchedMember = allMembers.find(m => {
        const nameParts = name.toLowerCase().split(' ');
        const memberParts = m.name.toLowerCase().split(' ');
        return nameParts.some(p => memberParts.includes(p));
      });
      
      const memberInfo = {
        name,
        count,
        member: matchedMember
      };
      
      if (count >= coreThreshold) {
        coreMembers.push(memberInfo);
      } else {
        contributors.push(memberInfo);
      }
    });
    
    const barsHtml = outputs.map(o => {
      const titleAttr = o.titleKey ? `data-i18n="${o.titleKey}"` : '';
      const descAttr = o.descKey ? `data-i18n="${o.descKey}"` : '';
      const metaAttr = o.metaKey ? `data-i18n="${o.metaKey}"` : '';
      const title = o.title || (currentLang === 'fr' ? (o.titleFR || o.titleEN) : o.titleEN) || '';
      const desc = o.desc || (currentLang === 'fr' ? (o.descFR || o.descEN) : o.descEN) || '';
      const meta = o.meta || (currentLang === 'fr' ? (o.metaFR || o.metaEN) : o.metaEN) || '';
      
      const fileBtn = o.fileUrl ? 
        `<a class="actionBtn actionBtn--download" href="${o.fileUrl}" download="${o.fileName || 'download'}">${currentLang === 'fr' ? 'Télécharger' : 'Download'}</a>` : '';
      
      const externalActions = (o.actions || []).map(a => {
        if (a.type === 'route') {
          return `<button class="actionBtn" data-route="${a.route}" type="button" data-i18n="${a.labelKey}">data</button>`;
        } else {
          return `<a class="actionBtn" href="${a.url}" rel="noreferrer" target="_blank" data-i18n="${a.labelKey}">link</a>`;
        }
      }).join('');
      
      const actions = fileBtn + externalActions;
      
      const typeIcons = {
        software: { icon: '{}', color: '#3b82f6' },
        paper: { icon: 'Aa', color: '#22c55e' },
        video: { icon: '|>', color: '#ef4444' },
        podcast: { icon: '))', color: '#a855f7' },
        book: { icon: '[]', color: '#f59e0b' }
      };
      const typeInfo = typeIcons[o.type] || { icon: '?', color: '#64748b' };
      
      const piDisplay = o.pi || '';
      
      return `
        <div class="outputBar" data-year="${o.year || 0}">
          <div class="outputBar__year">
            ${o.year || ''}
            <span class="outputBar__type" style="background: ${typeInfo.color}" title="${o.type || 'unknown'}">${typeInfo.icon}</span>
          </div>
          <div class="outputBar__content">
            <div class="outputBar__title" ${titleAttr}>${title}</div>
            ${piDisplay ? `<div class="outputBar__pi" style="color: ${typeInfo.color}">${piDisplay}</div>` : ''}
            ${desc ? `<div class="outputBar__desc" ${descAttr}>${desc}</div>` : ''}
            <div class="outputBar__meta" ${metaAttr}>${meta}</div>
          </div>
          <div class="outputBar__actions" aria-label="Actions">${actions}</div>
        </div>
      `;
    }).join('');
    
    const coreMembersLabel = currentLang === 'fr' ? 'Membres principaux' : 'Core Members';
    const contributorsLabel = currentLang === 'fr' ? 'Contributeurs' : 'Contributors';
    const outputsLabel = currentLang === 'fr' ? 'Productions' : 'Outputs';
    
    const renderMemberBadge = (m) => {
      if (m.member) {
        return `<span class="teamMemberBadge teamMemberBadge--linked" data-member-id="${m.member.id}">${m.name} <span class="teamMemberBadge__count">(${m.count})</span></span>`;
      }
      return `<span class="teamMemberBadge">${m.name} <span class="teamMemberBadge__count">(${m.count})</span></span>`;
    };
    
    const coreMembersHtml = coreMembers.length > 0 ? 
      `<div class="teamMembers"><h4>${coreMembersLabel}</h4><div class="teamMembersList">${coreMembers.map(renderMemberBadge).join('')}</div></div>` : '';
    
    const contributorsHtml = contributors.length > 0 ? 
      `<div class="teamMembers teamMembers--contributors"><h4>${contributorsLabel}</h4><div class="teamMembersList">${contributors.map(renderMemberBadge).join('')}</div></div>` : '';
    
    const descHtml = teamDesc ? `<div class="teamDescription">${teamDesc}</div>` : '';
    
    panelDiv.innerHTML = `
      ${descHtml}
      ${coreMembersHtml}
      ${contributorsHtml}
      <div class="teamOutputsSection">
        <h4>${outputsLabel}</h4>
        <div class="outputList">${barsHtml}</div>
      </div>
    `;
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
