import React, {Component} from 'react';
import axios from 'axios';
import {MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn} from 'mdb-react-ui-kit';

const backendUrl = 'http://localhost:5000';

const Post = props => (
    <MDBCard className='text-black mb-3' style={{borderRadius: '5px'}} small>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <MDBCardImage src={props.post.image} position='top' alt={props.post.title}
                          style={{width: '500px', height: '300px'}}/>
        </div>
        <MDBCardBody>
            <MDBCardTitle>{props.post.title}</MDBCardTitle>
            <MDBCardText>
                {props.post.content}
            </MDBCardText>
            {/* Add any other details you want to display */}
            <MDBBtn href='#'>Button</MDBBtn>
        </MDBCardBody>
    </MDBCard>
);

export default class PostList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        axios
            .get(`${backendUrl}/post/`)
            .then(response => {
                this.setState({posts: response.data});
            })
            .catch(error => {
                console.log(error);
            });
    }

    postList() {
        return this.state.posts.map(currentPost => (
            <Post
                post={currentPost}
                key={currentPost._id}
            />
        ));
    }

    render() {
        return (
            <div className='container-sm'>
                <button className='btn btn-primary mb-3' onClick={() => { /* Implement the logic to create a new post here */
                }}>
                    Create New Post
                </button>
                <div className='card-columns'>
                    {this.postList()}
                </div>
            </div>
        );
    }
}
