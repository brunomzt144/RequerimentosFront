import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'



const root = document.getElementById('root');
localStorage.removeItem('user');
localStorage.removeItem('authToken');
if (!root) {
  console.error('Root element not found! Make sure there is a div with id="root" in your index.html');
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}