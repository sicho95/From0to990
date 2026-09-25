# Audio

From0to990 utilise une banque MP3 neuronale pré-générée comme source principale.

## Moteur original

- Moteur : Kokoro-82M.
- Licence du modèle/poids : Apache-2.0.
- Génération reproductible : `scripts/generate-audio.py`.
- Spécification : `public/audio/audio-spec.json`.
- Manifeste consommé par la PWA : `public/audio/audio-manifest.json`.
- Fichiers : `public/audio/generated/*.mp3`.

La génération s'effectue gratuitement dans GitHub Actions via `.github/workflows/audio.yml`.

### Stratégie de voix

- Pré-A1 à A2 : anglais britannique de référence, voix masculines et féminines réparties de façon déterministe.
- B1+ : introduction progressive de voix américaines.
- Une même phrase conserve la même voix d'une lecture à l'autre.
- Les accents australien et canadien ne sont pas simulés avec une fausse voix : ils restent en fallback / ressources ETS autorisées jusqu'à disponibilité d'une voix neuronale locale fidèle.

## Ordre de lecture dans la PWA

1. audio ETS autorisé distant lorsqu'une ressource officielle le prévoit ;
2. MP3 original Kokoro présent dans la banque ;
3. `SpeechSynthesis` de l'appareil uniquement comme fallback.

Les fichiers ETS ne sont jamais copiés dans ce dossier.
