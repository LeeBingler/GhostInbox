export default function CopyClipboardButton ({data}) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(data);
    }

    return (
        <button onClick={copyToClipboard}>
            Copy
        </button>
    )
}