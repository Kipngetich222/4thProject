import React from 'react';
import Conversation from './Conversation';

function Conversations() {
    return (
        <div className="flex flex-col sm:h-[450px] md:h-[550px] w-full rounded-l-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
            <Conversation />
            <Conversation />
            <Conversation />
        </div>
    );
}

export default Conversations;

