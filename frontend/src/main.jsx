import React from 'react'
import ReactDOM from 'react-dom/client'
import './config/firebase-config.js' // maybe i will remove it
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
