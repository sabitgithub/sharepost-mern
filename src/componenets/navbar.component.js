import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const backendUrl = 'http://localhost:5000';

export default class Navbar extends Component {
    handleLogout = () => {

        axios
            .post(`${backendUrl}/auth/logout`, {}, {
                headers: {
                    'sessionID': sessionStorage.getItem('sessionID'),
                    'sessionUserID': sessionStorage.getItem('sessionUserID'),
                },
            })
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
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">
                    SharePost
                </Link>
                <div className="collpase navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <Link to="/" className="nav-link">
                                NewsFeed
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="CreatePost" className="nav-link">
                                New Post
                            </Link>
                        </li>
                        {/*<li className="navbar-item">*/}
                        {/*    <Link to="/profile" className="nav-link">*/}
                        {/*        Profile*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        <li className="navbar-item">
                            {/* Use the handleLogout method when the "Logout" link is clicked */}
                            <Link to="#" className="nav-link" onClick={this.handleLogout}>
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
