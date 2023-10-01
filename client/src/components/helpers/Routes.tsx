import Bookings from '../../pages/Bookings/Bookings'
import CreateBooking from '../../pages/Bookings/CreateBooking'
import LandingPage from '../../pages/LandingPage/LandingPage'
import { RouteObject } from 'react-router-dom'
import ErrorPage from '../../pages/Error'

/**
 * @description
 * Le routes accessibili solo agli utenti autenticati
 * @see {@link RouteObject}
 * @see https://reactrouter.com/en/route/route
 * @namespace Routes.ProtectedRoutes
 */
export const ProtectedRoutes: RouteObject[] = [
    {
        path: '/visualizza-prenotazioni',
        element: <Bookings />
    },
    {
        path: '/crea-prenotazione',
        element: <CreateBooking />
    }
]

/**
 * @description
 * Le routes accessibili a tutti gli utenti. \
 * Contiene la {@link ErrorPage | route 404 (Not Found)} e la route per la {@link LandingPage}.
 * @see {@link RouteObject}
 * @see https://reactrouter.com/en/route/route
 * @namespace Routes.PublicRoutes
 */
export const PublicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '*',
        element: <ErrorPage errorCode={404} />
    }
]

/**
 * @description
 * L'unione delle routes pubbliche e protette
 * @see {@link RouteObject}
 * @see https://reactrouter.com/en/route/route
 * @namespace Routes
 */
export const Routes: RouteObject[] = [
    ...ProtectedRoutes,
    ...PublicRoutes
]