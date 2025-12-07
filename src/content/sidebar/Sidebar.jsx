import DeleteButton from '../../components/DeleteButton/DeleteButton';
import GenerateEmail from '../../components/GenerateEmail/GenerateEmail';
import Inbox from '../../components/Inbox/Inbox';

import useDeleteAccount from '../../hooks/useDeleteAccount';
import useSidebarOpen from '../../hooks/useSidebarOpen';

import './style.css'

export default function Sidebar() {
    const { isDelete, deleteAccount } = useDeleteAccount();
    const { sidebarOpen } = useSidebarOpen();

    return (
        <div className={`sidebar-container${sidebarOpen ? " sidebar-open" : ""}`}>
            <h1>GhostInbox</h1>
            <GenerateEmail isDelete={isDelete}/>
            <Inbox isDelete={isDelete}/>
            <DeleteButton deleteAccount={deleteAccount} />
        </div>
    )
}
