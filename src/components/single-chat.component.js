import React, { useEffect, useState } from "react";
import ScrollableChat from "./scrollable-chat.component";
import { connect } from "react-redux";
import { getSender } from "../utils/ChatLogic";
import { AiOutlineSend } from "react-icons/ai";
import { MdInsertPhoto } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { Skeleton } from "antd";
import io from "socket.io-client";
import axiosInstance from "../api/service";
import animationData from "../animations/typing.json";
import { getSelectedChat } from "../actions";

var selectedChatCompare, socket;
const ENDPOINT = process.env.REACT_APP_BASE_URL;

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

  const [fileInput, setFileInput] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [base64String, setBase64String] = useState("");

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
    });

    return () => {
      socket.off("message received");
    };
  }, []);

  useEffect(() => {
    socket.emit("setup", currentUser);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [currentUser]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/message/${selectedChat?._id}`);

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
    // console.log(isIncluded);
    if (arrivalMsg && isIncluded) {
      setMessages((prev) => [...prev, arrivalMsg]);

      console.log(selectedChat);
    } else {
      console.log("No new msg");
    }
    setFetchAgain(!fetchAgain);
  }, [arrivalMsg, selectedChat]);

  function _previewFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewFile(reader.result);
    };
  }

  async function _handleChange(e) {
    const file = e.target.files[0];
    setFileInput(file);
    _previewFile(file);
    const base64 = await getBase64(file);
    if (base64) setBase64String(base64);
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  function _inputImageBtn() {
    const input = document.getElementById("input-msgImg");
    if (input) {
      input.click();
    }
  }

  function _deleteImageBtn() {
    setFileInput(null);
    setPreviewFile(null);
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessage || fileInput) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const { data } = await axiosInstance.post(`/message`, {
          content: newMessage,
          chatId: selectedChat._id,
          photo: base64String,
        });
        setNewMessage("");
        setFileInput(null);
        setPreviewFile(null);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        console.log(data);
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
          <div className="messages__friend-info">
            <img src={senderInfo?.avatar} alt="" className="friend-avatar" />
            <div className="friend-name">
              <span>{getSender(currentUser, selectedChat.users)}</span>
            </div>
          </div>
          <div className="messages__container">
            {loading ? (
              <Skeleton active paragraph={2}></Skeleton>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <form onSubmit={sendMessage}>
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
                <div className="stp-preview row ml-2">
                  {previewFile && (
                    <div>
                      <img
                        className="ml-3"
                        src={previewFile}
                        alt="chosen"
                        style={{ height: "100px", borderRadius: "4px" }}
                      />
                      <ImCancelCircle
                        className="ml-2 clickable-icon"
                        color="gray"
                        size="22px"
                        onClick={_deleteImageBtn}
                      ></ImCancelCircle>
                    </div>
                  )}
                </div>
                <div className="send-message__actions">
                  <input
                    className="input-msg"
                    type="text"
                    variant="filled"
                    placeholder="Enter a message..."
                    value={newMessage}
                    onChange={typingHandler}
                  />
                  <div>
                    <MdInsertPhoto
                      className="clickable-icon ml-3"
                      color="rgb(2, 136, 209)"
                      size="32px"
                      onClick={_inputImageBtn}
                    ></MdInsertPhoto>
                    <input
                      id="input-msgImg"
                      type="file"
                      name="image"
                      onChange={_handleChange}
                      style={{ display: "none" }}
                      accept="image/png, image/jpeg"
                    />
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <button type="submit" className="btn-send-message">
                      <AiOutlineSend />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="no-chat">
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
