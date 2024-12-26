import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MovieGrid from '@/components/MovieGrid';
import Pagination from '@/components/Pagination';
import { getMoviesByCategory } from '@/lib/movies';

interface Props {
  params: { name: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.name);
  
  return {
    title: `Films ${categoryName} - StreamFlix`,
    description: `Découvrez notre sélection de films ${categoryName} en streaming`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${params.name}`
    }
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const currentPage = Number(searchParams.page) || 1;
  const { movies, totalPages } = await getMoviesByCategory(params.name, currentPage);

  if (!movies.length) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Films {params.name}</h1>
      <MovieGrid movies={movies} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={`/category/${params.name}`}
      />
    </div>
  );
}