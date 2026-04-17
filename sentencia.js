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
          <span class="brand-mark">S</span>
          <strong>Sentencia</strong>
        </a>
        <nav class="nav-links" id="navLinks">
          ${NAV.map(n=>`<a href="${n.href}" class="${n.key===current?'active':''}">${n.label}</a>`).join('')}
        </nav>
        <a href="/carte.html" class="nav-cta">Ouvrir la carte <span aria-hidden="true">↗</span></a>
        <button class="nav-toggle" aria-label="Ouvrir le menu" id="navToggle" aria-expanded="false" aria-controls="navLinks">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h14M3 10h14M3 14h14"/></svg>
        </button>
      </div>
    </header>`;

  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-brand">
          <div class="brand"><span class="brand-mark">S</span><strong>Sentencia</strong></div>
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
        <span>Données issues du Service statistique du Ministère de la Justice et de partenariats publics.</span>
      </div>
    </footer>`;

  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.outerHTML = headerHTML;
  if (footerSlot) footerSlot.outerHTML = footerHTML;

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) toggle.addEventListener('click', ()=>{
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
})();
