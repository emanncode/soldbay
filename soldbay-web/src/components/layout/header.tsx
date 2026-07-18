export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4">
      <span className="font-semibold text-lg">Soldbay</span>
      <nav className="flex items-center gap-6 text-sm">
        <a
          href="#how-it-works"
          className="hover:text-neutral-500 transition-colors"
        >
          How it works
        </a>
        <a
          href="#features"
          className="hover:text-neutral-500 transition-colors"
        >
          Features
        </a>
      </nav>
    </header>
  );
}
