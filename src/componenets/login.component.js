import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBInput,
    MDBIcon,
}
    from 'mdb-react-ui-kit';


const backendUrl = 'http://localhost:5000';

export default class LoginUser extends Component {

    constructor(props) {
        super(props);

        this.onchangeEmail = this.onchangeEmail.bind(this)
        this.onchangePassword = this.onchangePassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)


        this.state = {

            email: '',
            password: '',
            errorTimeout: null,
            success: '',
            successTimeout: null,
            error: [],
        }
    }

    setErrorWithTimeout = (messages) => {
        // Clear any existing error timeout
        if (this.state.errorTimeout) {
            clearTimeout(this.state.errorTimeout);
        }

        // Set the error messages as an array
        let errorArray = [];
        if (Array.isArray(messages)) {
            errorArray = messages;
        } else {
            errorArray.push(messages);
        }

        this.setState({
            error: errorArray,
            errorTimeout: setTimeout(() => {
                this.setState({error: [], errorTimeout: null});
            }, 5000),
        });
    };

    setSuccessWithTimeout = (message) => {
        // Clear any existing success timeout
        if (this.state.successTimeout) {
            clearTimeout(this.state.successTimeout);
        }

        // Set the success message
        this.setState({
            success: message,
            successTimeout: setTimeout(() => {
                this.setState({success: '', successTimeout: null});
            }, 5000),
        });
    };


    onchangeEmail(e) {
        this.setState({
            email: e.target.value
        })
    }

    onchangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }


    onSubmit(e) {
        e.preventDefault();

        const login = {
            email: this.state.email,
            password: this.state.password,

        }
        console.log(login);

        axios
            .post(`${backendUrl}/auth/login`, login,{ withCredentials: true })
            .then((res) => {
                console.log(res.data);
                this.setSuccessWithTimeout('Login successfully');
                const sessionID = res.data.sessionID;
                const sessionUserID = res.data.sessionUserID;
                sessionStorage.setItem('sessionID', sessionID);
                sessionStorage.setItem('sessionUserID', sessionUserID);
                window.location = '/';
            })
            .catch((error) => {
                console.error(error);
                const errorMessage = error.response && error.response.data && error.response.data.error
                    ? error.response.data.error
                    : 'An error occurred while processing your request';

                this.setErrorWithTimeout(errorMessage);
            });


    }


    render() {
        return (
            <MDBContainer fluid>

                <MDBCard className='text-black m-5' style={{borderRadius: '25px'}}>
                    <MDBCardBody>
                        <MDBRow>
                            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                                <form onSubmit={this.onSubmit}>

                                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login</p>

                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <MDBIcon fas icon="envelope me-3" size='lg'/>
                                        <MDBInput label='Your Email' id='email' value={this.state.email}
                                                  onChange={this.onchangeEmail} type='email'/>
                                    </div>

                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <MDBIcon fas icon="lock me-3" size='lg'/>
                                        <MDBInput label='Password' id='password' value={this.state.password}
                                                  onChange={this.onchangePassword} type='password'/>
                                    </div>

                                    {/* Display the error message if there is one */}
                                    {this.state.error && this.state.error.length > 0 && (
                                        <div className='alert alert-danger' role='alert'>
                                            {this.state.error.map((message, index) => (
                                                <div key={index}>{message}</div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <input type="submit" style={{marginLeft: '18px'}} value="Login"
                                               className="btn btn-primary"/>
                                        <a href="/registration" style={{marginLeft: '18px'}}
                                           className="btn btn-secondary">Register</a>
                                    </div>
                                    <p style={{marginLeft: '18px', color: 'blue', cursor: 'pointer'}}> Want to Create
                                        Profile? Click <a href="/registration"
                                                          style={{
                                                              color: 'blue',
                                                              textDecoration: 'underline'
                                                          }}>Register</a>
                                    </p>

                                    {this.state.success && (
                                        <div className='alert alert-success' role='alert'>
                                            {this.state.success}
                                        </div>
                                    )}

                                </form>
                            </MDBCol>

                            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                                <MDBCardImage
                                    src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp'
                                    fluid/>
                            </MDBCol>

                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>

            </MDBContainer>
        );
    }

}
