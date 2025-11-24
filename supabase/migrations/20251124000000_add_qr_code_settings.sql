-- Migration to add QR Code settings to profiles table
-- This allows users to save their QR code preferences

-- Add qr_code_size column to store the preferred QR code size
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS qr_code_size INTEGER DEFAULT 512;

-- Add qr_code_custom_url column to store a custom URL for the QR code
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS qr_code_custom_url TEXT;

-- Add comment to explain the columns
COMMENT ON COLUMN public.profiles.qr_code_size IS 'Preferred QR code size in pixels (128-1024)';
COMMENT ON COLUMN public.profiles.qr_code_custom_url IS 'Custom URL to encode in the QR code. If null, uses the default profile URL';
