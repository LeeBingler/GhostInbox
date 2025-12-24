import { useState, useEffect } from "react";

export default function useSidebarOpen() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Launch animation when the sidebar is for the inject in the DOM
    useEffect(() => {
        setSidebarOpen(true);
    }, []);

    useEffect(() => {
        const listener = (msg) => {
            if (msg.type === "OPEN_SIDEBAR") {
                setSidebarOpen(prev => !prev);
            }
        };

        chrome.runtime.onMessage.addListener(listener);
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, []);

    return { sidebarOpen };
}