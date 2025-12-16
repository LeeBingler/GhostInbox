import Mailjs from "./Mailjs";
import InboxHandler from "./InboxHandler";
import ChromeStorageHandler from "./ChromeStorageHandler";

const readyTabs = new Set();
const openTabs = new Set();
InboxHandler.setInboxReadyTabSet(readyTabs);
InboxHandler.setInboxOpenTabsSet(openTabs);

async function restoreMailSession() {
    let res = await ChromeStorageHandler.getStorage();
    if (!res.status) return res;

    let { address, password } = res.account.ghostInboxAccount;

    let loginRes = await Mailjs.login(address, password);
    if (!loginRes.status) return loginRes;

    return {
            status: true,
            statusCode: loginRes.statusCode,
            message: "ok",
            data: {
                address,
                password,
            },
        };
}

chrome.runtime.onStartup.addListener(() => {
    restoreMailSession();
});

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
        ChromeStorageHandler.clearStorage();
    }
});

// Listener to receive for sidebar / content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GENERATE_EMAIL") {
        Mailjs.createAccount()
            .then((res) => {
                sendResponse(res);
                InboxHandler.startInbox();
                ChromeStorageHandler.setStorage(res.data.address, res.data.password);
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
        (async () => {
            let res = await restoreMailSession();
            sendResponse(res);

            if (res.status) {
                InboxHandler.startInbox();
            }
        })();

        return true;
    }

    if (message.type === "DELETE_ACCOUNT") {
        Mailjs.deleteMe()
            .then((res) => {
                sendResponse(res);
                InboxHandler.unping();
                ChromeStorageHandler.clearStorage();
            })
            .catch(err => sendResponse(err));

        return true
    }
});
