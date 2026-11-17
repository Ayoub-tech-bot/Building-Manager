# Building-Manager — Rapport de Réalisation & Guide d'Architecture Frontend

Ce document synthétise l'ensemble des développements réalisés au cours de cette session, les décisions d'architecture prises, les modules implémentés, ainsi que le fonctionnement technique détaillé du frontend React.

---

## 1. Vue d'Ensemble & Restructuration du Projet

Le projet a été scindé en deux projets indépendants au sein du même dépôt Git :

```text
Building-Manager/
├── backend/                  # Application Spring Boot (Java 25, Maven, MySQL, JPA)
│   ├── src/main/java/
│   │   └── back_end/Building/Manager/
│   │       ├── config/       # CorsConfig, DataInitializer
│   │       ├── entity/       # Apartment, Building, Residence, User, Fee, Payment, OwnerShip
│   │       ├── repository/   # Repositories Spring Data JPA
│   │       ├── service/      # Interfaces et Implémentations métier
│   │       └── ws/           # Controllers REST, DTOs, Mappers
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
│
├── frontend/                 # Application React (Vite, Tailwind CSS, React Router, Axios)
│   ├── src/
│   │   ├── api/              # Services de communication Axios
│   │   ├── components/       # Composants réutilisables (StatCard, StatusBadge, Modals)
│   │   ├── context/          # DemoAuthContext (Gestion du rôle et persistance)
│   │   ├── layouts/          # DashboardLayout, Sidebar, Navbar, RoleSwitcherBar
│   │   ├── pages/            # Pages des tableaux de bord et modules
│   │   ├── routes/           # Configuration des routes React Router
│   │   └── utils/            # Formatters monétaires, dates et utilitaires Tailwind
│   ├── package.json
│   └── tailwind.config.js
│
├── SESSION_WORK_AND_FRONTEND_GUIDE.md
└── README.md
```

---

## 2. Refonte du Modèle de Données : La Hiérarchie à 3 Niveaux

La hiérarchie immobilière a été corrigée pour correspondre au fonctionnement réel d'une copropriété :

$$\text{Résidence} \xrightarrow{1 \dots N} \text{Bâtiment / Immeuble} \xrightarrow{1 \dots N} \text{Appartement / Lot}$$

### Côté Backend
1. **Entité `Building`** : Table `building` avec `id`, `name` (ex: "Bâtiment A"), `floorsCount` (ex: 4), liée par `@ManyToOne` à `Residence`.
2. **Entité `Apartment` enrichie** :
   - Ajout de `@ManyToOne Building building` et `Integer floor`.
   - Méthode `getResidence()` rétrocompatible (résout la résidence via le bâtiment ou en direct).
3. **Repository, Service & Contrôleur REST** :
   - `BuildingController` exposé sous `/api/v1/buildings` (CRUD complet + filtre par résidence).
   - `ApartmentController` doté de `GET /api/v1/apartments/building/{buildingId}` et liaison automatique au bâtiment lors du `POST`.
4. **Auto-guérison et initialisation** :
   - `ApartmentServiceImpl` et `BuildingServiceImpl` s'auto-rattachent à la résidence par défaut si la base est vide.
   - `DataInitializer.java` (`CommandLineRunner`) : injecte automatiquement au premier démarrage la résidence, les 3 bâtiments initiaux, les utilisateurs démo et les appartements de test.
5. **Configuration CORS Globale** :
   - `CorsConfig.java` autorise les requêtes provenant de `http://localhost:5173` avec méthodes `GET, POST, PUT, DELETE, OPTIONS, PATCH`.

---

## 3. Modules Frontend Implémentés

### A. Dashboards par Rôle (Fidélité Figma)
- **Dashboard Syndic (`/`)** : KPIs de trésorerie, jauge de recouvrement, tableau des charges à suivre, derniers paiements enregistrés, demandes en cours, annonces et journal d'activité.
- **Espace Propriétaire (`/my-apartment` et `/`)** :
  - **Suppression du doublon "Vue d'ensemble"** : Le menu ouvre directement sur **"Mon appartement"**, qui fait office de vue d'ensemble avec photo de la résidence, solde restant dû (carte vert sapin), historique 3 mois des charges et paiements, demandes de travaux et contact direct du syndic.
- **Dashboard Employé** : Planning des rondes, interventions assignées priorisées, coordonnées d'urgence.
- **Barre de Changement de Rôle (Dev)** : Permet de basculer instantanément en un clic entre Syndic, Propriétaire et Employé sans ré-authentification, avec persistance dans le `localStorage`.

### B. Module Immeubles / Bâtiments (`/buildings`)
- **Titre & Accès** : Onglet **Immeubles** dans la barre latérale du Syndic.
- **KPIs** : Total des immeubles, lots répartis, cumul des étages, surface totale bâtie.
- **Grille de Cartes Immeuble** :
  - Affichage de la volumétrie (nombre d'étages `R + N`).
  - Nombre de lots rattachés et surface cumulée en m².
  - Aperçu visuel des badges de lots associés (ex : `Lot A-12`, `Lot A-03`).
  - Statut des lots (occupés / vacants).
  - Bouton d'accès direct filtré vers les appartements.
- **Création & Modification** : Modal [`BuildingModal.jsx`](file:///c:/Users/hp/Desktop/Futur%20SaaS!/Building-Manager/frontend/src/pages/buildings/BuildingModal.jsx) permettant de créer un nouvel immeuble avec nom et nombre d'étages.
- **Persistance** : Synchronisé avec `buildingApi` et mis en cache dans `localStorage` (`habita_buildings`).

### C. Module Appartements & Lots (`/apartments`)
- **Inventaire complet** : Table avec numéros de lots, bâtiment, étage (`RDC`, `1er étage`, `2e étage`), surface en m², tantièmes (/1000e), propriétaire assigné et statut d'occupation.
- **Sélecteur de Bâtiment dynamique** : Lors de l'ajout ou de la modification d'un lot, un menu déroulant propose tous les immeubles créés (chargés depuis l'API ou le cache).
- **Attribution & Transfert de propriété** : Modal dédié avec historique, permettant d'assigner un propriétaire ou d'effectuer une mutation de lot à une date donnée.
- **Persistance locale garantie** : Tout nouvel appartement créé est instantanément sauvegardé dans `localStorage` (`habita_apartments`), évitant toute perte de données lors des rechargements de page.

### D. Distinction Propriétaires vs Copropriétaires
Pour lever toute ambiguïté légale et d'interface :
1. **« Propriétaires » (`/owners`) — Annuaire Général** :
   - Liste de **tous** les utilisateurs enregistrés avec le rôle Propriétaire sur la plateforme.
   - Bouton **`+ Nouveau propriétaire`** : formulaire pour créer un profil (nom, email, téléphone, mot de passe).
   - Statut : *Attribué à un lot* ou *Sans lot (en attente d'attribution)*.
2. **« Copropriétaires » (`/co-owners`) — Registre de la Copropriété** :
   - Liste exclusive des propriétaires qui détiennent un ou plusieurs lots dans la résidence active.
   - Détail des lots et bâtiments possédés, quote-part totale de tantièmes, situation comptable des charges (À jour / Solde débiteur) et lien rapide vers les charges.

### E. Module Charges & Paiements (`/fees` et `/payments`)
- **Émission de charges** : Émission unitaire ou génération en masse pour tous les appartements (au forfait ou au taux par m² privatif).
- **Suivi du recouvrement** : Barre de progression du recouvrement du mois, calcul en temps réel du solde restant dû par lot.
- **Enregistrement des règlements** : Modal de paiement avec vérification du solde débiteur, choix du moyen de paiement (Espèces, Virement, Carte) et génération de reçu.

---

## 4. Fonctionnement Technique Détaillé du Frontend

### A. Arborescence du Code Source

```text
frontend/src/
├── api/
│   ├── client.js          # Instance Axios configurée (baseURL, timeout, gestion d'erreurs)
│   ├── buildingApi.js     # CRUD Bâtiments (/buildings)
│   ├── apartmentApi.js    # CRUD Appartements (/apartments)
│   ├── userApi.js         # Gestion des Utilisateurs (/users)
│   ├── ownershipApi.js    # Mutations et assignations de propriété (/ownerships)
│   ├── feeApi.js          # Émission et consultation des charges (/fees)
│   └── paymentApi.js      # Enregistrement des paiements (/payments)
│
├── components/common/
│   ├── ConfirmationDialog.jsx # Boîte de dialogue destructive accessible
│   ├── Modal.jsx              # Modal accessible (fermeture Échap, clic arrière-plan)
│   ├── StatCard.jsx           # Carte KPI statistique (variante normale et sapin foncé)
│   └── StatusBadge.jsx        # Badges d'état (Payé, En retard, Partiel, Vacant, etc.)
│
├── context/
│   └── DemoAuthContext.jsx    # Contexte React gérant le rôle actif et les utilisateurs démo
│
├── layouts/
│   ├── DashboardLayout.jsx    # Coquille principale (Sidebar + Navbar + Outlet)
│   ├── Navbar.jsx             # En-tête avec fil d'Ariane dynamique et date
│   ├── RoleSwitcherBar.jsx    # Barre supérieure de changement rapide de rôle
│   └── Sidebar.jsx            # Barre latérale adaptative selon le rôle
│
├── pages/
│   ├── dashboards/
│   │   ├── DashboardDispatcher.jsx # Aiguilleur de dashboard selon le rôle
│   │   ├── SyndicDashboard.jsx     # Dashboard Syndic fidèle à Figma
│   │   ├── OwnerDashboard.jsx      # Dashboard Propriétaire fidèle à Figma
│   │   └── EmployeeDashboard.jsx   # Dashboard Employé
│   ├── buildings/
│   │   ├── BuildingModal.jsx       # Création / Édition d'immeubles
│   │   └── BuildingsPage.jsx       # Gestion des immeubles et métriques
│   ├── apartments/
│   │   ├── ApartmentModal.jsx      # Formulaire de lot (avec sélecteur d'immeuble et étage)
│   │   ├── ApartmentsPage.jsx      # Inventaire des appartements et filtres
│   │   └── AssignOwnerModal.jsx    # Assignation et transfert de propriété
│   ├── owners/
│   │   ├── OwnerModal.jsx          # Création / Édition de propriétaire
│   │   ├── OwnerDetailsModal.jsx   # Fiche détaillée d'un propriétaire et ses lots
│   │   ├── OwnersPage.jsx          # Annuaire général des comptes propriétaires
│   │   └── CoOwnersPage.jsx        # Registre des copropriétaires de la résidence
│   ├── fees/
│   │   ├── FeeModal.jsx            # Création de charge unitaire
│   │   ├── GenerateFeesModal.jsx   # Génération en masse de charges
│   │   └── FeesPage.jsx            # Suivi des charges et barre de recouvrement
│   └── payments/
│       ├── PaymentModal.jsx        # Enregistrement de règlement avec contrôle de solde
│       └── PaymentsPage.jsx        # Historique des transactions et reçus
│
├── routes/
│   └── AppRoutes.jsx          # Configuration centralisée React Router
│
└── utils/
    └── formatters.js          # Utilitaires de devise (DH), dates fr et classes Tailwind (cn)
```

### B. Gestion des Rôles & Contexte Démo (`DemoAuthContext`)
L'authentification réelle (Spring Security / JWT) sera intégrée en Phase 6. Actuellement :
- Le contexte `DemoAuthContext` stocke le rôle sélectionné (`SYNDIC`, `OWNER`, `EMPLOYEE`).
- Le rôle est persisté dans `localStorage.getItem('habita_demo_role')`.
- Chaque rôle dispose de son propre utilisateur type (ex : Nora Alaoui pour le Syndic, Karim El Amrani pour le Propriétaire).
- La barre latérale (`Sidebar.jsx`) recalcule automatiquement les liens visibles :
  - **Syndic** : Vue d'ensemble, Immeubles, Appartements, Propriétaires, Copropriétaires, Charges, Paiements, Interventions, Autorisations, Documents, Annonces, Personnel.
  - **Propriétaire** : Mon appartement, Mes charges, Mes paiements, Mes demandes, Documents, Annonces.
  - **Employé** : Vue d'ensemble, Interventions assignées, Planning de travail, Résidence & Contacts, Documents, Annonces.

### C. Architecture Double Mode (En ligne / Hors-ligne Résilient)
Chaque page du frontend implémente un pattern robuste :
1. **Initialisation** : L'état React est initialisé à partir du `localStorage` (s'il contient des données sauvegardées) ou des données de démonstration conformes à Figma.
2. **Appel API asynchrone** : Au montage (`useEffect`), la page tente d'interroger les endpoints Spring Boot (`http://localhost:8080/api/v1`).
3. **Succès API** : Si le backend répond, les données fraîches écrasent l'état local et sont synchronisées dans le `localStorage`.
4. **Repli hors-ligne / Erreur** : Si le backend est éteint ou inaccessible, la requête échoue silencieusement sans faire crasher l'interface, et l'utilisateur continue à utiliser l'application avec les données locales.
5. **Opérations d'écriture (POST, PUT, DELETE)** :
   - L'action est transmise à l'API backend via Axios.
   - En parallèle, l'état React local et le `localStorage` sont immédiatement mis à jour.
   - Une notification Toast confirme l'opération à l'utilisateur.

### D. Design System & Tokens Visuels ("Habita")
L'application respecte la palette et la typographie de la maquette Figma :
- **Vert Forêt / Sapin** : `#1E392A` (Couleur primaire, boutons d'action, cartes clés).
- **Liseré & Fond crème / Lin chaud** : `#F6F5EE` (Fond principal), `#FAF9F5` (Fonds de cartes et formulaires).
- **Barre latérale** : `#ECEAE0` avec bordure `#E2DFC9`.
- **Typographie** : Inter / Sans-serif moderne, haute lisibilité, contrastes certifiés WCAG AA.
- **Composants d'état (`StatusBadge`)** :
  - `paid` (Vert) : Réglé / Occupé / À jour
  - `late` (Rouge) : En retard / Impayé
  - `partial` (Orange) : Paiement partiel / Solde restant
  - `pending` (Gris / Ambre) : En attente / Vacant

---

## 5. Guide d'Exécution

### Lancement du Backend (Spring Boot)
1. Assurez-vous que MySQL tourne sur le port `3306` et que la base `Saas` existe (`CREATE DATABASE IF NOT EXISTS Saas;`).
2. Ouvrez un terminal dans `Building-Manager/backend` :
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *(Ou démarrez la classe `BuildingManagerApplication.java` depuis votre IDE).*
3. Le serveur démarre sur `http://localhost:8080` et `DataInitializer` peuple automatiquement la base de données.
4. Documentation Swagger accessible sur : `http://localhost:8080/swagger-ui.html`.

### Lancement du Frontend (React + Vite)
1. Ouvrez un second terminal dans `Building-Manager/frontend` :
   ```powershell
   pnpm run dev
   ```
2. Ouvrez `http://localhost:5173` dans votre navigateur.
3. Vous pouvez basculer d'un rôle à un autre via la barre supérieure, créer de nouveaux immeubles, appartements, propriétaires et suivre les charges et paiements en direct.

---

## 6. Historique des Commits Git Réalisés

1. `commit 37711ef` : Implémentation des Modules 2 (Propriétaires) et 3 (Charges & Paiements).
2. `commit d88d176` : Introduction de la couche Bâtiment (`Building`) et hiérarchie à 3 niveaux (Résidence → Bâtiment → Appartement).
3. `commit 51d2a73` : Configuration CORS globale dans Spring Boot pour l'intégration frontend.
4. `commit 6f6788b` : Séparation Propriétaires vs Copropriétaires, suppression Vue d'ensemble Propriétaire, persistance locale et auto-seeder backend.
5. `commit 970cec3` : Implémentation complète du module **Immeubles** (`/buildings`), formulaires, métriques et synchronisation avec les appartements.
