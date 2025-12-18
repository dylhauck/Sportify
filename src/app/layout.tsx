import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SideNav from "@/components/layout/SideNav";

export const metadata: Metadata = {
  title: "Sportify",
  description: "Fantasy sports for all USA pro leagues",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <SiteHeader />

        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid md:grid-cols-[240px_1fr] gap-6">
            <SideNav />
            <main className="min-h-[70vh]">{children}</main>
          </div>
        </div>

        <footer className="border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-500">
            © {new Date().getFullYear()} Sportify
          </div>
        </footer>
      </body>
    </html>
  );
}
