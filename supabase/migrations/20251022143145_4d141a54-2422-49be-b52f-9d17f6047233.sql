-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create company_info table
CREATE TABLE public.company_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'Isaraya',
    slogan TEXT NOT NULL DEFAULT 'Vivez la modernité, shoppez chez I-Saraya',
    phone TEXT NOT NULL DEFAULT '77 415 65 65',
    email TEXT NOT NULL DEFAULT 'info@saraya.tech',
    address TEXT NOT NULL DEFAULT 'Dakar, Liberté 4',
    google_maps_url TEXT,
    website TEXT NOT NULL DEFAULT 'www.isaraya.tech',
    description TEXT NOT NULL DEFAULT 'Isaraya est votre destination moderne pour le shopping au Sénégal.',
    facebook TEXT DEFAULT '@isaraya',
    instagram TEXT DEFAULT '@isaraya',
    twitter TEXT DEFAULT '@isaraya',
    linkedin TEXT DEFAULT '@isaraya',
    whatsapp TEXT DEFAULT '77 415 65 65',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view company info
CREATE POLICY "Anyone can view company info"
ON public.company_info
FOR SELECT
TO public
USING (true);

-- Policy: Only admins can update company info
CREATE POLICY "Admins can update company info"
ON public.company_info
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default company info
INSERT INTO public.company_info (id, company_name, slogan, phone, email, address, website, description, google_maps_url)
VALUES (
    gen_random_uuid(),
    'Isaraya',
    'Vivez la modernité, shoppez chez I-Saraya',
    '77 415 65 65',
    'info@saraya.tech',
    'Dakar, Liberté 4',
    'www.isaraya.tech',
    'Isaraya est votre destination moderne pour le shopping au Sénégal. Nous offrons une gamme complète de produits technologiques et services innovants.',
    'https://goo.gl/maps/example'
);

-- Create services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active services
CREATE POLICY "Anyone can view active services"
ON public.services
FOR SELECT
TO public
USING (is_active = true);

-- Policy: Only admins can manage services
CREATE POLICY "Admins can insert services"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services"
ON public.services
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services"
ON public.services
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default services
INSERT INTO public.services (title, description, icon, display_order) VALUES
('Vente de téléphones', 'Smartphones dernière génération', 'Smartphone', 1),
('Accessoires tech', 'Coques, écouteurs, chargeurs...', 'Headphones', 2),
('Réparations', 'Service rapide et professionnel', 'Wrench', 3);

-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active products
CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
TO public
USING (is_active = true);

-- Policy: Only admins can manage products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default products
INSERT INTO public.products (title, description, price, is_featured, display_order) VALUES
('iPhone 15 Pro', 'Dernier modèle Apple', '850 000 FCFA', true, 1),
('Samsung Galaxy S24', 'Flagship Samsung', '750 000 FCFA', true, 2),
('AirPods Pro', 'Écouteurs sans fil premium', '180 000 FCFA', false, 3);

-- Create promotions table
CREATE TABLE public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    discount_text TEXT,
    is_active BOOLEAN DEFAULT true,
    valid_until TIMESTAMP WITH TIME ZONE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active promotions
CREATE POLICY "Anyone can view active promotions"
ON public.promotions
FOR SELECT
TO public
USING (is_active = true);

-- Policy: Only admins can manage promotions
CREATE POLICY "Admins can insert promotions"
ON public.promotions
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update promotions"
ON public.promotions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete promotions"
ON public.promotions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default promotions
INSERT INTO public.promotions (title, description, discount_text, display_order) VALUES
('Promo Rentrée', 'Réductions sur tous les smartphones', '-15%', 1),
('Pack Étudiant', 'Téléphone + écouteurs à prix réduit', 'Offre spéciale', 2);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for all tables
CREATE TRIGGER update_company_info_updated_at
    BEFORE UPDATE ON public.company_info
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
    BEFORE UPDATE ON public.promotions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();