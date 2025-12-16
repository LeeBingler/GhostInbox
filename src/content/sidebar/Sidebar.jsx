import { useState } from 'react';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import GenerateEmail from '../../components/GenerateEmail/GenerateEmail';
import EmailDetail from '../../components/EmailDetail/EmailDetail';
import Inbox from '../../components/Inbox/Inbox';

import useSendMessage from '../../hooks/useSendMessage';
import useSidebarOpen from '../../hooks/useSidebarOpen';

import './style.css'

export default function Sidebar() {
    const { sendMessage } = useSendMessage("DELETE_ACCOUNT");
    const { sidebarOpen } = useSidebarOpen();
    const [emailIDClicked, setEmailIDClicked] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const handleDelete = async () => {
        await sendMessage();
        setEmailIDClicked(null);
        setResetKey(prev => prev + 1);
    };

    return (
        <div className={`sidebar-container${sidebarOpen ? " sidebar-open" : ""}`}>
            <h1>GhostInbox</h1>
            <GenerateEmail key={`generate-${resetKey}`}/>
            <hr/>
            {
                emailIDClicked === null ? 
                <Inbox key={`inbox-${resetKey}`} setEmailIDClicked={setEmailIDClicked}/> :
                <EmailDetail emailIDClicked={emailIDClicked} setEmailIDClicked={setEmailIDClicked}/>
            }
            <hr/>
            <DeleteButton deleteAccount={handleDelete} />
        </div>
    )
}
