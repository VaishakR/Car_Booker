import { createTheme } from '@mui/material/styles';

const theme = createTheme({  palette: {
    mode: 'dark',
    primary: {
      main: '#FFB800', // RGB 255,184,0 - Orange/Amber
      light: '#FFCF40',
      dark: '#CC9200',
      contrastText: '#000000', // Black text on amber for higher contrast
    },
    secondary: {
      main: '#FFFFFF', // White - RGB 255,255,255
      light: '#FFFFFF',
      dark: '#E0E0E0',
      contrastText: '#000000',
    },
    background: {
      default: '#000000', // Black - RGB 0,0,0
      paper: '#111111', // Very dark surface
    },
    text: {
      primary: '#FFFFFF', // Bright white text - RGB 255,255,255
      secondary: '#FFB800', // Using primary amber color for secondary text
    },
    error: {
      main: '#FF5252',
    },
    success: {
      main: '#00FFA3', // Bright mint green
    },
    info: {
      main: '#775ADA', // Purple for info elements
    },
    warning: {
      main: '#FFB800', // Bright amber
    },
  },  typography: {
    fontFamily: [
      'Exo 2',
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif',
    ].join(','),    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
      background: 'linear-gradient(90deg, #FFFFFF 0%, #FFB800 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      background: 'linear-gradient(90deg, #FFFFFF 0%, #FFB800 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: '#FFFFFF',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#FFFFFF',
    },    h5: {
      fontWeight: 600,
      color: '#FFB800',
    },
    h6: {
      fontWeight: 600,
      color: '#FFB800',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.03em',
    },
    body1: {
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    body2: {
      fontWeight: 400,
      letterSpacing: '0.01em',
      color: '#E0E0E0',
    },
  },shape: {
    borderRadius: 4, // Reduced for more rectangular appearance
  },  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,          padding: '10px 20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(255,184,0,0.4)',
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease',
          },
        },        containedPrimary: {
          background: 'linear-gradient(135deg, #FFB800 0%, #CC9200 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
          color: '#000000',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          }
        },
        outlinedPrimary: {
          borderColor: '#FFB800',
        },
      },
    },    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #13151F 0%, #090B10 100%)',
          borderRadius: 6, // Reduced rounded corners
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,184,0,0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #FFB800, transparent)',
          },
        },
      },
    },    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        colorPrimary: {
          background: 'rgba(255,184,0,0.15)',
          border: '1px solid rgba(255,184,0,0.3)',
        },
        colorSecondary: {
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
        },
      },
    },    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(circle at 50% 0%, #1A1A1A 0%, #000000 70%)',
          backgroundAttachment: 'fixed',
          '&:before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            opacity: 0.4,
            backgroundImage: 
              'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,184,0,0.03) 10px, rgba(255,184,0,0.03) 11px)',
          }
        }
      }
    },    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to right, #111111, #000000)',
          borderBottom: '1px solid rgba(255,184,0,0.1)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    },    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255,184,0,0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFB800',
            },
          },
        }
      }
    }
  },
});

export default theme;