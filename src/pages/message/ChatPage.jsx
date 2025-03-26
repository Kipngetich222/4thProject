import React from 'react';
import Sidebar from './sidebar/Sidebar';
import MessageContainer from './messages/messageContainer';

function ChatPage() {
    return (
        <div className='flex sm:h-[450px] md:h-[550px] overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
            <Sidebar />
            {/* Add MessageContainer or chat content here */}
            <MessageContainer/>
        </div>
    );
}

export default ChatPage;
