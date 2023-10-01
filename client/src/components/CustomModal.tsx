import { Box, Modal } from "@mui/material"
import { ReactNode, JSX } from "react"

const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
}

/**
 * @description
 * Props del modal personalizzato
 * @namespace CustomModal.CustomModalProps
 */
interface CustomModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    children: ReactNode | ReactNode[]
}

/**
 * @namespace CustomModal
 * @description
 * Visualizza un modal personalizzato (MUI) \
 * Il modal contiene un contenuto personalizzabile.
 * @example
 * <CustomModal open={true} setOpen={setOpen}>
 *     <h1>Titolo</h1>
 *     <p>Contenuto</p>
 * </CustomModal>
 * @see https://mui.com/components/modal/
 * @param {CustomModal.CustomModalProps} props Il contenuto del modal e la funzione per chiuderlo
 * @returns {JSX.Element} Il modal personalizzato
 */
export const CustomModal = (props: CustomModalProps): JSX.Element => {

    /**
     * @description
     * Se il modal è aperto, lo chiude. \
     * Altrimenti lo apre.
     * @example
     * <Button onClick={toggleModal}>Apri o chiudi il modal</Button>
     * @returns {void}
     * @memberof CustomModal
     */
    const toggleModal = (): void => {
        props.setOpen(!props.open)
    }

    return (
        <Modal
            open={props.open}
            onClose={toggleModal}
            keepMounted
        >
            <Box sx={boxStyle}>
                {props.children}
            </Box>
        </Modal>
    )
}

export default CustomModal