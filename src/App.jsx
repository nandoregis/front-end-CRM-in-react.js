import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

function App() {

  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes/>
        </AuthProvider>
      </ToastProvider>
    </>
  )
}

export default App
