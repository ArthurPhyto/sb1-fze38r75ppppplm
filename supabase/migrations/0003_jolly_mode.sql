-- Trigger pour les vues de films
CREATE OR REPLACE FUNCTION track_movie_view()
RETURNS trigger AS $$
BEGIN
  IF NEW.page_url LIKE '/film/%' THEN
    INSERT INTO movie_views (movie_id, visit_id)
    SELECT 
      CAST(split_part(split_part(NEW.page_url, '/', 3), '-', 1) AS integer),
      NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_movie_view_trigger
AFTER INSERT ON visits
FOR EACH ROW
EXECUTE FUNCTION track_movie_view();

-- Trigger pour les vues de catégories
CREATE OR REPLACE FUNCTION track_category_view()
RETURNS trigger AS $$
BEGIN
  IF NEW.page_url LIKE '/categorie/%' OR NEW.page_url LIKE '/category/%' THEN
    INSERT INTO category_views (category_id, visit_id)
    SELECT 
      c.id,
      NEW.id
    FROM categorie c
    WHERE c.name = split_part(NEW.page_url, '/', 3);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_category_view_trigger
AFTER INSERT ON visits
FOR EACH ROW
EXECUTE FUNCTION track_category_view();