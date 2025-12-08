import MailPreview from "./MailPreview";

import useSendMessage from "../../hooks/useSendMessage";
import useInbox from "../../hooks/useInbox";

import "./styles.css"

export default function Inbox({isDelete, setEmailIDClicked}) {
    const { loading, error, sendMessage } = useSendMessage("LISTEN_INBOX");
    const { dataInbox, setDataInbox } = useInbox(isDelete);

    return (
        <div className="inbox-container">
            <div className="inboxheader-container">
                <div className="inboxheader-div">
                    <h2> Inbox </h2>
                    <button disabled={loading} onClick={async () => {
                        const res = await sendMessage();
                        setDataInbox(res.data);
                    }}>
                        {loading ? "Retreive message..." : "Update message"}
                    </button>
                </div>
                {error && (
                    <p className="error">⚠️ Error: {error}</p>
                )}
            </div>

            <div className="mailpreview-container">
                {dataInbox && dataInbox.map((element, i) => (
                    <MailPreview key={i} data={element} setEmailIDClicked={setEmailIDClicked}/>
                ))}
            </div>
        </div>
    )
}