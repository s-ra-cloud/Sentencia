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
