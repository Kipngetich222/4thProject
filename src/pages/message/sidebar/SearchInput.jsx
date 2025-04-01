import React from 'react';
import { TbUserSearch } from "react-icons/tb";

function SearchInput() {
  return (
    <form className='flex items-center gap-2'>
        <input type="text" placeholder="Secondary" class="input input-secondary" />
        <button className="btn btn-soft btn-info"><TbUserSearch /></button>
    </form>
  )
}

export default SearchInput
