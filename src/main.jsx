import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TodoProvider, useTodoContext } from './contexts/todoContexts.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TodoProvider>
    <App />
    </TodoProvider>
  </React.StrictMode>,
)
