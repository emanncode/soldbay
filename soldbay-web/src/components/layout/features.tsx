const studentFeatures = [
  "Browse listings from verified students on your campus",
  "Save items to your wishlist and get notified on price drops",
  "Chat with sellers directly, no middleman",
];

const vendorFeatures = [
  "List products in under a minute, right from your phone",
  "Track orders and manage inventory in one dashboard",
  "Get paid securely, withdraw straight to your bank",
];

export function Features() {
  return (
    <section id="features" className="px-6 py-20 bg-neutral-50">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12">
        <div>
          <h3 className="text-lg font-semibold mb-4">For students</h3>
          <ul className="space-y-3">
            {studentFeatures.map((f) => (
              <li key={f} className="text-sm text-neutral-600 flex gap-2">
                <span>•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">For vendors</h3>
          <ul className="space-y-3">
            {vendorFeatures.map((f) => (
              <li key={f} className="text-sm text-neutral-600 flex gap-2">
                <span>•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
