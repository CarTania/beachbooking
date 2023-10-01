//Middleware --> si trova tra il client (frontend) e il server (backend)
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import bcrypt from 'bcrypt'
import { NextFunction, Response } from 'express';
import { IGetUserAuthInfoRequest } from '../CustomTypes';

config();

const secret: jwt.Secret = process.env.JWT_SECRET || '';

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
export const authenticateToken = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {

    //Prende il token di accesso dai cookie
    const access_token = req.cookies.access_token;

    //L'access token non è presente nei cookie
    if (!access_token) {
        return res.status(403).send({ message: 'Missing access token' });
    }

    if (!secret) {
        return res.status(500).send({ message: 'Missing JWT secret' });
    }

    jwt.verify(access_token, secret, (err: any, user: any) => {

        //Token scaduto o non valido
        if (err) {
            return res.status(500).send({ message: 'Access token is not valid' });
        }

        //Aggiunge l'utente alla richiesta (req.user = access_token)
        req.user = user;

        next(); //passa la richiesta aggiornata al server. (con l'access token)
    });
};

/**
 * @description Genera un token di accesso utilizzando l'email, il secret JWT e la durata del token
 * @param {string} email 
 * @returns {string} Il token di accesso
 */
export const generateAccessToken = (email: string): string => jwt.sign({ id: email }, secret, jwtSignOptions)

/**
 * @description Crea un hash della password. 10 -> salt: numero di iterazioni per generare l'hash.
 * @param {string} plainPasswd 
 * @returns {Promise<string>} La password criptata
 */
export const hashPasswd = async (plainPasswd: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(plainPasswd, saltRounds);
};

/**
 * @description Confronta la password in chiaro con quella criptata
 * @param {string} plainPasswd
 * @param {string} hashedPasswd
 * @returns {Promise<boolean>} True se la password è corretta, false altrimenti
 */
export const comparePasswd = async (plainPasswd: string, hashedPasswd: string): Promise<boolean> => await bcrypt.compare(plainPasswd, hashedPasswd)