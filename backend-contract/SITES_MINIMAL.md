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

Do not advertise auth until the migrations and endpoints are ready.

Before activation:
`GET /api/v1/health` keeps `auth_version` absent or `<2`.

After activation:
`GET /api/v1/health` returns at least:

```json
{"status":"ok","database":"ok","schema_version":3,"auth_version":2}
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
- `INITIAL_ADMIN_EMAIL` (server-only configuration)
- `INITIAL_ADMIN_USERNAME=Sicho`

No transactional mail provider is used. Password-reset communication is initiated manually by the administrator through the browser's `mailto:` handler after generating a temporary password.

## Acceptance tests before setting auth_version=2

- register a user;
- bootstrap the configured initial admin identity after its normal registration;
- reject duplicate normalized email and username;
- login by email and username;
- bad password returns generic 401;
- blocked user cannot login or sync;
- `/auth/me` works with a valid bearer token;
- logout revokes only that session;
- unauthenticated `/api/v1/sync` returns 401 and never exposes legacy `owner` events;
- login on a second device and pull only that account's progression with cursor null;
- password forgot queues a manual admin request and always returns identical 202;
- admin-issued temporary password expires in 24 hours, is returned in plaintext only once to the authenticated admin, and revokes all sessions;
- temporary login creates a password-change-only session: no sync or normal app access before a permanent password is chosen;
- admin list/search works only for role admin;
- admin can grant or revoke the role through `PATCH /admin/users/{userId}`;
- block/unblock works and is audited;
- delete cascades pedagogical data and is audited;
- admin cannot block/delete itself or the last admin;
- export/import still requires only the server-side export token;
- cross-origin preflight from GitHub Pages accepts Authorization;
- a different browser Origin is refused;
- no permanent password, temporary plaintext password, pepper or raw session token appears in logs/export payloads.
