import MailApiClient from "./MailApiClient";
import ChromeStorageHandler from "./ChromeStorageHandler";

class MailSessionService {
    static async restore() {
        const res = await ChromeStorageHandler.getStorage();
        if (!res.status) return res;

        const account = res.account?.ghostInboxAccount;
        if (!account?.address || !account?.password) {
            return {
                status: false,
                statusCode: 404,
                message: "No stored mail account",
                data: null,
            };
        }

        const loginRes = await MailApiClient.login(account.address, account.password);
        if (!loginRes.status) return loginRes;

        return {
            status: true,
            statusCode: loginRes.statusCode ?? 200,
            message: "ok",
            data: {
                address: account.address,
                password: account.password,
            },
        };
    }

    static async clear() {
        await ChromeStorageHandler.clearStorage();
    }
}

export default MailSessionService;