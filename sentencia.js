(function(){
  const NAV = [
    {href:'/',label:'Accueil',key:'accueil'},
    {href:'/carte.html',label:'Carte',key:'carte'},
    {href:'/modeles.html',label:'Modèles',key:'modeles'},
    {href:'/methodologie.html',label:'Méthodologie',key:'methodologie'},
    {href:'/feuille-de-route.html',label:'Feuille de route',key:'feuille-de-route'},
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
          <a href="/modeles.html">Modèles</a>
          <a href="/methodologie.html">Méthodologie</a>
          <a href="/feuille-de-route.html">Feuille de route</a>
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
      </div>
    </footer>`;

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
})();
