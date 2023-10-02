import { SunshadeType } from "../../pages/Bookings/Sunshade"

/**
 * @description
 * I parametri della richiesta
 * @namespace SendRequest.SendRequestProps
 */
interface SendRequestProps {
    url: string
    method?: string
    body?: any
    headers?: any
    returnJSON?: boolean,
    credentials?: boolean,
}

/**
 * @namespace SendRequest
 * @description
 * Invia una richiesta al server e restituisce la risposta. \
 * Se {@link returnJSON} (flag booleano) è true, restituisce la risposta in formato JSON. \
 * Altrimenti, restituisce solo un flag che indica se la richiesta è andata a buon fine (status 200-299). \
 * Se credentials è true, invia anche il cookie access_token.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * @param {SendRequest.SendRequestProps} props I parametri della richiesta
 * @returns {Promise<any>} La risposta del server
 */
export const SendRequest = async (props: SendRequestProps): Promise<any> => {
    const response = await fetch(props.url, {
        method: props.method,
        body: props.body,
        headers: { ...props.headers },
        credentials: props.credentials ? 'include' : undefined
    }).catch((error) => console.log(error))

    if (response!.ok && props.returnJSON) {
        const json = await response!.json()
        json.ok = true
        return await json
    }

    return response!.ok
}

/**
 * @description
 * Invia una richiesta al server per ottenere la lista di ombrelloni. \
 * Restituisce la risposta in formato JSON. \
 * La richiesta viene inviata con il cookie access_token.
 * @returns {Promise<SunshadeType[]>} La lista di ombrelloni
 * @namespace SendRequest.GetSunshades
 */
export const GetSunshades = async (): Promise<SunshadeType[]> => {
    return await SendRequest({
        url: '/api/sunshades',
        method: 'GET',
        credentials: true,
        returnJSON: true
    })
}

/**
 * @description
 * Inserisce una prenotazione nel database. \
 * La richiesta viene inviata con il cookie access_token.
 * @param {SunshadeType} sunshade L'ombrellone da prenotare
 * @param {Date} startDate La data di inizio prenotazione
 * @param {Date} endDate La data di fine prenotazione
 * @returns {Promise<any>} La risposta del server
 * @namespace SendRequest.InsertBooking
 */
export const InsertBooking = async (sunshade: SunshadeType, startDate: Date, endDate: Date): Promise<any> => {
    return await SendRequest({
        url: '/api/booking',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sunshade_id: sunshade.sunshade_id,
            start_date: startDate,
            end_date: endDate,
            num_deckchairs: sunshade.num_deckchairs,
            num_sunbeds: sunshade.num_sunbeds
        }),
        credentials: true,
        returnJSON: false
    })
}

/**
 *  @description
 * Cancella una prenotazione dato l'ombrellone. \
 * @param sunshade 
 * @returns 
 */

export const DeleteBooking = async (sunshade: SunshadeType): Promise<any> => {
    return await SendRequest({
        url: '/api/booking',
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            booking_id: sunshade.booking_id
        }),
        credentials: true,
        returnJSON: false
    })
}

/**
 * @description
 * Controlla se l'utente è proprietario dell'ombrellone. \
 * @param sunshade 
 * @returns 
 */

export const amISunshadeOwner = async (sunshade: SunshadeType): Promise<any> => {
    return await SendRequest({
        url: '/api/booking/owner/:booking_id',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            booking_id: sunshade.booking_id
        }),
        credentials: true,
        returnJSON: false
    })
}