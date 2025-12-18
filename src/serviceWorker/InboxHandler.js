import BroadcastService from "./BroadcastService";
import Mailjs from "./Mailjs";

class InboxHandler {
    constructor() {
        this.interval = null;
    }

    ping() {
        this.interval = setInterval(async () => {
            Mailjs.listenInbox()
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

    startInbox() {
        if (BroadcastService.tabs.ready.size > 0 && BroadcastService.tabs.open.size > 0) {
            this.unping();
            this.ping();
        }
    }
}

let inboxhandler = new InboxHandler();
export default inboxhandler;