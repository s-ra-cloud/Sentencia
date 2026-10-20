# Sentencia

**An open platform for analysing criminal justice in France.**

🇬🇧 English · [🇫🇷 Français](README.fr.md)

Sentencia aims to make French criminal justice readable, comparable and accessible. At its core is an interactive map of the *geography of sentencing*: it lets citizens, lawyers, researchers, journalists and policymakers look at how sentences differ across the country.

The project is open source, open access, non-profit and grounded in public research. It is published by the [Machina Research Network](machina.html), an academic consortium that includes Aix-Marseille Université, CESDIP, CY Cergy Paris Université and the statistical service of the French Ministry of Justice (SSMJ).

> **Status:** closed alpha. We are gathering feedback, building a community, and presenting early prototypes, data and tools.

---

## What the platform offers

| Feature | Description |
|---|---|
| **Interactive map** | A choropleth map of metropolitan France showing sentencing indicators by département (prosecution rates, average length of prison sentences, residual severity) for several offence categories, including intimate partner violence (VIF). |
| **Territorial comparison** | Compare jurisdictions with similar caseloads and spot significant differences. |
| **Descriptive models** | Prototype models taken from the research literature, for example the decision tree for immediate trials (*comparutions immédiates*) from Azoulay (2020). |
| **Sentencing Choice Tree** | A tool that trains decision trees on an uploaded CSV, using scikit-learn, XGBoost or LightGBM. |
| **Documentation** | Methodology, bibliography (with downloadable PDFs), press coverage, FAQ, blog and roadmap. |

### Ethics and limits

Sentencia **does not** score courts or judges, and **does not** predict the outcome of individual cases. All indicators are aggregated statistical descriptions. Differences between areas reflect many factors (types of cases, demographics, how courts are organised, local criminal policy) and should be read with care. See [methodologie.html](methodologie.html) and [mentions-legales.html](mentions-legales.html).

---

## Tech stack

- **Frontend:** plain HTML, CSS and JavaScript, with no framework. D3.js v7 draws the map.
- **Backend:** Node.js + Express 5 (`server.js`), which serves the static site and a REST API.
- **Database:** PostgreSQL. Content is stored as JSONB, and the files in `data/` are used to seed it.
- **Sentencing Choice Tree:** Python + FastAPI (`sentencing-tree/`). Express starts it automatically on port 8000 and proxies it at `/sentencing-tree-app/`.

## Project structure

```
.
├── index.html               # Sentencia home page
├── carte.html               # Interactive map page
├── geography-sentencing.html# D3 map module (embedded by carte.html)
├── modeles.html             # Descriptive sentencing models
├── methodologie.html        # Data sources, indicators, limits
├── bibliographie.html       # Bibliography
├── presse.html, blog.html, faq.html, equipe.html,
│   feuille-de-route.html, mentions-legales.html
├── sentencia.css / .js      # Shared design system, header & footer
├── sentencia-assets/        # Images and bibliography PDFs
├── machina.html, app.js,
│   styles.css               # Former Machina Research Network site
├── admin.html               # Content management interface
├── server.js                # Express server + API
├── data/                    # Seed data (JSON) and VIF.csv
└── sentencing-tree/         # FastAPI app (Sentencing Choice Tree)
```

---

## Running locally

### Requirements

- Node.js 18+
- Python 3.11+
- A PostgreSQL database

### Setup

```bash
git clone https://github.com/s-ra-cloud/Sentencia.git
cd Sentencia

# Node dependencies
npm install

# Python dependencies (Sentencing Choice Tree)
python -m venv .venv
source .venv/bin/activate
pip install -r sentencing-tree/requirements.txt
```

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Password for the admin interface. **Always set this in production.** |

### Start

```bash
npm start
```

The site runs at <http://localhost:5000>. The Python backend starts on its own.

---

## Administration

The admin page (`/admin.html`) lets you manage outputs, team members, partners, funding, the research programme, blog posts and newsletter subscribers. You can also export or import the whole database as JSON. Protected API routes expect the password as a `Bearer` token.

**Adding a PDF to the bibliography:** put the file in `sentencia-assets/pdfs/`, then add a `<a class="card" href="/sentencia-assets/pdfs/FILE.pdf">` block under the right category in `bibliographie.html`.

---

## Data sources

Data comes mainly from the **statistical service of the French Ministry of Justice (SSMJ)**, along with public datasets and corpora built through partner research projects. Map boundaries come from [france-geojson](https://github.com/gregoiredavid/france-geojson).

## How to cite

> Sentencia – Plateforme ouverte d'analyse de la justice pénale en France, Machina Research Network, [year accessed], URL.

## Contact

Scientific director: **Sacha Raoult** · [sacha.raoult@univ-amu.fr](mailto:sacha.raoult@univ-amu.fr)

Questions, suggestions and issue reports are welcome. You can also [open an issue](https://github.com/s-ra-cloud/Sentencia/issues).
