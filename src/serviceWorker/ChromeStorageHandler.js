class ChromeStorageHandler {
    constructor(){
        this.keyAccount = "ghostInboxAccount";
    }

    setStorage(address, password) {
        return chrome.storage.local.set({
            ghostInboxAccount: { address, password }
        });
    }

    getStorage() {
        let account = chrome.storage.local.get(this.keyAccount);
        let status = true;

        if (!account)
            status = false;

        return {
            status,
            account
        }
    }
}

const chromeStorageHandler = new ChromeStorageHandler();
export default chromeStorageHandler;