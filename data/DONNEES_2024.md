# Données départementales 2024

- **`VIF.csv`** : fichier lu par la carte (`carte.html`, `geography-sentencing.html`) et par `modeles.html`. Il contient désormais les indicateurs **2024**, calculés à partir de la version définitive des fichiers SSER (extraction Cassiopée P2894, août 2026 : `CONDA_2024`, `DEC_TC_2024`). Même structure que le fichier précédent : 100 lignes (96 départements métropolitains + 4 DOM), 107 colonnes, séparateur `;`, décimale `,`, UTF-8 avec BOM.
- **`VIF_2023.csv`** : fichier précédent (année 2023), conservé pour archive.
- **`villes_2024.csv`** : Paris, Lyon et Marseille (ressort du tribunal judiciaire de la ville), même structure. Ce fichier n'est pas encore lu par le site.

## Changements de méthode par rapport à 2023

- **`Taux poursuivis / 100k (…)`** : ces colonnes contiennent désormais le nombre de **prévenus jugés** par les tribunaux correctionnels (NB_DEC) pour 100 000 habitants. Elles ne contiennent plus les affaires arrivées au parquet, qui ne figurent pas dans les fichiers 2024. Les noms de colonnes sont inchangés ; les libellés et définitions ont été mis à jour dans les pages. Les valeurs ne sont pas comparables à celles de 2023.
- **`Taux emprisonnement ferme global`** et **`Durée moy. emprisonnement ferme`** : ces deux indicateurs sont calculés sur l'ensemble des condamnations (8 catégories + autres contentieux). Les 368 condamnations comptées à la fois en VIF et en violences sexuelles ne le sont qu'une fois.
- **Durées** : le quantum n'est pas diffusé pour les cases ne comptant qu'une peine ferme (secret statistique), soit environ 9 % des peines fermes, exclues des durées moyennes.
- **Coefficients de régression** (`RECIDIVISM_REGRESSION`, `DURATION_RECIDIVISM_REGRESSION`) : ils sont réestimés sur 2024, sur les 100 lignes du fichier.

## Variables de contexte ajoutées (octobre 2026)

- **`Densité carcérale`** : densité des maisons d'arrêt et quartiers maison d'arrêt situés dans le département. C'est le nombre de détenus rapporté aux places opérationnelles, en %, en moyenne sur les 12 situations mensuelles de 2024.
  - Source : ministère de la Justice, DAP, *Statistique mensuelle des établissements et des personnes écrouées*, publiée sur data.gouv.fr.
  - Les établissements sont rattachés au département de leur commune d'après l'Annuaire de l'administration (service-public.fr).
  - La valeur est vide pour les départements sans maison d'arrêt : Eure-et-Loir, Gers, Lot, Orne.
- **`Indice de Gini`** : indice de Gini des niveaux de vie (revenu disponible par unité de consommation) en 2021.
  - Source : INSEE, Filosofi 2021, dernier millésime disponible.
  - La valeur est vide pour la Guadeloupe et la Guyane, non diffusées.

Les deux colonnes ne contiennent que des valeurs départementales.
