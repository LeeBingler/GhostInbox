import { useState, useEffect } from "react";

export default function useSidebarOpen() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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