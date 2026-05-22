import Link from 'next/link';
import { cities } from '../../data';

export async function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.id,
  }));
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = cities.find((c) => c.id === params.slug);

  if (!city) {
    return <div>City not found</div>;
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-slate-900 px-4 py-10 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/switzerland/cities" className="text-sm text-red-700 hover:text-red-600">
          ← Zurück zu Städten
        </Link>

        <div className="mt-6 rounded-[28px] border p-6 md:p-8 bg-white border-slate-200 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
            {city.name}
          </h1>
          <p className="text-slate-600 mb-6">{city.description}</p>

          {city.highlights.length > 0 && (
            <div className="space-y-3">
              {city.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700"
                >
                  {highlight}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
