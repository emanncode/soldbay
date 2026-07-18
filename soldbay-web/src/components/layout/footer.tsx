export function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-border text-sm text-text-secondary flex justify-between">
      <span>© {new Date().getFullYear()} Soldbay</span>
      <div className="flex gap-4">
        <a href="#" className="hover:text-text-primary transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-text-primary transition-colors">
          Terms
        </a>
      </div>
    </footer>
  );
}
