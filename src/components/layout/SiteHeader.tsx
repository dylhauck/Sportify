import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Sportify
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm px-3 py-2 rounded-md hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/leagues/new"
            className="text-sm px-3 py-2 rounded-md bg-black text-white hover:opacity-90"
          >
            Create League
          </Link>
        </div>
      </div>
    </header>
  );
}