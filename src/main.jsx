import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TodoProvider } from './contexts/todoContexts.jsx'
import { UserProvider } from './contexts/UserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
    <TodoProvider>
    <App />
    </TodoProvider>
    </UserProvider>
  </React.StrictMode>,
)
