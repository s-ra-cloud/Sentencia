(function(){
  const NAV = [
    {href:'/',label:'Accueil',key:'accueil'},
    {href:'/carte.html',label:'Carte',key:'carte'},
    {href:'/modeles.html',label:'Modèles prototypes',key:'modeles'},
    {href:'/methodologie.html',label:'Méthodologie',key:'methodologie'},
    {href:'/faq.html',label:'FAQ',key:'faq'},
    {href:'/presse.html',label:'Presse',key:'presse'},
    {href:'/bibliographie.html',label:'Bibliographie',key:'bibliographie'},
  ];
  const current = document.body.getAttribute('data-page') || 'accueil';

  const headerHTML = `
    <header class="site-header">
      <div class="nav">
        <a href="/" class="brand" aria-label="Sentencia – accueil">
          <span class="brand-mark"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="10" y1="3.5" x2="10" y2="16"/><line x1="7" y1="16" x2="13" y2="16"/><line x1="3" y1="6" x2="17" y2="6"/><line x1="4" y1="6" x2="4" y2="10.5"/><line x1="16" y1="6" x2="16" y2="10.5"/><path d="M2,10.5 Q4,13.5 6,10.5"/><path d="M14,10.5 Q16,13.5 18,10.5"/><circle cx="10" cy="6" r=".8" fill="currentColor" stroke="none"/></svg></span>
          <strong>Sentencia</strong>
        </a>
        <nav class="nav-links" id="navLinks">
          ${NAV.map(n=>`<a href="${n.href}" class="${n.key===current?'active':''}">${n.label}</a>`).join('')}
        </nav>
        <button class="nav-cta" id="nlNavBtn" type="button">S&rsquo;inscrire à la newsletter</button>
        <button class="nav-toggle" aria-label="Ouvrir le menu" id="navToggle" aria-expanded="false" aria-controls="navLinks">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h14M3 10h14M3 14h14"/></svg>
        </button>
      </div>
    </header>`;

  const alphaNoticeHTML = `
    <div id="alpha-notice" style="background:var(--navy,#1a2e4a);color:#fff;padding:14px 32px;display:flex;align-items:center;gap:16px;font-family:var(--sans,'Inter',sans-serif);font-size:.88rem;line-height:1.5;">
      <span style="flex:1;">Sentencia est actuellement en <strong>alpha fermée</strong>, réservée aux retours de la communauté. Si vous constatez une valeur incorrecte ou incohérente, contactez-nous à <a href="mailto:sacha.raoult@univ-amu.fr" style="color:var(--gold,#C9A84C);text-decoration:underline;text-underline-offset:2px;">sacha.raoult@univ-amu.fr</a>.</span>
      <button id="alpha-notice-close" aria-label="Fermer cette bannière" style="background:none;border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:4px;padding:4px 10px;cursor:pointer;font-size:.85rem;flex-shrink:0;">×</button>
    </div>
    <div id="webinar-notice" style="background:#F5EBD3;color:#3a2a10;padding:12px 32px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;font-family:var(--sans,'Inter',sans-serif);font-size:.88rem;line-height:1.5;border-bottom:1px solid #E2D2A8;">
      <span style="flex:1;min-width:240px;"><strong>Webinaire de présentation de la plateforme</strong> — mardi <strong>2 juin à 12h</strong>. Inscrivez-vous pour recevoir le lien de connexion.</span>
      <form id="webinar-form" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <input type="email" id="webinar-email" placeholder="votre@email.fr" required autocomplete="email" style="padding:6px 12px;border:1px solid #C8A95A;border-radius:4px;font-size:.85rem;background:#fff;font-family:inherit;min-width:200px;">
        <button type="submit" style="background:#1a2e4a;color:#fff;border:none;border-radius:4px;padding:7px 14px;font-size:.85rem;cursor:pointer;font-family:inherit;">S&rsquo;inscrire</button>
        <span id="webinar-msg" style="font-size:.82rem;"></span>
      </form>
      <button id="webinar-notice-close" aria-label="Fermer cette bannière" style="background:none;border:1px solid rgba(58,42,16,.3);color:#3a2a10;border-radius:4px;padding:4px 10px;cursor:pointer;font-size:.85rem;flex-shrink:0;">×</button>
    </div>`;

  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-brand">
          <div class="brand"><span class="brand-mark"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="10" y1="3.5" x2="10" y2="16"/><line x1="7" y1="16" x2="13" y2="16"/><line x1="3" y1="6" x2="17" y2="6"/><line x1="4" y1="6" x2="4" y2="10.5"/><line x1="16" y1="6" x2="16" y2="10.5"/><path d="M2,10.5 Q4,13.5 6,10.5"/><path d="M14,10.5 Q16,13.5 18,10.5"/><circle cx="10" cy="6" r=".8" fill="currentColor" stroke="none"/></svg></span><strong>Sentencia</strong></div>
          <p>Plateforme ouverte d’analyse de la justice pénale en France. Un projet de recherche public et non lucratif porté par le Machina Research Network.</p>
          <div class="badges">
            <span class="badge">Open source</span>
            <span class="badge">Open access</span>
            <span class="badge">Non lucratif</span>
          </div>
        </div>
        <div>
          <h4>Explorer</h4>
          <a href="/carte.html">Carte interactive</a>
          <a href="/modeles.html">Modèles prototypes</a>
          <a href="/methodologie.html">Méthodologie</a>
        </div>
        <div>
          <h4>Ressources</h4>
          <a href="/faq.html">FAQ</a>
          <a href="/presse.html">Presse</a>
          <a href="/bibliographie.html">Bibliographie</a>
        </div>
        <div>
          <h4>Projet</h4>
          <a href="/mentions-legales.html">Mentions & éthique</a>
          <a href="mailto:sacha.raoult@univ-amu.fr">Contact</a>
          <a href="https://github.com/" target="_blank" rel="noopener">Code source (à venir)</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Sentencia – Machina Research Network</span>
        <button id="sub-admin-btn" type="button" style="background:none;border:none;color:rgba(255,255,255,.3);font-size:.72rem;cursor:pointer;padding:0 0 0 16px;font-family:inherit;letter-spacing:.02em;text-decoration:underline;text-underline-offset:2px;">Admin</button>
      </div>
    </footer>

    <div id="sub-admin-overlay" hidden style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9000;display:flex;align-items:center;justify-content:center;">
      <div id="sub-admin-modal" style="background:#fff;border-radius:10px;width:min(700px,96vw);max-height:85vh;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,.25);overflow:hidden;">
        <div style="background:#1a2e4a;color:#fff;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <strong style="font-size:1rem;font-family:var(--sans,'Inter',sans-serif);">Gestion des abonnés</strong>
          <button id="sub-admin-close" type="button" aria-label="Fermer" style="background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;line-height:1;padding:0 4px;">×</button>
        </div>
        <div id="sub-admin-auth" style="padding:28px 24px;font-family:var(--sans,'Inter',sans-serif);">
          <p style="margin:0 0 14px;color:#333;font-size:.9rem;">Entrez le mot de passe administrateur pour continuer.</p>
          <form id="sub-admin-pw-form" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <input type="password" id="sub-admin-pw" placeholder="Mot de passe" autocomplete="current-password" style="flex:1;min-width:180px;padding:8px 12px;border:1px solid #ccc;border-radius:5px;font-size:.9rem;font-family:inherit;">
            <button type="submit" style="background:#1a2e4a;color:#fff;border:none;border-radius:5px;padding:9px 18px;font-size:.9rem;cursor:pointer;font-family:inherit;">Valider</button>
          </form>
          <p id="sub-admin-pw-err" style="margin:10px 0 0;color:#b00;font-size:.85rem;display:none;">Mot de passe incorrect.</p>
        </div>
        <div id="sub-admin-panel" hidden style="display:flex;flex-direction:column;flex:1;overflow:hidden;">
          <div style="padding:14px 20px 0;border-bottom:1px solid #e5e7eb;display:flex;gap:0;flex-shrink:0;">
            <button id="tab-nl" type="button" class="sub-tab active" data-tab="newsletter" style="background:none;border:none;border-bottom:2px solid #1a2e4a;color:#1a2e4a;font-size:.88rem;font-weight:600;padding:8px 18px 10px;cursor:pointer;font-family:var(--sans,'Inter',sans-serif);">Newsletter</button>
            <button id="tab-wb" type="button" class="sub-tab" data-tab="webinaire" style="background:none;border:none;border-bottom:2px solid transparent;color:#666;font-size:.88rem;padding:8px 18px 10px;cursor:pointer;font-family:var(--sans,'Inter',sans-serif);">Webinaire</button>
            <div style="flex:1;"></div>
            <button id="sub-dl-csv" type="button" style="background:#1a2e4a;color:#fff;border:none;border-radius:5px;padding:6px 14px;font-size:.8rem;cursor:pointer;font-family:var(--sans,'Inter',sans-serif);margin-bottom:8px;">Télécharger CSV</button>
          </div>
          <div id="sub-admin-list" style="overflow-y:auto;flex:1;padding:0;"></div>
        </div>
      </div>
    </div>`;

  const nlDropHTML = `
    <div id="nl-drop" class="nl-drop" hidden>
      <form id="nl-drop-form">
        <input type="email" id="nl-drop-email" placeholder="votre@email.fr" required autocomplete="email">
        <button type="submit">S&rsquo;inscrire</button>
      </form>
      <p id="nl-drop-msg"></p>
    </div>`;

  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.outerHTML = headerHTML + nlDropHTML + alphaNoticeHTML;
  if (footerSlot) footerSlot.outerHTML = footerHTML;

  const alphaNotice = document.getElementById('alpha-notice');
  if (alphaNotice) {
    if (sessionStorage.getItem('alphaNoticeDismissed')) {
      alphaNotice.style.display = 'none';
    }
    const closeBtn = document.getElementById('alpha-notice-close');
    if (closeBtn) closeBtn.addEventListener('click', () => {
      alphaNotice.style.display = 'none';
      sessionStorage.setItem('alphaNoticeDismissed', '1');
    });
  }

  const webinarNotice = document.getElementById('webinar-notice');
  if (webinarNotice) {
    if (sessionStorage.getItem('webinarNoticeDismissed')) {
      webinarNotice.style.display = 'none';
    }
    const wClose = document.getElementById('webinar-notice-close');
    if (wClose) wClose.addEventListener('click', () => {
      webinarNotice.style.display = 'none';
      sessionStorage.setItem('webinarNoticeDismissed', '1');
    });
    const wForm = document.getElementById('webinar-form');
    if (wForm) wForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('webinar-email').value.trim();
      const msg = document.getElementById('webinar-msg');
      msg.textContent = '';
      try {
        const r = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({email, type: 'webinaire'})
        });
        const d = await r.json();
        if (d.ok) {
          msg.textContent = 'Inscription enregistr\u00e9e\u202f!';
          msg.style.color = '#1a5c1a';
          document.getElementById('webinar-email').value = '';
        } else if (d.already) {
          msg.textContent = 'D\u00e9j\u00e0 inscrit(e).';
          msg.style.color = '#1a5c1a';
        } else {
          msg.textContent = 'Erreur. R\u00e9essayez.';
          msg.style.color = '#a02020';
        }
      } catch {
        msg.textContent = 'Erreur. R\u00e9essayez.';
        msg.style.color = '#a02020';
      }
    });
  }

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) toggle.addEventListener('click', ()=>{
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  const nlNavBtn = document.getElementById('nlNavBtn');
  const nlDrop = document.getElementById('nl-drop');
  if (nlNavBtn && nlDrop) {
    nlNavBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nlDrop.hidden = !nlDrop.hidden;
      if (!nlDrop.hidden) document.getElementById('nl-drop-email').focus();
    });
    document.addEventListener('click', (e) => {
      if (!nlDrop.hidden && !nlDrop.contains(e.target)) nlDrop.hidden = true;
    });
    document.getElementById('nl-drop-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('nl-drop-email').value.trim();
      const msg = document.getElementById('nl-drop-msg');
      msg.textContent = '';
      try {
        const r = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({email})
        });
        const d = await r.json();
        if (d.ok) {
          msg.textContent = 'Inscription enregistr\u00e9e\u00a0!';
          msg.style.color = '#2a7a2a';
          document.getElementById('nl-drop-email').value = '';
        } else if (d.already) {
          msg.textContent = 'D\u00e9j\u00e0 inscrit(e).';
          msg.style.color = '#2a7a2a';
        } else {
          msg.textContent = 'Erreur. R\u00e9essayez.';
          msg.style.color = '#b00';
        }
      } catch {
        msg.textContent = 'Erreur. R\u00e9essayez.';
        msg.style.color = '#b00';
      }
    });
  }

  let _subToken = null;
  let _allSubscribers = [];
  let _activeTab = 'newsletter';

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('fr-FR', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'});
    } catch { return String(iso); }
  }

  function renderSubscriberList() {
    const list = document.getElementById('sub-admin-list');
    if (!list) return;
    const filtered = _allSubscribers.filter(e => (e.type || 'newsletter') === _activeTab);
    if (filtered.length === 0) {
      list.innerHTML = '<p style="padding:24px;color:#888;font-family:var(--sans,\'Inter\',sans-serif);font-size:.88rem;text-align:center;">Aucun abonné dans cette catégorie.</p>';
      return;
    }
    const rows = filtered.map(e => `
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:10px 16px;font-size:.85rem;font-family:var(--sans,'Inter',sans-serif);word-break:break-all;">${escHtml(e.email)}</td>
        <td style="padding:10px 16px;font-size:.82rem;color:#555;font-family:var(--sans,'Inter',sans-serif);white-space:nowrap;">${escHtml(formatDate(e.date))}</td>
        <td style="padding:10px 12px;text-align:right;">
          <button type="button" data-email="${escHtml(e.email)}" data-type="${escHtml(e.type || 'newsletter')}" class="sub-del-btn"
            style="background:none;border:1px solid #e0a0a0;color:#b00;border-radius:4px;padding:4px 10px;font-size:.78rem;cursor:pointer;font-family:var(--sans,'Inter',sans-serif);">Supprimer</button>
        </td>
      </tr>`).join('');
    list.innerHTML = `<table style="width:100%;border-collapse:collapse;">
      <thead><tr style="background:#f7f8fa;border-bottom:2px solid #e5e7eb;">
        <th style="padding:10px 16px;text-align:left;font-size:.8rem;color:#444;font-family:var(--sans,'Inter',sans-serif);font-weight:600;">Email</th>
        <th style="padding:10px 16px;text-align:left;font-size:.8rem;color:#444;font-family:var(--sans,'Inter',sans-serif);font-weight:600;">Date</th>
        <th style="padding:10px 12px;"></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
    list.querySelectorAll('.sub-del-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email');
        const type = btn.getAttribute('data-type');
        btn.disabled = true;
        btn.textContent = '…';
        try {
          const r = await fetch('/api/subscribers/' + encodeURIComponent(email) + '?type=' + encodeURIComponent(type), {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + _subToken }
          });
          if (r.ok) {
            _allSubscribers = _allSubscribers.filter(e => !(e.email === email && (e.type || 'newsletter') === type));
            renderSubscriberList();
          } else {
            btn.disabled = false;
            btn.textContent = 'Supprimer';
            alert('Erreur lors de la suppression.');
          }
        } catch {
          btn.disabled = false;
          btn.textContent = 'Supprimer';
          alert('Erreur réseau.');
        }
      });
    });
  }

  function openSubPanel() {
    const overlay = document.getElementById('sub-admin-overlay');
    if (!overlay) return;
    overlay.hidden = false;
    document.getElementById('sub-admin-auth').style.display = 'block';
    const panel = document.getElementById('sub-admin-panel');
    panel.hidden = true;
    const pwErr = document.getElementById('sub-admin-pw-err');
    if (pwErr) pwErr.style.display = 'none';
    const pwInput = document.getElementById('sub-admin-pw');
    if (pwInput) { pwInput.value = ''; setTimeout(() => pwInput.focus(), 50); }
  }

  function closeSubPanel() {
    const overlay = document.getElementById('sub-admin-overlay');
    if (overlay) overlay.hidden = true;
    _subToken = null;
  }

  async function loadAndShowPanel(token) {
    const r = await fetch('/api/subscribers', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!r.ok) throw new Error('auth');
    _allSubscribers = await r.json();
    _subToken = token;
    document.getElementById('sub-admin-auth').style.display = 'none';
    const panel = document.getElementById('sub-admin-panel');
    panel.hidden = false;
    _activeTab = 'newsletter';
    updateTabStyles();
    renderSubscriberList();
  }

  function updateTabStyles() {
    document.querySelectorAll('.sub-tab').forEach(btn => {
      const isActive = btn.getAttribute('data-tab') === _activeTab;
      btn.style.borderBottom = isActive ? '2px solid #1a2e4a' : '2px solid transparent';
      btn.style.color = isActive ? '#1a2e4a' : '#666';
      btn.style.fontWeight = isActive ? '600' : '400';
    });
  }

  const subAdminBtn = document.getElementById('sub-admin-btn');
  if (subAdminBtn) subAdminBtn.addEventListener('click', openSubPanel);

  const subAdminClose = document.getElementById('sub-admin-close');
  if (subAdminClose) subAdminClose.addEventListener('click', closeSubPanel);

  const subOverlay = document.getElementById('sub-admin-overlay');
  if (subOverlay) subOverlay.addEventListener('click', (e) => { if (e.target === subOverlay) closeSubPanel(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && subOverlay && !subOverlay.hidden) closeSubPanel();
  });

  const pwForm = document.getElementById('sub-admin-pw-form');
  if (pwForm) pwForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = document.getElementById('sub-admin-pw').value;
    const pwErr = document.getElementById('sub-admin-pw-err');
    pwErr.style.display = 'none';
    try {
      await loadAndShowPanel(pw);
    } catch {
      pwErr.style.display = 'block';
    }
  });

  document.querySelectorAll('.sub-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeTab = btn.getAttribute('data-tab');
      updateTabStyles();
      renderSubscriberList();
    });
  });

  const dlBtn = document.getElementById('sub-dl-csv');
  if (dlBtn) dlBtn.addEventListener('click', () => {
    if (!_subToken) return;
    const a = document.createElement('a');
    a.href = '/api/subscribers/export';
    a.download = 'subscribers.csv';
    const req = new XMLHttpRequest();
    req.open('GET', '/api/subscribers/export', true);
    req.setRequestHeader('Authorization', 'Bearer ' + _subToken);
    req.responseType = 'blob';
    req.onload = () => {
      const url = URL.createObjectURL(req.response);
      a.href = url;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
    };
    req.send();
  });
})();
