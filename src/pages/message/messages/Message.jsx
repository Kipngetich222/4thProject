import React from 'react'

function Message() {
  return (
    <div className='chat chat-end'>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
            <img width="50" height="50" src="https://img.icons8.com/ios/50/businesswoman.png" alt="businesswoman"/>
        </div>
      </div>
      <div className={'chat-bubble text-white bg-blue-500'}>Hi! what is upp?</div>
      <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>12:42</div>
    </div>
  )
} 

export default Message
