import { Link } from "@tanstack/react-router"

export default function Header() {
  return (
    <header className="p-4 flex items-center justify-between bg-background border-b border-border">
      <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <span className="text-lg font-bold">Prahra</span>
      </Link>
    </header>
  )
}
