import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#2C3E50', light: '#34495E', dark: '#1B2631' },
        secondary: { main: '#1ABC9C', light: '#48C9B0', dark: '#148F77' },
        success: { main: '#27AE60', light: '#58D68D', dark: '#1E8449' },
        error: { main: '#E74C3C', light: '#F1948A', dark: '#C0392B' },
        warning: { main: '#F39C12', light: '#F8C471', dark: '#D68910' },
        background: { default: '#F8F9FA', paper: '#FFFFFF' },
        text: { primary: '#2C3E50', secondary: '#7F8C8D' }
    },
    typography: {
        fontFamily: '"Roboto", "Open Sans", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700, color: '#2C3E50', marginBottom: '1rem' },
        h6: { fontWeight: 600, color: '#2C3E50' },
        body1: { color: '#34495E' }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                }
            }
        },
        MuiTableHead: {
            styleOverrides: { root: { backgroundColor: '#F8F9FA' } }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    color: '#2C3E50',
                    borderBottom: '2px solid #E8F4FD'
                }
            }
        }
    }
});

export default theme;