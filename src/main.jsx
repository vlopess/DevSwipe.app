import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import DevSwipeLanding from "./App.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DevSwipe from "./DevSwipe.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<DevSwipeLanding/>} />
              <Route path="/jobs" element={<DevSwipe />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
