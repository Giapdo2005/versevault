// src/main.jsx
//
// This is the very first JavaScript file that runs.
// Its only job: mount the React app onto the HTML page.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './styles/global.css'

// ReactDOM.createRoot finds our <div id="root"> in index.html
// and hands it to React to control.
//
// StrictMode is a development helper — it intentionally double-renders
// components to help you catch bugs early. It has no effect in production.
//
// BrowserRouter gives our app access to the URL bar so we can
// navigate between pages without a full page reload.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
