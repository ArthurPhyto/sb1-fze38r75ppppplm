import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import MovieGrid from '@/components/MovieGrid';
import CategoryList from '@/components/CategoryList';
import Pagination from '@/components/Pagination';
import { Movie, Category } from '@/types/movie';

interface Props {
  searchParams: { page?: string };
}

export const metadata: Metadata = {
  title: 'StreamFlix - Votre plateforme de streaming',
  description: 'Découvrez les derniers films en streaming sur StreamFlix',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL
  }
};

async function getLatestMovies(page: number = 1): Promise<{ movies: Movie[], totalPages: number }> {
  const limit = 30;
  const offset = (page - 1) * limit;

  const { data: movies, count } = await supabase
    .from('movies')
    .select('*', { count: 'exact' })
    .order('release_date', { ascending: false })
    .range(offset, offset + limit - 1);

  return {
    movies: movies as Movie[] || [],
    totalPages: Math.ceil((count || 0) / limit)
  };
}

async function getCategories(): Promise<Category[]> {
  const { data: categories } = await supabase
    .from('categorie')
    .select('*');
  return categories as Category[] || [];
}

export default async function HomePage({ searchParams }: Props) {
  const currentPage = Number(searchParams.page) || 1;
  const [{ movies, totalPages }, categories] = await Promise.all([
    getLatestMovies(currentPage),
    getCategories(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <section>
        <h1 className="text-4xl font-bold mb-8">Les dernières sorties</h1>
        <MovieGrid movies={movies} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/"
        />
      </section>

      <section className="mt-20">
        <h2 className="text-3xl font-bold mb-8">Catégories populaires</h2>
        <CategoryList categories={categories} />
      </section>
    </main>
  );
}