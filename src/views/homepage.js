import React, {useState, useEffect} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useLocation
} from 'react-router-dom'
import NavBar from '../components/navbar'
import Sidebar from "react-sidebar";
import SideBar from "../components/sidebar"
import HomePage from '../components/admin/newfeed'
import NotiPage from '../components/admin/notificate-all'

import {homepageResTrue, loginResTrue} from '../data/data'

const Homepage = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [choose, setChoose] = useState(0)
    let { path, url } = useRouteMatch();

    function onSetSidebarOpen(open) {
        setSidebarOpen(open)
    }

    const routes = [
        {
          path: path,
          exact: true,
          main: () => 
            <HomePage
                avatar={loginResTrue.data[0].avatar}
                username={loginResTrue.data[0].username}
                data={homepageResTrue}>
            </HomePage>
        },
        {
          path: `${path}/notificates`,
          exact: true,
          main: () => <NotiPage></NotiPage>
        },
        {
          path: `${path}/createaccount`,
          exact: true,
          main: () => <h2>createaccount</h2>
        }
      ];

        return(
            <Router>
                <div className="containerr" style={{flex: 1}}>
                    <Sidebar
                        sidebar={
                            <SideBar
                                avatar={loginResTrue.data[0].avatar}
                                username ={loginResTrue.data[0].username}
                                homeLink={<Link className="link pl-2" onClick={() => setChoose(0)} to={url}>Home Page</Link>}
                                notiLink={<Link className="link pl-2" onClick={() => setChoose(1)} to={`${url}/notificates`}>All Notification</Link>}
                                createAccLink={<Link className="link pl-2" onClick={() => setChoose(2)} to={`${url}/createaccount`}>Create Account</Link>}
                                choose={choose}
                                ></SideBar>}
                            open={sidebarOpen}
                            onSetOpen={onSetSidebarOpen}
                            styles={{ sidebar: { background: "rgba(51,72,93,255)", width: "180px"}}}/>
                    <NavBar
                        sideBarHandle = {() => onSetSidebarOpen(true)}
                        avatar={loginResTrue.data[0].avatar}
                        username={loginResTrue.data[0].username}
                        // logOutHandle={}
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