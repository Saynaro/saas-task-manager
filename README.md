<h1 align="center">
  <br>
  🚀 SaaS Task Manager
  <br>
</h1>

<p align="center">
  <strong>Une plateforme de gestion de tâches collaborative, moderne et sécurisée</strong>
  <br>
  <sub>Conçue pour les équipes qui veulent aller plus vite, ensemble.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Google-OAuth2-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth"/>
  <img src="https://img.shields.io/badge/Cloudinary-Upload-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary"/>
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
</p>

---

## 📋 Table des matières

- [🌐 Aperçu](#-aperçu)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#%EF%B8%8F-architecture)
- [🛠️ Stack Technique](#%EF%B8%8F-stack-technique)
- [📂 Structure du projet](#-structure-du-projet)
- [⚙️ Installation & Démarrage](#%EF%B8%8F-installation--démarrage)
- [🔐 Variables d'environnement](#-variables-denvironnement)
- [📡 API Routes](#-api-routes)
- [🗄️ Modèle de données](#%EF%B8%8F-modèle-de-données)
- [🔒 Sécurité](#-sécurité)

---

## 🌐 Aperçu

**SaaS Task Manager** est une application web full-stack de type SaaS (Software as a Service) permettant à des équipes de gérer leurs projets et tâches en temps réel. Que vous soyez solo ou en grande équipe, l'application s'adapte à vos besoins grâce à un système de rôles granulaire, un tableau de bord analytique, et une communication instantanée via chat intégré.

### 🎯 Landing Page

L'application dispose d'une **landing page moderne et animée** servant de vitrine publique, présentant :

- 🎨 Design glassmorphisme avec animations dynamiques
- 📣 Section héro percutante avec appel à l'action
- 🧩 Présentation des fonctionnalités clés
- 📱 Entièrement responsive (mobile, tablette, desktop)
- ⚡ Transitions fluides et micro-animations
- 🔗 Liens vers l'inscription / connexion

---

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité

| Fonctionnalité | Description |
|---|---|
| **Inscription / Connexion** | Formulaires sécurisés avec validation côté serveur |
| **JWT Access & Refresh Tokens** | Access token à courte durée + Refresh token persistent |
| **Cookies HttpOnly** | Tokens stockés en cookies `httpOnly` (protection XSS) |
| **Vérification par email** | Email de confirmation envoyé à l'inscription |
| **Mot de passe oublié** | Flux complet de réinitialisation par email sécurisé |
| **OAuth Google** | Connexion en un clic via Google (Passport.js) |
| **Hachage des mots de passe** | Bcrypt avec salage automatique |

---

### 👥 Système de rôles (RBAC)

L'application implémente un contrôle d'accès basé sur les rôles avec **3 niveaux de permission** distincts :

| Rôle | Périmètre | Permissions |
|---|---|---|
| 👑 **OWNER** | Workspace | Crée et gère les projets · Crée, modifie et supprime les tâches · Invite des utilisateurs dans le workspace |
| 👤 **MEMBER** | Workspace | Consulte les projets · Marque les tâches comme terminées · Participe au chat en temps réel |
| 🛡️ **ADMIN** | Plateforme | Accès aux statistiques globales (workspaces, utilisateurs) · Peut supprimer des workspaces |

```
👑 OWNER
├── ✅ Créer / modifier / supprimer des projets
├── ✅ Créer / modifier / supprimer des tâches
├── ✅ Inviter des utilisateurs dans le workspace
└── ✅ Gérer les membres

👤 MEMBER
├── 👁️  Consulter les projets et les tâches
├── ✅ Marquer une tâche comme terminée (DONE)
└── 💬 Écrire dans le chat du workspace

🛡️ ADMIN  (rôle global plateforme)
├── 📊 Voir les statistiques globales
│     └── Nombre de workspaces · Nombre d'utilisateurs
└── 🗑️  Supprimer des workspaces
```

---

### 🏠 Dashboard (Tableau de bord)

Un tableau de bord analytique complet offrant :

- 📊 **Statistiques en temps réel** : nombre de tâches, projets actifs, membres
- 📈 **Graphiques interactifs** (Recharts) : répartition par statut, priorité, évolution
- 🗓️ **Tâches récentes** : aperçu des dernières activités
- 🔔 **Activités du workspace** : journal des actions de l'équipe
- ⚡ **Mise à jour temps réel** via Socket.IO

---

### 📋 Gestion des tâches

- ✅ Créer, modifier, supprimer des tâches
- 🏷️ **Statuts** : `TODO` · `IN_PROGRESS` · `DONE`
- 🔥 **Priorités** : `LOW` · `MEDIUM` · `HIGH`
- 📅 Date d'échéance configurable
- 👤 Assignation à un membre de l'équipe
- 💬 **Commentaires** sur chaque tâche
- 📜 **Historique d'activité** (qui a fait quoi, quand)
- 🔄 Réorganisation par glisser-déposer (drag & drop)

---

### 📁 Gestion des projets

- 🆕 Créer des projets dans un workspace
- 🔒 Projets **privés ou publics** (au sein du workspace)
- 👥 Gestion des membres du projet
- 📊 Statut et priorité au niveau projet
- 📅 Date limite de projet
- 🗑️ Suppression en cascade (projet → tâches → commentaires)

---

### 🏢 Workspaces

- 🌐 Chaque utilisateur peut créer et rejoindre plusieurs workspaces
- 🔗 URL unique par workspace (slug)
- 🖼️ Avatar du workspace uploadable
- 📨 Système d'**invitation par email**
- 📬 Statuts d'invitation : `PENDING` · `ACCEPTED` · `DECLINED`

---

### 💬 Chat & Activités en temps réel

Grâce à **Socket.IO**, l'application offre :

- 💬 **Chat en temps réel** entre membres du workspace
- 🔴 Indicateurs de présence en ligne
- 📢 **Notifications d'activité** instantanées (tâche créée, assignée, complétée…)
- 🔄 Synchronisation automatique des données entre tous les clients connectés

---

### 📸 Upload de photos

- 🖼️ Upload d'**avatar utilisateur** et de **logo workspace**
- ☁️ Stockage sur **Cloudinary** (CDN global)
- ⚙️ Traitement via **Multer** + `multer-storage-cloudinary`
- 📦 Formats acceptés : JPG, PNG, WEBP

---

### 📧 Système d'emails (Nodemailer)

- ✅ **Email de vérification** de compte
- 🔑 **Email de réinitialisation** de mot de passe
- 📨 **Invitation** de membres par email
- 🎨 Templates HTML soignés

---

### 📊 Pages de l'application

| Page | Description |
|---|---|
| `/` | Landing page publique |
| `/login` | Connexion utilisateur |
| `/register` | Inscription utilisateur |
| `/dashboard` | Vue d'ensemble avec statistiques |
| `/tasks` | Gestion complète des tâches |
| `/projects` | Liste et détail des projets |
| `/team` | Gestion des membres du workspace |
| `/activity` | Journal d'activité global |
| `/settings` | Paramètres utilisateur & workspace |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────-─┐
│                    CLIENT (React + Vite)                  │
│  Landing Page · Dashboard · Tasks · Projects · Chat       │
└───────────────────────┬───────────────────────────────────┘
                        │  HTTP REST + WebSocket (Socket.IO)
┌───────────────────────▼───────────────────────────────────┐
│               BACKEND (Express.js + Node.js)              │
│  Auth · Workspace · Project · Task · Email · Admin        │
│  Middlewares: JWT Auth · Rate Limiter · Multer            │
│  Passport.js (Google OAuth2)                              │
└──────┬───────────────────────────────────┬────────────────┘
       │                                   │
┌──────▼──────┐                   ┌────────▼────────┐
│ PostgreSQL  │                   │      Redis      │
│   (Prisma)  │                   │ (Rate Limiting) │
└─────────────┘                   └─────────────────┘
       │
┌──────▼──────┐
│  Cloudinary │
│   (Médias)  │
└─────────────┘

Tout orchestré via Docker Compose 🐳
```

---

## 🛠️ Stack Technique

### Frontend

| Technologie | Version | Usage |
|---|---|---|
| **React** | 19 | Framework UI principal |
| **Vite** | 8 | Bundler & dev server ultra-rapide |
| **React Router** | 7 | Routage côté client |
| **TailwindCSS** | 4 | Styling utilitaire |
| **shadcn/ui + Radix UI** | — | Composants accessibles et stylisés |
| **Socket.IO Client** | 4 | Temps réel côté client |
| **Recharts** | 3 | Graphiques et visualisations |
| **Lucide React** | — | Icônes modernes |
| **React Hot Toast** | 2 | Notifications / toasts |
| **OGL** | 1 | Animations WebGL (landing page) |
| **Geist Font** | — | Typographie moderne |

### Backend

| Technologie | Version | Usage |
|---|---|---|
| **Node.js + Express** | 5 | Serveur HTTP & API REST |
| **Prisma** | 6 | ORM TypeSafe pour PostgreSQL |
| **PostgreSQL** | 16 | Base de données relationnelle |
| **Redis** | 7 | Cache & Rate Limiting |
| **Socket.IO** | 4 | Communication temps réel |
| **JSON Web Tokens** | — | Authentification (access + refresh) |
| **Passport.js** | — | OAuth2 (Google) |
| **Bcrypt** | 6 | Hachage sécurisé des mots de passe |
| **Multer + Cloudinary** | — | Upload et stockage de fichiers |
| **Nodemailer** | 8 | Envoi d'emails transactionnels |
| **rate-limiter-flexible** | 11 | Protection contre les abus |
| **Cookie-parser** | — | Gestion des cookies httpOnly |

### DevOps & Outils

| Technologie | Usage |
|---|---|
| **Docker & Docker Compose** | Conteneurisation complète |
| **Nodemon** | Hot reload en développement |
| **Prisma Studio** | Interface visuelle pour la BDD |
| **ESLint** | Linting et qualité du code |

---

## 📂 Structure du projet

```
saas-task-manager/
├── 🐳 docker-compose.yml          # Orchestration des services
├── 📄 README.md
│
├── 📦 client/                     # Application React (Vite)
│   ├── Dockerfile
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                # Routage principal
│       ├── main.jsx
│       ├── index.css
│       ├── landingPage/           # 🌐 Page d'accueil publique
│       ├── authPages/             # 🔐 Login / Register
│       ├── homePage/              # 🏠 Dashboard
│       ├── tasksPage/             # ✅ Gestion des tâches
│       ├── teamPage/              # 👥 Gestion d'équipe
│       ├── activityPage/          # 📜 Journal d'activité
│       ├── settingsPage/          # ⚙️  Paramètres
│       ├── components/            # 🧩 Composants réutilisables
│       ├── lib/                   # 🛠️  Utilitaires (axios, socket…)
│       └── utils/                 # 🔧 Helpers divers
│
└── 🖥️  server/                    # Backend Node.js / Express
    ├── Dockerfile
    ├── package.json
    ├── prisma/
    │   ├── schema.prisma          # 🗄️  Schéma de base de données
    │   ├── seed.js                # 🌱 Données de démarrage
    │   └── migrations/            # 📦 Migrations BDD
    └── src/
        ├── server.js              # 🚀 Point d'entrée principal
        ├── app.js                 # ⚙️  Configuration Express
        ├── controllers/
        │   ├── authController.js      # Auth, OAuth, tokens
        │   ├── workspaceController.js # Workspaces CRUD
        │   ├── projectController.js   # Projets CRUD
        │   ├── emailController.js     # Emails transactionnels
        │   ├── invitationController.js# Invitations membres
        │   ├── commentController.js   # Commentaires tâches
        │   └── adminController.js     # Actions admin
        ├── routes/
        │   ├── authRoutes.js
        │   ├── workspaceRoutes.js
        │   ├── projectRoutes.js
        │   ├── emailRoutes.js
        │   ├── invitationRoutes.js
        │   ├── commentRoutes.js
        │   └── adminRoutes.js
        ├── middlewares/
        │   ├── authMiddleware.js      # Vérification JWT
        │   └── rateLimiter.js         # Protection Redis
        ├── config/                    # Configuration (DB, Redis, Cloudinary…)
        └── utils/                     # Helpers (mailer, tokens…)
```

---

## ⚙️ Installation & Démarrage

### Prérequis

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) installés
- [Node.js](https://nodejs.org/) v18+ (pour le développement local sans Docker)
- Un compte [Cloudinary](https://cloudinary.com/) (upload de médias)
- Un compte [Google Cloud](https://console.cloud.google.com/) (OAuth2)
- Un serveur SMTP ou compte [Gmail](https://mail.google.com/) (Nodemailer)

---

### 🐳 Démarrage avec Docker (recommandé)

```bash
# 1. Cloner le dépôt
git clone https://github.com/Saynaro/saas-task-manager.git
cd saas-task-manager

# 2. Configurer les variables d'environnement
cp server/.env.example server/.env
# → Remplissez les valeurs dans server/.env

# 3. Lancer tous les services
docker-compose up --build

# L'application sera disponible sur :
# 🌐 Frontend  → http://localhost:5174
# 🖥️  Backend   → http://localhost:5001
# 🗄️  Prisma Studio → http://localhost:5555
# 🐘 PostgreSQL → localhost:5433
# 🔴 Redis      → localhost:6379
```

---

### 💻 Démarrage en développement local

```bash
# ── Backend ──────────────────────────────
cd server
npm install

# Appliquer les migrations Prisma
npx prisma migrate dev

# (Optionnel) Alimenter la base de données
npx prisma db seed

# Démarrer le serveur
npm run dev

# ── Frontend ─────────────────────────────
cd ../client
npm install
npm run dev
```

---

## 🔐 Variables d'environnement

Créez un fichier `server/.env` avec les variables suivantes :

```env
# ── Base de données ───────────────────────
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5433/task_manager"
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=task_manager

# ── JWT ──────────────────────────────────
JWT_ACCESS_SECRET=super_secret_access_key
JWT_REFRESH_SECRET=super_secret_refresh_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── Redis ────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Cloudinary ───────────────────────────
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret

# ── Google OAuth2 ────────────────────────
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# ── Nodemailer ───────────────────────────
EMAIL_USER=email@gmail.com
EMAIL_PASS=app_password

# ── Application ──────────────────────────
CLIENT_URL=http://localhost:5174
PORT=5000
NODE_ENV=development
```

---

## 📡 API Routes

### 🔐 Authentification — `/api/auth`

| Méthode | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | Créer un compte | ❌ |
| `POST` | `/login` | Se connecter | ❌ |
| `POST` | `/logout` | Se déconnecter | ✅ |
| `POST` | `/refresh-token` | Renouveler l'access token | ❌ |
| `GET` | `/me` | Profil de l'utilisateur connecté | ✅ |
| `GET` | `/google` | Redirection OAuth Google | ❌ |
| `GET` | `/google/callback` | Callback OAuth Google | ❌ |

### 🏢 Workspaces — `/api/workspace`

| Méthode | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/` | Créer un workspace | ✅ |
| `GET` | `/` | Lister mes workspaces | ✅ |
| `GET` | `/:workspaceId` | Détail d'un workspace | ✅ |
| `PUT` | `/:workspaceId` | Modifier un workspace | ✅ OWNER/ADMIN |
| `DELETE` | `/:workspaceId` | Supprimer un workspace | ✅ OWNER/ADMIN |

### 📁 Projets — `/api/project`

| Méthode | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/` | Créer un projet | ✅ |
| `GET` | `/:workspaceId` | Projets d'un workspace | ✅ |
| `PUT` | `/:projectId` | Modifier un projet | ✅ |
| `DELETE` | `/:projectId` | Supprimer un projet | ✅ |

### ✅ Tâches — intégrées aux projets

| Méthode | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/task` | Créer une tâche | ✅ |
| `GET` | `/task/:projectId` | Tâches d'un projet | ✅ |
| `PUT` | `/task/:taskId` | Modifier une tâche | ✅ |
| `DELETE` | `/task/:taskId` | Supprimer une tâche | ✅ |

### 📨 Invitations — `/api/invitation`

| Méthode | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/invite` | Inviter un membre | ✅ OWNER/ADMIN |
| `POST` | `/accept/:id` | Accepter une invitation | ✅ |
| `POST` | `/decline/:id` | Refuser une invitation | ✅ |

### 📧 Emails — `/api/email`

| Méthode | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/verify/:token` | Vérifier l'adresse email | ❌ |
| `POST` | `/forgot-password` | Demande de réinitialisation | ❌ |
| `POST` | `/reset-password` | Réinitialiser le mot de passe | ❌ |

### 🛡️ Admin — `/api/admin`

| Méthode | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/users` | Lister tous les utilisateurs | ✅ ADMIN/OWNER |
| `DELETE` | `/user/:id` | Supprimer un utilisateur | ✅ OWNER |

---

## 🗄️ Modèle de données

```prisma
// Rôles disponibles
enum Role { OWNER · ADMIN · MEMBER }

// Statuts des tâches
enum TaskStatus { TODO · IN_PROGRESS · DONE }

// Priorités
enum Priority { LOW · MEDIUM · HIGH }

// Statuts d'invitation
enum InvitationStatus { PENDING · ACCEPTED · DECLINED }
```

**Relations principales :**

| Entité | Se lie à | Type de relation |
|---|---|---|
| `User` ↔ `Workspace` | via `WorkspaceMember` | Plusieurs utilisateurs dans plusieurs workspaces (many-to-many) |
| `User` ↔ `Project` | via `ProjectMember` | Plusieurs utilisateurs dans plusieurs projets (many-to-many) |
| `Workspace` → `Project` | `workspaceId` | Un workspace contient plusieurs projets (one-to-many) |
| `Project` → `Task` | `projectId` | Un projet contient plusieurs tâches (one-to-many) |
| `Task` → `Comment` | `taskId` | Une tâche peut avoir plusieurs commentaires (one-to-many) |
| `Task` → `ActivityLog` | `taskId` | Chaque action sur une tâche génère un log (one-to-many) |
| `Workspace` → `Invitation` | `workspaceId` | Un workspace peut avoir plusieurs invitations en attente (one-to-many) |
| `User` → `RefreshToken` | `userId` | Un utilisateur peut avoir plusieurs sessions actives (one-to-many) |

---

## 🔒 Sécurité

### 🛡️ Mesures de sécurité implémentées

| Mesure | Technologie | Description |
|---|---|---|
| **Tokens HttpOnly** | Cookie-parser | Les JWT ne sont jamais accessibles via JS (anti-XSS) |
| **Rate Limiting granulaire** | Redis + rate-limiter-flexible | Limites différentes par route (anti-bruteforce) |
| **Hachage des mots de passe** | Bcrypt | Hachage avec sel — jamais en clair |
| **Validation des rôles** | Middleware custom | RBAC vérifié sur chaque route sensible |
| **Vérification email** | Nodemailer + token UUID | Activation obligatoire avant connexion |
| **CORS** | Express cors | Origines autorisées strictement configurées |
| **Variables d'environnement** | dotenv | Aucune clé sensible dans le code source |
| **Refresh Token en BDD** | Prisma (RefreshToken) | Révocation possible des sessions actives |
| **Trust Proxy** | Express | `app.set('trust proxy', 1)` — IP réelle derrière reverse proxy |

### 🚦 Rate Limiting — Limites par route

Chaque point d'entrée sensible dispose de son propre limiteur Redis indépendant (`rate-limiter-flexible`), organisé par catégorie :

**🔐 Auth**

| Route | Limite | Fenêtre | Blocage |
|---|---|---|---|
| `POST /api/auth/login` | **10 tentatives** | 15 minutes | 15 minutes |
| `POST /api/auth/register` | **5 tentatives** | 1 heure | 30 minutes |
| `POST /api/auth/change-password` | **3 tentatives** | 1 heure | 30 minutes |
| `POST /api/auth/refresh` | **100 requêtes** | 24 heures | — |

**📧 Email**

| Route | Limite | Fenêtre | Blocage |
|---|---|---|---|
| `POST /api/email/forgot-password` | **3 tentatives** | 1 heure | 1 heure |
| `POST /api/email/reset-password` | **10 tentatives** | 1 heure | — |
| `GET  /api/email/verify-email` | **20 requêtes** | 1 heure | — |
| `POST /api/email/resend-verification` | **3 tentatives** | 1 heure | 30 minutes |

**🌐 API globale**

| Route | Limite | Fenêtre | Blocage |
|---|---|---|---|
| `Toutes les routes /api/*` | **100 requêtes** | 1 minute | — |

> **En développement** (`NODE_ENV=development`), tous les limiteurs sont désactivés automatiquement pour ne pas gêner le travail local.

> **En production**, chaque limiteur stocke les compteurs par IP dans Redis. La réponse `429 Too Many Requests` inclut le header `Retry-After` indiquant le temps d'attente en secondes. Le client affiche automatiquement un message toast : _"Too many attempts, try again in N minutes."_

---

## 🧩 Qualité du code

- 📐 **Architecture en couches** : routes → controllers → services → BDD
- 🧱 **Séparation des composants** : chaque page découpée en sous-composants atomiques
- 🔧 **Middlewares dédiés** : authentification, rate limiting, upload
- 🌱 **Seed de données** : base de données initialisable avec des données de démonstration
- 📦 **ES Modules** (`type: "module"`) côté serveur et client
- 🎯 **Code clair et lisible** : nommage explicite, responsabilités séparées
- 🔍 **ESLint** configuré avec les règles React Hooks

---

## 👨‍💻 Auteur

Développé par **Sainaro Khalid**

---

<p align="center">
  <sub>⭐ Si ce projet vous a plu, n'hésitez pas à lui mettre une étoile sur GitHub !</sub>
</p>
