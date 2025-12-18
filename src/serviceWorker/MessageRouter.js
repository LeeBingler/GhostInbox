import MailApiClient from "./MailApiClient";
import InboxPoller from "./InboxPoller";
import ChromeStorageHandler from "./ChromeStorageHandler";
import MailSessionService from "./MailSessionService";
import BroadcastService from "./BroadcastService";

export const messageRouter = {
    async GENERATE_EMAIL(_, sendResponse) {
        const res = await MailApiClient.createAccount();
        if (res.status) {
            await ChromeStorageHandler.setStorage(res.data.address, res.data.password);
            InboxPoller.startInbox();
        }
        BroadcastService.send("GENERATED_EMAIL_ON_OTHER_TAB", res);
        sendResponse(res);
    },

    async GET_CURRENT_MAIL(_, sendResponse) {
        const res = await MailSessionService.restore();
        if (res.status) InboxPoller.startInbox();
        sendResponse(res);
    },

    async LISTEN_INBOX(_, sendResponse) {
        sendResponse(await MailApiClient.listenInbox());
    },

    async GET_MESSAGE(message, sendResponse) {
        sendResponse(await MailApiClient.getMessage(message.data.id));
    },

    async GET_ATTACHEMENT(message, sendResponse) {
        sendResponse(await MailApiClient.getAttachementImage(message.data.link));
    },

    async DELETE_ACCOUNT(_, sendResponse) {
        const res = await MailApiClient.deleteMe();
        InboxPoller.unping();
        await ChromeStorageHandler.clearStorage();
        BroadcastService.send("DELETED_ACCOUNT_ON_OTHER_TAB", res);
        sendResponse(res);
    }
};
