class ChromeStorageHandler {
    constructor(){
        this.keyAccount = "ghostInboxAccount";
    }

    setStorage(address, password) {
        return chrome.storage.local.set({
            ghostInboxAccount: { address, password }
        });
    }

    async getStorage() {
        let account = await chrome.storage.local.get(this.keyAccount);
        let status = true;
        let message = "ok"

        if (!account || !account?.ghostInboxAccount || !account?.ghostInboxAccount?.address || !account?.ghostInboxAccount?.password) {
            status = false;
            message = "no account found";
        }

        return {
            status,
            message,
            account
        }
    }

    clearStorage() {
        return chrome.storage.local.remove(this.ghostInboxAccount);
    }
}

const chromeStorageHandler = new ChromeStorageHandler();
export default chromeStorageHandler;