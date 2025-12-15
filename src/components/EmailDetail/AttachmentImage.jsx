import { useEffect, useState } from "react";
import useSendMessage from "../../hooks/useSendMessage";

export default function AttachmentImage({ downloadUrl, filename }) {
    const { data, loading, error, sendMessage } = useSendMessage("GET_ATTACHEMENT");
    const [src, setSRC] = useState(null);

    useEffect(() => {
        let isMounted = true;

        sendMessage({link: downloadUrl})
            .then((res) => {
                if (isMounted)
                    setSRC(res.data)
            })
            .catch((e) => console.error(e))

        return () => {
            isMounted = false;
        }
    }, [downloadUrl])

    if (loading) return <p>Attachement loading...</p>
    if (error || data == null) return <p className="error">⚠️ Error: {error || "data null"}</p>

    return <img src={src} alt={filename} style={{ maxWidth: "100%" }} />;
}