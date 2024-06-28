import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import Navigation from './pages/navigation/navigation.jsx'
import DiseaseProvider from './context/diseaseContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <DiseaseProvider>
    <Navigation />
    <App />
    </DiseaseProvider>
  </BrowserRouter>,
)
