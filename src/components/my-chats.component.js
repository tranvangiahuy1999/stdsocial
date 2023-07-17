import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { message } from "antd";
import { getSender, getSenderInfo } from "../utils/ChatLogic";
import { getSelectedChat } from "../actions/index";
import ChatItem from "./chat-item.component";

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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/account/users?search=${search}`,
        config
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
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/chat`,
        { userId },
        config
      );
      const result = data.data;
      // console.log(result);
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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/chat`,
        config
      );
      setChats(data);
      // console.log(data);
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
