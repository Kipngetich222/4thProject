// import React from 'react';
// import Messages from './messages';
// import MessageInput from './MessageInput';
// import { TiMessages } from "react-hot-toast/ti";


// function MessageContainer() {
//     const noChatSelected = true;
//     return (
//         <div className='md:min-w-[450px] flex flex-col'>
//             {noChatSelected ? (
//                 <NoChatSelected />
//             ) : (
//                 <>
//                     {/*header*/}
//                     <div className='bg-slate-500 px-4 py-2 mb-2'>
//                         <span className='label-text'>To:</span>
//                         <span className='text-gray-900 font-bold'>John doe</span>
//                     </div>

//                     {/*messages input*/}
//                     <Messages />
//                     <MessageInput />

//                 </>
//             )}
//         </div>
//     )
// }

// export default MessageContainer

// const NoChatSelected = () => {
//     return (
//         <div className='flex items-center justify-center w-full h-full'>
//             <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
//                 <p>Wlcome John Doe</p>
//                 <p>Sekect a chat ton start messaging</p>
//                 <TiMessages className='text-3xl md:text-6xl text-center' />
//             </div>
//         </div>
//     )
// }


import React from 'react';
import Messages from './messages';
import MessageInput from './MessageInput';
import { TiMessages } from "react-icons/ti"; // ✅ Corrected import

function MessageContainer() {
    const noChatSelected = false; // Simulating no chat selected

    return (
        <div className='md:min-w-[450px] flex flex-col bg-gray-900 rounded-lg shadow-md h-full'>
            {noChatSelected ? (
                <NoChatSelected />
            ) : (
                <>
                    {/* Header */}
                    <div className='bg-slate-500 px-4 py-2 mb-2 text-white'>
                        <span className='label-text'>To:</span>
                        <span className='font-bold'>John Doe</span>
                    </div>

                    {/* Messages */}
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
}

export default MessageContainer;

const NoChatSelected = () => {
    return (
        <div className='flex items-center justify-center w-full h-full text-gray-200'>
            <div className='text-center flex flex-col items-center gap-4'>
                <p className="text-xl md:text-2xl font-bold">Welcome John Doe</p>
                <p className="text-sm md:text-lg">Select a chat to start messaging</p>
                <TiMessages className='text-5xl md:text-7xl text-blue-400' /> {/* ✅ Larger and more visible */}
            </div>
        </div>
    );
};
