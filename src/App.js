import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"; // Import Routes

import Registration from "./componenets/registration.component";
import Login from "./componenets/login.component";
import Navbar from "./componenets/navbar.component";
import Post from "./componenets/post-list.component";
import Logout from "./componenets/logout.component";

function App() {
    return (
        <Router>
            <Navbar/>
            <br/>
            <Routes>
                <Route path="/" element={<Post/>}/>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>
            </Routes>
        </Router>

    );
}

export default App;
