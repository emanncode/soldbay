const steps = [
  {
    title: "Browse or list",
    description:
      "Search what your campus is selling, or post your own item in under a minute.",
  },
  {
    title: "Chat and agree",
    description:
      "Message the seller directly, ask questions, agree on pickup or delivery.",
  },
  {
    title: "Pay securely",
    description:
      "Pay in-app — funds only release to the seller after you confirm delivery.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <h2 className="text-2xl font-semibold text-center mb-12">How it works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <div key={step.title} className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
              {i + 1}
            </div>
            <h3 className="font-medium mb-2">{step.title}</h3>
            <p className="text-sm text-neutral-500">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
