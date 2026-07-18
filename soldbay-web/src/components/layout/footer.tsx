export function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-neutral-200 text-sm text-neutral-500 flex justify-between">
      <span>© {new Date().getFullYear()} Soldbay</span>
      <div className="flex gap-4">
        <a href="#" className="hover:text-neutral-700">
          Privacy
        </a>
        <a href="#" className="hover:text-neutral-700">
          Terms
        </a>
      </div>
    </footer>
  );
}
