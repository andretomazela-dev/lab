
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { labPosts } from "@/content/lab-posts";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function LabPost({ post, related }) {
  if (!post) {
    return (
      <div>
        <Header />
        <main className="container py-16">
          <h1 className="text-2xl font-bold">Artigo não encontrado</h1>
          <p className="mt-4">
            Voltar para o <Link className="underline text-orange-600" href="/lab">LAB</Link>.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="bg-white">
        <section className="container pt-10 md:pt-14">
          <Link href="/lab" className="text-sm text-gray-600 hover:text-gray-900">← Voltar para o LAB</Link>
          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">{post.title}</h1>
          <time className="mt-3 block text-sm text-gray-500">{formatDate(post.date)}</time>

          {(post.tags || []).length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tg) => (
                <Link key={tg} href={`/lab?tag=${encodeURIComponent(tg)}`} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                  #{tg}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl overflow-hidden shadow-card relative h-[240px] sm:h-[320px] md:h-[420px]">
            <Image src={post.cover} alt={post.title} fill className="object-cover" sizes="100vw" />
          </div>
        </section>

        <section className="container py-10 md:py-14">
          <article className="prose prose-zinc max-w-none prose-a:text-orange-600" dangerouslySetInnerHTML={{ __html: post.content }} />
        </section>

        {related.length > 0 && (
          <section className="container pb-14 md:pb-20">
            <h3 className="text-xl font-semibold mb-4">Artigos relacionados</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <article key={p.slug} className="rounded-2xl overflow-hidden shadow-card bg-white ring-1 ring-black/5 hover:shadow-lg transition">
                  <Link href={`/lab/${p.slug}`} className="block">
                    <div className="relative w-full h-40">
                      <Image src={p.cover} alt={p.title} fill className="object-cover" sizes="(min-width:1024px) 33vw, 100vw" />
                    </div>
                    <div className="p-5">
                      <h4 className="font-semibold leading-snug">{p.title}</h4>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.excerpt}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
  return { paths: labPosts.map(p => ({ params: { slug: p.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const post = labPosts.find(p => p.slug === params.slug) || null;
  const related = post
    ? labPosts.filter(p => p.slug !== post.slug && (p.tags || []).some(t => (post.tags || []).includes(t))).slice(0,3)
    : [];
  return { props: { post, related } };
}
