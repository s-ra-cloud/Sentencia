const I18N = {
  en: {
    nav_program: "Research Program",
    nav_projects: "Outputs",
    nav_members: "Members",
    nav_funding: "Funding",
    projects_title: "Outputs",
    cat_law_title: "Computational Law Research Team",
    cat_epi_title: "Epistemic Engineering Team",
    cat_psy_title: "Computational Psychology Research Team",
    ipv_card_title: "French sentencing project",
    ipv_card_meta: "Interactive departmental map · three metrics",
    eep_card_title: "Epistemic Engineering Platform",
    eep_card_meta: "Documentation · Platform",
    myriam_jurimetrie_title: "The influence of methodological choices on the jurimetric assessment of punitiveness",
    laura_jurimetrie_title: "What is the role of small-N analyses in jurimetrics?",
    action_data: "data",
    action_text: "text",
    action_video: "video",
    action_code: "code",
    program_title: "Research programme",
    program_p1: "Machina Research Network is a research network that brings together lecturers, researchers, engineers, legal scholars, as well as students from several universities. It was established in 2019 under its original name, Structures et Théorie, and renamed in 2025.",
    program_p2: "The network conducts interdisciplinary research across all areas of legal studies, the humanities, and, more broadly, the social sciences, most often adopting a computational approach. This means that it draws on methods or logics derived from computer science in order to advance research in these disciplines or to bring them into dialogue with one another.",
    program_p3: "The network’s research programme consists in continuously seeking to push methodological boundaries and to pursue conceptual innovation in these fields, both through the production of scholarly work and through the development of software, whether licensed software, notably in partnership with the SATT, or open-source software.",
    program_p4: "The programme systematically maintains a reflexive and epistemological dimension.",
    program_p5: "Researchers strive to keep a critical distance from the tools they develop, from their limitations, and from their potential misuses.",
    program_p6: "They also seek to reflect on ways of giving new technologies an ethical and positive orientation.",
    members_title: "Members",
    funding_title: "Funding",
    funding_lede: "Research conducted within the Machina Research Network is supported by a combination of competitive grants and research contracts.",
    grant_type_grant: "Grant",
    grant_type_contract: "Contract",
    grant_title_pca: "Police Custody Assistant",
    grant_title_semantica: "SEMANTICA",
    grant_title_kt: "Knowledge Tree",
    grant_title_ias_eep: "IAS Epistemic Engineering Platform",
    grant_title_iuf: "Sacha Raoult, IUF Senior Member 2023-2028",
    member_sacha_tagline: "Lecturer",
    member_jiad_tagline: "Engineer",
    member_lisa_tagline: "Legal Scholar",
    member_sofiane_tagline: "Engineer",
    member_eliot_tagline: "Engineer",
    member_eric_tagline: "Engineer",
    member_belikov_tagline: "Researcher",
    member_myriam_tagline: "PhD Student",
    member_camille_tagline: "PhD Student",
    member_laura_tagline: "Researcher",
    member_ami_tagline: "PhD Student"
  },
  fr: {
    nav_program: "Programme de recherche",
    nav_projects: "Outputs",
    nav_members: "Membres",
    nav_funding: "Financement",
    projects_title: "Outputs",
    cat_law_title: "Équipe de recherche en droit computationnel",
    cat_epi_title: "Équipe d'ingénierie épistémique",
    cat_psy_title: "Équipe de recherche en psychologie computationnelle",
    ipv_card_title: "Projet de condamnations en France",
    ipv_card_meta: "Carte départementale interactive · trois indicateurs",
    eep_card_title: "Plateforme d'ingénierie épistémique",
    eep_card_meta: "Documentation · Plateforme",
    myriam_jurimetrie_title: "L’influence du choix des méthodes sur l’appréciation jurimétrique de la punitivité",
    laura_jurimetrie_title: "Quelle place pour les analyses de petits N dans la jurimétrie ?",
    action_data: "données",
    action_text: "texte",
    action_video: "vidéo",
    action_code: "code",
    program_title: "Programme de recherche",
    program_p1: "Machina Research Network est un réseau de recherche qui regroupe des enseignants, des chercheurs, des ingénieurs, des juristes ainsi que des étudiants issus de plusieurs universités. Il a été formé en 2019 sous son premier nom, Structures et Théorie, puis rebaptisé en 2025.",
    program_p2: "Le réseau mène des recherches interdisciplinaires dans l’ensemble des domaines des sciences juridiques, des humanités et, plus largement, des sciences humaines, en adoptant une approche computationnelle. Cela signifie qu’il mobilise des méthodes ou des logiques issues de l’informatique afin de faire progresser les recherches dans ces disciplines ou de les mettre en dialogue.",
    program_p3: "Le programme de recherche du réseau consiste à chercher en permanence à repousser les frontières méthodologiques et à innover sur le plan conceptuel dans ces domaines, à la fois par la production de travaux scientifiques et par le développement de logiciels, qu’il s’agisse de logiciels sous licence, notamment en partenariat avec la SATT, ou de logiciels open source.",
    program_p4: "Notre programme conserve systématiquement une dimension réflexive et épistémologique.",
    program_p5: "Les chercheurs s’efforcent de maintenir une distance critique à l’égard des outils développés, de leurs limites et de leurs usages potentiellement abusifs.",
    program_p6: "Ils cherchent également à réfléchir aux moyens de donner aux nouvelles technologies une orientation éthique et positive.",
    members_title: "Membres",
    funding_title: "Financement",
    funding_lede: "Les recherches menées au sein du Machina Research Network sont financées par un ensemble de subventions et de contrats de recherche.",
    grant_type_grant: "Subvention",
    grant_type_contract: "Contrat",
    grant_title_pca: "Assistant de garde à vue",
    grant_title_semantica: "SEMANTICA",
    grant_title_kt: "Arbre de connaissances",
    grant_title_ias_eep: "Plateforme d'ingénierie épistémique IAS",
    grant_title_iuf: "Sacha Raoult, Membre Senior IUF 2023-2028",
    member_sacha_tagline: "Maître de conférences",
    member_jiad_tagline: "Ingénieur",
    member_lisa_tagline: "Juriste",
    member_sofiane_tagline: "Ingénieur",
    member_eliot_tagline: "Ingénieur",
    member_eric_tagline: "Ingénieur",
    member_belikov_tagline: "Chercheur",
    member_myriam_tagline: "Doctorante",
    member_camille_tagline: "Doctorante",
    member_laura_tagline: "Chercheuse",
    member_ami_tagline: "Doctorante"
  }
};

let currentLang = localStorage.getItem("lang") || "en";

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
}

function initProjectCollapsers(){
  document.querySelectorAll('.projCat').forEach(cat => {
    const grid = cat.querySelector('.cardGrid[data-collapsible="true"]');
    if (!grid) return;
    const limit = Math.max(1, parseInt(grid.getAttribute('data-limit') || '3', 10));
    const cards = Array.from(grid.querySelectorAll('.card'));
    if (cards.length === 0) return;
    cards.sort((a, b) => (parseInt(b.getAttribute('data-year') || '0', 10) - parseInt(a.getAttribute('data-year') || '0', 10))).forEach(card => grid.appendChild(card));
    if (cards.length <= limit) return;
    if (cat.querySelector('.projMoreBtn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'projMoreBtn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = `<span class="projMoreBtn__icon" aria-hidden="true">▸</span><span class="projMoreBtn__label" data-i18n="projects_show_more">Show more</span>`;
    grid.after(btn);
    const setExpanded = (expanded) => {
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.classList.toggle('is-expanded', expanded);
      btn.querySelector('.projMoreBtn__label')?.setAttribute('data-i18n', expanded ? 'projects_show_less' : 'projects_show_more');
      const updatedCards = Array.from(grid.querySelectorAll('.card'));
      updatedCards.forEach((card, idx) => { card.classList.toggle('is-hidden', !expanded && idx >= limit); });
      applyLanguage(currentLang);
    };
    setExpanded(false);
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
    });
  });
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
    el.addEventListener("click", () => setRoute(el.getAttribute("data-route")));
    el.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") setRoute(el.getAttribute("data-route"));
    });
  });
}

hookRoutes();
initProjectCollapsers();
applyTheme(currentTheme);
applyLanguage(currentLang);
setRoute("home");
