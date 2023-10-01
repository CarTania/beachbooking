import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import { SunshadeType } from "../../pages/Bookings/Sunshade"

import { JSX } from "react"

interface CheckoutTableProps {
    sunshade: SunshadeType,
    numDays: number
}

/**
 * @description
 * Visualizza la tabella di checkout con i prezzi, la quantità e il totale
 * @example 
 * <CheckoutTable sunshade={sunshade} numDays={numDays} />
 * @example 
 * { 
 *     sunshade && CheckoutTable(sunshade, numDays); 
 * }
 * @param {CheckoutTableProps} props I dati dell'ombrellone e il numero di giorni
 * @returns {JSX.Element} La tabella di checkout
 * @namespace CheckoutTable
 */
export const CheckoutTable = (props: CheckoutTableProps): JSX.Element => {

    const totalDeckChairsPrice = props.sunshade!.num_deckchairs * props.sunshade!.deckchair_price
    const totalSunbedsPrice = props.sunshade!.num_sunbeds * props.sunshade!.sunbed_price
    const subtotal = totalDeckChairsPrice + totalSunbedsPrice + Number.parseFloat(props.sunshade!.price.toString())

    const total = subtotal * props.numDays

    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell align="right">Prezzo</TableCell>
                    <TableCell align="right">Quantità</TableCell>
                    <TableCell align="right">Totale</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>Ombrellone</TableCell>
                    <TableCell colSpan={3} align="right">{props.sunshade.price}€</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Sdraio</TableCell>
                    <TableCell align="right">{props.sunshade.deckchair_price}€</TableCell>
                    <TableCell align="right">{props.sunshade.num_deckchairs}</TableCell>
                    <TableCell align="right">{totalDeckChairsPrice}€</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Lettino</TableCell>
                    <TableCell align="right">{props.sunshade.sunbed_price}€</TableCell>
                    <TableCell align="right">{props.sunshade.num_sunbeds}</TableCell>
                    <TableCell align="right">{totalSunbedsPrice}€</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ fontSize: "1.5rem", fontWeight: 500 }}>Totale</TableCell>
                    <TableCell align="right">{subtotal}€</TableCell>
                    <TableCell align="right">{props.numDays} {props.numDays === 1 ? "giorno" : "giorni"}</TableCell>
                    <TableCell align="right">{total}€</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}