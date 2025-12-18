import Link from "next/link";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leagues/new", label: "Create League" },
];

export default function SideNav() {
  return (
    <aside className="hidden md:block border-r bg-white">
      <div className="p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Football (NFL)
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-md text-sm hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}