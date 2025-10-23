# 🚀 Appliquer la Migration Multi-tenant

## Étape 1: Accéder au SQL Editor de Supabase

1. **Ouvrez votre navigateur** et allez sur:
   ```
   https://supabase.com/dashboard/project/axljdeabsorjtzaxnxrd/sql/new
   ```

2. **Ou suivez ces étapes:**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet "axljdeabsorjtzaxnxrd"
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Cliquez sur "+ New query"

## Étape 2: Copier le fichier de migration

1. **Ouvrez le fichier:**
   ```
   supabase/migrations/20251022223423_saas_multi_tenant.sql
   ```

2. **Sélectionnez tout le contenu** (Ctrl+A ou Cmd+A)

3. **Copiez** (Ctrl+C ou Cmd+C)

## Étape 3: Exécuter la migration

1. **Collez le contenu** dans l'éditeur SQL de Supabase

2. **Cliquez sur "Run"** (bouton en bas à droite)

3. **Attendez** que la migration se termine (cela peut prendre quelques secondes)

## Étape 4: Vérifier le succès

Vous devriez voir un message de succès. Pour vérifier que tout fonctionne:

### Vérification 1: Table profiles créée

```sql
SELECT * FROM public.profiles;
```

Vous devriez voir un profil "isaraya" avec les données migrées de company_info.

### Vérification 2: Colonnes profile_id ajoutées

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('products', 'services', 'promotions')
  AND column_name = 'profile_id';
```

Vous devriez voir 3 lignes (une pour chaque table).

### Vérification 3: Données migrées

```sql
-- Compter les produits liés au profil
SELECT
    p.company_name,
    COUNT(prod.id) as products_count,
    COUNT(s.id) as services_count,
    COUNT(prom.id) as promotions_count
FROM public.profiles p
LEFT JOIN public.products prod ON prod.profile_id = p.id
LEFT JOIN public.services s ON s.profile_id = p.id
LEFT JOIN public.promotions prom ON prom.profile_id = p.id
WHERE p.slug = 'isaraya'
GROUP BY p.company_name;
```

### Vérification 4: RLS Policies

```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'products', 'services', 'promotions')
ORDER BY tablename, policyname;
```

## Étape 5: Assigner le profil à votre utilisateur admin (IMPORTANT!)

Après la migration, le profil "isaraya" n'est pas encore lié à un utilisateur. Vous devez l'assigner à votre compte admin:

### 5.1 Trouver votre User ID

```sql
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;
```

Copiez l'ID de votre compte admin.

### 5.2 Assigner le profil

```sql
-- Remplacez 'VOTRE_USER_ID' par l'ID copié ci-dessus
UPDATE public.profiles
SET user_id = 'VOTRE_USER_ID'
WHERE slug = 'isaraya' AND user_id IS NULL;
```

### 5.3 Vérifier

```sql
SELECT p.*, u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.slug = 'isaraya';
```

Vous devriez voir votre email associé au profil.

## Étape 6: Tester les fonctions utilitaires

### Tester is_slug_available

```sql
-- Devrait retourner false (slug déjà utilisé)
SELECT public.is_slug_available('isaraya');

-- Devrait retourner true (slug disponible)
SELECT public.is_slug_available('nouveau-test');
```

### Tester generate_unique_slug

```sql
-- Devrait générer un slug valide
SELECT public.generate_unique_slug('Ma Super Entreprise');

-- Devrait générer "isaraya-1" car "isaraya" existe déjà
SELECT public.generate_unique_slug('Isaraya');
```

## 🎉 Migration Terminée!

Si toutes les vérifications sont OK, la migration est réussie!

## Prochaines Étapes

1. ✅ Générer les nouveaux types TypeScript
2. ✅ Créer les hooks React pour les profils
3. ✅ Mettre à jour les composants existants
4. ✅ Créer les pages d'authentification (Phase 2)

## 🆘 En Cas de Problème

Si vous rencontrez une erreur:

1. **Lisez le message d'erreur** dans Supabase
2. **Vérifiez les logs**: Database > Logs dans le dashboard
3. **Rollback si nécessaire**: Voir MIGRATION_INSTRUCTIONS.md

### Erreurs Courantes

**"relation profiles already exists"**
- La migration a déjà été exécutée
- Vérifiez avec: `SELECT * FROM public.profiles`

**"permission denied"**
- Vous devez être connecté avec un compte admin
- Vérifiez vos permissions dans Settings > Database

**"column profile_id already exists"**
- Les colonnes ont déjà été ajoutées
- Continuez avec les prochaines étapes

## 📝 Notes

- La table `company_info` est conservée mais n'est plus utilisée
- Tous les nouveaux contenus doivent avoir un `profile_id`
- Les RLS policies garantissent l'isolation des données entre profils
