import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TodoProvider } from './contexts/todoContexts.jsx'
import { UserProvider } from './contexts/UserContext.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <UserProvider>
      <TodoProvider>
      <ToastContainer 
      newestOnTop={true}
      theme='colored'
      position="top-center" 
      closeOnClick
      draggable
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      autoClose={3000}
      />
        <App />
      </TodoProvider>
    </UserProvider>
  </React.StrictMode>,
)
