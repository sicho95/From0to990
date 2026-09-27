# Authentication / accounts v2

This document is part of the backend source of truth for the @Sites implementation.

## Goal

Replace the logical single `owner` user with real accounts while preserving the PWA's local-first behavior.

A user can:

- create an account with e-mail, unique username/pseudonym and password;
- sign in with either e-mail or username;
- use several devices with the same account;
- synchronize profile, settings, attempts, lessons, skills and errors;
- request a manually administered password reset;
- remain usable offline after a successful sign-in on the device.

An administrator can:

- list/search accounts;
- block/unblock an account;
- permanently delete an account and its pedagogical data;
- keep an immutable administrative audit trail.

## Non-negotiable security rules

- Never store plaintext passwords.
- Preferred password hash: Argon2id if the @Sites runtime supplies a reviewed native implementation.
- Portable Workers fallback: PBKDF2-HMAC-SHA-256, 600,000 iterations, unique random 16+ byte salt per account.
- Add a server-only pepper before PBKDF2 using HMAC-SHA-256. The pepper is never stored in D1.
- Password length: 12–128 Unicode characters. Do not impose arbitrary composition rules.
- Session tokens and administrator-issued temporary passwords are cryptographically random.
- Store only SHA-256 hashes of session tokens and salted password hashes in D1; return raw values only once.
- Browser admin uses the authenticated user role, never `ADMIN_EXPORT_TOKEN`.
- `ADMIN_EXPORT_TOKEN` remains server-only for database export/import only.
- Authentication and reset responses must use `Cache-Control: no-store`.
- Rate-limit registration and login; suppress repeated pending reset requests.
- Login and forgot-password must not reveal whether an e-mail exists.
- Blocked users cannot login or sync. Blocking immediately revokes all sessions.
- Password reset revokes all existing sessions.
- Admin cannot block/delete itself and cannot delete the last administrator.

## Normalization

- `email_norm = trim(email).toLowerCase()`.
- `username_norm = trim(username).toLowerCase()`.
- Preserve the user's original e-mail/username casing for display.
- Username: 3–32 characters. Allow letters, numbers, `.`, `_`, `-`; reject leading/trailing whitespace.
- E-mail and username are unique through their normalized columns.

## Password derivation fallback

Workers Web Crypto supports HMAC and PBKDF2.

1. `peppered = HMAC-SHA-256(PASSWORD_PEPPER, UTF8(password))`
2. `derived = PBKDF2-HMAC-SHA-256(peppered, salt, 600000, 32 bytes)`
3. Store base64url `derived`, base64url `salt`, `password_algo='pbkdf2-sha256'`, and the parameter JSON.
4. Compare derived values in constant time.

`PASSWORD_PEPPER` is a server secret and must not appear in GitHub, the PWA, D1 exports, logs, or error messages.

## Sessions

- Multiple simultaneous device sessions are allowed.
- A successful login/register returns one opaque `sessionToken`.
- Client sends `Authorization: Bearer <sessionToken>`.
- Session lifetime: 30 days. Update `last_seen_at` on authenticated activity.
- Store only `SHA-256(sessionToken)` in `auth_sessions`.
- Logout revokes only the current session.
- Password reset/block revokes all sessions for the user.
- `/api/v1/sync` derives `user_id` exclusively from the valid bearer session. Never accept a user id from the request body.

## Multi-device synchronization

On a new device:
1. sign in;
2. local database starts clean for that account;
3. `/sync` with `cursor=null` returns that account's complete event history;
4. the PWA reconstructs profile/progress locally.

On activation of account v2, legacy/local `owner` progress is deliberately discarded. Registration starts a clean account dataset.

Never mix local IndexedDB data from two authenticated users. The PWA clears pedagogical stores before registration/login hydration and after a safe logout. There is no legacy merge path.

## Manually administered password reset

Required server settings/secrets:

- `PASSWORD_PEPPER`
- `ADMIN_BOOTSTRAP_TOKEN`
- existing `ADMIN_EXPORT_TOKEN`

`POST /auth/password/forgot` always returns HTTP 202 with the same body.

For an existing active account, create one pending `reset_requests` row. Unknown e-mails receive the same 202 response and create no row. No server-side mail provider is used.

The administrator sees pending requests, issues a cryptographically random temporary password, and receives its plaintext only in that response. D1 stores only the salted PBKDF2 hash. The temporary password expires after 24 hours, revokes all old sessions, and forces `POST /auth/password/change` before any sync or normal app access. The administrator may copy it or open a `mailto:` composer in the browser. A completed change clears the temporary flags and keeps the current session, revoking other sessions. Personal passwords have no expiration.

## First administrator

Do not hardcode an admin password, e-mail or bootstrap token in the public PWA/repository.

Server-only deployment settings:
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_USERNAME`
- `ADMIN_BOOTSTRAP_TOKEN`

The intended initial administrator username is `Sicho`; the administrator e-mail is supplied privately at deployment time and must remain server-side.

First-admin behavior:
1. Configure `INITIAL_ADMIN_EMAIL` privately on the server and `INITIAL_ADMIN_USERNAME=Sicho`.
2. While zero administrators exist, reserve both normalized values so another account cannot claim either identity.
3. Register the matching identity as a normal account.
4. Invoke `POST /api/v1/admin/bootstrap` with the server-only bearer secret to promote that exact account and audit the action.
5. Once one administrator exists, bootstrap refuses further promotion.

Browser administration then uses the normal authenticated session and requires `role=admin`.

## Legacy logical `owner`

Legacy `owner` data does **not** need to be preserved for account v2 activation.

Rules:
- never use `owner` as an authentication fallback;
- unauthenticated `POST /api/v1/sync` must return HTTP 401;
- authenticated sync derives the account exclusively from the bearer session;
- old legacy rows may remain temporarily in D1, but they are unreachable through the v2 API;
- the operator may archive/delete them later.

This deliberately prioritizes clean account isolation over migration of previous test progress.

## CORS

Allowed origin remains only:

`https://sicho95.github.io`

For v2 preflight allow:

- methods: `GET, POST, PATCH, DELETE, OPTIONS`
- headers: `Content-Type, Authorization`

Never use CORS as authentication.

## Rate limiting baseline

Server-enforced baseline:
- register: 5 attempts / IP / 15 min;
- login: 10 attempts / normalized identifier + IP / 15 min;
- forgot: 5 requests / normalized e-mail hash + IP / hour;
- reset: 10 attempts / IP / hour.

Return 429 with a generic message and `Retry-After` where appropriate.
# Administration déléguée

`PATCH /api/v1/admin/users/{userId}` accepte `role: "admin" | "user"` et/ou
`status: "active" | "blocked"` avec la session d'un administrateur actif.
Le backend recharge le rôle de l'acteur dans D1 à chaque requête. Il refuse
toute opération qui retirerait le dernier administrateur actif. Un changement
de rôle conserve la progression et les sessions existantes ; le rôle est
rechargé par `/auth/me` et vérifié sur chaque action sensible. Chaque mutation
de rôle est inscrite dans `admin_audit_log` avec les deux rôles et les IDs.
