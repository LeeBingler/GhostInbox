import { useState } from "react";

import useSendMessage from "./useSendMessage";

export default function useDeleteAccount() {
    const [isDelete, setIsDelete] = useState(false);
    const { sendMessage } = useSendMessage("DELETE_ACCOUNT");

    async function deleteAccount() {
        const res = await sendMessage();
        if (!res.status) return;

        setIsDelete(true);

        setTimeout(() => setIsDelete(false), 500);
    }

    return {
        isDelete,
        deleteAccount
    }
}