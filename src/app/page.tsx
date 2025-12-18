import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h1 className="text-2xl font-bold">Welcome to Sportify</h1>
      <p className="mt-2 text-gray-600">
        Your all-sports fantasy hub. Starting with NFL.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/leagues/new"
          className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90"
        >
          Create an NFL League
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-md border hover:bg-gray-50"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
