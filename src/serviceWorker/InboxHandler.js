import Mailjs from "./Mailjs";

class InboxHandler {
    constructor() {
        this.interval = null;
        this.dataInbox = null;
        this.tabIdSet = null;
    }

    setInboxSet(setTab) {
        this.tabIdSet = setTab;
    }

    setInboxHandler() {
        this.unping();
        this.ping();
    }

    setTabID(tabID) {
        this.tabId = tabID;
    }

    ping() {
        this.interval = setInterval(() => {
            Mailjs.listenInbox()
                .then(res => {
                    this.dataInbox = res.data;
                    this.tabIdSet.forEach(tabId => {
                        chrome.tabs.sendMessage(tabId, { type: "INBOX_UPDATE", response: res });
                    });
                })
                .catch(err => {
                    this.tabIdSet.forEach(tabId => {
                        chrome.tabs.sendMessage(tabId, { type: "INBOX_ERROR", response: err });
                    });
                });
        }, 1000);
    }

    unping() {
        if (this.interval)
            clearInterval(this.interval);
    }
}

let inboxhandler = new InboxHandler();
export default inboxhandler;