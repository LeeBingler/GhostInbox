export const TAB_STATES = {
    READY: "ready",
    OPEN: "open"
}

class BroadcastService {
    constructor() {
        // Make this class a singleton
        if (BroadcastService._instance)
            return BroadcastService._instance;
        BroadcastService._instance = this;

        this.tabs = {
            [TAB_STATES.READY]: new Set(),
            [TAB_STATES.OPEN]: new Set(),
        };
    }

    register(type, tabId) {
        if (!this.tabs[type]) return;
        this.tabs[type]?.add(tabId);
    }

    unregister(type, tabId) {
        if (!this.tabs[type]) return;
        this.tabs[type]?.delete(tabId);
    }

    _getActiveTabs() {
         return [...this.tabs.ready].filter(tabId =>
            this.tabs.open.has(tabId)
        );
    }

    send(type, payload) {
        this._getActiveTabs().forEach(tabId => {
            chrome.tabs.sendMessage(tabId, {
                type,
                payload,
            });
        });
    }
}

export default new BroadcastService();