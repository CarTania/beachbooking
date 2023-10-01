//Formato WebP per le immagini in quanto più leggero di JPG e PNG e supportato da tutti i browser moderni
import denied from "/src/assets/Sunshade/denied.webp"
import sunshade from "/src/assets/Sunshade/sunshade.webp"

/**
 * @description
 * Le proprietà di un {@link Sunshade | ombrellone}
 * @namespace Sunshade.SunshadeType
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

/**
 * @description
 * I props di un {@link Sunshade | ombrellone}
 * @namespace Sunshade.SunshadeProps
 */
interface SunshadeProps {
    width?: number,
    height?: number,
    available: boolean,
    handleBooking(): void,
    data: SunshadeType
}

/**
 * @namespace Sunshade
 * @description
 * La rappresentazione grafica di un ombrellone \
 * Se l'ombrellone è disponibile, è possibile prenotarlo cliccando sull'immagine \
 * Altrimenti, viene visualizzata un'immagine che indica che l'ombrellone è già prenotato.
 * @see https://react.dev/learn/conditional-rendering#conditional-ternary-operator-- 
 * @example 
 * // Ombrellone disponibile
 * <Sunshade available={true} handleBooking={() => handleBooking()} />
 * @param {Sunshade.SunshadeProps} props Se l'ombrellone è disponibile e la funzione per prenotarlo
 * @returns {JSX.Element} La rappresentazione grafica di un ombrellone
 */
export const Sunshade: React.FC<SunshadeProps> = (props: SunshadeProps): JSX.Element => {

    const width = props.width || 125
    const height = props.height || 125

    const containerStyle = {
        backgroundImage: `url(${sunshade})`, //Immagine dell'ombrellone disponibile
        backgroundSize: 'cover',
        width: width,
        height: height
    }

    /**
     * @description
     * Se l'ombrellone è disponibile, viene chiamata la funzione {@link props.handleBooking} \
     * La funzione handleBooking è passata come props.
     * @see {@link Sunshade.SunshadeProps}
     * @see https://react.dev/learn/conditional-rendering#conditional-ternary-operator--
     * @returns {false | void} false se l'ombrellone non è disponibile, altrimenti void
     * @memberof Sunshade
     */
    const handleBooking = (): false | void => props.available && props.handleBooking()

    return (
        <div style={containerStyle} onClick={handleBooking} aria-describedby="sunshade image">
            {
                !props.available &&
                <img
                    width={width}
                    height={height}
                    src={denied} //Immagine dell'ombrellone non disponibile
                    alt="denied"
                />
            }
        </div>
    )
}
