import { Link } from "@tanstack/react-router"

export function NotFound() {
  return (
    <div className="min-h-80 bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-5xl">🗺️</p>
        <h1 className="text-2xl font-bold text-foreground">Stránka nenalezena</h1>
        <p className="text-muted-foreground">Tato stránka neexistuje. Možná ses ztratil?</p>
        <Link
          to="/"
          className="inline-block rounded-md bg-primary text-primary-foreground py-2 px-4 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  )
}
