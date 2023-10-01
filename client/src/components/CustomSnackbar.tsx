import { Alert, AlertColor, Snackbar } from "@mui/material"

export type SnackbarInfoType = {
    message: string;
    severity: AlertColor;
};

interface CustomSnackbarProps {
    open: boolean
    setOpen: (open: boolean) => void
    snackbarInfo: SnackbarInfoType
    duration?: number
    handleClose?: () => void
}

/**
 * @description
 * Visualizza una Snackbar personalizzata (MUI Snackbar) \
 * Al termine della durata, la Snackbar si chiude automaticamente. \
 * La Snackbar contiene:
 * - un messaggio
 * - un colore (success, error, warning, info)
 * @example
 * <CustomSnackbar
 *   open={open}
 *   setOpen={setOpen}
 *   message="Prenotazione eliminata con successo"
 *   severity="success"
 * />
 * @param props I parametri della Snackbar
 * @returns La Snackbar personalizzata
 */
export const CustomSnackbar = (props: CustomSnackbarProps): JSX.Element => {

    const handleClose = (): void => {
        props.setOpen(false)
    }

    return (
        <Snackbar
            open={props.open}
            autoHideDuration={props.duration || 2000}
            onClose={props.handleClose || handleClose}
        >
            <Alert onClose={props.handleClose || handleClose} severity={props.snackbarInfo.severity}>
                {props.snackbarInfo.message}
            </Alert>
        </Snackbar>
    )
}