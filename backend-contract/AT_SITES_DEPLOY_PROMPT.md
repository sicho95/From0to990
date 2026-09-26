# Prompt de migration @Sites — From0to990 auth v2

Utilise **@Sites uniquement comme backend** de From0to990.

Le frontend/PWA est déjà dans le dépôt GitHub public `sicho95/From0to990` et reste hébergé par GitHub Pages. Ne recrée, ne redessine et n'héberge aucun frontend.

Lis dans le dépôt et considère comme **source de vérité obligatoire** :

- `backend-contract/SITES_MINIMAL.md`
- `backend-contract/AUTH_V2.md`
- `backend-contract/openapi.yaml`
- `backend-contract/schema.sql`
- `backend-contract/migrations/002_auth.sql`

Migre le backend existant `https://from0to990-api.sicho95.chatgpt.site` de v1 vers v2 sans perdre les données existantes.

Exigences essentielles :
- appliquer la migration D1 v1→v2 ;
- comptes avec e-mail unique + pseudo unique + mot de passe hashé conformément à `AUTH_V2.md` ;
- sessions opaques multi-appareils ;
- `POST /api/v1/sync` authentifié, `user_id` dérivé exclusivement de la session ;
- inscription, connexion, déconnexion, `/auth/me` ;
- mot de passe oublié et reset par e-mail ;
- routes admin utilisateurs : liste/recherche, blocage, déblocage, suppression ;
- bootstrap sécurisé du premier admin ;
- audit des actions admin ;
- export/import administrateur existant conservé et toujours protégé par le secret serveur ;
- CORS uniquement pour `https://sicho95.github.io`, avec `Authorization` autorisé ;
- aucun secret ni donnée sensible dans le frontend ;
- aucun mot de passe, token brut de session/reset ou pepper dans les logs ou exports ;
- conserver l'idempotence/cursor de la synchro.

Secrets/configuration à créer côté serveur sans jamais les afficher dans le chat :
- `PASSWORD_PEPPER`
- `ADMIN_BOOTSTRAP_TOKEN`
- conserver/rotater si nécessaire `ADMIN_EXPORT_TOKEN`
- `APP_PUBLIC_URL=https://sicho95.github.io/From0to990/`
- `PASSWORD_RESET_FROM`
- `RESEND_API_KEY` ou un fournisseur transactionnel équivalent.

Important : n'annonce `auth_version: 2` dans `GET /api/v1/health` **qu'après** réussite de tous les tests d'acceptation de `SITES_MINIMAL.md`. Avant cela, laisse la capacité auth désactivée pour ne pas verrouiller la PWA.

Teste réellement en priorité :
1. CORS cross-origin depuis GitHub Pages avec header Authorization ;
2. inscription puis connexion par e-mail et par pseudo ;
3. synchronisation sur un second appareil avec cursor null ;
4. blocage utilisateur et révocation des sessions ;
5. reset de mot de passe par e-mail et révocation de toutes les sessions ;
6. rôle admin et protections self-delete/last-admin ;
7. export/import portable ;
8. absence de secrets dans les réponses, logs et export.

À la fin, retourne uniquement :
- l'URL API ;
- le JSON de `GET /api/v1/health` ;
- le résultat synthétique des tests ci-dessus ;
- la confirmation que les secrets ont été créés côté serveur sans révéler leur valeur.
