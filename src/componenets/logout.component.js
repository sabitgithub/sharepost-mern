import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";


const backendUrl = 'http://localhost:5000';

export default class LogoutUser extends Component {
    constructor(props) {
        super(props);
    }

    handleLogout = () => {

        axios
            .post(`${backendUrl}/auth/logout`)
            .then((res) => {
                sessionStorage.clear();
                window.location = '/login';
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        return (
            <div>
                <h1>Logout User</h1>
                <button onClick={this.handleLogout}>Logout</button>
            </div>
        );
    }
}
