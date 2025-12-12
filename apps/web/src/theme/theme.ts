import { createTheme } from '@mui/material/styles'

import { tokens } from './tokens'

export const theme = createTheme({
  palette: {
    primary: tokens.palette.primary,
    secondary: tokens.palette.secondary,
    success: tokens.palette.success,
    error: tokens.palette.error,
    warning: tokens.palette.warning,
    background: tokens.palette.background,
    text: tokens.palette.text,
  },
  typography: {
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.fontSize.md,
  },
  spacing: (factor: number) => tokens.spacing.sm * factor,
  shape: {
    borderRadius: tokens.radii.md,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: tokens.radii.md,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.lg,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.lg,
        },
      },
    },
  },
})
