import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TodoProvider } from './contexts/todoContexts.jsx'
import { UserProvider } from './contexts/UserContext.jsx'
import { GroupProvider } from './contexts/GroupContexts.jsx';
import { NotificationProvider } from './contexts/NotificationContexts.jsx';
import { FeedbackProvider } from './contexts/FeedbackContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, purple } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import { orange } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import TodoDrawer from './components/Layout/TodoDrawer/TodoDrawer'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const theme = createTheme({
  palette: {
    cancel: {
      main: red[800],
    },
    success: {
      main: green[500],
    },
    primary: {
      main: purple[700],
    },
    secondary: {
      main: orange[500],
    },
    error: {
      main: red[800],
    },
    neutral: {
      main: blue[700],
    },
    white: {
      main: '#FFFFFF',
    },
    forestGreen: {
      main: '#126912',
    },
  },


  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: '2em',
          border: '1px solid rgba(0, 0, 0, 0.23)',
        },
      },
    },
  },
});

function Main() {
  useEffect(() => {
    document.body.style.setProperty('--primary-color', theme.palette.primary.main);
    document.body.style.setProperty('--secondary-color', theme.palette.secondary.main);
    document.body.style.setProperty('--error-color', theme.palette.error.main);
    document.body.style.setProperty('--cancel-color', theme.palette.cancel.main);
    document.body.style.setProperty('--success-color', theme.palette.success.main);
    document.body.style.setProperty('--neutral-color', theme.palette.neutral.main);
    document.body.style.setProperty('--forestGreen-color', theme.palette.forestGreen.main);
  }, []);

  return (

    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>

        <UserProvider>
          <GroupProvider>
            <TodoProvider>
              <NotificationProvider>
                <FeedbackProvider>
                  <ToastContainer
                    newestOnTop={true}
                    theme='colored'
                    position="top-center"
                    closeOnClick
                    draggable
                    pauseOnHover={false}
                    pauseOnFocusLoss={false}
                    autoClose={500}
                  />
                  <TodoDrawer />
                  <App />
                </FeedbackProvider>
              </NotificationProvider>

            </TodoProvider>
          </GroupProvider>
        </UserProvider>
      </ThemeProvider>
    </I18nextProvider>

  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);