# Sentencia

**Plateforme ouverte d'analyse de la justice pénale en France.**

[🇬🇧 English](README.md) · 🇫🇷 Français

Sentencia a pour ambition de rendre la justice pénale française lisible, comparable et accessible. Au cœur du projet : une carte interactive de la *géographie des peines*, qui permet à chacun (citoyens, avocats, chercheurs, journalistes, décideurs publics) d'observer comment les peines varient sur le territoire.

Le projet est open source, open access, non lucratif et fondé sur la recherche publique. Il est édité par le [Machina Research Network](machina.html), consortium académique associant notamment Aix-Marseille Université, le CESDIP, CY Cergy Paris Université et le Service statistique du Ministère de la Justice (SSMJ).

> **Statut :** alpha fermée. Nous recueillons des retours, constituons une communauté et présentons les premiers prototypes, données et outils.

---

## Ce que propose la plateforme

| Fonctionnalité | Description |
|---|---|
| **Carte interactive** | Carte choroplèthe de la France métropolitaine présentant des indicateurs de sentencing par département (taux de poursuites, durée moyenne d'emprisonnement ferme, sévérité résiduelle) pour plusieurs catégories d'infractions, dont les violences intrafamiliales (VIF). |
| **Comparaison territoriale** | Comparer des juridictions à profil de contentieux comparable et repérer les écarts significatifs. |
| **Modèles descriptifs** | Modèles prototypes issus de la littérature, par exemple l'arbre de décision sur les comparutions immédiates d'Azoulay (2020). |
| **Sentencing Choice Tree** | Outil qui entraîne des arbres de décision sur un fichier CSV importé, avec scikit-learn, XGBoost ou LightGBM. |
| **Documentation** | Méthodologie, bibliographie (avec PDF téléchargeables), revue de presse, FAQ, blog et feuille de route. |

### Éthique et limites

Sentencia **ne propose aucun** classement des juridictions ou des magistrats et **ne prédit pas** l'issue d'une affaire individuelle. Les indicateurs sont des descriptions statistiques agrégées. Les écarts entre territoires reflètent de nombreux facteurs (composition du contentieux, démographie, organisation judiciaire, politiques pénales locales) et doivent être lus avec prudence. Voir [methodologie.html](methodologie.html) et [mentions-legales.html](mentions-legales.html).

---

## Technologies

- **Frontend :** HTML, CSS et JavaScript natifs, sans framework. La carte est réalisée avec D3.js v7.
- **Backend :** Node.js + Express 5 (`server.js`), qui sert le site statique et une API REST.
- **Base de données :** PostgreSQL. Le contenu est stocké en JSONB ; les fichiers de `data/` servent à l'initialiser.
- **Sentencing Choice Tree :** Python + FastAPI (`sentencing-tree/`). Express le lance automatiquement sur le port 8000 et le rend accessible via `/sentencing-tree-app/`.

## Structure du projet

```
.
├── index.html               # Page d'accueil Sentencia
├── carte.html               # Page de la carte interactive
├── geography-sentencing.html# Module cartographique D3 (intégré dans carte.html)
├── modeles.html             # Modèles descriptifs du sentencing
├── methodologie.html        # Sources, indicateurs, limites
├── bibliographie.html       # Bibliographie
├── presse.html, blog.html, faq.html, equipe.html,
│   feuille-de-route.html, mentions-legales.html
├── sentencia.css / .js      # Charte graphique, en-tête et pied de page communs
├── sentencia-assets/        # Images et PDF de la bibliographie
├── machina.html, app.js,
│   styles.css               # Ancien site du Machina Research Network
├── admin.html               # Interface d'administration
├── server.js                # Serveur Express + API
├── data/                    # Données initiales (JSON) et VIF.csv
└── sentencing-tree/         # Application FastAPI (Sentencing Choice Tree)
```

---

## Lancer le projet en local

### Prérequis

- Node.js 18+
- Python 3.11+
- Une base de données PostgreSQL

### Installation

```bash
git clone https://github.com/s-ra-cloud/Sentencia.git
cd Sentencia

# Dépendances Node
npm install

# Dépendances Python (Sentencing Choice Tree)
python -m venv .venv
source .venv/bin/activate
pip install -r sentencing-tree/requirements.txt
```

### Variables d'environnement

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Chaîne de connexion PostgreSQL |
| `ADMIN_PASSWORD` | Mot de passe de l'interface d'administration. **À définir impérativement en production.** |

### Démarrage

```bash
npm start
```

Le site est accessible sur <http://localhost:5000>. Le backend Python démarre automatiquement.

---

## Administration

La page d'administration (`/admin.html`) permet de gérer les publications, les membres, les partenaires, les financements, le programme de recherche, les articles de blog et les abonnés à la newsletter. Elle permet aussi d'exporter ou d'importer toute la base en JSON. Les routes protégées de l'API attendent le mot de passe sous forme de jeton `Bearer`.

**Ajouter un PDF à la bibliographie :** déposer le fichier dans `sentencia-assets/pdfs/`, puis ajouter un bloc `<a class="card" href="/sentencia-assets/pdfs/FICHIER.pdf">` dans la bonne catégorie de `bibliographie.html`.

---

## Sources des données

Les données proviennent principalement du **Service statistique du Ministère de la Justice (SSMJ)**, ainsi que de jeux de données publics et de corpus constitués dans le cadre de travaux de recherche partenaires. Les contours géographiques proviennent de [france-geojson](https://github.com/gregoiredavid/france-geojson).

## Citer la plateforme

> Sentencia – Plateforme ouverte d'analyse de la justice pénale en France, Machina Research Network, [année de consultation], URL.

## Contact

Direction scientifique : **Sacha Raoult** · [sacha.raoult@univ-amu.fr](mailto:sacha.raoult@univ-amu.fr)

Questions, suggestions et signalements sont les bienvenus. Vous pouvez aussi [ouvrir une issue](https://github.com/s-ra-cloud/Sentencia/issues).
