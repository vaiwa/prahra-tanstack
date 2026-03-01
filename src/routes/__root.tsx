import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import Header from "../components/Header"
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"
import { useServiceWorkerUpdate } from "../hooks/useServiceWorkerUpdate"
import appCss from "../styles.css?url"

interface MyRouterContext {
  queryClient: QueryClient
}

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

  return (
    <html lang="cs" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {!isGameRoute && <Header />}
        {children}
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
        {updateAvailable && (
          <div className="fixed bottom-4 inset-x-4 z-50 flex justify-center">
            <div className="max-w-md w-full rounded-xl border border-border bg-card/95 backdrop-blur px-4 py-3 shadow-lg flex items-center justify-between gap-3">
              <span className="text-sm text-foreground">
                Je dostupna nova verze aplikace.
              </span>
              <button
                onClick={refresh}
                className="px-3 py-1.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                Aktualizovat
              </button>
            </div>
          </div>
        )}
      </body>
    </html>
  )
}
