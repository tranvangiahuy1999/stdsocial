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
import CreateNoti from '../components/childviews/create-noti.child'
import CreateAccountPage from '../components/childviews/create-account.child'
import useWindowDimensions from '../components/useWindowDimensions'

//Fake data import
import {loginResTrue} from '../data/data'

const Homepage = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userData, setUserData] = useState(null)
    const [chooseSideBar, setChooseSideBar] = useState(0)
    const {width, height} = useWindowDimensions()

    let { path, url } = useRouteMatch();

    useEffect(() => {
        //check status code
        setUserData(loginResTrue)
    }, [])

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
          path: `${path}/writenotificate`,
          exact: true,
          main: () => <CreateNoti></CreateNoti>
        },
        {
            path: `${path}/createaccount`,
            exact: true,
            main: () => <CreateAccountPage></CreateAccountPage>
        }
      ];

        return(
                //Mobile render
                <Router>
                <div className="containerr" style={{height: height}}>
                    <NavBar
                        sideBarHandle = {() => onSetSidebarOpen(true)}
                        avatar={userData?userData.data[0].avatar:''}
                        username={userData?userData.data[0].username:''}
                        logOutHandle={logOutHandle}
                    ></NavBar>
                    <div className={width < 768?'':'row'}>
                    {
                        width < 768?(
                            <div>
                            <Sidebar
                                sidebar={
                                    <SideBar
                                        avatar={userData?userData.data[0].avatar:''}
                                        username ={userData?userData.data[0].username:''}
                                        homeLink={<Link className="link pl-2" style={{color:'white'}} onClick={() => setChooseSideBar(0)} to={url}>Home Page</Link>}
                                        notiLink={<Link className="link pl-2" style={{color:'white'}} onClick={() => setChooseSideBar(1)} to={`${url}/notificates`}>Notification</Link>}
                                        notiWrite={<Link className="link pl-2" style={{color:'white'}} onClick={() => setChooseSideBar(2)} to={`${url}/writenotificate`}>Write Noti</Link>}
                                        createAccLink={<Link className="link pl-2" style={{color:'white'}} onClick={() => setChooseSideBar(3)} to={`${url}/createaccount`}>Create Account</Link>}
                                        choose={chooseSideBar}
                                        ></SideBar>}
                                    open={sidebarOpen}
                                    onSetOpen={onSetSidebarOpen}
                                    styles={{ sidebar: { background: "rgba(51,72,93,255)", width: "180px" ,position: 'fixed', top: 0}}}/>                    
                            </div>
                        ):(
                                <div className='col-2'>
                                    <SideBar
                                        avatar={userData?userData.data[0].avatar:''}
                                        username ={userData?userData.data[0].username:''}
                                        homeLink={<Link className="link pl-2" style={{color:'black'}} onClick={() => setChooseSideBar(0)} to={url}>Home Page</Link>}
                                        notiLink={<Link className="link pl-2" style={{color:'black'}} onClick={() => setChooseSideBar(1)} to={`${url}/notificates`}>Notification</Link>}
                                        notiWrite={<Link className="link pl-2" style={{color:'black'}} onClick={() => setChooseSideBar(2)} to={`${url}/writenotificate`}>Write Noti</Link>}
                                        createAccLink={<Link className="link pl-2" style={{color:'black'}} onClick={() => setChooseSideBar(3)} to={`${url}/createaccount`}>Create Account</Link>}
                                        choose={chooseSideBar}
                                    ></SideBar>
                                </div>
                        )
                    }
                    <div className={width < 768?'':'col-10'}>
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
                    </div>
                </div>
            </Router>
        )
}

export default Homepage