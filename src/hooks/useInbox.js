import { useState, useEffect } from "react";

export default function useInbox(isDelete) {
    const [dataInbox, setDataInbox] = useState([]);

    useEffect(() => {
        const listener = (msg) => {
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
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, []);

    // Reset quand isDelete change
    useEffect(() => {
        setDataInbox([]);
    }, [isDelete]);

    return { dataInbox, setDataInbox };
}