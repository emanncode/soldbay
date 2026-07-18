export function Cta() {
  return (
    <section className="px-6 py-20 text-center">
      <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
      <p className="text-neutral-500 mb-8 max-w-md mx-auto">
        Join students already buying and selling on Soldbay.
      </p>
      <div className="flex justify-center gap-3">
        <button className="rounded-md bg-black text-white px-5 py-2.5 text-sm font-medium">
          Start shopping
        </button>
        <button className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium">
          Start selling
        </button>
      </div>
    </section>
  );
}
