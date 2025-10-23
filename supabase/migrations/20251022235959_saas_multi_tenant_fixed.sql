-- ============================================
-- MIGRATION VERS SAAS MULTI-TENANT
-- Version 1.0 - Multi-profils par utilisateur
-- ============================================

-- 1. Créer la table profiles (profils d'entreprise)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable pendant la migration
    slug TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    slogan TEXT DEFAULT '',
    logo_url TEXT,
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    address TEXT DEFAULT '',
    google_maps_url TEXT,
    website TEXT DEFAULT '',
    description TEXT DEFAULT '',
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,
    linkedin TEXT,
    whatsapp TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- 2. Ajouter profile_id aux tables existantes (nullable d'abord pour la migration)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. Créer des index pour performances
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_products_profile_id ON public.products(profile_id);
CREATE INDEX IF NOT EXISTS idx_services_profile_id ON public.services(profile_id);
CREATE INDEX IF NOT EXISTS idx_promotions_profile_id ON public.promotions(profile_id);

-- 4. Migrer les données existantes de company_info vers profiles
-- Créer un profil par défaut "isaraya" si des données existent
DO $$
DECLARE
    default_profile_id UUID;
    company_data RECORD;
BEGIN
    -- Vérifier s'il y a des données dans company_info
    SELECT * INTO company_data FROM public.company_info LIMIT 1;

    IF FOUND THEN
        -- Créer un profil par défaut avec les données de company_info
        -- user_id sera NULL car nous n'avons pas encore d'utilisateur
        -- Il devra être assigné manuellement après la migration
        INSERT INTO public.profiles (
            slug,
            company_name,
            slogan,
            phone,
            email,
            address,
            google_maps_url,
            website,
            description,
            facebook,
            instagram,
            twitter,
            linkedin,
            whatsapp,
            is_active,
            user_id
        )
        SELECT
            'isaraya', -- slug par défaut
            company_name,
            slogan,
            phone,
            email,
            address,
            google_maps_url,
            website,
            description,
            facebook,
            instagram,
            twitter,
            linkedin,
            whatsapp,
            true,
            NULL -- user_id explicitement NULL
        FROM public.company_info
        LIMIT 1
        ON CONFLICT (slug) DO NOTHING
        RETURNING id INTO default_profile_id;

        -- Assigner tous les produits existants au profil par défaut
        IF default_profile_id IS NOT NULL THEN
            UPDATE public.products
            SET profile_id = default_profile_id
            WHERE profile_id IS NULL;

            UPDATE public.services
            SET profile_id = default_profile_id
            WHERE profile_id IS NULL;

            UPDATE public.promotions
            SET profile_id = default_profile_id
            WHERE profile_id IS NULL;
        END IF;
    END IF;
END $$;

-- 5. Créer des fonctions utilitaires pour la gestion des slugs
CREATE OR REPLACE FUNCTION public.is_slug_available(slug_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE slug = slug_to_check
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_unique_slug(base_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Créer un slug de base à partir du nom
    base_slug := lower(base_name);
    base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
    base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');

    final_slug := base_slug;

    -- Trouver un slug unique en ajoutant un compteur si nécessaire
    WHILE NOT public.is_slug_available(final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter::TEXT;
    END LOOP;

    RETURN final_slug;
END;
$$;

-- 6. Mettre à jour les triggers pour la table profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Activer RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 8. Créer les politiques RLS pour profiles
-- Tout le monde peut voir les profils actifs (pour les pages publiques)
CREATE POLICY "Anyone can view active profiles"
ON public.profiles
FOR SELECT
TO public
USING (is_active = true);

-- Les utilisateurs authentifiés peuvent voir tous leurs profils
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

-- 9. Mettre à jour les politiques RLS des autres tables pour supporter profile_id
-- PRODUCTS
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Anyone can view active products"
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

CREATE POLICY "Profile owners can manage their products"
ON public.products
FOR ALL
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

-- SERVICES
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;

CREATE POLICY "Anyone can view active services"
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
FOR ALL
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

-- PROMOTIONS
DROP POLICY IF EXISTS "Anyone can view active promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can insert promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can update promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can delete promotions" ON public.promotions;

CREATE POLICY "Anyone can view active promotions"
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
FOR ALL
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

-- 10. NOTE IMPORTANTE POUR L'ADMINISTRATEUR
-- Après cette migration, le profil "isaraya" existe avec user_id = NULL
-- Pour l'attribuer à un utilisateur spécifique, exécutez:
-- UPDATE public.profiles SET user_id = '<user_uuid>' WHERE slug = 'isaraya';
--
-- Ensuite, pour rendre user_id obligatoire pour les nouveaux profils:
-- ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;
