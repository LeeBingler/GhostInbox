import Mailjs from "./Mailjs";

class InboxHandler {
    constructor() {
        this.interval = null;
        this.dataInbox = null;
        this.tabIdReadySet = null;
        this.tabIdOpenSet = null;
        this.activeTab = null;
    }

    setInboxReadyTabSet(setTab) {
        this.tabIdReadySet = setTab;
    }

    setInboxOpenTabsSet(setTab) {
        this.tabIdOpenSet = setTab;
    }

    setTabID(tabID) {
        this.tabId = tabID;
    }

    getActiveTabs() {
        return [...this.tabIdReadySet]
            .filter(tabId => this.tabIdOpenSet.has(tabId));
    }

    ping() {
        this.interval = setInterval(() => {
            Mailjs.listenInbox()
                .then(res => {
                    this.dataInbox = res.data;
                    console.log("---interval ping---");
                    this.tabIdReadySet.forEach(tabId => {
                        chrome.tabs.sendMessage(tabId, { type: "INBOX_UPDATE", response: res });
                        console.log(tabId, res)
                    });
                })
                .catch(err => {
                    this.tabIdReadySet.forEach(tabId => {
                        chrome.tabs.sendMessage(tabId, { type: "INBOX_ERROR", response: err });
                    });
                });
        }, 1000);
    }

    unping() {
        if (this.interval)
            clearInterval(this.interval);
    }

    startInbox() {
        if (this.tabIdReadySet.size > 0 && this.tabIdOpenSet.size > 0) {
            this.unping();
            this.ping();
        }
    }
}

let inboxhandler = new InboxHandler();
export default inboxhandler;