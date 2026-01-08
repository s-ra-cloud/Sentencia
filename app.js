// i18n (EN/FR). No fetch.
const I18N = {
  en: {

    program_title: "Research programme",
    program_meta: "",
    program_p1:
      "Machina Research Network is a research network that brings together lecturers, researchers, engineers, legal scholars, as well as students from several universities. It was established in 2019 under its original name, Structures et Théorie, and renamed in 2025.",
    program_p2:
      "The network conducts interdisciplinary research across all areas of legal studies, the humanities, and, more broadly, the social sciences, most often adopting a computational approach. This means that it draws on methods or logics derived from computer science in order to advance research in these disciplines or to bring them into dialogue with one another.",
    program_p3:
      "The network’s research programme consists in continuously seeking to push methodological boundaries and to pursue conceptual innovation in these fields, both through the production of scholarly work and through the development of software, whether licensed software, notably in partnership with the SATT, or open-source software.",
    program_p4:
      "The programme systematically maintains a reflexive and epistemological dimension.",
    program_p5:
      "Researchers strive to keep a critical distance from the tools they develop, from their limitations, and from their potential misuses.",
    program_p6:
      "They also seek to reflect on ways of giving new technologies an ethical and positive orientation.",

    members_title: "Members",

    funding_title: "Funding",
    funding_lede: "Research conducted within the Machina Research Network is supported by a combination of competitive grants and research contracts.",
    member_sacha_tagline: "Lecturer",
    member_sacha_affil: "IUF, amU",
    member_jiad_tagline: "Engineer",
    member_lisa_tagline: "Legal Scholar",
    member_sofiane_tagline: "Engineer",
    member_eliot_tagline: "Engineer",
    member_eliot_affil: "Leveragers",
    member_eric_tagline: "Engineer",
    member_belikov_tagline: "Researcher",
    member_belikov_affil: "GrowGraph",
    member_myriam_tagline: "PhD Student",
    member_myriam_affil: "amU",
    member_camille_tagline: "PhD Student",
    member_camille_affil: "EHESS",
    member_laura_tagline: "Researcher",
    member_laura_affil: "UM6P",
    member_ami_tagline: "PhD Student",
    member_ami_affil: "amU"
  },  fr: {

    program_title: "Programme de recherche",
    program_meta: "",
    program_p1:
      "Machina Research Network est un réseau de recherche qui regroupe des enseignants, des chercheurs, des ingénieurs, des juristes ainsi que des étudiants issus de plusieurs universités. Il a été formé en 2019 sous son premier nom, Structures et Théorie, puis rebaptisé en 2025.",
    program_p2:
      "Le réseau mène des recherches interdisciplinaires dans l’ensemble des domaines des sciences juridiques, des humanités et, plus largement, des sciences humaines, en adoptant une approche computationnelle. Cela signifie qu’il mobilise des méthodes ou des logiques issues de l’informatique afin de faire progresser les recherches dans ces disciplines ou de les mettre en dialogue.",
    program_p3:
      "Le programme de recherche du réseau consiste à chercher en permanence à repousser les frontières méthodologiques et à innover sur le plan conceptuel dans ces domaines, à la fois par la production de travaux scientifiques et par le développement de logiciels, qu’il s’agisse de logiciels sous licence, notamment en partenariat avec la SATT, ou de logiciels open source.",
    program_p4:
      "Notre programme conserve systématiquement une dimension réflexive et épistémologique.",
    program_p5:
      "Les chercheurs s’efforcent de maintenir une distance critique à l’égard des outils développés, de leurs limites et de leurs usages potentiellement abusifs.",
    program_p6:
      "Ils cherchent également à réfléchir aux moyens de donner aux nouvelles technologies une orientation éthique et positive.",

    members_title: "Membres",

    funding_title: "Financement",
    funding_lede: "Les recherches menées au sein du Machina Research Network sont financées par un ensemble de subventions et de contrats de recherche.",
    member_sacha_tagline: "Maître de conférences",
    member_sacha_affil: "IUF, amU",
    member_jiad_tagline: "Ingénieur",
    member_lisa_tagline: "Juriste",
    member_sofiane_tagline: "Ingénieur",
    member_eliot_tagline: "Ingénieur",
    member_eliot_affil: "Leveragers",
    member_eric_tagline: "Ingénieur",
    member_belikov_tagline: "Chercheur",
    member_belikov_affil: "GrowGraph",
    member_myriam_tagline: "Doctorante",
    member_myriam_affil: "amU",
    member_camille_tagline: "Doctorante",
    member_camille_affil: "EHESS",
    member_laura_tagline: "Chercheuse",
    member_laura_affil: "UM6P",
    member_ami_tagline: "Doctorante",
    member_ami_affil: "amU"
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

// Projects: show only the N latest per category, with an expand control.
function initProjectCollapsers(){
  document.querySelectorAll('.projCat').forEach(cat => {
    const grid = cat.querySelector('.cardGrid[data-collapsible="true"]');
    if (!grid) return;

    const limit = Math.max(1, parseInt(grid.getAttribute('data-limit') || '3', 10));
    const cards = Array.from(grid.querySelectorAll('.card'));
    if (cards.length === 0) return;

    // Sort by year (descending). Missing years fall back to 0.
    cards
      .sort((a, b) => (parseInt(b.getAttribute('data-year') || '0', 10) - parseInt(a.getAttribute('data-year') || '0', 10)))
      .forEach(card => grid.appendChild(card));

    if (cards.length <= limit) return;

    // Avoid duplicating a toggle if this function is called twice.
    if (cat.querySelector('.projMoreBtn')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'projMoreBtn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = `
      <span class="projMoreBtn__icon" aria-hidden="true">▸</span>
      <span class="projMoreBtn__label" data-i18n="projects_show_more">Show more</span>
    `;

    grid.after(btn);

    const setExpanded = (expanded) => {
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.classList.toggle('is-expanded', expanded);
      btn.querySelector('.projMoreBtn__label')?.setAttribute('data-i18n', expanded ? 'projects_show_less' : 'projects_show_more');

      const updatedCards = Array.from(grid.querySelectorAll('.card'));
      updatedCards.forEach((card, idx) => {
        card.classList.toggle('is-hidden', !expanded && idx >= limit);
      });

      // Refresh i18n for the toggler label.
      applyLanguage(currentLang);
    };

    setExpanded(false);

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
    });
  });
}

// Hook language buttons
document.querySelectorAll(".langBtn").forEach(btn => {
  btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang")));
});

// Theme (light default)
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
  themeBtn.addEventListener("click", () => {
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

// Simple router
function setRoute(route){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("is-active"));
  const el = document.getElementById(route);
  if (el) el.classList.add("is-active");

  document.querySelectorAll(".nav__link").forEach(b => b.classList.remove("is-active"));
  const btn = document.querySelector(`.nav__link[data-route="${route}"]`);
  if (btn) btn.classList.add("is-active");

  window.scrollTo({ top: 0, behavior: "auto" });

  // If landing on IPV, ensure the map is painted
  if (route === "ipv") {
    const ms = document.getElementById("metricSelect");
    if (ms && typeof applyMetric === "function") applyMetric(ms.value);
  }
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


/* === Imported IPV data + config === */
// No fetch. Fully local. Works as file:// in Chrome.

const DATA = {"adjusted_prison_rate": {"FR-01": 3.6, "FR-02": 1.9, "FR-03": 2.2, "FR-04": 2.5, "FR-05": 1.9, "FR-06": 2.3, "FR-07": 2.1, "FR-08": 2.8, "FR-09": 1.8, "FR-10": 2.2, "FR-11": 2.2, "FR-12": 2.4, "FR-13": 2.1, "FR-14": 2.0, "FR-15": 1.9, "FR-16": 2.4, "FR-17": 1.9, "FR-18": 2.1, "FR-19": 2.2, "FR-21": 1.4, "FR-22": 1.8, "FR-23": 1.8, "FR-24": 1.6, "FR-25": 1.8, "FR-26": 1.6, "FR-27": 2.2, "FR-28": 1.8, "FR-29": 2.1, "FR-2A": 1.2, "FR-2B": 4.3, "FR-30": 2.1, "FR-31": 1.9, "FR-32": 2.3, "FR-33": 1.9, "FR-34": 2.1, "FR-35": 1.9, "FR-36": 1.8, "FR-37": 2.5, "FR-38": 2.4, "FR-39": 2.2, "FR-40": 1.7, "FR-41": 1.4, "FR-42": 1.5, "FR-43": 1.7, "FR-44": 1.8, "FR-45": 2.0, "FR-46": 2.9, "FR-47": 2.0, "FR-48": 1.7, "FR-49": 1.8, "FR-50": 2.0, "FR-51": 1.9, "FR-52": 2.9, "FR-53": 1.1, "FR-54": 1.3, "FR-55": 2.1, "FR-56": 1.6, "FR-57": 2.2, "FR-58": 2.6, "FR-59": 1.8, "FR-60": 1.9, "FR-61": 1.5, "FR-62": 1.9, "FR-63": 2.5, "FR-64": 1.6, "FR-65": 1.6, "FR-66": 2.3, "FR-67": 2.1, "FR-68": 2.0, "FR-69": 1.9, "FR-70": 2.1, "FR-71": 2.0, "FR-72": 1.7, "FR-73": 1.7, "FR-74": 2.3, "FR-75": 2.3, "FR-76": 1.9, "FR-77": 2.2, "FR-78": 1.7, "FR-79": 1.4, "FR-80": 1.7, "FR-81": 2.0, "FR-82": 1.1, "FR-83": 1.9, "FR-84": 2.3, "FR-85": 2.1, "FR-86": 1.8, "FR-87": 2.2, "FR-88": 2.3, "FR-89": 1.6, "FR-90": 1.6, "FR-91": 2.2, "FR-92": 2.1, "FR-93": 2.3, "FR-94": 2.1, "FR-95": 2.9, "FR-971": 2.0, "FR-972": 2.0, "FR-973": 3.2, "FR-974": 1.8}, "severity_index": {"FR-01": 1.442548576, "FR-02": 1.023885398, "FR-03": 1.241366322, "FR-04": 1.174018512, "FR-05": 0.923457453, "FR-06": 1.156255412, "FR-07": 1.055017252, "FR-08": 1.211271255, "FR-09": 0.813797733, "FR-10": 1.028272952, "FR-11": 1.316943883, "FR-12": 1.128231243, "FR-13": 1.187211158, "FR-14": 0.952974733, "FR-15": 1.431309888, "FR-16": 1.321363624, "FR-17": 0.983405492, "FR-18": 1.448308195, "FR-19": 1.057681826, "FR-21": 0.887834903, "FR-22": 1.045891982, "FR-23": 1.077534517, "FR-24": 1.109038266, "FR-25": 1.000265548, "FR-26": 0.896192738, "FR-27": 1.042100224, "FR-28": 0.906572279, "FR-29": 1.027341772, "FR-2A": 1.286111111, "FR-2B": 1.731994762, "FR-30": 1.283133366, "FR-31": 0.994739803, "FR-32": 1.171482613, "FR-33": 0.972027636, "FR-34": 1.171351095, "FR-35": 1.005276651, "FR-36": 1.088346792, "FR-37": 1.111954454, "FR-38": 1.131213413, "FR-39": 1.119472103, "FR-40": 1.159483331, "FR-41": 1.029150555, "FR-42": 0.906722712, "FR-43": 0.942176186, "FR-44": 1.095588535, "FR-45": 1.142525172, "FR-46": 1.244580242, "FR-47": 1.077447324, "FR-48": 0.895403915, "FR-49": 0.876031415, "FR-50": 1.03487365, "FR-51": 0.943297541, "FR-52": 1.18090818, "FR-53": 0.748820596, "FR-54": 0.696009036, "FR-55": 1.136697165, "FR-56": 1.281637092, "FR-57": 1.005527251, "FR-58": 1.458133081, "FR-59": 0.956478228, "FR-60": 1.016683641, "FR-61": 0.830802953, "FR-62": 0.932793524, "FR-63": 1.256441874, "FR-64": 0.943864245, "FR-65": 1.051322255, "FR-66": 1.081883457, "FR-67": 1.099763237, "FR-68": 1.012289197, "FR-69": 0.952312956, "FR-70": 1.166340376, "FR-71": 1.093679488, "FR-72": 0.937630341, "FR-73": 1.053623325, "FR-74": 1.078983654, "FR-75": 1.172921771, "FR-76": 1.046559516, "FR-77": 1.148589527, "FR-78": 1.008073677, "FR-79": 0.813402707, "FR-80": 0.949684854, "FR-81": 1.153572088, "FR-82": 0.686134148, "FR-83": 1.066212393, "FR-84": 1.206084315, "FR-85": 1.089116834, "FR-86": 0.882883926, "FR-87": 0.804313619, "FR-88": 1.094114092, "FR-89": 1.031481886, "FR-90": 1.275448552, "FR-91": 0.978095881, "FR-92": 1.006134833, "FR-93": 1.211203259, "FR-94": 1.263240832, "FR-95": 1.174821766, "FR-971": 1.005072729, "FR-972": 1.196459776, "FR-973": 1.581236481, "FR-974": 0.989556589}, "sentence": {"FR-01": 13.61, "FR-02": 13.51666667, "FR-03": 16.94, "FR-04": 13.28, "FR-05": 11.17, "FR-06": 14.395, "FR-07": 12.95, "FR-08": 12.93, "FR-09": 8.89, "FR-10": 11.95, "FR-11": 18.325, "FR-12": 13.12, "FR-13": 15.93333333, "FR-14": 11.255, "FR-15": 22.7, "FR-16": 17.45, "FR-17": 12.21, "FR-18": 22.15, "FR-19": 12.44, "FR-21": 12.84, "FR-22": 14.29, "FR-23": 15.04, "FR-24": 16.855, "FR-25": 13.17, "FR-26": 12.03, "FR-27": 12.05, "FR-28": 11.11, "FR-29": 12.325, "FR-2A": 22.91, "FR-2B": 16.77, "FR-30": 18.08, "FR-31": 12.76, "FR-32": 14.62, "FR-33": 11.995, "FR-34": 15.755, "FR-35": 12.725, "FR-36": 15.14, "FR-37": 12.04, "FR-38": 13.08, "FR-39": 13.68, "FR-40": 17.52, "FR-41": 16.04, "FR-42": 13.005, "FR-43": 12.48, "FR-44": 15.325, "FR-45": 15.35, "FR-46": 13.24, "FR-47": 13.75, "FR-48": 11.18, "FR-49": 10.465, "FR-50": 12.99, "FR-51": 11.5, "FR-52": 11.42, "FR-53": 11.19, "FR-54": 8.86, "FR-55": 14.995, "FR-56": 20.74, "FR-57": 11.25, "FR-58": 19.39, "FR-59": 12.51, "FR-60": 13.11, "FR-61": 11.065, "FR-62": 11.21, "FR-63": 15.23, "FR-64": 12.86, "FR-65": 15.56, "FR-66": 12.3, "FR-67": 13.81, "FR-68": 12.44, "FR-69": 11.885, "FR-70": 15.28, "FR-71": 14.43, "FR-72": 12.44, "FR-73": 15.295, "FR-74": 12.24333333, "FR-75": 14.6, "FR-76": 13.63, "FR-77": 14.64333333, "FR-78": 14.21, "FR-79": 11.13, "FR-80": 12.41, "FR-81": 15.48, "FR-82": 9.61, "FR-83": 14.075, "FR-84": 15.47, "FR-85": 13.76, "FR-86": 10.72, "FR-87": 6.8, "FR-88": 12.73, "FR-89": 15.04, "FR-90": 20.78, "FR-91": 10.79, "FR-92": 11.91, "FR-93": 15.53, "FR-94": 17.68, "FR-95": 11.26, "FR-971": 12.5, "FR-972": 16.94, "FR-973": 19.26, "FR-974": 13.205}};
const CONFIG = {"adjusted_prison_rate": {"label": "IPV adjusted prison rate", "colors": ["#f2f2f2", "#d9d9d9", "#bdbdbd", "#969696", "#525252"], "thresholds": [1.6, 2.0, 2.4, 2.8], "format": "number2"}, "severity_index": {"label": "IPV punishment severity index", "colors": ["#f2f2f2", "#d9d9d9", "#bdbdbd", "#969696", "#525252"], "thresholds": [0.9, 1.05, 1.2, 1.35], "format": "number3"}, "sentence": {"label": "Average sentence length (months)", "colors": ["#f2f2f2", "#d9d9d9", "#bdbdbd", "#969696", "#525252"], "thresholds": [11, 13, 15, 18], "format": "months"}};


/* === Imported IPV map logic === */
// IPV map logic
const tooltip = document.getElementById("tooltip");
const legend = document.getElementById("legend");
const svg = document.querySelector("#mapHost svg");
const metricSelect = document.getElementById("metricSelect");

function bucket(v, thresholds){
  if (v == null || Number.isNaN(v)) return null;
  if (v < thresholds[0]) return 0;
  if (v < thresholds[1]) return 1;
  if (v < thresholds[2]) return 2;
  if (v < thresholds[3]) return 3;
  return 4;
}

function fmt(metricKey, v){
  if (v == null) return I18N[currentLang].tooltip_no_data;
  const f = CONFIG[metricKey].format;
  if (f === "months") return v.toFixed(2) + " " + I18N[currentLang].tooltip_months;
  if (f === "number3") return v.toFixed(3);
  if (f === "number2") return v.toFixed(2);
  return String(v);
}

function renderLegend(metricKey){
  const c = CONFIG[metricKey];
  const layer = DATA[metricKey] || {};

  // Compute observed min/max for the currently selected metric.
  const vals = Object.values(layer).filter(v => v != null && !Number.isNaN(v));
  const minV = vals.length ? Math.min(...vals) : null;
  const maxV = vals.length ? Math.max(...vals) : null;

  const title = I18N[currentLang].legend_title;
  const low = I18N[currentLang].legend_low;
  const high = I18N[currentLang].legend_high;

  const gradient = `linear-gradient(to right, ${c.colors.join(",")})`;
  const lowTxt = (minV == null) ? low : `${low} ${fmt(metricKey, minV)}`;
  const highTxt = (maxV == null) ? high : `${high} ${fmt(metricKey, maxV)}`;

  legend.innerHTML = `
    <div class="legend__title">${title}</div>
    <div class="legend__row">
      <span class="legend__label">${lowTxt}</span>
      <span class="legend__bar" style="background:${gradient}"></span>
      <span class="legend__label">${highTxt}</span>
    </div>
  `;
}

function applyMetric(metricKey){
  const c = CONFIG[metricKey];
  const layer = DATA[metricKey] || {};
  renderLegend(metricKey);

  svg.querySelectorAll('path[id^="FR-"]').forEach(p => {
    const v = layer[p.id];
    const b = bucket(v, c.thresholds);
    p.style.fill = (b === null) ? "#0f0f0f" : c.colors[b];

    p.onmousemove = (e) => {
      const name = p.getAttribute("title") || p.id;
      tooltip.style.display = "block";
      tooltip.style.left = e.clientX + "px";
      tooltip.style.top = e.clientY + "px";
      tooltip.innerHTML = name + "<br>" + c.label + ": " + fmt(metricKey, v);
    };
    p.onmouseleave = () => tooltip.style.display = "none";
  });
}

metricSelect.addEventListener("change", () => applyMetric(metricSelect.value));
applyMetric(metricSelect.value);
// Admin Logic
const ADMIN_PASS = "1234";

document.getElementById("loginBtn")?.addEventListener("click", () => {
  const pass = document.getElementById("adminPass").value;
  if (pass === ADMIN_PASS) {
    document.getElementById("adminAuth").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
  } else {
    alert("Incorrect passcode");
  }
});

// Tab switching
document.querySelectorAll("[data-admin-tab]").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.getAttribute("data-admin-tab");
    document.querySelectorAll(".admin-tab-content").forEach(c => c.style.display = "none");
    document.getElementById("admin" + tab.charAt(0).toUpperCase() + tab.slice(1)).style.display = "block";
    document.querySelectorAll("[data-admin-tab]").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  });
});

// Data persistence (simple LocalStorage layer)
const store = {
  get: (key) => JSON.parse(localStorage.getItem("mnr_" + key) || "[]"),
  add: (key, item) => {
    const data = store.get(key);
    data.push(item);
    localStorage.setItem("mnr_" + key, JSON.stringify(data));
    location.reload(); // Refresh to show new data
  },
  reset: () => {
    localStorage.clear();
    location.reload();
  }
};

document.getElementById("addProjBtn")?.addEventListener("click", () => {
  store.add("projects", {
    title: document.getElementById("projTitle").value,
    meta: document.getElementById("projMeta").value,
    year: document.getElementById("projYear").value,
    cat: document.getElementById("projCat").value
  });
});

document.getElementById("addMemBtn")?.addEventListener("click", () => {
  store.add("members", {
    name: document.getElementById("memName").value,
    role: document.getElementById("memRole").value,
    affil: document.getElementById("memAffil").value
  });
});

document.getElementById("addFundBtn")?.addEventListener("click", () => {
  store.add("funding", {
    title: document.getElementById("fundTitle").value,
    org: document.getElementById("fundOrg").value,
    amount: document.getElementById("fundAmount").value,
    dates: document.getElementById("fundDates").value
  });
});

document.getElementById("resetDataBtn")?.addEventListener("click", () => {
  if(confirm("Reset all custom data?")) store.reset();
});

// Inject dynamic data into pages
function renderDynamicContent() {
  const projects = store.get("projects");
  projects.forEach(p => {
    const grid = document.querySelector(`.projCat h2[data-i18n="cat_${p.cat}_title"]`)?.nextElementSibling;
    if (grid) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<div class="card__title">${p.title}</div><div class="card__meta">${p.meta} · ${p.year}</div>`;
      grid.prepend(card);
    }
  });

  const members = store.get("members");
  const memGrid = document.querySelector("#members .cardGrid");
  members.forEach(m => {
    const card = document.createElement("div");
    card.className = "card memberCard--simple";
    card.innerHTML = `<div class="memberCard__name">${m.name}</div><div class="memberCard__tagline">${m.role}</div><div class="memberCard__affiliation">${m.affil}</div>`;
    memGrid?.append(card);
  });

  const funding = store.get("funding");
  const fundList = document.querySelector(".grantList");
  funding.forEach(f => {
    const row = document.createElement("div");
    row.className = "grantRow";
    row.innerHTML = `<div class="grantMain"><div class="grantTitle">${f.title}</div><div class="grantOrg">${f.org}</div></div><div class="grantMeta"><div class="grantDates">${f.dates}</div></div><div class="grantAmount"><div class="grantMoney">${f.amount}</div></div>`;
    fundList?.prepend(row);
  });
}

renderDynamicContent();
