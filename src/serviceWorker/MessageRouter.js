import Mailjs from "./Mailjs";
import InboxHandler from "./InboxHandler";
import ChromeStorageHandler from "./ChromeStorageHandler";
import MailSessionService from "./MailSessionService";
import BroadcastService from "./BroadcastService";

export const messageRouter = {
    async GENERATE_EMAIL(_, sendResponse) {
        const res = await Mailjs.createAccount();
        if (res.status) {
            await ChromeStorageHandler.setStorage(res.data.address, res.data.password);
            InboxHandler.startInbox();
        }
        BroadcastService.send("GENERATED_EMAIL_ON_OTHER_TAB", res);
        sendResponse(res);
    },

    async GET_CURRENT_MAIL(_, sendResponse) {
        const res = await MailSessionService.restore();
        if (res.status) InboxHandler.startInbox();
        sendResponse(res);
    },

    async LISTEN_INBOX(_, sendResponse) {
        sendResponse(await Mailjs.listenInbox());
    },

    async GET_MESSAGE(message, sendResponse) {
        sendResponse(await Mailjs.getMessage(message.data.id));
    },

    async GET_ATTACHEMENT(message, sendResponse) {
        sendResponse(await Mailjs.getAttachementImage(message.data.link));
    },

    async DELETE_ACCOUNT(_, sendResponse) {
        const res = await Mailjs.deleteMe();
        InboxHandler.unping();
        await ChromeStorageHandler.clearStorage();
        BroadcastService.send("DELETED_ACCOUNT_ON_OTHER_TAB", res);
        sendResponse(res);
    }
};
