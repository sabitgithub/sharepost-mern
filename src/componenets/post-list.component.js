import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBCardImage, MDBCardFooter} from 'mdb-react-ui-kit';
import Cookies from 'js-cookie';

const backendUrl = 'http://localhost:5000';

const calculateTimeDifference = (createdAt) => {
    const currentTime = new Date();
    const createdTime = new Date(createdAt);

    const timeDifferenceInSeconds = Math.floor((currentTime - createdTime) / 1000);

    if (timeDifferenceInSeconds < 60) {
        return 'few seconds ago';
    } else if (timeDifferenceInSeconds < 3600) {
        return `${Math.floor(timeDifferenceInSeconds / 60)} minutes ago`;
    } else if (timeDifferenceInSeconds < 86400) {
        return `${Math.floor(timeDifferenceInSeconds / 3600)} hours ago`;
    } else {
        return `${Math.floor(timeDifferenceInSeconds / 86400)} days ago`;
    }

};


const Post = props => {

    const [isLiked, setIsLiked] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [userComments, setUserComments] = useState([]);

    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
    };


    useEffect(() => {
        axios.post(`${backendUrl}/comment/user-comment/`, { postid: props.post._id })
            .then((response) => {
                setUserComments(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [props.post._id]);

    const handleCommentSubmit = () => {
        axios.post(`${backendUrl}/comment/add`, {
            postid: props.post._id,
            content: commentInput,
            userid: Cookies.get('sessionUserID')
        })
            .then((response) => {
                if (response.status === 200) {
                    setCommentInput("");
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        setShowSuccessAlert(false);
                    }, 3000);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleLike = () => {
        axios.post(`${backendUrl}/like/add`, {postid: props.post._id, userid: Cookies.get('sessionUserID')})
            .then((response) => {
                if (response.status === 200 && response.data.message == 'Liked') {
                    setIsLiked(true);
                }
                if (response.status === 200 && response.data.message == 'UnLiked') {
                    setIsLiked(false);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <MDBCard className='text-black mb-3' alignment='center' style={{'marginTop': '40px'}}>
            {props.post.image &&
                <MDBCardImage src={props.post.image} alt={props.post.title} width={'400px'} height={'300px'}
                              position="top"/>}
            <MDBCardBody>
                <MDBCardTitle>{props.post.title}</MDBCardTitle>
                <div className='d-flex justify-content-between'>
                    <MDBCardText>{props.post.content}</MDBCardText>
                    <MDBCardText className='text-muted'
                                 style={{'textAlign': 'right'}}>{calculateTimeDifference(props.post.createdAt)}</MDBCardText>
                </div>

                <div className='form-group d-flex flex-column align-items-start' style={{'marginTop': '60px'}}>
                    <button className='btn btn-primary' onClick={handleLike}>
                        {isLiked ? 'Liked' : 'Like'}
                    </button>
                </div>

                <div className='form-group d-flex flex-column align-items-end'>
                    <textarea className='form-control mt-3' rows='3' placeholder='Write a comment...'
                              value={commentInput} onChange={handleCommentChange}></textarea>
                    <button className={'btn btn-primary'} onClick={handleCommentSubmit}> Submit Comment</button>
                </div>
                {showSuccessAlert && (
                    <div className="alert alert-success" role="alert">
                        Comment posted successfully!
                    </div>
                )}
            </MDBCardBody>
            {userComments && userComments.map((comment) => (
                <MDBCard key={comment._id}>
                    <MDBCardBody>
                        <div className='d-flex justify-content-between'>
                        <div>
                            <strong>{comment.name}:</strong> {comment.content}
                        </div>
                        <MDBCardText className="text-muted">
                            {calculateTimeDifference(comment.createdAt)}
                        </MDBCardText>
                        </div>
                    </MDBCardBody>
                </MDBCard>
            ))}
        </MDBCard>
    );
};

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
        return this.state.posts.map((currentPost) => (
            <Post
                post={currentPost}
                key={currentPost._id}
                comments={currentPost.comments}
            />
        ));
    }

    render() {
        return (
            <div style={{maxWidth: '800px', margin: '0 auto', padding: '16px'}}>
                <div>
                    {this.postList()}
                </div>
            </div>
        );
    }
}
