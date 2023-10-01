import { ReactNode, useMemo, JSX } from 'react'
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material'

interface CustomThemeProviderProps {
    children: ReactNode | ReactNode[]
}

/**
 * @description
 * Imposta il tema dell'applicazione in base alle preferenze del sistema. \
 * Questo componente influisce su tutti i componenti figli facenti parte della libreria Material UI. \
 * Utilizza il context provider {@link https://mui.com/material-ui/customization/theming/#theme-provider | ThemeProvider} di Material UI per impostare il tema.
 * @see https://mui.com/material-ui/customization/theming/#theme-provider
 * @param {CustomThemeProviderProps} props I componenti figli
 * @returns {JSX.Element} il tema dell'applicazione
 * @namespace CustomThemeProvider
 */
export const CustomThemeProvider = (props: CustomThemeProviderProps): JSX.Element => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    /**
     * @description
     * Crea un tema in base alle preferenze del sistema \
     * Memoizza il tema in modo che non venga ricreato ad ogni render
     * @see https://mui.com/customization/theming/#createtheme-options-args-theme
     * @see https://react.dev/reference/react/useMemo
     * @memberof CustomThemeProvider
     */
    const theme = useMemo(() =>
        createTheme({ palette: { mode: prefersDarkMode ? 'dark' : 'light' } }),
        [prefersDarkMode]
    )

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {props.children}
            </ThemeProvider>
        </>
    )
}

export default CustomThemeProvider