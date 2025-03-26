import React from "react";

function MessageInput() {
  return (
    <form className="px-4 py-2 flex items-center gap-2 bg-gray-100 rounded-lg">
      <input
        type="text"
        placeholder="Type a message..."
        className="input input-bordered w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button type="submit" className="btn btn-primary">
        Send
      </button>
    </form>
  );
}

export default MessageInput;

