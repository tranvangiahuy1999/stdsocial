import React, {useState, useEffect} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useLocation
} from 'react-router-dom'

import Sidebar from "react-sidebar";
import NavBar from '../components/navbar.component'
import SideBar from "../components/sidebar.component"
import Newfeed from '../components/childviews/newfeed.child'
import NotiPage from '../components/childviews/notificate.child'
import CreateAccountPage from '../components/childviews/create-account.child'

//Fake data import
import {loginResTrue} from '../data/data'

const Homepage = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userData, setUserData] = useState(null)
    const [chooseSideBar, setChooseSideBar] = useState(0)

    let { path, url } = useRouteMatch();

    useEffect(() => {
        //check status code
        setUserData(loginResTrue)
    })

    function onSetSidebarOpen(open) {
        setSidebarOpen(open)
    }

    function logOutHandle(){

    }

    const routes = [
        {
          path: path,
          exact: true,
          main: () => <Newfeed></Newfeed>
        },
        {
          path: `${path}/notificates`,
          exact: true,
          main: () => <NotiPage></NotiPage>
        },
        {
          path: `${path}/createaccount`,
          exact: true,
          main: () => <CreateAccountPage></CreateAccountPage>
        }
      ];

        return(
            <Router>
                <div className="containerr" style={{flex: 1}}>
                    <Sidebar
                        sidebar={
                            <SideBar
                                avatar={userData?userData.data[0].avatar:''}
                                username ={userData?userData.data[0].username:''}
                                homeLink={<Link className="link pl-2" onClick={() => setChooseSideBar(0)} to={url}>Home Page</Link>}
                                notiLink={<Link className="link pl-2" onClick={() => setChooseSideBar(1)} to={`${url}/notificates`}>All Notification</Link>}
                                createAccLink={<Link className="link pl-2" onClick={() => setChooseSideBar(2)} to={`${url}/createaccount`}>Create Account</Link>}
                                choose={chooseSideBar}
                                ></SideBar>}
                            open={sidebarOpen}
                            onSetOpen={onSetSidebarOpen}
                            styles={{ sidebar: { background: "rgba(51,72,93,255)", width: "180px"}}}/>
                    <NavBar
                        sideBarHandle = {() => onSetSidebarOpen(true)}
                        avatar={userData?userData.data[0].avatar:''}
                        username={userData?userData.data[0].username:''}
                        logOutHandle={logOutHandle}
                    ></NavBar>
                    <Switch>
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            children={route.main}
                        />
                        ))}
                    </Switch>
                </div>
            </Router>
        )
}

export default Homepage