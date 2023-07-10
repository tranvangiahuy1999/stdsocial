import React, { useEffect, useState } from "react";
import MyChats from "../my-chats.component";
import ChatBox from "../chat-box.component";
import { connect } from "react-redux";
import { getSelectedChat } from "../../actions";

const ChatPage = (props) => {
  const [fetchAgain, setFetchAgain] = useState();
  const { setCurrentChat } = props;
  useEffect(() => {
    setCurrentChat(null);
  }, []);

  return (
    <div className="chat-page">
      <MyChats fetchAgain={fetchAgain} />
      <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    token: state.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch({ type: "LOGOUT" }),
    setCurrentChat: (chat) => dispatch(getSelectedChat(chat)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);
