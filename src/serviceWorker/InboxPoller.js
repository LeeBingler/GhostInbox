import BroadcastService from "./BroadcastService";
import MailApiClient from "./MailApiClient";

class InboxPoller {
    constructor() {
        this.interval = null;
    }

    ping() {
        this.interval = setInterval(async () => {
            MailApiClient.getInbox()
                .then(res => BroadcastService.send("INBOX_UPDATE", res))
                .catch(err => BroadcastService.send("INBOX_ERROR", err));
        }, 1000);
    }

    unping() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    startPolling() {
        if (BroadcastService.tabs.ready.size > 0 && BroadcastService.tabs.open.size > 0) {
            this.unping();
            this.ping();
        }
    }
}

let inboxpoller = new InboxPoller();
export default inboxpoller;