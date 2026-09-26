# Correctif immédiat @Sites — auth v2

Applique ce correctif au backend live `https://from0to990-api.sicho95.chatgpt.site`.

Lis d'abord :
- `backend-contract/AUTH_V2.md`
- `backend-contract/SITES_MINIMAL.md`
- `backend-contract/openapi.yaml`

## À corriger maintenant

1. **Supprimer totalement le fallback legacy owner dans /api/v1/sync**
   - sans `Authorization: Bearer <session>` valide => HTTP 401 ;
   - ne jamais retourner d'événements `owner` à une requête non authentifiée ;
   - avec session valide, déduire `user_id` uniquement depuis `auth_sessions`.

2. **Rendre password/forgot réellement fonctionnel**
   - configurer le fournisseur transactionnel ;
   - pour un compte existant : créer token reset, stocker seulement son hash, envoyer le lien ;
   - pour une adresse inexistante : même réponse ;
   - réponse publique dans tous les cas réussis : HTTP 202, corps générique ;
   - ne jamais logger le token brut.

3. **Administrateur initial**
   - configuration serveur privée : `INITIAL_ADMIN_EMAIL=<fourni par l'opérateur>` ;
   - `INITIAL_ADMIN_USERNAME=Sicho` ;
   - réserver cette identité pour le premier admin ;
   - après création du compte correspondant, le promouvoir `role=admin` via le bootstrap sécurisé ;
   - ne jamais exposer l'e-mail admin, le token bootstrap ou un mot de passe dans GitHub/frontend/logs.

4. **Health**
   - seulement après réussite complète :
   `{"status":"ok","database":"ok","schema_version":2,"auth_version":2}`

## Tests obligatoires

- OPTIONS GitHub Pages avec Authorization => 204 ;
- autre Origin => 403 ;
- GET /auth/me sans token => 401 ;
- POST /sync sans token => 401 ;
- register réel => 201 ;
- login par pseudo et e-mail => 200 ;
- sync avec token => uniquement événements du compte ;
- forgot => 202 et mail réellement envoyé/queue ;
- reset valide => mot de passe changé + sessions révoquées ;
- compte Sicho promu admin ;
- GET /admin/users avec session Sicho => 200 ;
- block/unblock/delete d'un compte test => fonctionne et audité.

Ne passe pas auth_version à 2 avant que tous ces tests soient verts.
