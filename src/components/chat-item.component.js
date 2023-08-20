import React from "react";
import { getSender, getSenderInfo } from "../utils/ChatLogic";
import { connect } from "react-redux";

const ChatItem = ({ chat, currentUser, currentChat }) => {
  // console.log(currentChat);
  return (
    <div
      className="chat-item"
      style={{
        backgroundColor: currentChat?._id === chat._id ? "#f5f5f5" : "#FFFFFF",
        // color: selectedChat === chat ? "white" : "black",
      }}
      key={chat._id}
    >
      <div className="chat-item__avatar">
        <img src={getSenderInfo(currentUser, chat.users)?.avatar} alt="" />
      </div>
      <div
        className="chat-item__content"
        style={{ fontWeight: chat.seen ? "400" : "bold" }}
      >
        <span className="content__sender-name">
          {!chat.isGroupChat
            ? getSender(currentUser, chat.users)
            : chat.chatName}
        </span>
        <span className="content__latestmessage">
          {chat.latestMessage?.sender._id === currentUser._id ? "Bạn: " : ""}

          {chat.latestMessage?.photo
            ? "Đã gửi một ảnh"
            : chat?.latestMessage?.content.length > 50
            ? chat?.latestMessage?.content.substring(0, 21) + "..."
            : chat?.latestMessage?.content}
        </span>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    currentChat: state.chat,
  };
}

export default connect(mapStateToProps)(ChatItem);
