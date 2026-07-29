-- Run this in your Supabase SQL Editor

-- 1. Create the watches table
CREATE TABLE public.watches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    brand TEXT NOT NULL,
    model_name TEXT NOT NULL,
    reference_number TEXT NOT NULL,
    era_label TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    collection TEXT NOT NULL,
    collection_title TEXT NOT NULL,
    condition_grade TEXT NOT NULL,
    condition_label TEXT NOT NULL,
    condition_notes TEXT,
    image TEXT NOT NULL,
    gallery_images TEXT[] NOT NULL DEFAULT '{}',
    badge TEXT,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC NOT NULL DEFAULT 5.0,
    reviews_count INTEGER NOT NULL DEFAULT 1,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    authenticity_guarantee BOOLEAN NOT NULL DEFAULT true,
    service_history TEXT,
    description TEXT
);

-- 2. Create the product-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage Policies for public read access
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );

-- 4. Set up Storage Policies for authenticated/service role inserts
CREATE POLICY "Service Role Insert" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'product-images' );
