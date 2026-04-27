# EduAPI Monitor - Full Stack Firebase

> Tableau de bord de monitoring d'API en temps réel avec React, D3.js et Firebase

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://eduapi-monitor.web.app)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)

## Démo Live

**Application :** https://eduapi-monitor.web.app

---

## Aperçu

Application full-stack qui surveille et visualise les performances de l'API Wikipedia en temps réel. Chaque recherche génère des métriques de performance sauvegardées dans Firestore et visualisées instantanément via 4 graphiques D3.js.

---

## Fonctionnalités

- Recherche en temps réel sur Wikipedia
- 4 visualisations D3.js interactives
- Mesure précise des temps de réponse avec `performance.now()`
- Analyse du ratio taille/vitesse des articles Wikipedia
- Détection automatique des articles lents (monitoring)
- Sauvegarde persistante dans Firestore
- Historique des 12 dernières recherches
- Design responsive (mobile-first)
- Backend serverless avec Cloud Functions

---

## Architecture

```
Frontend (React + D3.js)
        ↓
Firebase Hosting (CDN Global)
        ↓
Cloud Functions (Backend Serverless)
        ↓
Firestore (Base de données NoSQL)
```

---

## Technologies

### Frontend
- **React 19** - Framework UI avec hooks
- **D3.js 7.9** - Visualisations de données
- **Tailwind CSS 4.1** - Styling moderne
- **Axios** - Client HTTP
- **Vite 7.1** - Build tool

### Backend
- **Firebase Cloud Functions** - Backend serverless
- **Firestore** - Base de données NoSQL
- **Node.js 22** - Runtime JavaScript

### Déploiement
- **Firebase Hosting** - CDN mondial
- **Firebase CLI** - Outils de déploiement

---

## Installation Locale

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Firebase

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/ImadAAmara1/EduAPI-Monitor-full-stack-application.git
cd EduAPI-Monitor-full-stack-application

# 2. Installer les dépendances frontend
npm install

# 3. Installer les dépendances backend
cd functions
npm install
cd ..

# 4. Configurer Firebase
firebase login
firebase use --add

# 5. Créer .env avec vos URLs Firebase
echo "VITE_FIREBASE_URL=https://us-central1-VOTRE-PROJET.cloudfunctions.net" > .env

# 6. Lancer en local
npm run dev
```

---

## API Endpoints

### Cloud Functions

**Base URL :** `https://us-central1-eduapi-monitor.cloudfunctions.net`

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/saveMetric` | POST | Sauvegarder une recherche |
| `/getMetrics` | GET | Récupérer l'historique |
| `/clearMetrics` | DELETE | Supprimer toutes les données |

---

## Structure du Projet

```
EduAPI-Monitor/
├── functions/                  # Backend (Cloud Functions)
│   └── index.js               # API endpoints (save, get, clear)
├── src/
│   ├── components/
│   │   ├── LineChart.jsx      # Évolution temporelle des temps de réponse
│   │   ├── BarChart.jsx       # Volume de recherches par catégorie
│   │   ├── DonutChart.jsx     # Répartition rapide / moyen / lent
│   │   ├── ScatterPlot.jsx    # Analyse taille vs vitesse des articles
│   │   ├── SearchPanel.jsx    # Interface de recherche
│   │   └── StatsCard.jsx      # Cartes de statistiques
│   ├── hooks/
│   │   └── useApiMonitor.js   # Hook central - toute la logique métier
│   ├── services/
│   │   ├── wikiApi.js         # Service Wikipedia avec mesure de performance
│   │   └── firebaseApi.js     # Service Firebase (save, get, clear)
│   ├── App.jsx
│   └── main.jsx
├── firebase.json              # Configuration Firebase
├── firestore.rules            # Règles de sécurité
└── package.json
```

---

## Base de Données

### Firestore Collection : `search_metrics`

```javascript
{
  query: "React",           // Terme recherché
  category: "Technology",   // Catégorie choisie
  responseTime: 245,        // Temps de réponse en ms
  resultsCount: 10,         // Nombre de résultats Wikipedia
  timestamp: Date           // Horodatage serveur
}
```

---

## Visualisations D3.js

### 1. LineChart - Évolution Temporelle
Affiche les temps de réponse au fil du temps avec axes dynamiques et tooltips interactifs.

### 2. DonutChart - Répartition des Performances
Visualise la distribution des performances avec des seuils adaptés à une API externe :
- Rapide : moins de 500ms
- Moyen : entre 500ms et 1000ms
- Lent : au-delà de 1000ms

### 3. BarChart - Volume par Catégorie
Compare le nombre de recherches par catégorie avec couleurs distinctes et légende interactive.

### 4. ScatterPlot - Analyse Taille vs Vitesse des Articles
Pour chaque recherche, l'app analyse les 10 résultats Wikipedia, calcule un ratio `responseTime / size` pour chaque article, et affiche les 3 articles avec le ratio le plus élevé — c'est-à-dire les articles les plus lents par rapport à leur taille.

Chaque point est coloré selon son niveau de performance :
- Rouge : article lent à charger
- Orange : chargement moyen
- Vert : chargement rapide

Un tableau de monitoring s'affiche automatiquement sous le graphique lorsque des articles critiques sont détectés.

---

## Logique de Monitoring

Le flux de données complet pour chaque recherche :

```
Utilisateur tape "React"
        ↓
performance.now() → appel Wikipedia → performance.now()
        ↓
responseTime = fin - début (ex: 245ms)
        ↓
Sauvegarde dans Firestore via Cloud Function
        ↓
Analyse des 10 articles : calcul ratio = responseTime / size
        ↓
Top 3 articles avec ratio le plus élevé → ScatterPlot
        ↓
Mise à jour en temps réel des 4 graphiques
```

---

## Déploiement

```bash
# Build le frontend
npm run build

# Déployer sur Firebase Hosting
firebase deploy --only hosting
```

---

## Compétences Démontrées

### Frontend
- React (Hooks, State Management, Custom Hooks)
- D3.js (Scales, Axes, Animations, Interactivity)
- Tailwind CSS (Utility-first, Responsive Design)
- JavaScript ES6+ (Async/Await, Promise.all, Array methods)

### Backend
- Firebase Cloud Functions (Serverless)
- Firestore (NoSQL, Requêtes, Batch operations)
- REST API Design (GET, POST, DELETE)
- CORS & Sécurité

### DevOps
- Firebase Hosting (CDN mondial)
- Déploiement continu avec Firebase CLI
- Variables d'environnement (Vite)
- Git & GitHub

---

## Métriques du Projet

- **Composants React :** 7
- **Cloud Functions :** 3
- **Graphiques D3.js :** 4
- **Performance :** moins de 2s de chargement
- **Uptime :** 99.9% (Firebase SLA)
- **Version :** 1.3.0

---

## Auteur

**Imad Amara**

- Live Demo: [eduapi-monitor.web.app](https://eduapi-monitor.web.app)
- GitHub: [@ImadAAmara1](https://github.com/ImadAAmara1)
- Email: imadamara14@gmail.com

---

Développé pour Capgemini Morocco
