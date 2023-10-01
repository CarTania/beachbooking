import React from 'react'
import ReactDOM from 'react-dom/client'

import { ProtectedRoutes, PublicRoutes } from './components/helpers/Routes.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout.tsx'

/**
 * @namespace BrowserRouter
 * @description
 * Il browser router che gestisce le routes dell'applicazione.\
 * Le routes sono divise in due categorie:
 * - {@link Routes.PublicRoutes}: routes accessibili a tutti gli utenti
 * - {@link Routes.ProtectedRoutes}: routes accessibili solo agli utenti autenticati
 * @example
 * <RouterProvider router={browserRouter} />
 * @see https://reactrouter.com/en/routers/create-browser-router
 */
const browserRouter = createBrowserRouter([
  {
    element: <Layout isRouteProtected={true} />,
    children: ProtectedRoutes
  },
  {
    element: <Layout isRouteProtected={false} />,
    children: PublicRoutes
  }
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={browserRouter} />
  </React.StrictMode>
)