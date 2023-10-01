import { Button, Typography } from "@mui/material"
import { CSSProperties } from "@mui/material/styles/createTypography"

import { flexColumnStyle } from "../components/utils/CustomStyles"
import { useNavigate } from "react-router-dom"

const containerStyle: CSSProperties = {
    ...flexColumnStyle,
    gap: "2rem",
    padding: "35px"
}

const errorStyle: CSSProperties = {
    ...containerStyle,
    gap: "1rem"
}

/**
 * @description
 * Props per il componente {@link ErrorPage}
 * @namespace ErrorPage.ErrorPageProps
 */
interface ErrorPageProps {
    errorCode: number,
}

/**
 * @namespace ErrorPage
 * @description
 * Visualizza una pagina di errore personalizzata. \
 * La pagina contiene un messaggio di errore e un pulsante per tornare alla {@link LandingPage}. \
 * Gestisce gli errori 403, 404 e 500. \
 * Altri errori vengono gestiti come errori generici.
 * @example
 * // 403 - Non sei autorizzato ad accedere a questa pagina
 * <ErrorPage errorCode={403} />
 * @example 
 * // 404 - Pagina non trovata
 * <ErrorPage errorCode={404} />
 * @example
 * // 500 - Errore interno del server
 * <ErrorPage errorCode={500} />
 * @param {ErrorPage.ErrorPageProps} props Il codice di errore
 * @returns {JSX.Element}  La pagina di errore
 */
export const ErrorPage = (props: ErrorPageProps): JSX.Element => {

    const navigate = useNavigate()

    /**
     * @description
     * Visualizza un messaggio di errore in base al codice di errore tramite uno switch.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
     * @returns {string} Il messaggio di errore in base al codice di errore
     * @memberof ErrorPage
     */
    const showErrorMessage = (): string => {
        switch (props.errorCode) {
            case 403:
                return "Non sei autorizzato ad accedere a questa pagina."
            case 404:
                return "Pagina non trovata :("
            case 500:
                return "Errore interno del server."
            default:
                return "Errore generico."
        }
    }

    return (
        <div style={containerStyle}>
            <div style={errorStyle}>
                <Typography variant="h1" color="red">
                    Errore {props.errorCode}
                </Typography>
                <Typography variant="h4">
                    {showErrorMessage()}
                </Typography>
            </div>
            <Button variant="contained" onClick={() => navigate("/")}>
                Torna alla home
            </Button>
        </div>
    )
}

export default ErrorPage