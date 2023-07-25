import React, {Component} from 'react';
import axios from "axios";
import {MDBContainer, MDBCard, MDBCardBody, MDBInput} from 'mdb-react-ui-kit';
import Cookies from "js-cookie";
import Navbar from './navbar.component';

const backendUrl = 'http://localhost:5000';

export default class CreateNewPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            newPost: "",
            image: null,
            imagePreview: null,
            showSuccessAlert: false,
        };
    }

    // Handle the change of the title input
    onChangeTitle = (event) => {
        this.setState({
            title: event.target.value,
        });
    };

    // Handle the change of the new post input
    onChangeNewPost = (event) => {
        this.setState({
            newPost: event.target.value,
        });
    };

    onChangeImage = (event) => {
        const file = event.target.files[0];

        if (file) {
            this.setState({
                image: file,
                imagePreview: URL.createObjectURL(file),
            });
        }
    };

    // Handle the submission of the new post
    handleNewPostSubmit = () => {
        const {title, newPost, image} = this.state;
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", newPost);
        formData.append("userid", Cookies.get('sessionUserID'));
        formData.append("image", image);


        axios.post(`${backendUrl}/post/add`, formData, {
            headers: {
                'sessionID': sessionStorage.getItem('sessionID'),
                'sessionUserID': sessionStorage.getItem('sessionUserID'),
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        title: "",
                        newPost: "",
                        image: null,
                        imagePreview: null,
                        showSuccessAlert: true,
                    });
                    setTimeout(() => {
                        this.setState({showSuccessAlert: false});
                    }, 3000);
                    window.location = '/';
                }
            })
            .catch((error) => {
                console.error(error);
                this.setState({showErrorAlert: true});
                setTimeout(() => {
                    this.setState({showErrorAlert: false});
                }, 3000);
                setTimeout(() => {
                    window.location = '/login';
                }, 3000);
            });
    };

    render() {
        const {title, newPost, imagePreview, showSuccessAlert, showErrorAlert} = this.state;
        return (
            <>
                <Navbar/>
                <MDBContainer fluid>
                    <MDBCard className='text-black mb-3' alignment='center'
                             style={{maxWidth: '800px', maxHeight: '1200px', margin: '0 auto', padding: '16px'}}
                    >
                        <MDBCardBody>
                            <MDBInput
                                type='text'
                                value={title}
                                placeholder='Title'
                                onChange={this.onChangeTitle}
                            />
                            <textarea
                                className='form-control mt-3'
                                rows='3'
                                placeholder='Write your thoughts...'
                                value={newPost}
                                onChange={this.onChangeNewPost}
                                style={{height: '236px'}}
                            ></textarea>
                            <div className="form-group mt-3">
                                <label htmlFor="image">Upload Image:</label>
                                <input
                                    type="file"
                                    id="image"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={this.onChangeImage}
                                />
                            </div>
                            {imagePreview && <img src={imagePreview} alt="Image Preview"
                                                  style={{maxWidth: '100%', height: 'auto', marginTop: '10px'}}/>}
                            <button className='btn btn-primary mt-3' onClick={this.handleNewPostSubmit}>
                                Submit Post
                            </button>
                            {showSuccessAlert && (
                                <div className="alert alert-success mt-3" role="alert">
                                    Post submitted successfully!
                                </div>
                            )}
                            {showErrorAlert && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    You are not authorized to post. Please login to continue.
                                </div>
                            )}
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer>
            </>
        );
    }
}