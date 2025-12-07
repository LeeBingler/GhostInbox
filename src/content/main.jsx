import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Sidebar from './sidebar/Sidebar.jsx'

const container = document.createElement('div')
container.id = 'crxjs-app'
document.body.appendChild(container)
createRoot(container).render(
  <StrictMode>
    <Sidebar/ >
  </StrictMode>,
)

chrome.runtime.sendMessage({ type: "READY_FOR_EMAILS" });