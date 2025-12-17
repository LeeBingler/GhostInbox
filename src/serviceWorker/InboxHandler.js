import BroadcastService from "./BroadcastService";
import Mailjs from "./Mailjs";

class InboxHandler {
    constructor() {
        this.interval = null;
        this.lastInbox = null;
    }

    ping() {
        this.interval = setInterval(async () => {
            try {
                const res = await Mailjs.listenInbox();
                const newInbox = res.data;

                if (!newInbox) return;

                if (!this.lastInbox || newInbox.length > this.lastInbox.length) {
                    this.lastInbox = newInbox;

                    BroadcastService.send("INBOX_UPDATE", res);
                }
            } catch (err) {
                BroadcastService.send("INBOX_ERROR", err);
            }
        }, 1000);
    }

    unping() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.lastInbox = null;
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