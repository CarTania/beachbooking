import { Typography, Button, CardHeader, CardContent, CardActions, Card } from "@mui/material"
import { CSSProperties, useState } from "react"
import { CustomModal } from "../../components/CustomModal"

import styles from './LandingPage.module.css'
import { AuthForm } from "../../components/forms/AuthForm"
import { flexColumnStyle } from "../../components/utils/CustomStyles"
import { useAuth } from "../../components/utils/AuthProvider"
import { useNavigate } from "react-router-dom"

/**
 * @description
 * Struttura la landing Page in una colonna. 
 */
const containerStyle: CSSProperties = {
    ...flexColumnStyle,
    gap: "2rem",
    padding: "35px"
}

/**
 * @description
 * Struttura la card in una colonna. 
 */
const cardStyle: CSSProperties = {
    ...flexColumnStyle,
    borderRadius: "2rem"
}

/**
 * @description
 * Visualizza la pagina di landing \
 * Contiene un pulsante per effettuare il {@link AuthProvider.login} \
 * Se l'utente è già loggato, viene reindirizzato alla pagina di visualizzazione delle prenotazioni.
 * @example 
 * <LandingPage />
 * @returns {JSX.Element} La pagina di landing
 * @namespace LandingPage
 */
export const LandingPage = (): JSX.Element => {

    const [open, setOpen] = useState(false)
    const auth = useAuth()
    const navigate = useNavigate()

    /**
     * @description
     * Controlla se l'utente è loggato.\
     * Se l'utente è loggato, viene reindirizzato alla pagina di {@link Bookings | visualizzazione delle prenotazioni}.\
     * Altrimenti, viene visualizzato il {@link AuthForm | form di login}.
     * Se il modal viene chiuso, l'utente rimane sulla pagina di landing.
     * @see AuthForm
     * @returns {void}
     * @memberof LandingPage
     */
    const toggleModal = (): void => {

        //Access token dell'utente (se presente)
        //Access token lo prende dai cookie. 
        const access_token = auth.cookies.get("access_token")

        if (access_token) {
            //Se l'access_token è presente, controlla se è valido
            //esempio: sono loggato, ma il token è scaduto
            auth.checkAuth()
                .then((result) => {
                    if (result) {
                        //se il token è valido, naviga alla pagina di visualizzazione delle prenotazioni
                        navigate('/visualizza-prenotazioni')
                    }
                })
        }

        //se il token non è presente, oppure non è valido, apre il modal 
        setOpen(!open)
    }

    /**
     * @description
     * Il custom modal contiene l'authform. 
     * Il resto è una card.
     */
    return (
        <>
            <CustomModal open={open} setOpen={toggleModal}>
                <AuthForm
                    onLogin={(res) => {
                        if (res) {
                            open && setOpen(false)
                            navigate('/visualizza-prenotazioni')
                        }
                    }}
                />
            </CustomModal>
            <div className={styles.sandbg}>
                <div style={containerStyle} className={styles.gradientbg}>
                    <Card sx={cardStyle} className={styles.cardStyle}>
                        <CardHeader
                            title="Beach Bookings"
                            titleTypographyProps={{ variant: 'h2', fontWeight: 500 }}
                        />
                        <CardContent>
                            <Typography variant="h5" color="text.secondary">
                                Prenota un posto in spiaggia
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ width: '250px', borderRadius: '25px' }}
                                onClick={toggleModal}
                            >
                                Continua
                            </Button>
                        </CardActions>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default LandingPage