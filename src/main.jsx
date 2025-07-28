import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import InvoilaContextProvider from './context/InvoilaContext.jsx'

createRoot(document.getElementById('root')).render(
      <InvoilaContextProvider>
        <App/>
    </InvoilaContextProvider>
)
