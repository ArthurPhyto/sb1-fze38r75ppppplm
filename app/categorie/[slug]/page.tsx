import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MovieGrid from '@/components/MovieGrid';
import Pagination from '@/components/Pagination';
import { Movie } from '@/types/movie';

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

async function getCategoryMovies(category: string, page: number = 1) {
  const limit = 30;
  const offset = (page - 1) * limit;

  const { data: movies, count } = await supabase
    .from('movies')
    .select('*', { count: 'exact' })
    .contains('genres', [category])
    .order('release_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (!movies?.length) return null;

  return {
    movies: movies as Movie[],
    totalPages: Math.ceil((count || 0) / limit)
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.slug);
  const result = await getCategoryMovies(category, 1);
  
  if (!result) notFound();

  return {
    title: `Films ${category} en Streaming - StreamFlix`,
    description: `Regarder les meilleurs films ${category} en streaming gratuit sur StreamFlix`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/categorie/${params.slug}`
    }
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = decodeURIComponent(params.slug);
  const currentPage = Number(searchParams.page) || 1;
  const result = await getCategoryMovies(category, currentPage);

  if (!result) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Films {category}</h1>
      <MovieGrid movies={result.movies} />
      <Pagination
        currentPage={currentPage}
        totalPages={result.totalPages}
        baseUrl={`/categorie/${params.slug}`}
      />
    </div>
  );
}