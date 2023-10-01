//Utils: componenti riutilizzabili in più parti del progetto e altri progetti
import { CSSProperties } from "react"

/**
 * @description
 * Stile per un contenitore con display flex e allineamento al centro
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_flex
 * @namespace flexStyle
 */
const flexStyle: CSSProperties = {
    display: 'flex',
    alignContent: 'center', //CSS: align-content: center;
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem'
}

/**
 * @description
 * Stile che estende flexStyle con la direzione row
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction
 * @see {@link flexStyle}
 * @namespace flexStyle.flexRowStyle
 */
export const flexRowStyle: CSSProperties = {
    ...flexStyle,
    flexDirection: 'row'
}

/**
 * @description
 * Stile che estende flexStyle con la direzione column
 * @see {@link flexRowStyle}
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction
 * @see {@link flexStyle}
 * @namespace flexStyle.flexColumnStyle
 */
export const flexColumnStyle: CSSProperties = {
    ...flexStyle,
    flexDirection: 'column'
}