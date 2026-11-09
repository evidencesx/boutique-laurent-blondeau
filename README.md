# Laurent Blondeau, écrivain : la bibliothèque

Site vitrine des livres de Laurent Blondeau : thrillers, polars, fiction historique, poésies et développement personnel.

En ligne (préproduction, non indexée) : [laurent-blondeau.netlify.app](https://laurent-blondeau.netlify.app)

## Le principe

Une bibliothèque dans la brume, un casier par thème. Au survol, un livre sort de son rayon ; au clic, il vient au centre, grandit et s'ouvre sur son résumé et son prix.

## Fichiers

| Fichier | Contenu |
| ------- | ------- |
| `site/index.html` | La bibliothèque et le texte de chaque livre |
| `site/a-propos.html` | L'auteur, ses éditeurs, les contacts |
| `site/css/style.css` | Toute la mise en forme |
| `site/js/brume.js` | Brume du fond, dos de livres décoratifs, faisceau de lumière |
| `site/js/lecteur.js` | Le livre qui vient au centre et s'ouvre |
| `site/img/`, `site/polices/` | Couvertures, polices hébergées avec le site (licence OFL) |

HTML, CSS et JavaScript simples, sans framework ni étape de construction. Aucun cookie, aucune mesure d'audience, aucune police externe. Pour modifier un livre, on édite sa fiche dans `index.html` : le livre ouvert lit son texte dans la page.

Lancer en local : double-cliquer sur `site/index.html`.

## Déploiement

Netlify publie le dossier `site/` à chaque push sur `main` (voir `netlify.toml`). Avant l'ouverture au public : retirer la balise `robots` des deux pages et l'en-tête `X-Robots-Tag` de `netlify.toml`.

© Laurent Blondeau pour les textes, les couvertures et le portrait.
