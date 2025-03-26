import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations';
import LogOutBtn from '../../components/LogOutBtn';

function Sidebar() {
  return (
    <div>
      <SearchInput/>
      <div className='divider px-3'></div>
      <Conversations/>
      <LogOutBtn/>
     <p>My conversations</p>
    </div>
  )
}

export default Sidebar
