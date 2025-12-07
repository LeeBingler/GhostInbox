import { useState } from "react";

import sendMessageAsync from "../utils/sendMessageAsync";

export default function useSendMessage(message) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function sendMessage() {
        setLoading(true);
        setError(null);

        const response = await sendMessageAsync({ type: message });
        //console.log(message, response);
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
