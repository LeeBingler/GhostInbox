import InboxPoller from "./InboxPoller";
import { messageRouter } from "./MessageRouter";
import ChromeStorageHandler from "./ChromeStorageHandler";
import MailSessionService from "./MailSessionService";
import BroadcastService, { TAB_STATES } from "./BroadcastService";

/* Startup */
chrome.runtime.onStartup.addListener(() => {
    MailSessionService.restore();
});

/* Handshake */
chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.type === "READY_FOR_EMAILS" && sender.tab?.id != null) {
        BroadcastService.register(TAB_STATES.READY, sender.tab.id);
    }
});

/* Action */
chrome.action.onClicked.addListener((tab) => {
    if (!tab.id) return;
    chrome.tabs.sendMessage(tab.id, {type: "OPEN_SIDEBAR"});
    BroadcastService.register(TAB_STATES.OPEN, tab.id);
});

/* Tabs lifecycle */
chrome.tabs.onRemoved.addListener((tabId) => {
    BroadcastService.unregister(TAB_STATES.READY, tabId);
    BroadcastService.unregister(TAB_STATES.OPEN, tabId);

    if (readyTabs.size === 0 || openTabs.size === 0) {
        InboxPoller.unping();
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
