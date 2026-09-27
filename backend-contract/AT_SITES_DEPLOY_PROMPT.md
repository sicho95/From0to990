# Prompt de migration @Sites — From0to990 auth v2

Utilise **@Sites uniquement comme backend** de From0to990.

Le frontend/PWA est déjà dans le dépôt GitHub public `sicho95/From0to990` et reste hébergé par GitHub Pages. Ne recrée, ne redessine et n'héberge aucun frontend.

Lis dans le dépôt et considère comme **source de vérité obligatoire** :

- `backend-contract/SITES_MINIMAL.md`
- `backend-contract/AUTH_V2.md`
- `backend-contract/openapi.yaml`
- `backend-contract/schema.sql`
- `backend-contract/migrations/002_auth.sql`

Migre le backend existant `https://from0to990-api.sicho95.chatgpt.site` de v1 vers v2. La conservation de l'ancien utilisateur logique `owner` et de son historique n'est plus requise.

Exigences essentielles :
- appliquer les migrations D1 `002_auth.sql` puis `003_manual_reset.sql` si elles ne sont pas déjà présentes ;
- comptes avec e-mail unique + pseudo unique + mot de passe hashé conformément à `AUTH_V2.md` ;
- sessions opaques multi-appareils ;
- `POST /api/v1/sync` strictement authentifié : sans Bearer valide => 401, aucun fallback `owner`, `user_id` dérivé exclusivement de la session ;
- inscription, connexion, déconnexion, `/auth/me` ;
- mot de passe oublié SANS fournisseur mail : `/forgot` crée une demande admin et répond toujours 202 ;
- l'admin voit les demandes dans `GET /api/v1/admin/reset-requests` ;
- `POST /api/v1/admin/users/{userId}/password/temporary` génère un mot de passe provisoire aléatoire valable 24 h, n'en stocke que le hash et retourne le clair UNE SEULE FOIS à l'admin ;
- la PWA ouvre ensuite un `mailto:` local prérempli pour que l'admin l'envoie manuellement ; aucun service mail serveur ;
- le login avec mot de passe provisoire ne donne accès qu'à `POST /api/v1/auth/password/change` jusqu'au choix d'un mot de passe permanent ;
- un mot de passe permanent choisi par l'utilisateur n'expire pas ;
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
- `INITIAL_ADMIN_EMAIL` : valeur fournie privément par l'opérateur au déploiement, ne jamais la committer ;
- `INITIAL_ADMIN_USERNAME=Sicho`.

Important : n'annonce `auth_version: 2` dans `GET /api/v1/health` **qu'après** réussite de tous les tests d'acceptation de `SITES_MINIMAL.md`. Avant cela, laisse la capacité auth désactivée pour ne pas verrouiller la PWA.

Teste réellement en priorité :
1. CORS cross-origin depuis GitHub Pages avec header Authorization ;
2. inscription puis connexion par e-mail et par pseudo ;
3. synchronisation sur un second appareil avec cursor null ;
4. blocage utilisateur et révocation des sessions ;
5. demande de reset → notification admin → provisoire 24 h → changement obligatoire → révocation des anciennes sessions ;
6. rôle admin et protections self-delete/last-admin ;
7. export/import portable ;
8. absence de secrets dans les réponses, logs et export.

À la fin, retourne uniquement :
- l'URL API ;
- le JSON réel de `GET /api/v1/health` (attendu schema_version 3 + auth_version 2) ;
- le résultat synthétique des tests ci-dessus ;
- la confirmation que les secrets ont été créés côté serveur sans révéler leur valeur.


## État live constaté à corriger avant activation

Les tests externes ont déjà confirmé :
- D1 répond `schema_version: 2` ;
- les routes auth/admin existent ;
- CORS GitHub Pages + Authorization est correct ;
- origine étrangère refusée ;
- `/auth/me` et `/admin/users` sans session renvoient 401 ;
- login invalide renvoie 401.

Blocages live restants :
1. `GET /api/v1/health` n'annonce pas encore `auth_version: 2`.
2. **CRITIQUE** : `POST /api/v1/sync` sans Authorization renvoie encore 200 et expose les événements legacy `owner`. Supprimer entièrement ce chemin legacy : sans session v2 valide => 401.
3. `POST /api/v1/auth/password/forgot` doit renvoyer 202 et créer une demande admin. Aucun fournisseur mail serveur : l'envoi est manuel via `mailto:` depuis l'interface admin.

Ne définir `auth_version:2` qu'après correction et tests de ces trois points et application de `003_manual_reset.sql`.

## Administrateur initial

Le propriétaire utilisera le pseudo `Sicho`.
La valeur de `INITIAL_ADMIN_EMAIL` doit être fournie **privément dans l'environnement @Sites**, jamais ajoutée au dépôt public.
Après création du compte correspondant, le promouvoir `role=admin` via le bootstrap sécurisé, puis vérifier que `/api/v1/admin/users` fonctionne avec sa session normale.
