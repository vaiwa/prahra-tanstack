import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { Link } from "@tanstack/react-router"

export default function Header() {
  return (
    <header className="p-4 flex items-center justify-between bg-background border-b border-border">
      <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <span className="text-lg font-bold">Prahra</span>
      </Link>
      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton mode="modal">
            <button
              type="button"
              className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted/50 transition"
            >
              Prihlasit
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  )
}
