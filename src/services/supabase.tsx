import { createClient } from '@supabase/supabase-js'

// Remplace ces valeurs par tes credentials Supabase dans un fichier .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// === TABLE SQL à créer dans Supabase ===
/*
CREATE TABLE reservations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  university text NOT NULL,
  field text NOT NULL,
  level text NOT NULL,
  thesis_title text NOT NULL,
  defense_date date NOT NULL,
  drive_file_url text,
  status text DEFAULT 'pending'
);
*/