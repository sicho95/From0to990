# Format de packs From0to990

Chaque ressource pédagogique est indépendante du moteur de l'application.

## Provenance

`origin` :

- `original` : contenu entièrement créé pour From0to990.
- `official-external` : lien vers une ressource officielle externe.
- `authorized-hotlink` : ressource tierce appelée depuis l'URL d'origine sur la base d'une autorisation écrite.
- `licensed` : ressource tierce distribuable sous licence compatible.

Chaque ressource non originale doit renseigner `rightsRef`.

## Exemple ETS autorisé

```json
{
  "id": "ETS-SAMPLE-P3-001",
  "origin": "authorized-hotlink",
  "rightsRef": "ets-permission-2026-09-25",
  "part": 3,
  "audio": {
    "mode": "remote",
    "url": "https://...",
    "cachePolicy": "temporary-runtime"
  },
  "lifecycle": "active"
}
```

## Remplacement progressif

Un contenu ETS autorisé peut coexister avec un contenu original From0to990 de même compétence. Le moteur suit les statistiques agrégées par compétence et conserve séparément l'historique question par question.

Une ressource originale peut déclarer :

```json
{
  "origin": "original",
  "replaces": ["ETS-SAMPLE-P3-001"],
  "equivalence": {
    "part": 3,
    "skills": ["inference", "paraphrase"],
    "difficulty": 3
  }
}
```

Le remplacement ne transfère jamais artificiellement une bonne/mauvaise réponse d'un item vers un autre.

## Copyright et création originale

Une ressource originale ne doit pas être une simple reformulation phrase par phrase d'un item protégé. Elle peut reprendre le format général du test, le type de compétence, le type de piège, la difficulté ou un contexte métier générique, mais le script, la situation précise, les noms, chiffres, formulations, réponses et distracteurs doivent être indépendants.
