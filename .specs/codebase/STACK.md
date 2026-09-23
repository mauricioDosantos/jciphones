# Tech Stack

**Analyzed:** 2026-09-18

## Core

- Framework: nenhum — HTML5 estático puro
- Language: HTML + CSS (custom properties) + JavaScript vanilla (ES5/ES6, IIFE)
- Runtime: navegador (client-side apenas, sem build step)
- Package manager: nenhum (sem `package.json`, sem bundler)

## Frontend

- UI Framework: nenhum — markup semântico manual
- Styling: CSS puro dentro de `<style>` no `<head>`, com variáveis (`:root { --bg, --accent, ... }`)
- State Management: nenhum — estado de UI (menu mobile, nav scrolled) via toggle de classes
- Form Handling: não há formulários — toda conversão é link `wa.me/...`

## Backend

- Não existe backend. Site 100% estático servido via GitHub Pages.

## Testing

- Unit: nenhum
- Integration: nenhum
- E2E: nenhum
- **Gap:** sem qualquer automação de teste (ver `CONCERNS.md`)

## External Services

- Analytics: Google Analytics 4 (gtag.js, measurement ID `G-FJ1ECSJ4RF`)
- Mensageria/Conversão: WhatsApp (`wa.me` deep link, número placeholder `5511999999999`)
- Mapa: Google Maps embed (iframe)
- Fontes: Google Fonts (`Instrument Sans`)

## Development Tools

- Hospedagem: GitHub Pages
- Controle de versão: Git/GitHub
