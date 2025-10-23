# Agenda du Projet - Isaraya Link (Plateforme SaaS)

## Vue d'ensemble du projet

**Nom**: Isaraya Link
**Type**: Plateforme SaaS multi-tenant de gestion de profils d'entreprise
**Technologies**: React, TypeScript, Vite, shadcn-ui, Tailwind CSS, Supabase
**URL Lovable**: https://lovable.dev/projects/607ea544-ba2e-4d15-b8c9-fc63d5efc30c

## Transformation SaaS - Vision

### Concept
Transformer Isaraya Link d'une application mono-entreprise en plateforme SaaS permettant à plusieurs entreprises de créer et gérer leurs profils en ligne. Chaque utilisateur peut gérer plusieurs profils d'entreprise depuis un seul compte.

### Modèle d'affaires (Phase 1 - Gratuit)
- **Accès ouvert**: Inscription gratuite pour tous
- **Multi-profils**: Gestion illimitée de profils d'entreprise par compte
- **Fonctionnalités complètes**: Toutes les features disponibles gratuitement
- **Phase ultérieure**: Monétisation (abonnements, plans premium) sera ajoutée plus tard

---

## Objectifs du projet

### Phase 1: MVP SaaS (Open & Free)
- ✅ Permettre l'inscription/connexion des utilisateurs
- ✅ Créer et gérer plusieurs profils d'entreprise par utilisateur
- ✅ Isoler les données entre les différents profils (multi-tenant)
- ✅ Générer des URLs uniques pour chaque profil d'entreprise
- ✅ Permettre la gestion des produits, services et promotions par profil
- ✅ Générer des QR codes pour chaque profil
- ✅ Interface d'administration moderne et intuitive

### Phase 2: Fonctionnalités Premium (À venir)
- Plans d'abonnement (Gratuit, Pro, Business)
- Limites par plan (nombre de produits, services, etc.)
- Fonctionnalités premium (analytics avancés, domaine personnalisé, etc.)
- Système de paiement (Stripe/PayPal)

---

## Fonctionnalités principales (SaaS Multi-tenant)

### 1. Authentification et Gestion de Compte
- [ ] Page d'inscription (Sign Up)
  - Email/password
  - OAuth (Google, GitHub - optionnel)
- [ ] Page de connexion (Sign In)
- [ ] Page de profil utilisateur
  - Modifier informations personnelles
  - Changer mot de passe
  - Gérer les préférences
- [ ] Récupération de mot de passe

### 2. Dashboard Principal (User Dashboard)
- [ ] Vue d'ensemble de tous les profils d'entreprise de l'utilisateur
- [ ] Bouton "Créer un nouveau profil"
- [ ] Liste des profils avec:
  - Nom de l'entreprise
  - URL unique du profil
  - Statut (actif/inactif)
  - Actions rapides (éditer, voir, QR code)
- [ ] Statistiques globales (optionnel)

### 3. Gestion de Profils d'Entreprise
- [ ] Création de nouveau profil
  - Choix du slug/URL unique (ex: isaraya.link/mon-entreprise)
  - Vérification de disponibilité du slug
  - Informations de base
- [ ] Sélecteur de profil actif
- [ ] Page de configuration par profil:
  - Informations générales
  - Logo/image de profil
  - Coordonnées de contact
  - Liens réseaux sociaux
  - Paramètres d'affichage

### 4. Page Publique de Profil (/:slug)
- [ ] Affichage dynamique basé sur le slug
- [ ] En-tête avec logo et informations entreprise
- [ ] Section À propos
- [ ] Catalogue de produits du profil
- [ ] Catalogue de services du profil
- [ ] Promotions actives du profil
- [ ] Liens de contact et réseaux sociaux
- [ ] Bouton WhatsApp flottant
- [ ] Design responsive et moderne

### 5. Gestion de Contenu par Profil
- [ ] **Produits**
  - CRUD complet (Create, Read, Update, Delete)
  - Upload d'images
  - Gestion des prix et descriptions
  - Ordre d'affichage
  - Produits vedettes
  - Activer/désactiver

- [ ] **Services**
  - CRUD complet
  - Icônes personnalisables
  - Descriptions détaillées
  - Ordre d'affichage
  - Activer/désactiver

- [ ] **Promotions**
  - CRUD complet
  - Dates de validité
  - Texte de réduction
  - Ordre d'affichage
  - Activer/désactiver

### 6. Outils et Fonctionnalités
- [ ] Générateur de QR Code par profil
  - Génération automatique de l'URL du profil
  - Téléchargement en différents formats
  - Personnalisation (couleur, logo)
- [ ] Prévisualisation en temps réel
- [ ] Partage de profil (liens, réseaux sociaux)

---

## Architecture technique

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.19
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: shadcn-ui (Radix UI)
- **Routing**: React Router DOM 6.30.1
- **State Management**: React Query (TanStack Query 5.83.0)
- **Forms**: React Hook Form 7.61.1 + Zod 3.25.76

### Backend (Supabase)
- **BaaS**: Supabase 2.76.1
- **Base de données**: PostgreSQL (multi-tenant)
- **Authentification**: Supabase Auth
- **Storage**: Supabase Storage (images par profil)
- **Row Level Security (RLS)**: Isolation des données par profil

### Nouvelle Structure de Base de Données (Multi-tenant)

#### Tables principales

**1. profiles (Profils d'entreprise)**
```sql
- id: UUID (PK)
- user_id: UUID (FK -> auth.users) -- Propriétaire du profil
- slug: TEXT (UNIQUE) -- URL unique (ex: "mon-entreprise")
- company_name: TEXT
- slogan: TEXT
- logo_url: TEXT
- phone: TEXT
- email: TEXT
- address: TEXT
- google_maps_url: TEXT
- website: TEXT
- description: TEXT
- facebook, instagram, twitter, linkedin, whatsapp: TEXT
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**2. products (Produits liés aux profils)**
```sql
- id: UUID (PK)
- profile_id: UUID (FK -> profiles) -- Lien avec le profil
- title: TEXT
- description: TEXT
- price: TEXT
- image_url: TEXT
- is_featured: BOOLEAN
- is_active: BOOLEAN
- display_order: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**3. services (Services liés aux profils)**
```sql
- id: UUID (PK)
- profile_id: UUID (FK -> profiles)
- title: TEXT
- description: TEXT
- icon: TEXT
- is_active: BOOLEAN
- display_order: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**4. promotions (Promotions liées aux profils)**
```sql
- id: UUID (PK)
- profile_id: UUID (FK -> profiles)
- title: TEXT
- description: TEXT
- discount_text: TEXT
- is_active: BOOLEAN
- valid_until: TIMESTAMP
- display_order: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**5. user_roles (Conservé pour gestion des rôles)**
```sql
- id: UUID (PK)
- user_id: UUID (FK -> auth.users)
- role: ENUM (admin, user)
```

### Row Level Security (RLS) Policies

**Profiles:**
- Tout le monde peut voir les profils actifs (is_active = true)
- Les utilisateurs peuvent créer leurs propres profils
- Les utilisateurs peuvent modifier/supprimer leurs propres profils
- Les admins ont accès complet

**Products/Services/Promotions:**
- Tout le monde peut voir le contenu actif des profils actifs
- Les propriétaires de profils peuvent gérer leur contenu
- Les admins ont accès complet

### Composants UI principaux
- Formulaires et inputs
- Cards et layouts
- Dialogs et modals
- Navigation avec breadcrumbs
- Toasts et notifications
- Carousels
- QR Code generator (qrcode.react)
- Data tables avec pagination
- Sélecteur de profil (Profile switcher)

---

## Structure du projet (SaaS)

```
isaraya-link/
├── public/                    # Assets statiques
├── src/
│   ├── assets/               # Images et ressources
│   ├── components/           # Composants React
│   │   ├── auth/            # Composants d'authentification
│   │   │   ├── SignInForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── PasswordReset.tsx
│   │   ├── dashboard/       # Dashboard utilisateur
│   │   │   ├── ProfileList.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── CreateProfileDialog.tsx
│   │   │   └── StatsOverview.tsx
│   │   ├── profile/         # Gestion de profil entreprise
│   │   │   ├── ProfileEditor.tsx
│   │   │   ├── ProfileSwitcher.tsx
│   │   │   └── ProfileSettings.tsx
│   │   ├── public/          # Vue publique des profils
│   │   │   ├── PublicProfile.tsx
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ContactLinks.tsx
│   │   │   └── SocialLinks.tsx
│   │   ├── admin/           # Gestion de contenu par profil
│   │   │   ├── ProductsManager.tsx
│   │   │   ├── ServicesManager.tsx
│   │   │   ├── PromotionsManager.tsx
│   │   │   └── QRCodeGenerator.tsx
│   │   ├── layout/          # Layouts et navigation
│   │   │   ├── AppLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── PublicLayout.tsx
│   │   └── ui/              # Composants UI (shadcn)
│   ├── hooks/               # Custom hooks
│   │   ├── useProfile.ts
│   │   ├── useProfiles.ts
│   │   ├── useProducts.ts
│   │   ├── useServices.ts
│   │   └── usePromotions.ts
│   ├── integrations/        # Intégrations (Supabase)
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts     # Types générés
│   ├── lib/                 # Utilitaires
│   │   ├── utils.ts
│   │   ├── validators.ts    # Schémas Zod
│   │   └── constants.ts
│   ├── contexts/            # Contexts React
│   │   ├── AuthContext.tsx
│   │   └── ProfileContext.tsx
│   ├── pages/               # Pages de l'application
│   │   ├── Home.tsx         # Landing page
│   │   ├── SignIn.tsx
│   │   ├── SignUp.tsx
│   │   ├── Dashboard.tsx    # Dashboard utilisateur
│   │   ├── ProfileView.tsx  # /:slug - Vue publique
│   │   ├── ProfileEdit.tsx  # /dashboard/profile/:id
│   │   └── NotFound.tsx
│   ├── types/               # Types TypeScript
│   │   └── index.ts
│   ├── App.tsx              # Routes principales
│   └── main.tsx             # Point d'entrée
├── supabase/                # Configuration Supabase
│   ├── migrations/          # Migrations SQL
│   └── config.toml
└── package.json             # Dépendances
```

---

## Plan de Migration vers SaaS Multi-tenant

### 🎯 Phase 1: Migration de la Base de Données (PRIORITÉ)

#### 1.1 Création de la nouvelle structure
- [ ] Créer la table `profiles` (nouvelle table principale)
- [ ] Migrer les données de `company_info` vers `profiles`
- [ ] Ajouter la colonne `profile_id` aux tables existantes:
  - [ ] `products` → ajouter `profile_id`
  - [ ] `services` → ajouter `profile_id`
  - [ ] `promotions` → ajouter `profile_id`
- [ ] Créer des index sur `profile_id` pour performances

#### 1.2 Mise à jour des RLS Policies
- [ ] **Profiles table:**
  - [ ] Policy: Tout le monde peut voir les profils actifs
  - [ ] Policy: Utilisateurs peuvent créer leurs profils
  - [ ] Policy: Utilisateurs peuvent gérer leurs propres profils
  - [ ] Policy: Admins ont accès complet

- [ ] **Products/Services/Promotions:**
  - [ ] Mettre à jour les policies pour inclure `profile_id`
  - [ ] Policy: Lecture publique si profil actif
  - [ ] Policy: Modification par propriétaire du profil
  - [ ] Policy: Admins ont accès complet

#### 1.3 Migration des données existantes
- [ ] Script de migration pour lier les données existantes à un profil par défaut
- [ ] Vérification de l'intégrité des données

### 🔐 Phase 2: Authentification et Gestion Utilisateur

#### 2.1 Pages d'authentification
- [ ] Page de connexion (Sign In)
- [ ] Page d'inscription (Sign Up)
- [ ] Récupération de mot de passe
- [ ] Vérification d'email

#### 2.2 Context et hooks
- [ ] AuthContext (gestion de l'état utilisateur)
- [ ] useAuth hook
- [ ] Protected routes (HOC ou composant)

### 📊 Phase 3: Dashboard Utilisateur

#### 3.1 Interface principale
- [ ] Page Dashboard principale
- [ ] Liste des profils de l'utilisateur
- [ ] Bouton "Créer un nouveau profil"
- [ ] Statistiques (optionnel)

#### 3.2 Gestion des profils
- [ ] CreateProfileDialog (création de profil)
  - [ ] Formulaire avec validation
  - [ ] Vérification de disponibilité du slug
  - [ ] Upload de logo
- [ ] ProfileCard (carte de profil dans la liste)
- [ ] Actions: Éditer, Voir, Supprimer, QR Code

### 🏢 Phase 4: Gestion de Profil d'Entreprise

#### 4.1 Édition de profil
- [ ] Page d'édition de profil
- [ ] ProfileEditor (informations générales)
- [ ] Upload de logo
- [ ] Gestion des coordonnées de contact
- [ ] Gestion des liens réseaux sociaux
- [ ] Prévisualisation en temps réel

#### 4.2 Sélection de profil actif
- [ ] ProfileContext (profil actif)
- [ ] ProfileSwitcher (dropdown pour changer de profil)
- [ ] Persistance du profil actif (localStorage)

### 📦 Phase 5: Gestion de Contenu par Profil

#### 5.1 Mise à jour des managers existants
- [ ] **ProductsManager**
  - [ ] Filtrer par `profile_id`
  - [ ] CRUD avec `profile_id`
  - [ ] Upload d'images par profil

- [ ] **ServicesManager**
  - [ ] Filtrer par `profile_id`
  - [ ] CRUD avec `profile_id`

- [ ] **PromotionsManager**
  - [ ] Filtrer par `profile_id`
  - [ ] CRUD avec `profile_id`

#### 5.2 Hooks mis à jour
- [ ] useProducts (avec profile_id)
- [ ] useServices (avec profile_id)
- [ ] usePromotions (avec profile_id)

### 🌐 Phase 6: Pages Publiques Dynamiques

#### 6.1 Routing dynamique
- [ ] Route `/:slug` pour les profils publics
- [ ] Récupération du profil par slug
- [ ] Gestion du 404 (profil non trouvé)

#### 6.2 Affichage public
- [ ] PublicProfile (page principale)
- [ ] ProfileHeader (dynamique selon profil)
- [ ] AboutSection (dynamique)
- [ ] ProductSection (filtré par profil)
- [ ] ServiceSection (filtré par profil)
- [ ] PromotionSection (filtré par profil)
- [ ] ContactLinks (dynamique)
- [ ] SocialLinks (dynamique)

### 🔧 Phase 7: Outils et Fonctionnalités

#### 7.1 QR Code Generator
- [ ] Génération par profil (URL unique)
- [ ] Personnalisation (couleur, logo)
- [ ] Téléchargement multiple formats

#### 7.2 Partage et analytics
- [ ] Boutons de partage (social media)
- [ ] Copie de lien
- [ ] Analytics basiques (optionnel)

### 🎨 Phase 8: UI/UX et Design

#### 8.1 Layouts
- [ ] AppLayout (layout général)
- [ ] DashboardLayout (pour dashboard)
- [ ] PublicLayout (pour pages publiques)
- [ ] Navigation responsive

#### 8.2 Responsive design
- [ ] Mobile-first design
- [ ] Tablette
- [ ] Desktop
- [ ] Tests sur différents devices

### ✅ Phase 9: Tests et Optimisation

#### 9.1 Tests fonctionnels
- [ ] Test création de compte
- [ ] Test création de profil
- [ ] Test CRUD produits/services/promotions
- [ ] Test accès public aux profils
- [ ] Test RLS policies

#### 9.2 Optimisation
- [ ] Performance (lazy loading, code splitting)
- [ ] SEO (meta tags dynamiques)
- [ ] Images optimisées
- [ ] Caching (React Query)

### 🚀 Phase 10: Déploiement

#### 10.1 Configuration
- [ ] Variables d'environnement
- [ ] Configuration Netlify/Vercel
- [ ] Configuration Supabase production

#### 10.2 Mise en production
- [ ] Migration de la base de données
- [ ] Tests en production
- [ ] Documentation utilisateur
- [ ] Monitoring

---

## Roadmap SaaS

### ✅ Version 0.x (Actuelle - Mono-tenant)
- [x] Interface publique de base
- [x] Gestion des produits
- [x] Gestion des services
- [x] Gestion des promotions
- [x] Authentification admin
- [x] Générateur de QR Code

### 🚀 Version 1.0 (MVP SaaS Multi-tenant - Gratuit)
**Objectif:** Transformer en plateforme SaaS fonctionnelle

**Backend & Database:**
- [ ] Migration vers architecture multi-tenant
- [ ] Table `profiles` avec slug unique
- [ ] Relations profile_id pour tout le contenu
- [ ] RLS policies multi-tenant
- [ ] Storage organisé par profil

**Authentification:**
- [ ] Sign Up / Sign In
- [ ] Gestion de compte utilisateur
- [ ] Protected routes

**Fonctionnalités Utilisateur:**
- [ ] Dashboard personnel
- [ ] Création de profils illimités
- [ ] Gestion multi-profils
- [ ] URLs dynamiques (/:slug)
- [ ] Gestion complète du contenu par profil
- [ ] Générateur de QR Code par profil

**UI/UX:**
- [ ] Design moderne et responsive
- [ ] Navigation intuitive
- [ ] Formulaires avec validation
- [ ] Messages d'erreur et succès

**Déploiement:**
- [ ] Production ready
- [ ] Documentation utilisateur

### 📈 Version 1.1 (Améliorations)
**Analytics & Insights:**
- [ ] Dashboard avec statistiques basiques
- [ ] Nombre de vues par profil
- [ ] Tracking des clics (liens, WhatsApp, etc.)
- [ ] Graphiques simples

**Personnalisation:**
- [ ] Thèmes de couleur par profil
- [ ] Templates de profil prédéfinis
- [ ] Customisation avancée du design

**Social & Partage:**
- [ ] Partage facilité (social media)
- [ ] Prévisualisation (Open Graph tags)
- [ ] SEO optimisé par profil

### 🌍 Version 1.2 (Internationalisation)
- [ ] Multi-langue (FR/EN/ES)
- [ ] Mode sombre
- [ ] Accessibilité (WCAG)
- [ ] PWA (Progressive Web App)

### 💳 Version 2.0 (Monétisation - Premium)
**Plans d'Abonnement:**
- [ ] **Plan Gratuit:**
  - 1 profil
  - 5 produits max
  - 3 services max
  - Features basiques

- [ ] **Plan Pro (€9.99/mois):**
  - 5 profils
  - Produits illimités
  - Services illimités
  - Analytics avancés
  - Domaine personnalisé
  - Support prioritaire

- [ ] **Plan Business (€29.99/mois):**
  - Profils illimités
  - White label
  - API access
  - Export de données
  - Intégrations avancées

**Paiements:**
- [ ] Intégration Stripe/PayPal
- [ ] Gestion des abonnements
- [ ] Facturation automatique
- [ ] Essai gratuit (14 jours)

### 🚀 Version 3.0+ (Fonctionnalités Avancées)
**E-commerce:**
- [ ] Panier d'achat intégré
- [ ] Paiements en ligne
- [ ] Gestion des commandes
- [ ] Inventaire

**Communication:**
- [ ] Chat en direct
- [ ] Notifications push
- [ ] Email marketing intégré
- [ ] SMS notifications

**Business Tools:**
- [ ] Calendrier de réservations
- [ ] Système de rendez-vous
- [ ] CRM intégré
- [ ] Gestion d'équipe (multi-utilisateurs)

**Contenu:**
- [ ] Blog/Actualités par profil
- [ ] Galerie photo avancée
- [ ] Vidéos
- [ ] Témoignages clients

**Intégrations:**
- [ ] API publique
- [ ] Webhooks
- [ ] Zapier/Make
- [ ] Google Analytics
- [ ] Facebook Pixel
- [ ] WhatsApp Business API

**Advanced:**
- [ ] A/B Testing
- [ ] Marketing automation
- [ ] Programme de parrainage
- [ ] Marketplace de templates

---

## Configuration et lancement

### Prérequis
- Node.js (version recommandée via nvm)
- npm ou pnpm
- Compte Supabase

### Installation

```bash
# Cloner le repository
git clone <URL_DU_REPO>

# Naviguer dans le dossier
cd isaraya-link

# Installer les dépendances
npm install
# ou
pnpm install

# Configurer les variables d'environnement
# Créer un fichier .env à la racine avec:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Lancer le serveur de développement
npm run dev
```

### Commandes disponibles

```bash
npm run dev          # Développement
npm run build        # Build de production
npm run build:dev    # Build de développement
npm run lint         # Linting ESLint
npm run preview      # Prévisualiser le build
```

---

## Notes importantes

- Le projet utilise pnpm comme gestionnaire de paquets
- Déployé via Netlify (configuration dans netlify.toml)
- L'authentification est gérée par Supabase
- Les images doivent être optimisées avant upload
- Respecter les conventions de nommage TypeScript
- Utiliser les composants shadcn-ui pour la cohérence visuelle

---

## Ressources

- [Documentation Lovable](https://docs.lovable.dev)
- [Documentation React](https://react.dev)
- [Documentation Vite](https://vitejs.dev)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation shadcn-ui](https://ui.shadcn.com)
- [Documentation Tailwind CSS](https://tailwindcss.com)

---

## Contacts et support

- **Projet Lovable**: https://lovable.dev/projects/607ea544-ba2e-4d15-b8c9-fc63d5efc30c
- **Repository Git**: Géré via Lovable
- **Déploiement**: Netlify

---

## Migration SQL - Scripts de Base de Données

Créer un nouveau fichier de migration Supabase:
`supabase/migrations/[timestamp]_saas_multi_tenant.sql`

```sql
-- ============================================
-- MIGRATION VERS SAAS MULTI-TENANT
-- ============================================

-- 1. Créer la table profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    slogan TEXT,
    logo_url TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    google_maps_url TEXT,
    website TEXT,
    description TEXT,
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,
    linkedin TEXT,
    whatsapp TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Ajouter profile_id aux tables existantes
ALTER TABLE public.products ADD COLUMN profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.services ADD COLUMN profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.promotions ADD COLUMN profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. Créer des index pour performances
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_slug ON public.profiles(slug);
CREATE INDEX idx_products_profile_id ON public.products(profile_id);
CREATE INDEX idx_services_profile_id ON public.services(profile_id);
CREATE INDEX idx_promotions_profile_id ON public.promotions(profile_id);

-- 4. Enable RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies pour profiles
-- Tout le monde peut voir les profils actifs
CREATE POLICY "Anyone can view active profiles"
ON public.profiles
FOR SELECT
TO public
USING (is_active = true);

-- Les utilisateurs authentifiés peuvent voir leurs propres profils
CREATE POLICY "Users can view their own profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres profils
CREATE POLICY "Users can create their own profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs propres profils
CREATE POLICY "Users can update their own profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres profils
CREATE POLICY "Users can delete their own profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Les admins ont accès complet
CREATE POLICY "Admins have full access to profiles"
ON public.profiles
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Mettre à jour les policies pour products
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Voir les produits actifs des profils actifs
CREATE POLICY "Anyone can view active products of active profiles"
ON public.products
FOR SELECT
TO public
USING (
    is_active = true
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = products.profile_id
        AND profiles.is_active = true
    )
);

-- Les propriétaires de profils peuvent gérer leurs produits
CREATE POLICY "Profile owners can manage their products"
ON public.products
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = products.profile_id
        AND profiles.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = products.profile_id
        AND profiles.user_id = auth.uid()
    )
);

-- 7. Mettre à jour les policies pour services
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;

CREATE POLICY "Anyone can view active services of active profiles"
ON public.services
FOR SELECT
TO public
USING (
    is_active = true
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = services.profile_id
        AND profiles.is_active = true
    )
);

CREATE POLICY "Profile owners can manage their services"
ON public.services
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = services.profile_id
        AND profiles.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = services.profile_id
        AND profiles.user_id = auth.uid()
    )
);

-- 8. Mettre à jour les policies pour promotions
DROP POLICY IF EXISTS "Anyone can view active promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can insert promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can update promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can delete promotions" ON public.promotions;

CREATE POLICY "Anyone can view active promotions of active profiles"
ON public.promotions
FOR SELECT
TO public
USING (
    is_active = true
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = promotions.profile_id
        AND profiles.is_active = true
    )
);

CREATE POLICY "Profile owners can manage their promotions"
ON public.promotions
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = promotions.profile_id
        AND profiles.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = promotions.profile_id
        AND profiles.user_id = auth.uid()
    )
);

-- 9. Trigger pour updated_at sur profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Fonction pour vérifier la disponibilité du slug
CREATE OR REPLACE FUNCTION public.is_slug_available(check_slug TEXT, exclude_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE slug = check_slug
    AND (exclude_id IS NULL OR id != exclude_id)
  );
$$;
```

---

## Changelog

### 2025-10-22
- ✅ Création du fichier Agent.md (Agenda)
- ✅ Planification complète de la migration SaaS multi-tenant
- ✅ Définition de l'architecture multi-tenant
- ✅ Structure de la base de données avec profiles
- ✅ Plan de migration en 10 phases
- ✅ Roadmap détaillée (v1.0 à v3.0+)
- ✅ Scripts SQL de migration
- 📋 Prêt pour l'implémentation Phase 1
