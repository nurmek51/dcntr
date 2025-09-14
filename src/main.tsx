import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import DestinationPrediction from './pages/DestinationPrediction.tsx'
import MapPage from './pages/MapPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/destination-prediction" element={<DestinationPrediction />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
