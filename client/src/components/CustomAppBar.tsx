import {
    AppBar,
    Box,
    Button,
    CssBaseline,
    Toolbar,
    Typography
} from '@mui/material'

import { JSX } from 'react'
import { useAuth } from './utils/AuthProvider'
import { useNavigate } from 'react-router-dom'

/**
 * @description
 * Props dell'AppBar personalizzata
 * @namespace CustomAppBar.CustomAppBarProps
 */
interface CustomAppBarProps {
    title: string
}

/**
 * @namespace CustomAppBar
 * @description
 * Visualizza una AppBar personalizzata (MUI) \
 * L'AppBar contiene un titolo e un pulsante per effettuare il {@link AuthProvider.logout} \
 * Il componente utilizza il context provider {@link AuthProvider}.
 * @example
 * <CustomAppBar title="Titolo" />
 * @see https://mui.com/components/app-bar/
 * @param {CustomAppBar.CustomAppBarProps} props Il titolo dell'AppBar
 * @returns {JSX.Element} L'AppBar personalizzata
 */
export const CustomAppBar = (props: CustomAppBarProps): JSX.Element => {

    const auth = useAuth()

    const navigate = useNavigate()

    return (
        <Box sx={{ flexGrow: 1 }}>
            <CssBaseline />
            <AppBar
                position="sticky"
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}>
                        {props.title}
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={async () => {
                            await auth.logout();
                            navigate("/")
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}