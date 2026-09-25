# ETS — usage autorisé pour From0to990

## Statut

Autorisation écrite reçue de l'équipe ETS Permissions le 25 septembre 2026 pour un usage éducatif, puis précisée explicitement concernant le fonctionnement offline et la constitution progressive d'une banque audio originale.

Le message original complet est conservé hors du dépôt public par le propriétaire du projet.

## Usages autorisés

Selon les réponses écrites reçues de l'équipe ETS Permissions, From0to990 peut :

- lire les fichiers audio depuis leur URL ETS d'origine ;
- rendre ces fichiers disponibles dans le cache offline de la PWA afin qu'un étudiant puisse continuer à travailler sans connexion, y compris pendant plusieurs jours ou semaines ;
- afficher les ressources correspondantes : textes, questions, choix, réponses et éléments associés ;
- précharger/cache plusieurs audios nécessaires à un exercice ou à une session offline ;
- télécharger temporairement des MP3 ETS dans le cadre du travail de développement lorsqu'ils servent à construire progressivement la propre banque audio de From0to990.

## Restrictions et règles internes

- Aucun logo ETS ne doit apparaître dans l'application.
- From0to990 ne doit jamais laisser penser qu'ETS est responsable du projet, l'édite, l'exploite ou l'approuve.
- Les MP3 ETS ne doivent pas être ajoutés au dépôt GitHub public.
- Les MP3 ETS ne doivent pas être réhébergés comme fichiers permanents de From0to990.
- Les MP3 ETS destinés au travail de développement restent temporaires et hors dépôt.
- Les ressources ETS ne doivent pas être modifiées puis redistribuées comme si elles étaient originales.
- Toute URL ETS cassée ou retirée doit être désactivée côté application plutôt que remplacée par une copie permanente non autorisée.

## Implémentation prévue dans la PWA

Les ressources ETS utilisent la provenance `authorized-hotlink`.

Politique cache autorisée :

```text
ETS original URL
   ↓
fetch par la PWA
   ↓
Cache Storage / Service Worker
   ↓
utilisable offline pendant une période prolongée
   ↓
rafraîchissement ou éviction ultérieure
```

Les ressources ETS ne font pas partie du bundle GitHub lui-même. La PWA peut cependant préparer une session offline en mettant en cache les audios nécessaires avant la déconnexion.

## Workflow de création de notre propre banque

ETS autorise également le téléchargement temporaire de MP3 pour permettre le développement progressif de notre propre banque.

Workflow interne :

```text
ressource ETS temporaire de référence
   ↓
analyse pédagogique du format / compétence / difficulté
   ↓
création indépendante d'un nouveau script From0to990
   ↓
génération ou enregistrement d'un nouvel audio original
   ↓
validation
   ↓
suppression de la copie temporaire ETS de travail
   ↓
publication du MP3 original From0to990 dans GitHub
```

Les nouveaux scripts doivent rester indépendants : ne pas paraphraser ligne par ligne un dialogue ETS.

## Mention produit

L'interface doit utiliser une mention claire du type :

> From0to990 est un outil indépendant de préparation à l'anglais et au TOEIC. Il n'est ni édité ni exploité par ETS.

TOEIC peut être utilisé pour désigner l'examen préparé ; le logo ETS ne doit pas être utilisé.
