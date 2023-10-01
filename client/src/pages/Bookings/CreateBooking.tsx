import { Breadcrumbs, Link, Button, Card, CardActions, CardContent, CardHeader, Typography, Box, CircularProgress } from '@mui/material'
import { CSSProperties, useEffect, useState } from 'react'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import { flexColumnStyle, flexRowStyle } from '../../components/utils/CustomStyles'
import { useLocation, useNavigate } from 'react-router-dom'

import CustomNumericField from '../../components/CustomNumericField'

import { InsertBooking } from '../../components/helpers/Api'

import { SunshadeType } from './Sunshade'
import { CheckoutTable } from '../../components/utils/CheckoutTable'
import { CustomSnackbar, SnackbarInfoType } from '../../components/CustomSnackbar'

const cardContentStyle: CSSProperties = {
    display: 'inline-block'
}

const containerStyle: CSSProperties = {
    ...flexColumnStyle,
    padding: '2.5rem'
}

const formColumnStyle: CSSProperties = {
    ...flexColumnStyle,
    justifyContent: 'space-between',
    gap: '2rem'
}

/**
 * @description
 * Aggiunge i giorni alla data. 
 * @param date La data
 * @param days Il numero di giorni da aggiungere
 * @returns La data aggiornata
 */
const addDays = (date: Date, days: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

/**
 * @description
 * Visualizza un form per creare una prenotazione \
 * Utilizza la funzione {@link SendRequest.InsertBooking | InsertBooking} per inserire la prenotazione nel database
 *  
 * Il form contiene: 
 * - un {@link https://mui.com/x/react-date-pickers/date-picker/ | calendario} per selezionare la data di inizio e di fine
 * - un {@link CustomNumericField | campo numerico} per selezionare il numero di sdraio e lettini 
 * - una {@link CheckoutTable | tabella di checkout} per visualizzare il riepilogo della prenotazione
 * @returns {JSX.Element} Il form per creare una prenotazione
 * @namespace CreateBooking
 */
export const CreateBooking = (): JSX.Element => {

    const [startDate, setStartDate] = useState<Date>(new Date(Date.now()))
    const [endDate, setEndDate] = useState<Date>(new Date(addDays(startDate!, 1)))

    //1000: da millisecondi a secondi
    //3600: da secondi a ore
    //24: da ore a giorni
    const numDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))

    //Es: Bookings.tsx --> CreateBooking.tsx
    //I dati trasferiti attraverso la funzione navigate() sono contenuti in state. (trasferimento dati tra routes)
    const location = useLocation()
    const state = location.state as SunshadeType

    const [open, setOpen] = useState<boolean>(false)

    const [sunshade, setSunshade] = useState<SunshadeType>()

    const navigate = useNavigate()

    const snackbarInfo: SnackbarInfoType = {
        message: "Prenotazione creata con successo",
        severity: "success"
    }

    /**
     * @description
     * Inserisce la prenotazione nel database utilizzando la funzione {@link SendRequest.InsertBooking |} \
     * Se la prenotazione è stata inserita correttamente, viene visualizzato un messaggio di successo
     * @see https://mui.com/components/breadcrumbs/
     * @returns {void} 
     * @memberof CreateBooking
     */
    const handleBooking = (): void => {
        InsertBooking(sunshade!, startDate, endDate)
            .then((ok) => {
                //Se lo status è OK (200-299) allora la prenotazione è stata inserita con successo
                if (ok) {
                    setOpen(true) //visulizzo la snackbar.
                }
            })
    }

    /**
     * @description
     * Chiude il messaggio di successo e reindirizza alla pagina di visualizzazione delle prenotazioni
     * @returns {void}
     * @memberof CreateBooking
     */
    const handleClose = (): void => {
        setOpen(false)
        navigate('/visualizza-prenotazioni')
    }

    /**
     * @description
     * Se l'utente seleziona un ombrellone dalla griglia allora viene settata la variabile di stato (sunshade). \
     * Altrimenti se l'utente è arrivato alla pagina senza selezionare un ombrellone, viene reindirizzato alla pagina di visualizzazione delle prenotazioni.
     * 
     */

    useEffect(() => {
        if (state) {
            setSunshade(state)
        } else {
            navigate('/visualizza-prenotazioni')
        }
    }, [state, navigate]) //se state cambia, viene eseguito il codice

    return (
        <div style={containerStyle}>
            {/* Breadcrumbs: Home / Crea prenotazione */}
            <Box sx={{ ...flexRowStyle, width: "100vw", float: "left", textAlign: "left", justifyContent: "flex-start" }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ paddingLeft: 5 }}>
                    <Link underline="hover" color="inherit" href="/visualizza-prenotazioni">
                        Home
                    </Link>
                    <Typography color="text.primary">Crea prenotazione</Typography>
                </Breadcrumbs>
            </Box>
            <Box sx={flexRowStyle}>
                <Card sx={flexColumnStyle}>
                    <CardHeader title={'Prenota un ombrellone'} />
                    <CardContent style={cardContentStyle}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <div style={formColumnStyle}>
                                {
                                    //conditional rendering: se sunshade è definito, visualizza i campi per creare la prenotazione
                                    sunshade ? (
                                        <>
                                            <CustomNumericField //textfield
                                                label="Numero di righe"
                                                value={sunshade!.num_row}
                                                onChange={(e) => setSunshade({ ...sunshade!, num_row: Number.parseInt(e.target.value) })}
                                                minValue={1}
                                                disabled={true}
                                            />
                                            <CustomNumericField
                                                label="Numero di colonne"
                                                value={sunshade!.num_column}
                                                onChange={(e) => setSunshade({ ...sunshade!, num_column: Number.parseInt(e.target.value) })}
                                                minValue={1}
                                                disabled={true}
                                            />
                                            {/*
                                                Utilizzo il componente Date Picker anche se il Date Range Picker sarebbe stata un'opzione migliore.
                                                In quanto più appropriato, sfortunatamente è incluso solo nel piano pro.
                                            */}
                                            <div style={flexRowStyle}>
                                                <DatePicker
                                                    label="Data di inizio"
                                                    value={startDate}
                                                    disablePast
                                                    onChange={(newDate) => setStartDate(newDate!)}
                                                    format="dd/MM/yyyy"
                                                />
                                                <Typography> - </Typography>
                                                <DatePicker
                                                    label="Data di fine"
                                                    value={endDate}
                                                    disableHighlightToday
                                                    shouldDisableDate={(date) => date.getTime() <= startDate.getTime()}
                                                    onChange={(newDate) => setEndDate(newDate!)}
                                                    format="dd/MM/yyyy"
                                                />
                                            </div>
                                            <CustomNumericField
                                                label="Numero di sdraio"
                                                value={sunshade!.num_deckchairs}
                                                onChange={(e) => setSunshade({ ...sunshade!, num_deckchairs: Number.parseInt(e.target.value) })}
                                                minValue={0}
                                            />
                                            <CustomNumericField
                                                label="Numero di lettini"
                                                value={sunshade!.num_sunbeds}
                                                onChange={(e) => setSunshade({ ...sunshade!, num_sunbeds: Number.parseInt(e.target.value) })}
                                                minValue={0}
                                            />
                                            <CheckoutTable  //tabella con nome, prezzo, quantità e totale. 
                                                sunshade={sunshade}
                                                numDays={numDays}
                                            />
                                        </>
                                    ) : (
                                        <CircularProgress />
                                    )
                                }
                            </div>
                        </LocalizationProvider>
                    </CardContent>
                    <CardActions style={containerStyle}>
                        <Box sx={flexRowStyle}>
                            <Button
                                variant="contained"
                                color="error"
                                style={{ width: "30%", borderRadius: "25px" }}
                                onClick={() => navigate('/visualizza-prenotazioni')}
                            >
                                Annulla
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ width: "70%", borderRadius: "25px" }}
                                onClick={() => handleBooking()}
                            >
                                Crea prenotazione
                            </Button>
                        </Box>
                        <CustomSnackbar
                            open={open}
                            setOpen={setOpen}
                            handleClose={handleClose}
                            snackbarInfo={snackbarInfo}
                        />
                    </CardActions>
                </Card>
            </Box>
        </div>
    )
}

export default CreateBooking