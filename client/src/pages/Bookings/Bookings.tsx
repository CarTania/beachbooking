import { Button, Divider, ImageList, ImageListItem, Tooltip, Typography } from "@mui/material"

import sandTexture from '/src/assets/Beach/sandTexture.webp'
import seaTexture from '/src/assets/Beach/seaTexture.webp'

import { useState, useEffect } from "react"

import { DeleteBooking, GetSunshades } from "../../components/helpers/Api"
import { useAuth } from "../../components/utils/AuthProvider"
import { CustomSnackbar, SnackbarInfoType } from "../../components/CustomSnackbar"
import { flexColumnStyle, flexRowStyle } from "../../components/utils/CustomStyles"
import { Sunshade, SunshadeType } from "./Sunshade"

/**
 * @description
 * Visualizza la mappa degli {@link Sunshade | ombrelloni} \
 * Ordinata per fila e colonna, si può cliccare su un ombrellone per prenotarlo \
 * Il componente utilizza la funzione {@link SendRequest.GetSunshades | GetSunshades} per ottenere gli ombrelloni dal database \
 * Se l'ombrellone è prenotato, non è più disponibile \
 * Il proprietario di una prenotazione può eliminare la prenotazione cliccando sul pulsante "Elimina"
 * @see https://mui.com/material-ui/react-image-list/
 * @example 
 * <Bookings />
 * @returns {JSX.Element} La mappa degli ombrelloni
 * @namespace Bookings
 */
export const Bookings = (): JSX.Element => {

    const [sunshades, setSunshades] = useState<SunshadeType[]>([])

    //context hook per l'autenticazione
    const auth = useAuth()

    //Snackbar stato di apertura/chiusura
    const [open, setOpen] = useState<boolean>(false)

    const [snackbarInfo, setSnackbarInfo] = useState<SnackbarInfoType>({
        message: "",
        severity: "info"
    });

    const GetSortedSunshades = () => {
        GetSunshades()
            .then((res) => {
                //Ordina gli ombrelloni per fila e colonna
                res.sort((a, b) => {
                    return b.num_row === a.num_row
                        ? a.num_column - b.num_column
                        : b.num_row - a.num_row
                })

                setSunshades(res)
            })
    }

    //teoria: useEffect viene eseguito dopo che il componente è stato renderizzato
    //In questo caso, viene eseguito solo una volta, quando il componente viene renderizzato per la prima volta
    useEffect(() => {
        GetSortedSunshades()
    }, [])

    const handleDeleteBooking = (sunshade: SunshadeType) => {
        DeleteBooking(sunshade).then((ok) => {
            //Se lo status è OK (200-299) allora la prenotazione è stata eliminata con successo
            const snackbarInfo: SnackbarInfoType = ok
                ? {
                    message: "Prenotazione eliminata con successo",
                    severity: "success",
                }
                : {
                    message: "Non hai i permessi per eliminare questa prenotazione",
                    severity: "error",
                };

            setSnackbarInfo(snackbarInfo);
            setOpen(true);
        })
    }

    /**
     * @description
     * Chiude il messaggio di successo o errore della snackbar e visualizza nuovamente la lista di ombrelloni aggiornata
     * @returns {void}
     */
    const handleClose = (): void => {
        setOpen(false)
        if (snackbarInfo.severity === "success") {
            GetSortedSunshades()
            renderSunshades()
        }
    }

    /**
     * @description
     * Visualizza la lista di ombrelloni. \
     * Ogni ombrellone è un componente {@link Sunshade} \
     * La lista viene generata tramite la funzione {@link Array.map} 
     * @returns {JSX.Element[]} La lista di ombrelloni
     * @memberof Bookings
     */
    const renderSunshades = (): JSX.Element[] => {

        /**
         * @description
         * Visualizza il tooltip con le informazioni dell'ombrellone
         * Riquadro contenente:
         * - il numero di fila
         * - il numero di colonna
         * - il numero di sdraio
         * - il numero di lettini
         * - il pulsante "Elimina" (se l'ombrellone è prenotato)
         * @param {Sunshade.SunshadeType} sunshade L'ombrellone da visualizzare
         * @returns {JSX.Element} Il tooltip
         * @memberof Bookings.renderSunshades
         */
        const renderTooltipTitle = (sunshade: SunshadeType): JSX.Element => {

            return (
                <div style={{ ...flexColumnStyle, gap: "0.5rem" }}>
                    <Typography variant="h6">Ombrellone</Typography>
                    <Typography variant="body1">Fila ombr. n° {sunshade.num_row}</Typography>
                    <Typography variant="body1">Numero colonna: {sunshade.num_column}</Typography>
                    <Typography variant="body1">Numero sdraio: {sunshade.num_deckchairs}</Typography>
                    <Typography variant="body1">Numero lettino: {sunshade.num_sunbeds}</Typography>
                    {
                        //Se l'ombrellone è prenotato, visualizza il pulsante "Elimina"
                        sunshade.booking_id !== null &&
                        <>
                            <Divider />
                            <Button color="error" variant="contained" onClick={() => handleDeleteBooking(sunshade)}>Elimina</Button>
                        </>
                    }
                </div>
            )
        }

        return sunshades.map((sunshade) => (
            <Tooltip sx={flexRowStyle} key={sunshade.sunshade_id} title={renderTooltipTitle(sunshade)} placement="bottom">
                <ImageListItem>
                    <Sunshade
                        available={sunshade.booking_id === null}
                        handleBooking={() => { auth.navigateProtected('/crea-prenotazione', { state: sunshade }) }}
                        data={sunshade}
                    />
                </ImageListItem>
            </Tooltip>
        ))
    }

    return (
        <div style={{ ...flexColumnStyle, gap: "1.5rem", paddingTop: 35 }}>
            <Typography textAlign={"center"} variant="h5">Visualizza i posti disponibili</Typography>
            <Typography variant="h6">Scegli un ombrellone:</Typography>
            <Divider />
            <div style={{ ...flexColumnStyle, background: `url("${sandTexture}")`, backgroundSize: "cover", gap: 0, margin: 0, padding: 0, width: "80vw" }}>
                <ImageList cols={5} rowHeight={100} style={{ height: "50vh", width: "100%", padding: 0, margin: 0 }}>
                    {
                        renderSunshades()
                    }
                </ImageList>
                <div style={{
                    backgroundImage: `url("${seaTexture}")`,
                    backgroundRepeat: "repeat",
                    height: "15vh",
                    backgroundSize: "contain",
                    padding: 0,
                    width: "100%"
                }} />
            </div>
            <CustomSnackbar
                open={open}
                setOpen={setOpen}
                handleClose={handleClose}
                snackbarInfo={snackbarInfo}
            />
        </div>
    )
}

export default Bookings