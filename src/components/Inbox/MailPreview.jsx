import formatDate from "../../utils/formatDate";

export default function MailPreview({data, setEmailIDClicked}) {
    const { from, intro, id, subject, updatedAt } = data;

    return (
        <div className="mailpreview-card" onClick={() => setEmailIDClicked(id)}>
            <div className="mailpreview-header">
                <p className="from">{from.name}</p>
                <p className="date">{formatDate(updatedAt)}</p>
            </div>
            <p className="subject">{subject}</p>
            <p className="intro">{intro}</p>
        </div>
    )
}