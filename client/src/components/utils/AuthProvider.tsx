import { ReactNode, createContext, useContext, useMemo } from "react"
import { SendRequest } from "../helpers/Api";
import Cookies from "universal-cookie";
import { NavigateOptions, useNavigate } from "react-router-dom";

/**
 * @description
 * L'oggetto che contiene le funzioni di autenticazione 
 * @namespace AuthProvider.AuthContextType
 */
export type AuthContextType = {
    cookies: Cookies,
    login: (email: string, password: string) => Promise<boolean>,
    logout: () => Promise<void>,
    checkAuth: () => Promise<boolean>,
    navigateProtected: (path: string, options?: NavigateOptions) => void
}

const defaultAuthContext: AuthContextType = {
    cookies: new Cookies({ path: '/' }, { secure: true }),
    login: () => Promise.resolve(false),
    logout: () => Promise.resolve(),
    checkAuth: () => Promise.resolve(false),
    navigateProtected: () => { }
};

/**
 * @description
 * Il context provider che contiene le funzioni di autenticazione
 * @see https://react.dev/reference/react/createContext
 */
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

/**
 * @description
 * Le props di AuthProvider
 * @namespace AuthProvider.AuthProviderProps
 */
interface AuthProviderProps {
    children: ReactNode | ReactNode[]
}

/**
 * @namespace AuthProvider
 * @description
 * AuthProvider gestisce le funzioni di:
 * - {@link AuthProvider.login}
 * - {@link AuthProvider.logout}
 * - {@link AuthProvider.checkAuth}
 * - {@link AuthProvider.navigateProtected}
 * @example 
 * <AuthProvider>
 *  <App />
 * </AuthProvider>
 * @see https://react.dev/reference/react/createContext#provider
 * @param {AuthProvider.AuthProviderProps} props Le funzioni di autenticazione
 * @returns {JSX.Element} Context provider per le funzioni di autenticazione
 */
export const AuthProvider = (props: AuthProviderProps): JSX.Element => {

    //Accede ai cookie inviati dal server
    const cookies = new Cookies({ path: '/' }, { secure: true })

    /**
     * @description
     * Gestisce il login dell'utente e restituisce un booleano.
     * La funzione non restituisce un risultato in Json. 
     * @param {string} email L'email dell'utente
     * @param {string} password La password dell'utente
     * @returns {Promise<boolean>} true se il login è andato a buon fine, altrimenti false
     * @memberof AuthProvider
     */
    const login = async (email: string, password: string): Promise<boolean> => {
        const res = await SendRequest({
            url: '/api/auth',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            returnJSON: false
        })

        //Se lo status è OK (200-299) allora res è true (login effettuato con successo)
        //Altrimenti, res è false (login fallito)
        return res
    };

    /**
     * @description
     * Controlla se l'utente è autenticato e restituisce un booleano.
     * Se l'utente non è autenticato, effettua il logout.
     * @returns {Promise<boolean>}
     * @memberof AuthProvider
     */
    const checkAuth = async (): Promise<boolean> => {
        const res = await SendRequest({
            url: '/api/protected',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: true,
            returnJSON: false
        })

        if (!res) {
            logout()
            return false
        }

        return true
    }

    /**
     * Effettua il logout dell'utente
     * @returns {Promise<void>}
     * @memberof AuthProvider
     */
    const logout = async (): Promise<void> => {
        await SendRequest({
            url: '/api/logout',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            returnJSON: false
        })
    };

    //Hook di React Router per la navigazione tra le pagine
    const navigate = useNavigate()

    /**
     * Effettua la navigazione protetta. \
     * Se l'utente è autenticato, naviga alla pagina specificata, altrimenti naviga alla LandingPage
     * @see {@link AuthProvider.checkAuth}
     * @param {string} path La pagina da visualizzare
     * @param {NavigateOptions} options Le opzioni di navigazione
     * @returns {void} 
     * @memberof AuthProvider
     */
    const navigateProtected = (path: string, options?: NavigateOptions): void => {
        checkAuth()
            .then((result) => {
                navigate(result ? path : '/', options)
            })
    }

    /**
     * (cookies, login, logout, checkAuth, navigateProtected --- sono tutte le funzioni che vengono inserite nell'auth e passate ai componenti figli)
     * auth è un oggetto che contiene le funzioni di: 
     * - cookie di sessione (access_token)
     * - {@link AuthProvider.login} 
     * - {@link AuthProvider.logout} 
     * - {@link AuthProvider.checkAuth} 
     * - {@link AuthProvider.navigateProtected}
     * @see https://react.dev/reference/react/useMemo
     * @return {AuthProvider.AuthContextType}
     * @memberof AuthProvider
     */
    const auth = useMemo(
        () => ({
            cookies,
            login,
            logout,
            checkAuth,
            navigateProtected
        }),
        [cookies, login, logout, checkAuth, navigateProtected]
    );

    return (
        <AuthContext.Provider value={auth}>
            {props.children}
        </AuthContext.Provider>
    )
};

/**
 * useAuth è un hook che restituisce l'oggetto {@link AuthProvider.auth} di {@link AuthProvider}. \
 * Permette ai componenti di accedere alle funzioni specificate in {@link AuthProvider.AuthContextType}
 * @see https://react.dev/reference/react/useContext
 * @returns {AuthContextType} L'oggetto auth di AuthProvider
 * @namespace AuthProvider.useAuth
 */
export const useAuth = (): AuthContextType => {
    return useContext(AuthContext)
};