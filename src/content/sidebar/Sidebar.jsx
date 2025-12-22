import { useState, useEffect } from 'react';
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

    const resetUI = () => {
            setEmailIDClicked(null);
            setResetKey(prev => prev + 1);
    }

    useEffect(() => {
        const listener = (msg) => {
            if (msg.type === "DELETED_ACCOUNT_ON_OTHER_TAB") {
                resetUI();
            }
        }

        chrome.runtime.onMessage.addListener(listener);
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, []);

    const handleDelete = async () => {
        await sendMessage();
        resetUI();
    };

    return (
        <div className={`sidebar-container${sidebarOpen ? " sidebar-open" : ""}`}>
            <h1 className='title'>GhostInbox</h1>
            <GenerateEmail key={`generate-${resetKey}`}/>
            <hr className='line'/>
            {
                emailIDClicked === null ? 
                <Inbox key={`inbox-${resetKey}`} setEmailIDClicked={setEmailIDClicked}/> :
                <EmailDetail emailIDClicked={emailIDClicked} setEmailIDClicked={setEmailIDClicked}/>
            }
            <hr className='line'/>
            <DeleteButton deleteAccount={handleDelete} />
        </div>
    )
}
