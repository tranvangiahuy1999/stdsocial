import './stylesheet/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LoginView from './views/login'
import Homepage from './views/homepage'

function App() {
  return (
    <Router>
        <Route exact path="/login" component={LoginView}/>
        <Route exact path="/home" component={Homepage}/>
    </Router>
  );
}
export default App;
