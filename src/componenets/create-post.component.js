import React, {Component} from 'react';
import axios from "axios";
import {MDBContainer, MDBCard, MDBCardBody, MDBInput} from 'mdb-react-ui-kit';
import Cookies from "js-cookie";

const backendUrl = 'http://localhost:5000';

export default class CreateNewPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "", // New field for the post title
            newPost: "",
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

    // Handle the submission of the new post
    handleNewPostSubmit = () => {
        const {title, newPost} = this.state;
        axios.post(`${backendUrl}/post/add`, {
            title: title, // Pass the title to the backend
            content: newPost,
            userid: Cookies.get('sessionUserID'),
        })
            .then((response) => {
                if (response.status === 200) {
                    // Clear the input fields after successful submission
                    this.setState({
                        title: "",
                        newPost: "",
                        showSuccessAlert: true,
                    });
                    setTimeout(() => {
                        this.setState({showSuccessAlert: false});
                    }, 3000);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        const {title, newPost, showSuccessAlert} = this.state;
        return (
            <MDBContainer fluid>
                <MDBCard className='text-black mb-3' alignment='center'
                         style={{maxWidth: '800px', maxHeight: '1200px', margin: '0 auto', padding: '16px'}}>
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
                        <button className='btn btn-primary mt-3' onClick={this.handleNewPostSubmit}>
                            Submit Post
                        </button>
                        {showSuccessAlert && (
                            <div className="alert alert-success mt-3" role="alert">
                                Post submitted successfully!
                            </div>
                        )}
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        );
    }
}
