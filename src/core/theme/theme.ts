import { createTheme, PaletteMode } from '@mui/material'

/**
 * Paleta estilo Notion/Linear: blanco puro + azul eléctrico como acento.
 * Minimalista, mucho espacio, tipografía Inter.
 */
export function createAppTheme(mode: PaletteMode) {
  const isLight = mode === 'light'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563EB',
        dark: '#1D4ED8',
        light: '#3B82F6',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#7C3AED',
        dark: '#6D28D9',
        light: '#8B5CF6',
        contrastText: '#ffffff',
      },
      background: isLight
        ? { default: '#F8FAFC', paper: '#FFFFFF' }
        : { default: '#0F172A', paper: '#1E293B' },
      text: isLight
        ? { primary: '#0F172A', secondary: '#64748B' }
        : { primary: '#F1F5F9', secondary: '#94A3B8' },
      success: { main: '#059669', light: '#10B981', dark: '#047857', contrastText: '#fff' },
      warning: { main: '#D97706', light: '#F59E0B', dark: '#B45309', contrastText: '#fff' },
      error:   { main: '#DC2626', light: '#EF4444', dark: '#B91C1C', contrastText: '#fff' },
      info:    { main: '#0EA5E9', light: '#38BDF8', dark: '#0284C7', contrastText: '#fff' },
      divider: isLight ? 'rgba(15,23,42,0.08)' : 'rgba(241,245,249,0.08)',
    },
    typography: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontSize: 15,
      h1: { fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 },
      h2: { fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25 },
      h3: { fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
      h4: { fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontSize: 15, fontWeight: 600 },
      h6: { fontSize: 14, fontWeight: 600 },
      subtitle1: { fontSize: 15, fontWeight: 500 },
      subtitle2: { fontSize: 13, fontWeight: 600, letterSpacing: '0.01em' },
      body1: { fontSize: 15 },
      body2: { fontSize: 13 },
      caption: { fontSize: 12 },
      button: { fontWeight: 600, textTransform: 'none', fontSize: 14 },
    },
    shape: { borderRadius: 12 },
    shadows: [
      'none',
      '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
      '0 4px 6px rgba(15,23,42,0.05), 0 2px 4px rgba(15,23,42,0.04)',
      '0 10px 15px rgba(15,23,42,0.07), 0 4px 6px rgba(15,23,42,0.05)',
      '0 20px 25px rgba(15,23,42,0.08), 0 10px 10px rgba(15,23,42,0.04)',
      '0 25px 50px rgba(15,23,42,0.12)',
      ...Array(19).fill('none'),
    ] as any,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            border: `1px solid ${isLight ? 'rgba(15,23,42,0.07)' : 'rgba(241,245,249,0.08)'}`,
            boxShadow: isLight
              ? '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)'
              : '0 4px 16px rgba(0,0,0,0.3)',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            '&:hover': {
              boxShadow: isLight
                ? '0 8px 24px rgba(37,99,235,0.10), 0 2px 8px rgba(15,23,42,0.06)'
                : '0 8px 24px rgba(0,0,0,0.4)',
            },
          }),
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '24px',
            '&:last-child': { paddingBottom: '24px' },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: 'none',
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: 14,
            '&:hover': { boxShadow: 'none', opacity: 0.92 },
          },
          sizeSmall: { padding: '6px 14px', fontSize: 13 },
          sizeLarge: { padding: '14px 28px', fontSize: 15 },
          containedPrimary: {
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 500, fontSize: 12 },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              minHeight: 48,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            minHeight: 48,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-root': {
              minHeight: 52,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '14px 16px',
            fontSize: 14,
          },
          head: {
            fontWeight: 700,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-root': {
              backgroundColor: isLight ? '#F1F5F9' : '#1E293B',
              color: isLight ? '#475569' : '#94A3B8',
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
            borderRight: `1px solid ${isLight ? 'rgba(15,23,42,0.08)' : 'rgba(241,245,249,0.08)'}`,
            boxShadow: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
            borderBottom: `1px solid ${isLight ? 'rgba(15,23,42,0.08)' : 'rgba(241,245,249,0.08)'}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: 'rgba(37,99,235,0.08)',
              '&:hover': { backgroundColor: 'rgba(37,99,235,0.12)' },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 16 },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isLight ? 'rgba(15,23,42,0.08)' : 'rgba(241,245,249,0.08)',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { borderRadius: 8, fontSize: 12, fontWeight: 500 },
        },
      },
    },
  })
}
