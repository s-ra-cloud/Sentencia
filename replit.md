# Machina Research Network

## Overview

Machina Research Network is a bilingual (English/French) academic research network website showcasing computational interdisciplinary research. The site presents research outputs, team members, funding sources, and program information for a network of lecturers, researchers, engineers, and legal scholars from multiple universities.

The application is a single-page application (SPA) with client-side routing, theme switching (light/dark mode), and internationalization support. It includes an admin interface for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Vanilla JavaScript SPA**: No framework dependencies - uses plain HTML, CSS, and JavaScript
- **Client-side routing**: Hash-based or data-attribute routing via `data-route` attributes on navigation elements
- **Internationalization (i18n)**: Built-in translation system supporting English and French via `I18N` object in `app.js`
- **Theme system**: Light/dark mode toggle with CSS custom properties (CSS variables) for theming
- **Static assets**: Hero video (`hero.mp4`), stylesheets, and scripts served directly

### Backend Architecture
- **Express.js server** (v5.x): Minimal Node.js server handling static file serving and REST API
- **File-based data storage**: JSON files in `/data` directory for content persistence
- **Simple authentication**: Password-based admin authentication using Bearer tokens
- **API endpoints**:
  - `POST /api/login` - Admin authentication
  - `GET/PUT /api/outputs` - Research outputs CRUD
  - Similar patterns expected for members, funding, and program data

### Data Storage
- **PostgreSQL database**: Content stored in `content` table with JSONB data column
  - `outputs` - Research publications and projects
  - `members` - Team member profiles
  - `partners` - External partners and collaborating organizations
  - `funding` - Grants and contracts
  - `program` - Research program description
- **Bilingual content structure**: Each data item contains both English and French versions using `titleEN`/`titleFR` pattern or translation keys
- **Initial data**: JSON files in `/data` directory are used for initial database seeding only

### Authentication
- **Simple password-based auth**: Single admin password stored in `ADMIN_PASSWORD` environment variable
- **Bearer token pattern**: Password sent as Bearer token in Authorization header for protected routes
- **No session management**: Stateless authentication

### Funding Progress Bar
- **Visual progress indicator** showing funding status
- **Consumption logic**:
  - If funding period is completed (end year < current year): Fully consumed
  - If funding period is ongoing: Amount divided by number of years, elapsed years counted as consumed
  - Future funding periods: Not consumed
- **Display**: Total secured, consumed amount with percentage, remaining amount with percentage

### Admin Interface
- **Admin page**: `/admin.html` - Password-protected content management interface
- **Features**:
  - Login with password (default: "Trismegiste")
  - Manage Outputs (organized by team: Law, Epistemic, Psychology, Mythology, Philosophy, Structure and Theory)
  - Manage Members (name, tagline, affiliation, LinkedIn, bio EN/FR)
  - Manage Partners (name, website, logo, scope/type EN/FR, description EN/FR)
  - Manage Funding (grants and contracts with amounts, dates, links)
  - Manage Research Program (bilingual paragraphs)
  - Export/Import database (backup and restore all content as JSON)
  - File uploads for outputs (PDFs, videos, etc.) - stored locally for direct download
- **Access**: Small "Admin" link in footer of main website
- **API endpoints**:
  - `GET /api/export` - Export all database content as JSON (auth required)
  - `POST /api/import` - Import JSON backup to restore content (auth required)
  - `POST /api/upload` - Upload file for outputs (auth required, max 50MB)
  - `GET /api/files` - List uploaded files (auth required)
  - `DELETE /api/files/:filename` - Delete uploaded file (auth required)

### File Storage
- **Uploads directory**: `/uploads` - Stores uploaded files (PDFs, videos, etc.)
- **File types allowed**: .pdf, .doc, .docx, .mp4, .mp3, .zip, .png, .jpg, .jpeg, .gif
- **Max file size**: 50MB
- **Access**: Files served at `/uploads/<filename>` with download headers

## External Dependencies

### NPM Packages
- **express** (v5.2.1): Web server framework for API and static file serving
- **http-proxy-middleware**: Proxies requests to Python FastAPI app

### Python Packages (for Sentencing Tree App)
- **fastapi**, **uvicorn**: Web framework and server
- **pandas**, **numpy**: Data processing
- **scikit-learn**, **xgboost**, **lightgbm**: Machine learning
- **matplotlib**: Visualization

### External Services
- **Google Fonts**: Inter font family loaded via CSS import

### Sentencing Tree App
- **Location**: `/sentencing-tree/` directory
- **Description page**: `/sentencing-tree.html` - Explains the tool and links to the app
- **App URL**: `/sentencing-tree-app/` - Proxied to Python FastAPI backend on port 8000
- **Workflow**: Runs `python -m uvicorn main:app --host 0.0.0.0 --port 8000`
- **Features**: Upload CSV data, generate decision trees, multiple ML frameworks

### Geography of Sentencing Page
- **Location**: `/geography-sentencing.html`
- **Description**: Interactive map visualization of sentencing severity across French departments
- **Features**:
  - D3.js-powered choropleth map of metropolitan France
  - Color-coded departments by sentencing severity indicators
  - Left sidebar with contextual explanations, methodology, and data sources
  - Two dropdown menus: offense category (IPV) and indicator type (severity index, incarceration rate, average duration)
  - Bilingual support (EN/FR)
  - Tooltips showing department-specific data on hover
- **Data**: Sample IPV sentencing data for all 96 metropolitan departments
- **External dependency**: D3.js v7 (loaded from CDN), GeoJSON from gregoiredavid/france-geojson

### Environment Variables
- `ADMIN_PASSWORD`: Admin authentication password (defaults to 'Trismegiste' if not set)

### Static Assets Required
- `hero.mp4`: Hero section background video
- Member photos referenced in members data (expected in static directory)