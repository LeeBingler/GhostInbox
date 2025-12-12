import Mailjs from "./Mailjs";
import InboxHandler from "./InboxHandler";

const readyTabs = new Set();

// Handshake
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "READY_FOR_EMAILS" && sender.tab?.id != null) {
        readyTabs.add(sender.tab.id);
        Mailjs.getEmail()
            .then(res => sendResponse(res))
            .catch(error => sendResponse(error))
    }
});

chrome.action.onClicked.addListener((tab) => {
    if (!tab.id) return;
    chrome.tabs.sendMessage(tab.id, {type: "OPEN_SIDEBAR"});
});

// Listener to receive for sidebar / content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GENERATE_EMAIL") {
        Mailjs.createAccount()
            .then((res) => {
                sendResponse(res);
                InboxHandler.setTabID(sender.tab.id);
                InboxHandler.ping();
            })
            .catch(err => sendResponse(err));

        return true;
    }

    if (message.type === "LISTEN_INBOX") {
        Mailjs.listenInbox()
            .then(res => sendResponse(res))
            .catch(err => sendResponse(err));
        return true;
    }

    if (message.type === "GET_MESSAGE") {
        Mailjs.getMessage(message.data.id)
            .then(res => sendResponse(res))
            .catch(err => sendResponse(err));
        return true;
    }

    if (message.type === "GET_ATTACHEMENT") {
        Mailjs.getAttachementImage(message.data.link)
            .then(res => sendResponse(res))
            .catch(err => sendResponse(err));
        return true;
    }

    if (message.type === "DELETE_ACCOUNT") {
        Mailjs.deleteMe()
            .then((res) => {
                sendResponse(res);
                InboxHandler.unping();
            })
            .catch(err => sendResponse(err));

        return true
    }
});
