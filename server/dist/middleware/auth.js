var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Middleware --> si trova tra il client (frontend) e il server (backend)
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
config();
const secret = process.env.JWT_SECRET || '';
/**
 * @description Il secret JWT scade dopo 3 ore
 */
const jwtSignOptions = {
    expiresIn: '3h'
};
/**
 * @description Middleware per autenticare l'utente
 * @param {Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>} req
 * @param {Response<any, Record<string, any>, number>} res
 * @param {NextFunction} next Ritorna il controllo al prossimo middleware
 */
export const authenticateToken = (req, res, next) => {
    //Prende il token di accesso dai cookie
    const access_token = req.cookies.access_token;
    //L'access token non è presente nei cookie
    if (!access_token) {
        return res.status(403).send({ message: 'Missing access token' });
    }
    if (!secret) {
        return res.status(500).send({ message: 'Missing JWT secret' });
    }
    jwt.verify(access_token, secret, (err, user) => {
        //Token scaduto o non valido
        if (err) {
            return res.status(500).send({ message: 'Access token is not valid' });
        }
        //Aggiunge l'utente alla richiesta (req.user = access_token)
        req.user = user;
        next();
    });
};
/**
 * @description Genera un token di accesso utilizzando l'email, il secret JWT e la durata del token
 * @param {string} email
 * @returns {string} Il token di accesso
 */
export const generateAccessToken = (email) => jwt.sign({ id: email }, secret, jwtSignOptions);
/**
 * @description Crea un hash della password. 10 -> salt: numero di iterazioni per generare l'hash.
 * @param {string} plainPasswd
 * @returns {Promise<string>} La password criptata
 */
export const hashPasswd = (plainPasswd) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return yield bcrypt.hash(plainPasswd, saltRounds);
});
/**
 * @description Confronta la password in chiaro con quella criptata
 * @param {string} plainPasswd
 * @param {string} hashedPasswd
 * @returns {Promise<boolean>} True se la password è corretta, false altrimenti
 */
export const comparePasswd = (plainPasswd, hashedPasswd) => __awaiter(void 0, void 0, void 0, function* () { return yield bcrypt.compare(plainPasswd, hashedPasswd); });
