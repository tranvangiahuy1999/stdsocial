import './stylesheet/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dropdown/style.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import LoginView from './views/login'
import Homepage from './views/homepage'
import PrivateRoute from './route/privateRoute'

function App() {
  return (
    <Router>
        <Route path="/login" component={LoginView}/>
        <PrivateRoute path="/home" component={Homepage}/>
    </Router>
  );
}
export default App;
