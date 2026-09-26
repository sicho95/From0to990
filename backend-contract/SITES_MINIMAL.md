# @Sites backend — From0to990 API v2

The frontend is hosted on GitHub Pages. Do not create or host any frontend in @Sites.

Source of truth:
- `backend-contract/openapi.yaml`
- `backend-contract/schema.sql`
- `backend-contract/migrations/002_auth.sql`
- `backend-contract/AUTH_V2.md`

## Required role of @Sites

1. expose only `/api/v1/*`;
2. use D1;
3. keep CORS limited to `https://sicho95.github.io`;
4. implement auth/account/session/password-reset/admin exactly as documented;
5. derive sync `user_id` from the authenticated bearer session;
6. preserve idempotent event/cursor sync;
7. preserve complete portable admin export/import;
8. keep every secret server-only.

## Capability switch

Do not advertise auth until the migration, mail configuration and endpoints are ready.

Before activation:
`GET /api/v1/health` keeps `auth_version` absent or `<2`.

After activation:
`GET /api/v1/health` returns at least:

```json
{"status":"ok","database":"ok","schema_version":2,"auth_version":2}
```

The PWA detects this automatically. This prevents a half-deployed backend from locking existing users out.

## CORS v2

Allowed origin only:
`https://sicho95.github.io`

Allow methods:
`GET, POST, PATCH, DELETE, OPTIONS`

Allow request headers:
`Content-Type, Authorization`

Never treat CORS as authentication.

## Required server secrets/settings

Do not place values in GitHub or frontend code.

- `PASSWORD_PEPPER`
- `ADMIN_BOOTSTRAP_TOKEN`
- `ADMIN_EXPORT_TOKEN`
- `APP_PUBLIC_URL=https://sicho95.github.io/From0to990/`
- `PASSWORD_RESET_FROM`
- `RESEND_API_KEY` (or an equivalent transactional-mail adapter)

## Acceptance tests before setting auth_version=2

- register a user;
- reject duplicate normalized email and username;
- login by email and username;
- bad password returns generic 401;
- blocked user cannot login or sync;
- `/auth/me` works with a valid bearer token;
- logout revokes only that session;
- login on a second device and pull the first device's progression with cursor null;
- password forgot always returns identical 202;
- reset link changes password and revokes all sessions;
- admin list/search works only for role admin;
- block/unblock works and is audited;
- delete cascades pedagogical data and is audited;
- admin cannot block/delete itself or the last admin;
- export/import still requires only the server-side export token;
- cross-origin preflight from GitHub Pages accepts Authorization;
- a different browser Origin is refused;
- no password, pepper, session raw token or reset raw token appears in logs/export payloads.
