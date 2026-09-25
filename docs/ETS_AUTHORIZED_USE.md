# ETS — usage autorisé pour From0to990

## Statut

Autorisation écrite reçue de l'équipe ETS Permissions le 25 septembre 2026 pour un usage éducatif.

Le message original complet est conservé hors du dépôt public par le propriétaire du projet.

## Usages autorisés

Selon cette autorisation écrite, From0to990 peut :

- lire les fichiers audio depuis leur URL ETS d'origine, sans les copier, télécharger, modifier ni réhéberger ;
- rendre ces fichiers temporairement disponibles via le cache offline de l'application ;
- afficher les ressources correspondantes : textes, questions, choix, réponses et éléments associés.

## Restrictions

- Aucun logo ETS ne doit apparaître dans l'application.
- From0to990 ne doit jamais laisser penser qu'ETS est responsable du projet, l'édite, l'exploite ou l'approuve.
- Les fichiers audio ETS ne doivent pas être ajoutés au dépôt GitHub.
- Les fichiers audio ETS ne doivent pas être modifiés.
- Toute URL ETS cassée ou retirée doit être désactivée côté application plutôt que remplacée par une copie locale.

## Implémentation prévue

Les ressources ETS utilisent la provenance `authorized-hotlink`.

Les MP3 ETS ne sont jamais précachés pendant l'installation de la PWA. Ils peuvent être ajoutés à un cache runtime après première lecture, avec métadonnées de date et politique d'éviction automatique.

Les ressources originales From0to990 utilisent la provenance `original` et peuvent, elles, être distribuées dans GitHub et précachées durablement.

## Mention produit

L'interface doit utiliser une mention claire du type :

> From0to990 est un outil indépendant de préparation à l'anglais et au TOEIC. Il n'est ni édité ni exploité par ETS.

TOEIC peut être utilisé pour désigner l'examen préparé ; le logo ETS ne doit pas être utilisé.
