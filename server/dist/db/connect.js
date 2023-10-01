var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from 'dotenv';
config();
/**
 * @description Configurazione del client per la connessione al database
 */
import pg from 'pg';
const client = new pg.Client({
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD
});
/**
 * @description connessione al database
 * @returns {Promise<void>}
 */
client.connect();
/**
 * @description
 * Ritorna la lista di ombrelloni. \
 * Se non è presente alcun ombrellone.
 * @returns {Promise<SunshadeType[]>} La lista di ombrelloni
 */
export const getSunshades = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sunshades = (yield client.query('SELECT * FROM Sunshade')).rows;
        //operatore for...of: iterazione di un oggetto iterabile (es. array)
        for (const sunshade of sunshades) {
            //Se l'ombrellone è prenotato e la prenotazione è scaduta, rimuovi la prenotazione
            if (sunshade.booking_id) {
                const booking = (yield client.query("SELECT * FROM Booking WHERE booking_id = $1", [sunshade.booking_id])).rows[0];
                const endDate = new Date(booking.enddate);
                const today = new Date();
                //Se la data di oggi è maggiore della data di fine prenotazione
                if (today > endDate) {
                    //Elimino il riferimento alla prenotazione dall'ombrellone e cancello la prenotazione
                    yield Promise.all([
                        client.query("UPDATE Sunshade SET booking_id = NULL WHERE sunshade_id = $1", [sunshade.sunshade_id]),
                        client.query("DELETE FROM Booking WHERE booking_id = $1", [sunshade.booking_id])
                    ]);
                }
            }
        }
        if (!sunshades) {
            throw new Error('No sunshades found');
        }
        return sunshades;
    }
    catch (err) {
        console.log(err.stack);
    }
});
/**
 * @description
 * Ritorna la lista di prenotazioni. \
 * Se non è presente alcuna prenotazione.
 * @returns {Promise<Array>} La lista di prenotazioni
 */
export const getBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (yield client.query('SELECT * FROM Booking')).rows;
    }
    catch (err) {
        console.log(err.stack);
    }
});
/**
 * @description
 * Ritorna la lista di utenti. \
 * Se non è presente alcun utente.
 * @returns {Promise<Array>} La lista di utenti
 */
export const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (yield client.query('SELECT * FROM Users')).rows;
    }
    catch (err) {
        console.log(err.stack);
    }
});
/**
 * @description
 * Ritorna la lista di prenotazioni di un utente data una mail. \
 * Se non è presente alcuna prenotazione.
 * @param {string} email
 * @returns {Promise<any[]>} La lista di prenotazioni dell'utente
 */
export const getBookingsByUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (yield client.query("SELECT * FROM Booking WHERE email = $1", [email])).rows;
    }
    catch (err) {
        console.log(err.stack);
    }
});
/**
 * @description
 * Ritorna l'utente con l'email specificata. \
 * Se non è presente alcun utente.
 * @param {string} email
 * @returns {Promise<Object>} L'utente con l'email specificata
 */
export const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //SQL Injection protection by using prepared statements
        //es. SQL Injection: (vulnerable to SQL injection)
        //return (await client.query("SELECT * FROM Users WHERE email = '" + email + "'")).rows[0]
        //body: { email: "a' OR '1' = '1" }
        //SQL query: SELECT * FROM Users WHERE email = 'a' OR '1' = '1'
        return (yield client.query("SELECT * FROM Users WHERE email = $1", [email])).rows[0];
    }
    catch (err) {
        console.log(err.stack);
    }
});
/**
 * @description
 * Crea un nuovo utente con l'email e la password specificate
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
 */
export const createUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.query(`INSERT INTO Users (email, password) VALUES ($1, $2)`, [email, password]);
    }
    catch (err) {
        console.log(err.stack);
    }
});
/**
 * @description
 * Crea una nuova prenotazione con i parametri specificati \
 * Inserisce la prenotazione con l'email dell'utente che ha effettuato la prenotazione \
 * Aggiorna il numero di lettini, il numero di sdraio dell'ombrellone e la chiave esterna booking_id dell'ombrellone
 * @param {number} sunshadeId
 * @param {number} numSunbeds
 * @param {number} numDeckchairs
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {string} email
 * @returns {Promise<void>}
 */
export const createBooking = (sunshadeId, numSunbeds, numDeckchairs, startDate, endDate, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield client.query('INSERT INTO Booking (startdate, enddate, email) VALUES ($1, $2, $3) RETURNING booking_id', [startDate, endDate, email]);
        const bookingId = res.rows[0].booking_id;
        yield client.query('UPDATE Sunshade SET booking_id = $1, num_sunbeds = $2, num_deckchairs = $3 WHERE sunshade_id = $4', [bookingId, numSunbeds, numDeckchairs, sunshadeId]);
    }
    catch (err) {
        console.log(err.stack);
    }
});
/**
 * @description
 * Controlla se l'utente è il proprietario della prenotazione. \
 * Se la prenotazione non esiste, ritorna false. \
 * Se l'utente è il proprietario della prenotazione, ritorna true. \
 * Altrimenti, ritorna false.
 * @param {number} booking_id
 * @param {string} email
 * @returns {Promise<boolean>} True se l'utente è il proprietario della prenotazione, false altrimenti
 */
export const amISunshadeOwner = (booking_id, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = (yield client.query("SELECT * FROM Booking WHERE booking_id = $1", [booking_id])).rows[0];
        if (!booking)
            return false;
        return !!booking && booking.email === email;
    }
    catch (err) {
        console.log(err.stack);
    }
});
/**
 * @description
 * Cancella una prenotazione. \
 * Se la prenotazione non esiste. \
 * Aggiorna l'ombrellone con la chiave esterna booking_id a NULL. \
 * Cancella la prenotazione dalla tabella Booking.
 * @param {number} booking_id
 * @returns {Promise<void>}
 */
export const deleteBooking = (booking_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sunshade = (yield client.query('SELECT * FROM Sunshade WHERE booking_id = $1', [booking_id])).rows[0];
        if (sunshade) {
            yield client.query('UPDATE Sunshade SET booking_id = NULL, num_sunbeds = 2, num_deckchairs = 2 WHERE sunshade_id = $1', [sunshade.sunshade_id]);
        }
        yield client.query('DELETE FROM Booking WHERE booking_id = $1', [booking_id]);
    }
    catch (err) {
        console.log(err.stack);
    }
});
