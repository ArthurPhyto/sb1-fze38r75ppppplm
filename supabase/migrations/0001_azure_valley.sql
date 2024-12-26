/*
  # Ajout des tables pour le tracking des visites

  1. Nouvelles Tables
    - `visits`
      - `id` (uuid, primary key)
      - `ip_address` (text)
      - `user_agent` (text)
      - `page_url` (text)
      - `created_at` (timestamp)
    - `movie_views`
      - `id` (uuid, primary key)
      - `movie_id` (integer, foreign key)
      - `visit_id` (uuid, foreign key)
      - `created_at` (timestamp)
    - `category_views`
      - `id` (uuid, primary key)
      - `category_id` (integer, foreign key)
      - `visit_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for insert and select
*/

-- Table des visites
CREATE TABLE visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  user_agent text,
  page_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Table des vues de films
CREATE TABLE movie_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id integer REFERENCES movies(id) ON DELETE CASCADE,
  visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Table des vues de catégories
CREATE TABLE category_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id integer REFERENCES categorie(id) ON DELETE CASCADE,
  visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Activation RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_views ENABLE ROW LEVEL SECURITY;

-- Policies pour les visites
CREATE POLICY "Allow anonymous insert visits"
  ON visits FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select visits"
  ON visits FOR SELECT TO authenticated
  USING (true);

-- Policies pour les vues de films
CREATE POLICY "Allow anonymous insert movie_views"
  ON movie_views FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select movie_views"
  ON movie_views FOR SELECT TO authenticated
  USING (true);

-- Policies pour les vues de catégories
CREATE POLICY "Allow anonymous insert category_views"
  ON category_views FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select category_views"
  ON category_views FOR SELECT TO authenticated
  USING (true);