# Panorama des langages de script - Projet NodeJS

Création d'un jeu vidéo avec NodeJS :

Installation :

- Ouvrir une invite de commande et écrire npm install dans le dossier Jeu script.

- Suivre le tutoriel attentivement https://www.youtube.com/watch?v=HtWsjlCp8TU (et en respectant les noms indiqués) pour installer Mongodb community server avec compass : https://www.mongodb.com/try/download/community

- Une fois l'installation complétée, créer une database comme décrit dans le tutoriel. (L'importation d'une database déjà existante étant plus compliquée que de suivre ce tutoriel).

- Ouvrir une invite de commande et écrire node ./app.js dans le dossier Jeu script.

- Se connecter à http://localhost:3000


Nota Bene :

Les joueurs connectés sont affichés sous forme de tableau dans la console serveur chaque fois qu'un joueur se connecte ou se déconnecte.

L'interaction entre joueurs n'a pas été terminée, je préfère donc ne pas inclure un module incomplet dans le code.
 
Le chat marche tout de même avec possibilité d'envoyer des messages à tout le monde ou des messages privés.

La sauvegarde des messages avec chargement des anciens dans l'ordre s'effectue aussi (2 derniers messages envoyés pour tous et 5 derniers messages privés).