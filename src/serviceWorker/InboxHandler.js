import Mailjs from "./Mailjs";

class InboxHandler {
    constructor() {
        this.emailSet = false;
        this.interval = null;
        this.dataInbox = null;
        this.tabId = null;
    }

    setTabID(tabID) {
        this.tabId = tabID;
    }

    ping() {
        this.interval = setInterval(() => {
            Mailjs.listenInbox()
                .then(res => {
                    this.dataInbox = res.data;
                    chrome.tabs.sendMessage(this.tabId, { type: "INBOX_UPDATE", response: res });
                })
                .catch(err => {
                    chrome.tabs.sendMessage(this.tabId, { type: "INBOX_ERROR", response: err });
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