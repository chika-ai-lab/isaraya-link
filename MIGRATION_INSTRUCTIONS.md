# Instructions de Migration - Phase 1: SaaS Multi-tenant

## 📋 Étapes de Migration

### Option 1: Via Supabase Dashboard (Recommandé)

1. **Accéder à votre projet Supabase**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet Isaraya Link

2. **Ouvrir l'éditeur SQL**
   - Cliquez sur "SQL Editor" dans la barre latérale
   - Cliquez sur "New query"

3. **Copier et exécuter la migration**
   - Ouvrez le fichier `supabase/migrations/20251022223423_saas_multi_tenant.sql`
   - Copiez tout le contenu
   - Collez-le dans l'éditeur SQL
   - Cliquez sur "Run" (en bas à droite)

4. **Vérifier les résultats**
   - Vérifiez qu'il n'y a pas d'erreurs
   - Vous devriez voir "Success. No rows returned" ou des messages de confirmation

### Option 2: Via Supabase CLI (Si installé)

```bash
# Installer Supabase CLI (si pas déjà fait)
npm install -g supabase

# Se connecter à votre projet
supabase login

# Lier votre projet local
supabase link --project-ref YOUR_PROJECT_REF

# Appliquer les migrations
supabase db push
```

### Option 3: Migration manuelle via scripts

```bash
# Exécuter via psql (si vous avez accès direct à la base)
psql -h db.YOUR_PROJECT.supabase.co -U postgres -d postgres -f supabase/migrations/20251022223423_saas_multi_tenant.sql
```

## ✅ Vérification Post-Migration

Après avoir exécuté la migration, vérifiez que:

### 1. Tables créées
```sql
-- Vérifier que la table profiles existe
SELECT * FROM public.profiles;

-- Vérifier les colonnes profile_id ajoutées
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'profile_id';
```

### 2. Données migrées
```sql
-- Vérifier qu'un profil par défaut "isaraya" a été créé
SELECT * FROM public.profiles WHERE slug = 'isaraya';

-- Vérifier que les produits existants ont été liés au profil
SELECT p.*, pr.company_name
FROM public.products p
JOIN public.profiles pr ON pr.id = p.profile_id;
```

### 3. Policies RLS actives
```sql
-- Vérifier les policies sur profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Vérifier les policies sur products, services, promotions
SELECT tablename, policyname FROM pg_policies
WHERE tablename IN ('products', 'services', 'promotions');
```

### 4. Fonctions créées
```sql
-- Tester la fonction is_slug_available
SELECT public.is_slug_available('isaraya'); -- Devrait retourner false
SELECT public.is_slug_available('nouveau-slug'); -- Devrait retourner true

-- Tester generate_unique_slug
SELECT public.generate_unique_slug('Ma Super Entreprise');
```

## 🔧 Actions Post-Migration

### 1. Assigner le profil par défaut à un utilisateur admin

Si vous avez déjà un compte admin, vous devez lui assigner le profil "isaraya":

```sql
-- Remplacer YOUR_ADMIN_USER_ID par l'UUID de votre utilisateur admin
UPDATE public.profiles
SET user_id = 'YOUR_ADMIN_USER_ID'
WHERE slug = 'isaraya' AND user_id IS NULL;
```

Pour trouver votre user_id:
```sql
SELECT id, email FROM auth.users;
```

### 2. Générer les nouveaux types TypeScript

Après la migration, régénérez les types TypeScript:

```bash
# Via Supabase CLI
supabase gen types typescript --local > src/integrations/supabase/types.ts

# Ou via API
# Allez dans Settings > API > Generate Types
# Copiez le contenu dans src/integrations/supabase/types.ts
```

## 🚨 Rollback (En cas de problème)

Si vous rencontrez des problèmes, vous pouvez revenir en arrière:

```sql
-- ATTENTION: Ceci supprimera toutes les données de profiles et les colonnes profile_id

-- Supprimer les colonnes profile_id
ALTER TABLE public.products DROP COLUMN IF EXISTS profile_id;
ALTER TABLE public.services DROP COLUMN IF EXISTS profile_id;
ALTER TABLE public.promotions DROP COLUMN IF EXISTS profile_id;

-- Supprimer la table profiles
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS public.is_slug_available(TEXT, UUID);
DROP FUNCTION IF EXISTS public.generate_unique_slug(TEXT);

-- Supprimer la vue
DROP VIEW IF EXISTS public.profiles_with_stats;

-- Restaurer les anciennes policies (voir migration initiale)
```

## 📊 Prochaines Étapes

Une fois la migration réussie:

1. ✅ Mettre à jour les types TypeScript
2. ✅ Créer les hooks React pour les profils
3. ✅ Tester l'accès aux données via RLS
4. ✅ Passer à la Phase 2: Authentification

## 💡 Notes Importantes

- **Backup**: Assurez-vous d'avoir une sauvegarde de votre base de données avant la migration
- **Environnement**: Testez d'abord sur un environnement de développement
- **company_info**: L'ancienne table `company_info` est conservée pour référence mais n'est plus utilisée
- **profile_id**: Tous les nouveaux produits/services/promotions devront avoir un `profile_id`

## 🆘 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs d'erreur dans Supabase Dashboard > Database > Logs
2. Consultez la documentation Supabase: https://supabase.com/docs
3. Vérifiez que votre utilisateur a les permissions nécessaires
