import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { message } from "antd";
import { getSender, getSenderInfo } from "../utils/ChatLogic";
import { getSelectedChat } from "../actions/index";
import ChatItem from "./chat-item.component";
import axiosInstance from "../api/service";

const MyChats = (props) => {
  const [loggedUser, setLoggedUser] = useState({});
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { currentUser, token, selectedChat, getSelectedChat, fetchAgain } =
    props;

  const handleSearch = async () => {
    if (!search) {
      message.error("Something wrong ");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/account/users?search=${search}`
      );

      setLoading(false);
      setSearchResult(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axiosInstance.post(
        `/chat`,
        { userId }
      );
      const result = data.data;
      if (!chats.find((c) => c._id === result._id))
        setChats([result, ...chats]);
      getSelectedChat(result);
      setSearchResult([]);
      setLoadingChat(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchChats = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/chat`
      );
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [token, fetchAgain]);

  return (
    <div className="my-chat">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>
          <AiOutlineSearch />
        </button>
      </div>
      {searchResult &&
        searchResult.length > 0 &&
        searchResult.map((user) => (
          <div
            className="search-results__item"
            key={user._id}
            onClick={() => accessChat(user._id)}
          >
            {user.user_name}
          </div>
        ))}
      {chats.map((chat) => (
        <div key={chat._id} onClick={() => getSelectedChat(chat)}>
          <ChatItem chat={chat} currentUser={currentUser} />
        </div>
      ))}
    </div>
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
    getSelectedChat: (chat) => dispatch(getSelectedChat(chat)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyChats);
