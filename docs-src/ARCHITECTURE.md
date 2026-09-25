# Architecture From0to990

```text
GitHub repository (source maître)
   │
   ├─ GitHub Actions → GitHub Pages / PWA
   │                     │
   │                     ├─ IndexedDB locale (offline-first)
   │                     └─ SyncClient HTTP
   │                             │
   │                             ▼
   │                       @Sites API (optionnel)
   │                             │
   │                             ▼
   │                            D1
   │
   └─ contenu + éventuels MP3 versionnés
```
