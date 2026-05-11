import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="bg-slate-900 min-h-screen">
      <App />
    </div>
  </StrictMode>,
)
