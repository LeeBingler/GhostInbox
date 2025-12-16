import { useState } from 'react';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import GenerateEmail from '../../components/GenerateEmail/GenerateEmail';
import EmailDetail from '../../components/EmailDetail/EmailDetail';
import Inbox from '../../components/Inbox/Inbox';

import useDeleteAccount from '../../hooks/useDeleteAccount';
import useSidebarOpen from '../../hooks/useSidebarOpen';

import './style.css'

export default function Sidebar() {
    const { isDelete, deleteAccount } = useDeleteAccount();
    const { sidebarOpen } = useSidebarOpen();
    const [emailIDClicked, setEmailIDClicked] = useState(null);

    return (
        <div className={`sidebar-container${sidebarOpen ? " sidebar-open" : ""}`}>
            <h1>GhostInbox</h1>
            <GenerateEmail key={isDelete ? "delete" : "active"} isDelete={isDelete}/>
            <hr/>
            {
                emailIDClicked === null ? 
                <Inbox key={isDelete ? "delete" : "active"} setEmailIDClicked={setEmailIDClicked}/> :
                <EmailDetail emailIDClicked={emailIDClicked} setEmailIDClicked={setEmailIDClicked}/>
            }
            <hr/>
            <DeleteButton deleteAccount={deleteAccount} />
        </div>
    )
}
