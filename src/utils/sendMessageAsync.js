export default function sendMessageAsync(message) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
            resolve(response);
        });
    });
}
