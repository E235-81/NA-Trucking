import { useParams } from 'react-router-dom';

export function SlugPage() {
  const { slug } = useParams();

  return (
    <div className="container mx-auto px-6 py-24 text-white">
      <h1 className="text-4xl font-bold">Slug: {slug}</h1>
      <p className="mt-4">This is the page for the slug: {slug}.</p>
      <p className="mt-4">In a real application, this page would fetch and display data based on this slug.</p>
    </div>
  );
}
