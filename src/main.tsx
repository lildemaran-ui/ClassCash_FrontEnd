import ReactDOM from "react-dom/client"
import './index.css'
import React from 'react'

import { BrowserRouter } from 'react-router-dom'
import App from "./App"
import { InstitutionProvider } from "./Pages/Administrador/GestaoInstituicaoAdmin/InstitutionContext "
import { Toaster } from "sonner"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Toaster position="bottom-right" richColors closeButton/>
    <InstitutionProvider>
      <App/>
      </InstitutionProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
