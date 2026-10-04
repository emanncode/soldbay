import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PageShell } from "@/components/page-shell";
import { SiteNav } from "@/components/site-nav";

export const dynamic = "force-dynamic";

export default async function AdminWaitlistPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    notFound(); 
  }

  const waitlist = await prisma.waitlistSignup.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const buyers = waitlist.filter(w => w.role === "BUYER");
  const sellers = waitlist.filter(w => w.role === "SELLER");

  return (
    <PageShell>
      <SiteNav />
      <main className="container mx-auto px-4 py-12 max-w-6xl min-h-screen">
        <h1 className="text-3xl font-bold mb-2">Waitlist Dashboard</h1>
        <p className="text-gray-500 mb-10">Overview of all users who have joined the Soldbay waitlist.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buyers Column */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h2 className="text-2xl font-semibold">Buyers</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {buyers.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {buyers.length === 0 && (
                <p className="text-gray-400 italic">No buyers on the waitlist yet.</p>
              )}
              {buyers.map(b => (
                <div key={b.id} className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-lg text-gray-900">{b.name}</p>
                    <span className="text-xs text-gray-500">{b.createdAt.toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3"><a href={`mailto:${b.email}`} className="hover:underline">{b.email}</a></p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                    <p><strong>University:</strong> {b.university}</p>
                    {b.level && <p><strong>Level:</strong> {b.level}</p>}
                    {b.categories && b.categories.length > 0 && (
                      <p><strong>Categories:</strong> {b.categories.join(", ")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sellers Column */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h2 className="text-2xl font-semibold">Sellers</h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {sellers.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {sellers.length === 0 && (
                <p className="text-gray-400 italic">No sellers on the waitlist yet.</p>
              )}
              {sellers.map(s => (
                <div key={s.id} className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-lg text-gray-900">{s.name}</p>
                    <span className="text-xs text-gray-500">{s.createdAt.toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3"><a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a></p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                    <p><strong>University:</strong> {s.university}</p>
                    {s.sellsWhat && <p><strong>Sells:</strong> {s.sellsWhat}</p>}
                    {s.frequency && <p><strong>Frequency:</strong> {s.frequency}</p>}
                    {s.categories && s.categories.length > 0 && (
                      <p><strong>Categories:</strong> {s.categories.join(", ")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
