# From0to990

PWA local-first de préparation adaptative au TOEIC® Listening & Reading.

## Principes

- GitHub = source maître, historique et hébergement GitHub Pages.
- PWA responsive : laptop, grand écran, iPad 10–11 pouces, iPhone 13 environ.
- Offline-first : IndexedDB locale, cache PWA, file d'attente de synchro.
- Mises à jour automatiques du service worker avec restauration de session.
- Backend optionnel derrière une API HTTP abstraite (`SyncAdapter`).
- Backend actif : @Sites + D1 à `https://from0to990-api.sicho95.chatgpt.site`.
- CORS direct validé depuis `https://sicho95.github.io` ; le proxy Cloudflare n'est pas nécessaire.
- Export/import administrateur complet pour migration future.
- Contenu pédagogique et audio versionnés séparément du code.

> TOEIC® est une marque d'ETS. Ce projet n'est ni affilié ni approuvé par ETS. Les exercices inclus sont originaux et de type TOEIC ; ils ne sont pas des questions officielles, sauf packs distincts explicitement signalés comme ressources ETS autorisées.

## Développement local

```bash
npm run check
npm run build
python3 -m http.server 8080 -d docs
```

Puis ouvrir <http://localhost:8080>.

## GitHub Pages

Le workflow `.github/workflows/pages.yml` construit `docs/` puis le publie.

URL : `https://sicho95.github.io/From0to990/`

## Architecture

```text
src/                  code source de la PWA
public/content/       contenu pédagogique généré au build
public/audio/         futurs fichiers audio originaux
backend-contract/     contrat API, schéma SQL et migrations
scripts/              build/check sans dépendance
.github/workflows/    déploiement GitHub Pages
docs/                 build généré
```
