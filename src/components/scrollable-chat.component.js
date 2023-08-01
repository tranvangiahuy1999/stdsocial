import React from "react";
import { connect } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import { Tooltip } from "antd";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../utils/ChatLogic";

const ScrollableChat = ({ currentUser, messages }) => {
  return (
    <ScrollableFeed className="srcoll-feed">
      {messages &&
        messages.map((mess, i) => (
          <div
            style={{
              display: "flex",
              // alignItems: "center",
              flexDirection: mess.photo ? "column" : "row",
            }}
            key={mess._id}
          >
            {(isSameSender(messages, mess, i, currentUser._id) ||
              isLastMessage(messages, i, currentUser._id)) && (
              <Tooltip title={mess.sender.user_name}>
                <img
                  src={mess.sender.avatar}
                  alt="sender avatar"
                  cursor="pointer"
                  className="message__sender-avatar"
                />
              </Tooltip>
            )}

            {mess.content.length > 0 && (
              <span
                style={{
                  backgroundColor: `${
                    mess.sender._id === currentUser._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(
                    messages,
                    mess,
                    i,
                    currentUser._id
                  ),
                  marginTop: isSameUser(messages, mess, i, currentUser._id)
                    ? 3
                    : 5,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {mess.content}
              </span>
            )}
            {mess.photo && (
              <div
                style={{
                  marginLeft: isSameSenderMargin(
                    messages,
                    mess,
                    i,
                    currentUser._id
                  ),
                  marginTop: isSameUser(messages, mess, i, currentUser._id)
                    ? 3
                    : 5,

                  padding: "5px 10px",
                  maxWidth: "75%",
                  backgroundSize: "contain",
                  overflow: "hidden",
                }}
              >
                <img
                  src={mess.photo.link}
                  alt="msg photo"
                  style={{
                    maxHeight: "125px",

                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

function mapStateToProps(state) {
  return {
    token: state.token,
    currentUser: state.user,
    selectedChat: state.chat,
  };
}

export default connect(mapStateToProps)(ScrollableChat);
