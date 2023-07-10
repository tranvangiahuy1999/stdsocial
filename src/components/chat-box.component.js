import React from "react";
import SingleChat from "./single-chat.component";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  return (
    <div className="chat-box">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
