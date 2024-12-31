# My Family Frontend

Interface utilisateur de l'application de gestion des profils familiaux.

## Fonctionnalités

- 👨‍👩‍👧‍👦 Gestion des profils familiaux
- 📸 Galerie photo familiale
- 👥 Gestion des membres de la famille
- 🔐 Authentification sécurisée
- 📱 Interface responsive

## Technologies utilisées

- React.js
- Material-UI pour l'interface utilisateur
- Axios pour les requêtes HTTP
- React Router pour la navigation
- Context API pour la gestion d'état
- Formik pour la gestion des formulaires
- Yup pour la validation des données

## Installation

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn

### Configuration

1. Cloner le dépôt :
```bash
git clone https://github.com/Eliezelg/myfamilyfrontend.git
cd myfamilyfrontend
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` à la racine du projet avec les variables suivantes :
```env
REACT_APP_API_URL=http://localhost:5000
```

## Démarrage

Pour démarrer l'application en mode développement :
```bash
npm start
```

L'application sera accessible à l'adresse : http://localhost:3000

## Tests

Pour lancer les tests :
```bash
npm test
```

## Build

Pour créer une version de production :
```bash
npm run build
```

Les fichiers de build seront générés dans le dossier `build`.

## Structure du projet

```
src/
├── components/      # Composants réutilisables
├── contexts/        # Contextes React (AuthContext, etc.)
├── pages/          # Pages/Routes de l'application
├── services/       # Services (API, authentification, etc.)
├── theme.js        # Configuration du thème Material-UI
└── App.js          # Point d'entrée de l'application
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT
