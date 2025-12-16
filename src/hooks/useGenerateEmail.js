import { useState, useEffect } from "react";

import sendMessageAsync from "../utils/sendMessageAsync";

export default function useGenerateEmail() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const message = "GENERATE_EMAIL";

    useEffect(() => {
        let isMounted = true;

        const sender = (msg) => {
            if (msg.type === "OPEN_SIDEBAR") {
                sendMessageAsync({type: "GET_CURRENT_MAIL"})
                .then(res => {
                    if (isMounted && res.status) {
                        setData(res.data);
                    }
                })
            }
        };

        chrome.runtime.onMessage.addListener(sender);
        return () => {
            isMounted = false;
            chrome.runtime.onMessage.removeListener(sender);
        }
    }, []);

    async function sendMessage(data = null) {
        setLoading(true);
        setError(null);

        const response = await sendMessageAsync({ type: message, data: data });
        console.log(message, response);
        if (response.status) {
            setData(response.data);
        } else {
            setError(response.message || "Unknown error");
        }

        setLoading(false);
        return response;
    }

    function resetAll() {
        setData(null);
        setLoading(false);
        setError(null);
    }

    return {
        data,
        loading,
        error,
        sendMessage,
        resetAll
    };
}
