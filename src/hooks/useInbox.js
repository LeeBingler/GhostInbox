import { useState, useEffect } from "react";

export default function useInbox() {
    const [dataInbox, setDataInbox] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const listener = (msg) => {
            if (!isMounted) return;

            if (msg.type === "INBOX_UPDATE" || msg.type === "INBOX_ERROR") {
                if (!msg.response.data) return false;

                setDataInbox(prev => {
                    const oldLen = prev?.length ?? 0;
                    const newLen = msg.response.data.length;

                    if (newLen > oldLen) {
                        return msg.response.data;
                    }

                    return prev;
                });
            }
        };

        chrome.runtime.onMessage.addListener(listener);
        return () => {
            isMounted = false;
            chrome.runtime.onMessage.removeListener(listener)
        };
    }, []);

    return { dataInbox, setDataInbox };
}