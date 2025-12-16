import InboxHandler from "./InboxHandler";
import { messageRouter } from "./MessageRouter";
import ChromeStorageHandler from "./ChromeStorageHandler";
import MailSessionService from "./MailSessionService";

const readyTabs = new Set();
const openTabs = new Set();
InboxHandler.setInboxReadyTabSet(readyTabs);
InboxHandler.setInboxOpenTabsSet(openTabs);

/* Startup */
chrome.runtime.onStartup.addListener(() => {
    MailSessionService.restore();
});

/* Handshake */
chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.type === "READY_FOR_EMAILS" && sender.tab?.id != null) {
        readyTabs.add(sender.tab.id);
    }
});

/* Action */
chrome.action.onClicked.addListener((tab) => {
    if (!tab.id) return;
    chrome.tabs.sendMessage(tab.id, {type: "OPEN_SIDEBAR"});
    openTabs.add(tab.id);
});

/* Tabs lifecycle */
chrome.tabs.onRemoved.addListener((tabId) => {
    readyTabs.delete(tabId);
    openTabs.delete(tabId);

    if (readyTabs.size === 0 || openTabs.size === 0) {
        InboxHandler.unping();
        ChromeStorageHandler.clearStorage();
    }
});

/* Message router */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const handler = messageRouter[message.type];
    if (!handler) return;

    handler(message, sendResponse);
    return true;
});
