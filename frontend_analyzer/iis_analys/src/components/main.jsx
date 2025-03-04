import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GetStatsByendpoint from './GetStatsByendpoint.jsx'
import CollapseStats from './CollapseStats.jsx'
import LayoutPage from './LayoutPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LayoutPage />
    {/* <CollapseStats /> */}
  </StrictMode>,
)
