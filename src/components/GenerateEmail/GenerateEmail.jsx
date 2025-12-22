import useGenerateEmail from "../../hooks/useGenerateEmail";
import CopyClipboardButton from "./CopyClipboardButton";

import "./styles.css"

export default function GenerateEmail() {
    const { data, loading, error, sendMessage } = useGenerateEmail();

    return (
        <div className="generateEmail-container">
            <button disabled={loading} onClick={() => sendMessage()}>
                {loading ? "Generating..." : "Generate Email"}
            </button>

            {data && (
                <div className="generateEmail-datacontainer">
                    <CopyClipboardButton email={data.address}/>
                    <p className="email">
                        <strong>Email :</strong> {data.address}
                    </p>
                </div>
            )}

            {error && (
                <p className="error">⚠️ Error: {error}</p>
            )}
        </div>
    )
}