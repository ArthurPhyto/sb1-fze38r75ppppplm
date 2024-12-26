import { supabase } from './supabase';

interface MovieStats {
  title: string;
  views: number;
}

interface CategoryStats {
  name: string;
  views: number;
}

interface VisitorStats {
  unique_visitors: number;
  total_views: number;
  avg_views_per_visitor: number;
}

export async function getMovieStats(days: number): Promise<MovieStats[]> {
  const { data, error } = await supabase
    .rpc('get_movie_stats', { days_ago: days });

  if (error) {
    console.error('Error fetching movie stats:', error);
    return [];
  }

  return (data as MovieStats[]) || [];
}

export async function getCategoryStats(days: number): Promise<CategoryStats[]> {
  const { data, error } = await supabase
    .rpc('get_category_stats', { days_ago: days });

  if (error) {
    console.error('Error fetching category stats:', error);
    return [];
  }

  return (data as CategoryStats[]) || [];
}

export async function getVisitorStats(days: number): Promise<VisitorStats | null> {
  const { data, error } = await supabase
    .rpc('get_visitor_stats', { days_ago: days })
    .single();

  if (error) {
    console.error('Error fetching visitor stats:', error);
    return null;
  }

  return data as VisitorStats;
}

export async function trackPageView(url: string, ip: string, userAgent?: string) {
  try {
    const { data, error } = await supabase
      .from('visits')
      .insert({
        ip_address: ip,
        user_agent: userAgent,
        page_url: url
      })
      .select()
      .single();

    if (error) {
      console.error('Error tracking page view:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error tracking page view:', error);
    return null;
  }
}