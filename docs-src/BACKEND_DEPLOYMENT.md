# Backend déployé

Endpoint actif : `https://from0to990-api.sicho95.chatgpt.site`

## État validé le 25/09/2026

- `GET /api/v1/health` : HTTP 200.
- D1 : opérationnel, schéma version 1.
- CORS : autorisé depuis `https://sicho95.github.io`.
- Prévol `OPTIONS` : 204.
- `POST /api/v1/sync` : 200 depuis l'origine GitHub Pages autorisée.
- Autres origines testées : refusées.
- Proxy Cloudflare : non requis.

## Sécurité

Le secret `ADMIN_EXPORT_TOKEN` est exclusivement serveur. Il ne doit jamais être commité, embarqué dans la PWA ni stocké dans IndexedDB.

La synchronisation utilisateur n'a pas encore d'authentification forte : CORS limite les navigateurs mais ne remplace pas une authentification API. Une authentification propriétaire pourra être ajoutée ultérieurement sans modifier le stockage local-first.
