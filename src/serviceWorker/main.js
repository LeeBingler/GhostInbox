import Mailjs from "./Mailjs";
import InboxHandler from "./InboxHandler";

const readyTabs = new Set();
const openTabs = new Set();
InboxHandler.setInboxReadyTabSet(readyTabs);
InboxHandler.setInboxOpenTabsSet(openTabs);

// Handshake
chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.type === "READY_FOR_EMAILS" && sender.tab?.id != null) {
        readyTabs.add(sender.tab.id);
    }
});

chrome.action.onClicked.addListener((tab) => {
    if (!tab.id) return;
    chrome.tabs.sendMessage(tab.id, {type: "OPEN_SIDEBAR"});
    openTabs.add(tab.id);
});

chrome.tabs.onRemoved.addListener((tabId) => {
    readyTabs.delete(tabId);
    openTabs.delete(tabId);

    if (readyTabs.size === 0 || openTabs.size === 0) {
        InboxHandler.unping();
    }
});

// Listener to receive for sidebar / content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GENERATE_EMAIL") {
        Mailjs.createAccount()
            .then((res) => {
                sendResponse(res);
                InboxHandler.startInbox();
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

    if (message.type === "GET_CURRENT_MAIL") {
        let res = Mailjs.getEmail();
        sendResponse(res);

        if (res.status) {
            InboxHandler.startInbox();
        }
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
