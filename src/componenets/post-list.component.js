import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBCardImage, MDBCardFooter} from 'mdb-react-ui-kit';
import Cookies from 'js-cookie';
import Navbar from './navbar.component';

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

    console.log('full data:' + props.post);

    const [isLiked, setIsLiked] = useState(props.post.isLiked || false);
    const [commentInput, setCommentInput] = useState("");
    const [totalLike, settotalLike] = useState("0");
    const [totalComment, settotalComment] = useState("0");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [userComments, setUserComments] = useState([]);
    const [postUserFullName, setpostUserFullName] = useState("");

    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
    };


    useEffect(() => {
        axios.post(`${backendUrl}/comment/user-comment/`, {postid: props.post._id}, {
            headers: {
                'sessionID': sessionStorage.getItem('sessionID'),
                'sessionUserID': sessionStorage.getItem('sessionUserID'),
            },
        })
            .then((response) => {
                setUserComments(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        axios
            .post(`${backendUrl}/like/user-like`, {postid: props.post._id}, {
                headers: {
                    'sessionID': sessionStorage.getItem('sessionID'),
                    'sessionUserID': sessionStorage.getItem('sessionUserID'),
                },
            })
            .then((response) => {
                if (response.status === 200 && response.data.message === 'Liked') {
                    setIsLiked(true);
                } else {
                    setIsLiked(false);
                }
            })
            .catch((error) => {
                console.error(error);
            });

        axios
            .post(`${backendUrl}/post/user-name`, {postid: props.post._id}, {
                headers: {
                    'sessionID': sessionStorage.getItem('sessionID'),
                    'sessionUserID': sessionStorage.getItem('sessionUserID'),
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setpostUserFullName(response.data.postUserFullName);
                    console.log('postUserFullName: ' + response.data.postUserFullName)
                } else {
                    setIsLiked('');
                }
            })
            .catch((error) => {
                console.error(error);
            });

        axios
            .post(`${backendUrl}/comment/count`, {postid: props.post._id}, {
                headers: {
                    'sessionID': sessionStorage.getItem('sessionID'),
                    'sessionUserID': sessionStorage.getItem('sessionUserID'),
                },
            })
            .then((response) => {
                console.log('Count:' + response.data);
                if (response.status === 200) {
                    settotalLike(response.data.LikeCount);
                    settotalComment(response.data.CommentCount);
                }
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
        }, {
            headers: {
                'sessionID': sessionStorage.getItem('sessionID'),
                'sessionUserID': sessionStorage.getItem('sessionUserID'),
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    setCommentInput("");
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        setShowSuccessAlert(false);
                    }, 3000);

                    window.location.reload();
                }
            })
            .catch((error) => {
                window.location = '/login?error=' + error.response.data.error;
            });
    };


    const handleLike = () => {
        axios.post(`${backendUrl}/like/add`, {postid: props.post._id}, {
            headers: {
                'sessionID': sessionStorage.getItem('sessionID'),
                'sessionUserID': sessionStorage.getItem('sessionUserID'),
            },
        })
            .then((response) => {
                if (response.status === 200 && response.data.message == 'Liked') {
                    setIsLiked(true);
                }
                if (response.status === 200 && response.data.message == 'UnLiked') {
                    setIsLiked(false);
                }
                window.location.reload();
            })
            .catch((error) => {
                window.location = '/login?error=' + error.response.data.error;
            });
    };

    return (
        <MDBCard className='text-black mb-3' alignment='center' style={{'marginTop': '40px'}}>
            <div className='d-flex justify-content-between'>
            <MDBCardTitle style={{'textAlign': 'left'}}>Posted By: {postUserFullName} </MDBCardTitle>
            <MDBCardText className='text-muted'
                         style={{'textAlign': 'right'}}>{calculateTimeDifference(props.post.createdAt)}</MDBCardText>
            </div>
            {props.post.image &&
                <MDBCardImage src={backendUrl + '/uploads/' + props.post.image} alt={props.post.title} style={{
                    'width': '800px',
                    'height': '200px',
                    'objectFit': 'contain',
                    'objectPosition': 'center',
                    'alignContent': 'center'
                }} position="center"/>}

            <MDBCardBody>
                <MDBCardTitle>{props.post.title}</MDBCardTitle>
                <div className='d-flex justify-content-between'>
                    <MDBCardText>{props.post.content}</MDBCardText>
                </div>

                <div className='form-group d-flex flex-column align-items-start' style={{'marginTop': '60px'}}>
                    <button className='btn btn-primary' onClick={handleLike}>
                        {isLiked ? 'Liked' : 'Like'}
                    </button>
                </div>

                <div className='d-flex justify-content-between' style={{'marginTop': '10px'}}>
                    <MDBCardText>Likes: {totalLike}</MDBCardText>
                    <MDBCardText className='text-muted'
                                 style={{'textAlign': 'right'}}>Comments: {totalComment}</MDBCardText>
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
        const sessionID = sessionStorage.getItem('sessionID');
        const sessionUserID = sessionStorage.getItem('sessionUserID');

        axios
            .get(`${backendUrl}/post/`, {
                headers: {
                    'sessionID': sessionID,
                    'sessionUserID': sessionUserID,
                },
            })
            .then(response => {
                this.setState({posts: response.data});
            })
            .catch(error => {
                if (error.response) {
                    console.log('Error status:', error.response.status);
                    console.log('Error data:', error.response.data);
                    if (error.response.status === 401) {
                        window.location = '/login?error=Unauthorized';
                    } else {
                        window.location = '/login?error=An error occurred while fetching posts.';
                    }
                } else {
                    console.log('Error:', error.message);
                    window.location = '/login?error=Connection refused. Please try again later.';
                }
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
            <>
                <Navbar/>
                <div style={{maxWidth: '800px', margin: '0 auto', padding: '16px'}}>
                    <div>
                        {this.postList()}
                    </div>
                </div>
            </>
        );
    }
}