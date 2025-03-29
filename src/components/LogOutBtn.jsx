// import React from 'react';
// import {BIlogout} from "react-icons/bi";

// function LogOutBtn() {
//   return (
//     <div>
//       <BIlogout className="w-6 h-6 text-white cursor-pointer"/>
//     </div>
//   )
// }

// export default LogOutBtn

import React from 'react';
import { BiLogOut } from "react-icons/bi"; // ✅ Corrected import

function LogOutBtn() {
  return (
    <div>
      <BiLogOut className="w-6 h-6 text-white cursor-pointer" />
    </div>
  );
}

export default LogOutBtn;

