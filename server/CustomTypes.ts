import { Request } from "express";

/**
 * @description
 * Le proprietà di un ombrellone
 */
export type SunshadeType = {
    sunshade_id: number,
    num_row: number,
    num_column: number,
    num_deckchairs: number,
    num_sunbeds: number,
    deckchair_price: number,
    sunbed_price: number,
    chalet_id: number,
    booking_id: number,
    price: number
}

export interface IGetUserAuthInfoRequest extends Request {
    user?: string | any
    params: any
}