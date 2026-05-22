import Link from 'next/link';
import { categories } from '../../data';

export async function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.id,
  }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.id === params.slug);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-slate-900 px-4 py-10 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/switzerland" className="text-sm text-red-700 hover:text-red-600">
          ← Zurück zu Schweiz
        </Link>

        <div className="mt-6 rounded-[28px] border p-6 md:p-8 bg-white border-slate-200 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
            {category.name}
          </h1>
          <p className="text-slate-600 mb-6">{category.description}</p>

          {category.links.length > 0 ? (
            <div className="space-y-3">
              {category.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 hover:bg-slate-100 hover:border-red-300 transition-colors"
                >
                  {link.text}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">Keine Links verfügbar</p>
          )}
        </div>
      </div>
    </main>
  );
}
