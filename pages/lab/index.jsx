
import { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { labPosts } from "@/content/lab-posts";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const PAGE_SIZE = 9;

export default function LabIndex({ tag = "", q = "", page = 1 }) {
  const [qLocal, setQLocal] = useState(q);

  useEffect(() => setQLocal(q), [q]);

  const ordered = useMemo(() => [...labPosts].sort((a, b) => (a.date < b.date ? 1 : -1)), []);
  const allTags = useMemo(() => {
    const s = new Set();
    ordered.forEach(p => p.tags?.forEach(t => s.add(t)));
    return Array.from(s).sort((a,b)=>a.localeCompare(b));
  }, [ordered]);

  const filtered = useMemo(() => {
    let arr = ordered;
    if (tag) {
      const t = tag.toLowerCase();
      arr = arr.filter(p => (p.tags || []).map(x => x.toLowerCase()).includes(t));
    }
    if (q) {
      const qq = q.toLowerCase();
      arr = arr.filter(p =>
        p.title.toLowerCase().includes(qq) ||
        p.excerpt.toLowerCase().includes(qq) ||
        p.content.toLowerCase().includes(qq)
      );
    }
    return arr;
  }, [ordered, tag, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, parseInt(page, 10) || 1), totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const setParam = (k, v) => {
    const url = new URL(window.location.href);
    if (!v) url.searchParams.delete(k); else url.searchParams.set(k, v);
    if (k === "tag" || k === "q") url.searchParams.delete("page");
    window.location.href = `/lab${url.search ? `?${url.searchParams.toString()}` : ""}`;
  };

  const goToPage = (p) => setParam("page", String(Math.max(1, Math.min(totalPages, p))));

  const pagesToShow = () => {
    const max = 5, list = [];
    let st = Math.max(1, current - Math.floor(max/2));
    let en = Math.min(totalPages, st + max - 1);
    st = Math.max(1, en - max + 1);
    for (let i=st;i<=en;i++) list.push(i);
    return list;
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (qLocal !== q) setParam("q", qLocal.trim() ? qLocal : "");
    }, 300);
    return () => clearTimeout(t);
  }, [qLocal]); // eslint-disable-line

  return (
    <div>
      <Header />

      <main className="bg-white">
        <section className="container py-14 md:py-16">
          <p className="uppercase tracking-wide text-sm text-orange-600 font-semibold">LAB</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold leading-tight">
            Ideias, aprendizados e bastidores.
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-prose">
            Um espaço para testar, documentar e compartilhar o que funciona em comunicação,
            reputação e conteúdo.
          </p>
        </section>

        <section className="container -mt-6 pb-4">
          <div className="grid md:grid-cols-12 gap-3 md:items-center">
            <div className="md:col-span-6">
              <label className="block text-sm text-gray-700 mb-1" htmlFor="q">Buscar no LAB</label>
              <input
                id="q"
                value={qLocal}
                onChange={(e)=>setQLocal(e.target.value)}
                placeholder="Digite palavra-chave (título, resumo ou conteúdo)"
                className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500"
              />
              {q && (
                <button onClick={()=>setParam("q","")} className="mt-2 text-xs underline text-gray-600 hover:text-gray-900">
                  Limpar busca
                </button>
              )}
            </div>
            <div className="md:col-span-6">
              <div className="flex flex-wrap gap-2 md:justify-end pt-2 md:pt-0">
                {allTags.map((t) => {
                  const active = t.toLowerCase() === (tag || "").toLowerCase();
                  return (
                    <button
                      key={t}
                      onClick={() => setParam("tag", active ? "" : t)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${active ? "bg-[#FF4D00] text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                    >
                      #{t}
                    </button>
                  );
                })}
                {tag && (
                  <button onClick={()=>setParam("tag","")} className="text-xs underline text-gray-600 hover:text-gray-900">
                    Limpar filtro
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="container pb-10 md:pb-14">
          {pageItems.length === 0 ? (
            <p className="text-gray-600">Nenhum artigo encontrado.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((post) => (
                <article key={post.slug} className="rounded-2xl overflow-hidden shadow-card bg-white ring-1 ring-black/5 hover:shadow-lg transition">
                  <Link href={`/lab/${post.slug}`} className="block">
                    <div className="relative w-full h-48">
                      <Image src={post.cover} alt={post.title} fill className="object-cover" sizes="(min-width:1024px) 33vw, 100vw" />
                    </div>
                    <div className="p-5">
                      <time className="text-xs uppercase tracking-wide text-gray-500">{formatDate(post.date)}</time>
                      <h2 className="mt-2 text-lg font-semibold leading-snug">{post.title}</h2>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                      {(post.tags || []).length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {post.tags.map((tg) => (
                            <button
                              key={tg}
                              onClick={(e)=>{ e.preventDefault(); setParam("tag", tg); }}
                              className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              #{tg}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      <span className="mt-4 inline-block text-sm font-semibold text-orange-600">Ler artigo →</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="container pb-14 md:pb-20">
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button onClick={()=>goToPage(current-1)} disabled={current===1} className="px-3 py-2 rounded-lg text-sm border border-gray-300 disabled:opacity-40">← Anterior</button>
              {Array.from(new Set(pagesToShow())).map(n => (
                <button
                  key={n}
                  onClick={()=>goToPage(n)}
                  className={`px-3 py-2 rounded-lg text-sm border ${n===current ? "bg-[#FF4D00] text-white border-[#FF4D00]" : "border-gray-300 hover:bg-gray-100"}`}
                >
                  {n}
                </button>
              ))}
              <button onClick={()=>goToPage(current+1)} disabled={current===totalPages} className="px-3 py-2 rounded-lg text-sm border border-gray-300 disabled:opacity-40">Próxima →</button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

LabIndex.getInitialProps = ({ query }) => {
  return { tag: query.tag || "", q: query.q || "", page: query.page || "1" };
};
