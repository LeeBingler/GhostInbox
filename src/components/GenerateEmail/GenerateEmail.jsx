import { useEffect } from "react";

import useSendMessage from "../../hooks/useSendMessage";

import "./styles.css"

export default function GenerateEmail({isDelete}) {
    const { data, loading, error, sendMessage, resetAll } = useSendMessage("GENERATE_EMAIL");
    
    useEffect(() => {
        resetAll();
    }, [isDelete]) // Check why delete is not working

    return (
        <div className="generateEmail-container">
            <button disabled={loading} onClick={sendMessage}>
                {loading ? "Generating..." : "Generate Email"}
            </button>

            {data && (
                <div>
                    <p className="email">
                        <strong>Email :</strong> {data.address}
                    </p>
                    <p className="password">
                        <strong>Password :</strong> {data.password}
                    </p>
                </div>
            )}

            {error && (
                <p className="error">⚠️ Error: {error}</p>
            )}
        </div>
    )
}