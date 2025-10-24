
import Link from "next/link";
export default function Header(){
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-lg">TOMAZELA</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/lab" className="hover:underline">LAB</Link>
          <Link href="/manifesto" className="hover:underline">Manifesto</Link>
        </nav>
      </div>
    </header>
  );
}
