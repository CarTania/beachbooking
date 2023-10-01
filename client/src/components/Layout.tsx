import { Outlet } from 'react-router-dom'
import { AuthProvider } from './utils/AuthProvider'
import CustomThemeProvider from './utils/CustomThemeProvider'
import { ProtectedRoute } from './utils/ProtectedRoute'
import { CustomAppBar } from './CustomAppBar'

/**
 * @description
 * Layout generale dell'applicazione.\
 * Il componente racchiude l'intera applicazione e contiene il context provider {@link AuthProvider}.\
 * Il componente {@link CustomAppBar} viene visualizzato solo se la route è protetta. \
 * Outlet è un componente di {@link https://reactrouter.com/en/main/routers/router-provider | React Router} che visualizza il componente figlio della route corrente.
 * @param {boolean} props indica se la route deve essere protetta
 * @example
 * // Route protetta
 * <Layout isRouteProtected={true} />
 * @example
 * // Route pubblica
 * <Layout isRouteProtected={false} />
 * @see https://reactrouter.com/en/components/outlet
 * @returns {JSX.Element} il layout dell'applicazione
 * @namespace Layout
 */
export const Layout = (props: { isRouteProtected: boolean }): JSX.Element => {
    return (
        <CustomThemeProvider>
            <AuthProvider>
                {
                    props.isRouteProtected ?
                        <ProtectedRoute>
                            <CustomAppBar title={document.title} />
                            <Outlet />
                        </ProtectedRoute>
                        :
                        <Outlet />
                }
            </AuthProvider >
        </CustomThemeProvider>
    )
}

export default Layout