import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Sidebar from './sidebar/Sidebar.jsx'


chrome.runtime.onMessage.addListener((msg) => {
    const idContainer = "ghostinbox-app"
    let container = document.getElementById(idContainer);

    if (msg.type === "OPEN_SIDEBAR" && !container) {
        container = document.createElement('div');
        container.id = idContainer;
        document.body.appendChild(container);
        createRoot(container).render(
          <StrictMode>
              <Sidebar />
          </StrictMode>,
        );

        chrome.runtime.sendMessage({ type: "READY_FOR_EMAILS" });
    }
})