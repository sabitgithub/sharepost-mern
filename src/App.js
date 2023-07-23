import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"; // Import Routes
import Registration from "./componenets/registration.component";
import Login from "./componenets/login.component";

function App() {
    return (
        <Router>
            <br/>
            <Routes>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </Router>

    );
}

export default App;
