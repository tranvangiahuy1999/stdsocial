import React, { useEffect, useState } from "react";
import ScrollableChat from "./scrollable-chat.component";
import { connect } from "react-redux";
import { getSender } from "../utils/ChatLogic";
import { AiOutlineSend } from "react-icons/ai";
import { Skeleton } from "antd";
import io from "socket.io-client";
import axiosInstance from "../api/service";
import animationData from "../animations/typing.json";
import { getSelectedChat } from "../actions";

var selectedChatCompare, socket;
const ENDPOINT = process.env.REACT_APP_API;

const SingleChat = ({
  currentUser,
  selectedChat,
  setSelectedChat,
  token,
  fetchAgain,
  setFetchAgain,
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [missing, setMissing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [arrivalMsg, setArrivalMsg] = useState(null);

  const senderInfo = selectedChat?.users.filter(
    (user) => user._id !== currentUser._id
  )[0];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("message received", (newMessageReceived) => {
      setArrivalMsg(newMessageReceived);
      // setFetchAgain(!fetchAgain);
    });
  }, []);

  useEffect(() => {
    socket.emit("setup", currentUser);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [currentUser]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/message/${selectedChat?._id}`
      );
      setMessages(data.data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    // selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const isIncluded = selectedChat?.users.some(
      (user) => user._id === arrivalMsg?.sender._id
    );
    console.log(isIncluded);
    if (arrivalMsg && isIncluded) {
      setMessages((prev) => [...prev, arrivalMsg]);
    } else {
      console.log("something wrong");
    }
    setFetchAgain(!fetchAgain);
  }, [arrivalMsg, selectedChat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const { data } = await axiosInstance.post(
          `/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          }
        );
        setNewMessage("");
        // console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);

        setFetchAgain(!fetchAgain);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleKeyDown = (e) => {
    e.key === "Enter" && sendMessage(e);
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // if (!socketConnected) return;

    // if (!typing) {
    //   setTyping(true);
    //   socket.emit("typing", selectedChat._id);
    // }

    // let lastTypingTime = new Date().getTime();
    // var timer = 3000;
    // setTimeout(() => {
    //   var curTime = new Date().getTime();
    //   var timeDiff = curTime - lastTypingTime;
    //   if (timeDiff >= timer && typing) {
    //     socket.emit("stop typing", selectedChat._id);
    //     setTyping(false);
    //   }
    // }, timer);
  };

  return (
    <>
      {selectedChat ? (
        <div className="single-chat">
          <div className="messages__sender-info">
            <img src={senderInfo?.avatar} alt="" className="sender-avatar" />
            <div className="sender-name">
              <span>{getSender(currentUser, selectedChat.users)}</span>
            </div>
          </div>
          <div className="message__container">
            {loading ? (
              <Skeleton active paragraph={2}></Skeleton>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div className="send-message" onKeyDown={handleKeyDown}>
              {/* {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={30}
                    width={40}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )} */}
              <input
                type="text"
                variant="filled"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
              />
              <button onClick={sendMessage} className="btn-send-message">
                <AiOutlineSend />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span>Chọn người dùng để bắt đầu trò chuyện</span>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    token: state.token,
    currentUser: state.user,
    selectedChat: state.chat,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSelectedChat: (chat) => dispatch(getSelectedChat(chat)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleChat);
