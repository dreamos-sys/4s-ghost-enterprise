import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// PAKSA BACKGROUND GELAP SEBELUM REACT RENDER
document.documentElement.style.backgroundColor = '#050505';
document.body.style.backgroundColor = '#050505';
document.body.style.margin = '0';
document.body.style.padding = '0';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
