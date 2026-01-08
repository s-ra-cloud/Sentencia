# Machina Research Network Website

## Overview

This is a static website for the Machina Research Network, an academic research organization focused on computational interdisciplinary research. The site presents information about the network's research program, outputs/projects, team members, and funding sources. It features bilingual support (English/French), light/dark theme switching, and a basic client-side admin panel for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend-Only Static Site
- **Problem**: Display research network information with minimal infrastructure
- **Solution**: Pure HTML/CSS/JavaScript with no build tools or frameworks
- **Rationale**: Simple academic website doesn't need framework complexity; reduces maintenance burden

### Single-Page Application Pattern
- **Problem**: Smooth navigation between sections without page reloads
- **Solution**: Client-side routing using `data-route` attributes on navigation elements
- **Rationale**: Better user experience while keeping the codebase simple

### Internationalization (i18n)
- **Problem**: Support both English and French audiences
- **Solution**: Client-side i18n using a JavaScript object (`I18N`) containing all translations, with `data-i18n` attributes on HTML elements
- **Rationale**: No server-side rendering needed; translations are instant

### Theme System
- **Problem**: Support user preference for light/dark modes
- **Solution**: CSS custom properties (variables) with `data-theme` attribute on body, toggled via JavaScript
- **Rationale**: Clean separation of theme logic; easy to maintain color schemes

### Admin Panel
- **Problem**: Allow basic content management without a backend
- **Solution**: Client-side admin with localStorage persistence
- **Limitations**: Data is browser-local only, no persistence across devices
- **Rationale**: Proof-of-concept for content editing; real deployment would need backend

### Static File Server
- **Problem**: Serve the website for development/preview
- **Solution**: Minimal Node.js HTTP server (`server.js`) that serves static files
- **Rationale**: Zero dependencies; just uses built-in `http` and `fs` modules

## External Dependencies

### Fonts
- **Google Fonts**: Inter font family loaded via CSS import

### Media Assets
- **hero.mp4**: Background video for the homepage hero section (expected but not included in repository)

### Runtime Requirements
- **Node.js**: Required only for running the development server (`server.js`)
- **Browser localStorage**: Used for admin panel data persistence (client-side only)

### No External APIs or Databases
- The site is fully static with no backend services
- All content is embedded in the JavaScript/HTML files
- Admin changes persist only in browser localStorage