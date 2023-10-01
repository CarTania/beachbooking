import { useAuth } from "./AuthProvider"
import { ReactNode, JSX } from "react";
import ErrorPage from "../../pages/Error";

/**
 * @description
 * Permette di proteggere una route da accessi non autorizzati.\
 * Se l'utente non è autenticato, viene visualizzata la pagina di errore 403 (Forbidden).
 * @param {ReactNode | ReactNode[]} props il componente che deve essere protetto
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
 * @see {@link ErrorPage}
 * @returns {JSX.Element} il componente protetto o la pagina di errore 403
 * @namespace ProtectedRoute
 */
export const ProtectedRoute = (props: { children: ReactNode | ReactNode[] }): JSX.Element => {

    const auth = useAuth();

    return auth.cookies.get("access_token") ?
        <>{props.children}</> :
        <ErrorPage errorCode={403} />
}