import blobToBase64 from "../utils/blobToBase64";

class MailApiClient {
    constructor() {
        // Make this class a singleton
        if (MailApiClient._instance)
            return MailApiClient._instance;
        MailApiClient._instance = this;


        this.baseUrl = "https://api.mail.tm";

        this.address = "";
        this.id = "";
        this.token = "";
        this.password = "";
    }

    getEmail() {
        const hasCredential = this.address != "" && this.password != ""

        return {
            status: hasCredential,
            statusCode: hasCredential ? 200 : 404,
            message: hasCredential ? "ok" : "email not found",
            data: hasCredential 
            ? { address: this.address, password: this.password }
            : {}
        }
    }

    getDomains() {
        return this._send("/domains");
    }

    register(address, password) {
        const data = {
            address,
            password,
        };

        return this._send("/accounts", "POST", data);
    }

    async login(address, password) {
        const data = {
            address,
            password,
        };

        const res = await this._send("/token", "POST", data);

        if (res.status) {
            this.token = res.data.token;
            this.id = res.data.id;
            this.address = address;
            this.password = password;
        }

        return res;
    }

    async createAccount() {
        const domainData = await this.getDomains();
        if(!domainData.status) return domainData;
        const domain = domainData.data[0].domain;

        const address = `ghost_${crypto.randomUUID().slice(0, 8)}@${domain}`;
        const password = crypto.randomUUID();

        const registerRes = await this.register(address, password);
        if (!registerRes.status) return registerRes;

        const loginRes = await this.login(address, password)
        if (!loginRes.status) return loginRes;

        return {
            status: true,
            statusCode: loginRes.statusCode,
            message: "ok",
            data: {
                address,
                password,
            },
        };
    }

    async listenInbox() {
        if (!this.address || !this.id || !this.token)
            throw new Error("Mailbox not initialized");
        const res = await this._send("/messages");
        return res;
    }

    async getMessage(messageId) {
        if (!this.address || !this.id || !this.token || !messageId)
            throw new Error("Mailbox not initialized");
        const res = await this._send("/messages/" + messageId);
        return res;
    }

    async getAttachementImage(link) {
        if (!this.address || !this.id || !this.token || !link)
            throw new Error("Mailbox not initialized");
        const res = await this._send(link);
        console.log("getAttachmentImage res", res);
        return res;
    }

    async deleteAccount(accountId) {
        const res = await this._send("/accounts/" + accountId, "DELETE");
        if (!res) return res;

        this.address = "";
        this.id = "";
        this.token = "";
        this.password = "";

        return res;
    }

    deleteMe() {
        return this.deleteAccount(this.id);
    } 

    /** @private */
    async _send(path, method, body) {
        if (!method) method = "GET"

        const headers = { accept: "application/json" };

        if (this.token != "") {
            headers.authorization = `Bearer ${this.token}`;
        }

        const options = { method, headers };

        if (method === "POST" || method === "PATCH") {
            const contentType = method === "PATCH" ? "merge-patch+json" : "json";
            options.headers["content-type"] = `application/${contentType}`;
            options.body = JSON.stringify(body);
        }

        const res = await fetch(this.baseUrl + path, options);
        const contentType = res.headers.get("content-type");

        let data = null;
        if (contentType?.startsWith("application/json")) data = await res.json();
        else if (contentType?.includes("image")) data = await blobToBase64(await res.blob());
        else data = await res.text();

        return {
            status: res.ok,
            statusCode: res.status,
            message: res.ok ? "ok" : data.message || data.detail,
            data
        };
    }
}

let mailapiclient = new MailApiClient();
export default mailapiclient;