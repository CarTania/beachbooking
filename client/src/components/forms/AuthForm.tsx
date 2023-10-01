import { Button, Divider, TextField } from "@mui/material"
import { flexColumnStyle } from "../utils/CustomStyles"
import { useAuth } from "../utils/AuthProvider"
import { useState } from "react"

/**
 * @description
 * Props del form di login (struttura dati che contiene le props del componente)
 * @namespace AuthForm.AuthFormProps
 */
interface AuthFormProps {
    onLogin: (res: boolean) => void
}

/**
 * @description
 * Visualizza un form per effettuare il {@link AuthProvider.login}. \
 * Utilizza il context provider {@link AuthProvider} per effettuare il login.
 * @example 
 * <AuthForm /> 
 * @returns {JSX.Element} Il form di login
 * @namespace AuthForm
 */
export const AuthForm = (props: AuthFormProps): JSX.Element => {

    /**
     * @description
     * Lo stato che contiene l'email dell'utente
     * @memberof AuthForm
     */
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<boolean>(false)

    /**
     * @description
     * Lo stato che contiene la password dell'utente
     * @memberof AuthForm
     */
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<boolean>(false)
    const [passwordHelperText, setPasswordHelperText] = useState<string | JSX.Element>('')

    const auth = useAuth()

    const passwordHelperTextDefault = () => {
        return (
            <>
                <p>La password deve contenere almeno: </p>
                <ul>
                    <li>8 caratteri</li>
                    <li>una lettera minuscola</li>
                    <li>una lettera maiuscola</li>
                    <li>un numero</li>
                    <li>un carattere speciale</li>
                </ul>
            </>
        )
    }

    /**
     * @description
     * Controlla se l'email è valida utilizzando una regex in base allo standard RFC 5322.
     * @see https://datatracker.ietf.org/doc/html/rfc5322
     * @param {string} email l'email da controllare
     * @returns {boolean} true se l'email è valida, altrimenti false
     * @memberof AuthForm
     */
    const isEmailValid = (email: string): boolean => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
    }

    /**
     * @description
     * Controlla se la password è valida utilizzando una regex. \
     * La password deve contenere almeno 8 caratteri, \
     * almeno una lettera minuscola, \
     * almeno una lettera maiuscola, \
     * almeno un numero, \
     * almeno un carattere speciale.
     * @param password la password da controllare
     * @returns  true se la password è valida, altrimenti false
     */
    const isPasswordValid = (password: string): boolean => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
    }

    /**
     * @description
     * Effettua il login utilizzando il context provider {@link AuthProvider}. \
     * Se il login va a buon fine, viene chiamata la funzione {@link AuthFormProps.handleLogin | handleLogin} passata come props. \
     * Se il login non va a buon fine, vengono visualizzati gli errori.
     * @returns {Promise<void>} 
     * @memberof AuthForm
     */
    const handleLogin = async (): Promise<void> => {

        // Reset errore di validazione
        setPasswordError(false)

        /*
            Gestisce sia il sign up che il login (se l'utente è già registrato)
            Il backend si occupa di gestire il caso in cui l'utente non sia registrato
        */
        const res = await auth.login(email, password)

        if (!res) {
            setPasswordHelperText("Email o password errati.")
            setPasswordError(true)
            props.onLogin(false)
            return
        }

        props.onLogin(true)
    }

    const handleEmail = (email: string): void => {
        setEmailError(!isEmailValid(email))
        setEmail(email)
    }

    const handlePassword = (password: string): void => {
        setPasswordError(!isPasswordValid(password))
        setPasswordHelperText(passwordHelperTextDefault())
        setPassword(password)
    }

    return (
        <div style={flexColumnStyle}>
            <h1>Autenticati</h1>
            <TextField
                required
                label="Email"
                variant="outlined"
                type="email"
                error={emailError}
                helperText={emailError ? "Email non valida" : ""}
                value={email}
                onChange={(e) => handleEmail(e.target.value)}
                fullWidth
            />
            <TextField
                required
                label="Password"
                variant="outlined"
                type="password"
                error={passwordError}
                helperText={passwordHelperText}
                value={password}
                onChange={(e) => handlePassword(e.target.value)}
                fullWidth
            />
            <Divider />
            <Button
                onClick={handleLogin}
                variant="contained"
                style={{ width: '100%', borderRadius: '25px' }}
            >
                Continua
            </Button>
        </div>
    )
}