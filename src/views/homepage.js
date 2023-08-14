import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Link,
} from "react-router-dom";
import logo from "../resources/logo-tdtu.png";
import Sidebar from "react-sidebar";
import NavBar from '../components/navbar.component'
import SideBar from "../components/sidebar.component"
import Newfeed from '../components/childviews/newfeed.child'
import NotiPage from '../components/childviews/notification.child'
import CreateNoti from '../components/childviews/create-notification.child'
import CreateAccountPage from '../components/childviews/create-account.child'
import PersonalPage from '../components/childviews/personal-page.child'
import useWindowDimensions from '../components/useWindowDimensions'
import axiosInstance from '../api/service';
import { googleLogout } from '@react-oauth/google';
import {
    Avatar,
    message,
    Skeleton
} from 'antd';
import { FaHome, FaUserPlus } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import {
  RiNotificationBadgeFill,
  RiNotificationBadgeLine,
} from "react-icons/ri";
import NotiReader from "../components/childviews/notification-reader.child";
import AccManagerPage from "../components/childviews/account-manager.child";
import { getUser } from "../actions";
import { connect } from "react-redux";
import ChatPage from "../components/childviews/chat-page.child";

const Homepage = (props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState();
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [route, setRoute] = useState(null);
  const { width } = useWindowDimensions();
  const [newsfeedReloadState, setNewsfeedReloadState] = useState(false);
  let history = useHistory();

  useEffect(() => {
    getCurrentUserData();
  }, []);

  function setCompRoute(role) {
    if (role === "admin") {
      setRoute([
        {
          name: "Homepage",
          route: "/home",
          icon: <FaHome className="mb-1" size="22px" />,
        },
        {
          name: "Notification",
          route: `/home/notification`,
          icon: <RiNotificationBadgeFill className="mb-1" size="22px" />,
        },
        {
          name: "Post notice",
          route: `/home/postnotification`,
          icon: <RiNotificationBadgeLine className="mb-1" size="22px" />,
        },
        {
          name: "Create account",
          route: `/home/createaccount`,
          icon: <FaUserPlus className="mb-1" size="22px" />,
        },
        {
          name: "Chat",
          route: `/home/chat`,
          icon: <AiFillMessage className="mb-1" size="22px" />,
        },
      ]);
    } else if (role === "user") {
      setRoute([
        {
          name: "Homepage",
          route: "/home",
          icon: <FaHome className="mb-1" size="22px" />,
        },
        {
          name: "Notification",
          route: `/home/notification`,
          icon: <RiNotificationBadgeFill className="mb-1" size="22px" />,
        },
        {
          name: "Post notice",
          route: `/home/postnotification`,
          icon: <RiNotificationBadgeLine className="mb-1" size="22px" />,
        },
        {
          name: "Chat",
          route: `/home/chat`,
          icon: <AiFillMessage className="mb-1" size="22px" />,
        },
      ]);
    } else {
      setRoute([
        {
          name: "Homepage",
          route: "/home",
          icon: <FaHome className="mb-1" size="22px" />,
        },
        {
          name: "Notification",
          route: `/home/notification`,
          icon: <RiNotificationBadgeFill className="mb-1" size="22px" />,
        },
        {
          name: "Chat",
          route: `/home/chat`,
          icon: <AiFillMessage className="mb-1" size="22px" />,
        },
      ]);
    }
  }

  function getCurrentUserData() {
    axiosInstance
      .get(`/account/current`)
      .then((res) => {
        if (res.data.code === 0) {
          setUserData(res.data.data);
          setCompRoute(res.data.data.role);
          setAvatar(res.data.data.avatar);
          setUsername(res.data.data.user_name);
          props.getUser(res.data.data);
          if (
            res.data.data.faculty.length < 1 &&
            res.data.data.role === "student"
          ) {
            message.error("Your account is not registed");
            setTimeout(() => {
              history.push("/register");
            }, 3000);
          }
        }
      })
      .catch((e) => {
        console.error(e);
        if (e.response.status === 401) {
          sessionStorage.removeItem("token");
          history.push("/login");
        }
      });
  }

  function onSetSidebarOpen(open) {
    setSidebarOpen(open);
  }

  function logOutHandle() {
    sessionStorage.removeItem("token");
    history.push("/login");
  }

  function logoHome() {
    return <Link to="/home"></Link>;
  }

  return (
    //Mobile render
    <Router>
      <div className="containerr">
        <div>
          <NavBar
            sideBarHandle={() => onSetSidebarOpen(!sidebarOpen)}
            logOutHandle={logOutHandle}
            navbarlogo={
              <Link
                to="/home"
                onClick={() => setNewsfeedReloadState(!newsfeedReloadState)}
              >
                <img
                  style={{ cursor: "pointer" }}
                  className="align-self-center ml-3"
                  src={logo}
                  alt="tdtu-logo"
                />
              </Link>
            }
            usersession={
              <Link to={`/home/personalwall/${userData && userData._id}`}>
                {userData ? (
                  <div
                    className="userwall row mr-1"
                    onClick={props.userwallredirect}
                  >
                    <Avatar src={avatar} alt="avatar"></Avatar>
                    <div
                      className="align-self-center pl-2 pr-3 text-primary"
                      style={{ color: "black", fontWeight: "bold" }}
                    >
                      {username}
                    </div>
                  </div>
                ) : (
                  <Skeleton avatar active></Skeleton>
                )}
              </Link>
            }
            user_role={userData ? userData.role : ""}
          ></NavBar>
        </div>
        <div className="row">
          {width < 768 ? (
            <div>
              <Sidebar
                sidebar={
                  <SideBar
                    avatar={userData ? userData.avatar : ""}
                    username={userData ? userData.user : ""}
                    sidebarchild={
                      route &&
                      route.map((value, index) => (
                        <div key={index}>
                          <Link
                            to={value.route}
                            onClick={() => {
                              if (index === 0) {
                                setNewsfeedReloadState(!newsfeedReloadState);
                              }
                            }}
                          >
                            <button className="sidebar-btn pl-2">
                              {value.icon}
                              <span
                                className="ml-2"
                                style={{ fontSize: "17px" }}
                              >
                                {value.name}
                              </span>
                            </button>
                          </Link>
                        </div>
                      ))
                    }
                  ></SideBar>
                }
                open={sidebarOpen}
                onSetOpen={onSetSidebarOpen}
                styles={{
                  sidebar: {
                    background: "white",
                    width: "180px",
                    position: "fixed",
                    top: 0,
                  },
                }}
              />
            </div>
          ) : (
            <div className="col-3">
              <SideBar
                avatar={userData ? userData.avatar : ""}
                username={userData ? userData.user : ""}
                sidebarchild={
                  route &&
                  route.map((value, index) => (
                    <div key={index}>
                      <Link
                        to={value.route}
                        onClick={() => {
                          if (index === 0) {
                            setNewsfeedReloadState(!newsfeedReloadState);
                          }
                        }}
                      >
                        <button className="sidebar-btn pl-2">
                          {value.icon}
                          <span className="ml-2" style={{ fontSize: "17px" }}>
                            {value.name}
                          </span>
                        </button>
                      </Link>
                    </div>
                  ))
                }
              ></SideBar>
            </div>
          )}
          <div
            className={
              width < 768 ? "home-body col-12 p-0" : "home-body col-9 p-0"
            }
          >
            <Switch>
              <Route path={`/home`} exact={true}>
                <Newfeed
                  reloadNewsfeed={newsfeedReloadState}
                  notilink={<Link to={`/home/notification`}>See all</Link>}
                ></Newfeed>
              </Route>
              <Route path={`/home/notification`} component={NotiPage} exact />
              <Route path={`/home/notification/:id`} component={NotiReader} />
              <Route path={`/home/personalwall/:id`} component={PersonalPage} />
              <Route path={`/home/chat`} component={ChatPage} />
              {userData && userData.role === "user" && (
                <Route path={`/home/postnotification`} component={CreateNoti} />
              )}
              {userData && userData.role === "admin" && (
                <>
                  <Route
                    path={`/home/postnotification`}
                    component={CreateNoti}
                  />
                  <Route
                    path={`/home/createaccount`}
                    component={CreateAccountPage}
                    exact
                  />
                  <Route
                    path={`/home/createaccount/accountmanager`}
                    component={AccManagerPage}
                  />
                </>
              )}
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
};

function mapStateToProps(state) {
  return {
    currentUser: state.user,
    token: state.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUser: (user) => dispatch(getUser(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
