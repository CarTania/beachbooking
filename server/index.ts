import express, { json, Request, Response } from 'express'
import cors from 'cors'
import { amISunshadeOwner, createBooking, createUser, deleteBooking, getSunshades, getUserByEmail } from './db/connect.js'
import { config } from 'dotenv'
import { authenticateToken, generateAccessToken, hashPasswd, comparePasswd } from './middleware/auth.js'

import * as EmailValidator from 'email-validator'

import cookieParser from 'cookie-parser'
import { IGetUserAuthInfoRequest } from './CustomTypes.js'

//carica le variabili d'ambiente dal file .env nel processo di node (process.env)
config()

//Creo un'istanza di express
const app = express()
const port = process.env.PORT || 8080
const clientPort = process.env.CLIENT_PORT || 5173

//Oggetto di configurazione per la libreria cors
const corsOptions = {
    origin: `http://localhost:${clientPort}`,
    method: ['GET', 'POST', 'DELETE'],
    credentials: true
}

//Il cors permette di fare richieste dai domini autorizzati
app.use(cors(corsOptions))
//Il JSON permette di parsare il body delle richieste in formato JSON
app.use(json())
//Il cookie parser parsa i cookie e li rende disponibili in req.cookies
app.use(cookieParser())

/**
 * @description Fa partire il server
 * @param {number} port La porta su cui far partire il server
 * @returns {void}
 */
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
    console.log(`[server]: Client is running at http://localhost:${clientPort}`)
})

/**
 * @description 
 * Ritorna la lista di ombrelloni. \
 * Se non è presente alcun ombrellone, ritorna 500.
 * @returns {void}
 */
app.get('/api/sunshades', authenticateToken, async (req: Request, res: Response) => {
    try {
        const data = await getSunshades();
        if (!data) {
            return res.status(500).send({ message: 'No sunshades found' });
        }
        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred' });
    }
});

/**
 * @description
 * Se l'utente esiste già, controlla se la password è corretta.
 * Altrimenti, crea l'utente.
 * Infine genera un token di accesso e lo invia al client tramite cookie.
 * @param {string} email L'email dell'utente
 * @param {string} password La password dell'utente
 * @returns {Promise<void>}
 */
app.post('/api/auth', async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(500).send({ message: 'Missing email or password' });
        }

        if (!EmailValidator.validate(email)) {
            return res.status(500).send({ message: 'Invalid email' });
        }

        const user = await getUserByEmail(email);

        if (user) {
            const isPasswordCorrect = await comparePasswd(password, user.password);

            if (!isPasswordCorrect) {
                return res.status(403).send({ message: 'Wrong password' });
            }
        } else {
            await createUser(email, await hashPasswd(password));
        }

        const access_token = generateAccessToken(email);

        res.cookie('access_token', access_token).sendStatus(200);

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred' });
    }
});

/**
 * @description Controlla se l'utente è loggato
 * @returns {void}
 */
app.post('/api/protected', authenticateToken, (req: Request, res: Response) => {
    res.send({ message: "The user is logged in" }).status(200)
})

/**
 * @description 
 * Effettua il logout dell'utente, se loggato, cancellando il cookie.
 * Altrimenti, ritorna 500.
 * @returns {void}
 */
app.post('/api/logout', async (req: Request, res) => {

    if (!req.cookies.access_token) {
        return res.status(500).send({ message: "The user is not logged in" })
    }

    res
        .clearCookie('access_token')
        .send({ message: "Logged out successfully" })
        .status(200)
})

/**
 * @description
 * Crea una prenotazione. \
 * Se la data di inizio è maggiore della data di fine, ritorna 500. \
 * Se il numero di lettini o di sdraio è minore di 0, ritorna 500. \
 * Se la data di inizio o di fine non è valida, ritorna 500. \
 * Altrimenti, crea la prenotazione e ritorna 200.
 * @return {Promise<void>}
 */
app.post('/api/booking', authenticateToken, async (req: IGetUserAuthInfoRequest, res: Response) => {

    let {
        sunshade_id,
        num_sunbeds,
        num_deckchairs,
        start_date,
        end_date
    } = req.body;

    start_date = new Date(start_date).toISOString().substring(0, 10);
    end_date = new Date(end_date).toISOString().substring(0, 10);

    if (num_sunbeds < 0 || num_deckchairs < 0) {
        return res.status(500).send({ message: 'Invalid number of sunbeds or deckchairs' });
    }
    if (start_date > end_date || !start_date || !end_date) {
        return res.status(500).send({ message: 'Invalid start or end date' });
    }

    if (!req.user) {
        return res.status(500).send({ message: 'Missing user' });
    }

    const email: string = req.user.id;

    try {
        await createBooking(sunshade_id, num_sunbeds, num_deckchairs, start_date, end_date, email);
        res.status(200).send({ message: 'Booking created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred' });
    }
})

/**
 * @description
 * Cancella una prenotazione se l'utente è il proprietario. \
 * Altrimenti, ritorna 403.
 * @returns {Promise<void>}
 */
app.delete('/api/booking', authenticateToken, async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {

        if (!req.user) {
            return res.status(500).send({ message: 'Missing user' });
        }

        if (!(await amISunshadeOwner(req.body.booking_id, req.user.id))) {
            return res.status(403).send({ message: 'You are not the owner of this booking' });
        }

        await deleteBooking(req.body.booking_id);
        res.status(200).send({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred' });
    }
})

/**
 * @description
 * Controlla se l'utente è il proprietario della prenotazione. \
 * Confrontando l'email dell'utente con quella della prenotazione. \
 * Altrimenti, ritorna 403.
 * @returns {Promise<void>}
 */
app.get('/api/booking/owner/:booking_id', authenticateToken, async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
        if (!(await amISunshadeOwner(req.params.booking_id, req.user.id))) {
            return res.status(403).send({ message: 'You are not the owner of this booking' });
        }
        res.status(200).send({ message: 'You are the owner of this booking' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred' });
    }
})