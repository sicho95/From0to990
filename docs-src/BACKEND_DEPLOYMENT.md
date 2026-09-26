# Backend déployé

Endpoint actif : `https://from0to990-api.sicho95.chatgpt.site`

## Production actuelle

Le backend actuellement déployé reste en **v1** tant que `GET /api/v1/health` ne renvoie pas explicitement `auth_version: 2`.

État v1 validé :
- D1 opérationnel ;
- CORS autorisé depuis `https://sicho95.github.io` ;
- synchronisation événementielle avec cursor ;
- export/import administrateur serveur ;
- aucun secret dans la PWA.

Le frontend sait maintenant détecter automatiquement la capacité d'authentification. Il n'affiche les écrans compte/connexion que lorsque le backend annonce **auth v2**, afin d'éviter un déploiement partiel qui bloquerait l'application.

## Migration v2 préparée dans GitHub

Sources de vérité :
- `backend-contract/schema.sql` : schéma complet pour une installation neuve ;
- `backend-contract/migrations/002_auth.sql` : migration D1 v1 → v2 ;
- `backend-contract/openapi.yaml` : API v2 ;
- `backend-contract/AUTH_V2.md` : règles de sécurité et comportement détaillé ;
- `backend-contract/SITES_MINIMAL.md` : contraintes @Sites et tests d'acceptation.

La v2 ajoute :
- comptes e-mail + pseudo + mot de passe ;
- sessions multi-appareils ;
- synchronisation par utilisateur authentifié ;
- récupération de mot de passe par e-mail ;
- rôles `user/admin` ;
- blocage/déblocage/suppression d'utilisateurs ;
- journal d'audit administrateur.

## Secrets serveur v2

Ne jamais mettre leurs valeurs dans GitHub, la PWA, les logs ou un export D1 :
- `PASSWORD_PEPPER`
- `ADMIN_BOOTSTRAP_TOKEN`
- `ADMIN_EXPORT_TOKEN`
- `RESEND_API_KEY` (ou secret du fournisseur mail retenu)

Configuration serveur non secrète :
- `APP_PUBLIC_URL=https://sicho95.github.io/From0to990/`
- `PASSWORD_RESET_FROM=<adresse expéditrice vérifiée>`

Le secret d'export administrateur existant doit rester serveur uniquement.

## Activation

Ne définir/annoncer `auth_version: 2` dans `GET /api/v1/health` qu'après :
1. migration D1 réussie ;
2. routes auth/sync/admin déployées ;
3. CORS `Authorization` validé depuis GitHub Pages ;
4. fournisseur e-mail de reset fonctionnel ;
5. tests d'acceptation de `SITES_MINIMAL.md` réussis.

Une fois la v2 activée, la PWA bascule automatiquement sur les écrans de création de compte / connexion.

## Premier administrateur

1. Créer d'abord un compte utilisateur normal depuis la PWA.
2. Utiliser hors navigateur l'endpoint `POST /api/v1/admin/bootstrap` avec le secret serveur `ADMIN_BOOTSTRAP_TOKEN` et l'e-mail de ce compte.
3. Le bootstrap ne doit fonctionner que tant qu'aucun administrateur n'existe.
4. Ensuite l'administration navigateur utilise uniquement la session normale du compte avec `role=admin`.
