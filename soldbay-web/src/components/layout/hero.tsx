export function Hero() {
  return (
    <section className="flex flex-col items-center text-center px-6 py-24">
      <h1 className="text-4xl font-semibold max-w-xl">
        Buy and sell on campus, without the hassle
      </h1>
      <p className="mt-4 text-neutral-500 max-w-md">
        The marketplace built for university students — textbooks, gadgets,
        food, and services, all from people on your campus.
      </p>
      <div className="mt-8 flex gap-3">
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
