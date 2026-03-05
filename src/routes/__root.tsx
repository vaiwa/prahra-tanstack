import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { dark } from "@clerk/themes"
import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, HeadContent, Scripts, useRouterState } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { useOnlineStatus } from "../hooks/useOnlineStatus"
import { useServiceWorkerUpdate } from "../hooks/useServiceWorkerUpdate"
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"
import appCss from "../styles.css?url"

interface MyRouterContext {
  queryClient: QueryClient
}

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        title: "Prahra",
      },
      {
        name: "theme-color",
        content: "#2b1d0e",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "apple-touch-icon",
        href: "/logo192.png",
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isGameRoute = pathname.startsWith("/game/")
  const { updateAvailable, refresh } = useServiceWorkerUpdate()
  const isOnline = useOnlineStatus()

  const appContent = (
    <>
      {!isGameRoute && <Header />}
      {isGameRoute && (
        <div className="fixed top-3 right-4 z-50 flex h-9 items-center justify-end">
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="h-9 rounded-full border border-border bg-card/90 backdrop-blur px-3 text-sm text-foreground hover:bg-muted/50 transition"
              >
                Prihlasit
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      )}
      {children}
      {!isGameRoute && <Footer />}
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
      <Scripts />
      {!isOnline && (
        <div className="fixed top-3 inset-x-4 z-50 flex justify-center">
          <div className="max-w-md w-full rounded-xl border border-border bg-card/95 backdrop-blur px-4 py-2 shadow-lg text-sm text-foreground text-center">
            Jsi offline. Hra bezi v offline rezimu.
          </div>
        </div>
      )}
      {updateAvailable && (
        <div className="fixed bottom-4 inset-x-4 z-50 flex justify-center">
          <div className="max-w-md w-full rounded-xl border border-border bg-card/95 backdrop-blur px-4 py-3 shadow-lg flex items-center justify-between gap-3">
            <span className="text-sm text-foreground">Je dostupna nova verze aplikace.</span>
            <button
              type="button"
              onClick={refresh}
              className="px-3 py-1.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              Aktualizovat
            </button>
          </div>
        </div>
      )}
    </>
  )

  return (
    <html lang="cs" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {clerkPublishableKey ? (
          <ClerkProvider
            publishableKey={clerkPublishableKey}
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: "#2b1d0e",
                colorBackground: "#1a140b",
                colorInputBackground: "#1f170c",
                colorText: "#f5e9d0",
                colorTextSecondary: "#cbb891",
              },
            }}
          >
            {appContent}
          </ClerkProvider>
        ) : (
          appContent
        )}
      </body>
    </html>
  )
}
