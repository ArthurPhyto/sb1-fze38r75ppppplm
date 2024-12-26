/*
  # Ajout des fonctions pour les statistiques

  1. Nouvelles Fonctions
    - get_movie_stats : Statistiques des films les plus vus
    - get_category_stats : Statistiques des catégories les plus vues
    - get_visitor_stats : Statistiques générales des visiteurs
*/

-- Fonction pour les stats des films
CREATE OR REPLACE FUNCTION get_movie_stats(days_ago integer)
RETURNS TABLE (
  title text,
  views bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.title,
    COUNT(mv.id) as views
  FROM movies m
  LEFT JOIN movie_views mv ON m.id = mv.movie_id
  WHERE mv.created_at >= NOW() - (days_ago || ' days')::interval
  GROUP BY m.id, m.title
  ORDER BY views DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour les stats des catégories
CREATE OR REPLACE FUNCTION get_category_stats(days_ago integer)
RETURNS TABLE (
  name text,
  views bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.name,
    COUNT(cv.id) as views
  FROM categorie c
  LEFT JOIN category_views cv ON c.id = cv.category_id
  WHERE cv.created_at >= NOW() - (days_ago || ' days')::interval
  GROUP BY c.id, c.name
  ORDER BY views DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour les stats des visiteurs
CREATE OR REPLACE FUNCTION get_visitor_stats(days_ago integer)
RETURNS TABLE (
  unique_visitors bigint,
  total_views bigint,
  avg_views_per_visitor numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT ip_address) as unique_visitors,
    COUNT(*) as total_views,
    ROUND(COUNT(*)::numeric / COUNT(DISTINCT ip_address)::numeric, 2) as avg_views_per_visitor
  FROM visits
  WHERE created_at >= NOW() - (days_ago || ' days')::interval;
END;
$$ LANGUAGE plpgsql;