export default function Footer() {
  const version = import.meta.env.VITE_APP_VERSION ?? "0.0.0"

  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur px-4 py-3">
      <div className="mx-auto max-w-md text-center text-xs text-muted-foreground">v{version}</div>
    </footer>
  )
}
