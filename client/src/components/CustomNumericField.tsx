import React, { useEffect, JSX } from 'react'
import TextField from '@mui/material/TextField'

interface CustomNumericFieldProps {
    label: string
    value: number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    minValue: number
    maxValue?: number
    disabled?: boolean
}

/**
 * @description
 * Visualizza un campo numerico personalizzato (MUI TextField) \
 * \
 * Il campo contiene:
 * - un valore numerico 
 * - una label
 * - un errore personalizzabile in base al range di valori consentiti
 * @example
 * <CustomNumericField
 *    label="Età"
 *    value={age}
 *    onChange={handleChange}
 *    minValue={18}
 * />
 * @see https://mui.com/material-ui/react-text-field/#type-quot-number-quot
 * @param {CustomNumericFieldProps} props Il valore numerico, la label, la funzione per cambiare il valore e il range di valori consentiti
 * @returns {JSX.Element} Il campo numerico personalizzato
 * @namespace CustomNumericField
 */
const CustomNumericField = (props: CustomNumericFieldProps): JSX.Element => {

    const error = props.value < props.minValue || (props.maxValue !== undefined && props.value > props.maxValue)
    const [helperText, setHelperText] = React.useState<string>('')

    useEffect(() => {
        if (props.maxValue) {
            setHelperText(`Il valore inserito deve essere compreso tra ${props.minValue} e ${props.maxValue}`)
        } else {
            setHelperText(`Il valore inserito deve essere maggiore o uguale a ${props.minValue}`)
        }
    }, [props.minValue, props.maxValue])

    return (
        <TextField
            label={props.label}
            value={props.value}
            onChange={props.onChange}
            type='number'
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            error={error}
            helperText={error && helperText}
            disabled={props.disabled}
        />
    )
}

export default CustomNumericField