import {useEffect, useState} from "react";
import {CheckSquareFill, PersonFill, Search, XSquareFill} from "react-bootstrap-icons";
import "../css/friends.css"
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment/moment";
import {useWindowSize} from "./useWindowSize";
import image from '../images/background.jpg'
import {Modal, Button} from "react-bootstrap";

const Friends = () => {
    const [width, height] = useWindowSize();
    const [startDate, setStartDate] = useState(new Date());
    const [tab, setTab] = useState('friends');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [requests, setRequests] = useState(null);
    const [friends, setFriends] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pendingRequests, setPendingRequests] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: '#efa481',
        date: '',
        sendTo: 0,
        friendshipId: 0,
        status: 'pending'
    });
    const [userToSend, setUserToSend] = useState();

    useEffect(() => {
        let userId = localStorage.getItem('userId');
        let token = localStorage.getItem('jwt');

        const fetchData = async () => {
            await fetch(`http://localhost:2426/api/friendship/requests/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    const data = await response.json();
                    console.log(data);
                    setRequests(data);
                } else if (response.status === 403) {
                    window.location.href = "http://localhost:3000/forbidden";
                } else if (response.status === 404) {
                    console.log("Not found")
                } else {
                    console.log("Problem")
                }
            }).catch((err) => {
                console.log(err.message)
            });


            await fetch(`http://localhost:2426/api/friendship/user/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    const data = await response.json();
                    let friendList = [];
                    for (let i = 0; i < data.length; i += 1) {
                        if (data[i].firstUser.id === parseInt(userId)) {
                            friendList.push(data[i].secondUser);
                        } else {
                            friendList.push(data[i].firstUser);
                        }
                    }
                    setFriends(friendList);
                } else if (response.status === 403) {
                    window.location.href = "http://localhost:3000/forbidden";
                } else if (response.status === 404) {
                    console.log("Not found")
                } else {
                    console.log("Problem")
                }
            }).catch((err) => {
                console.log(err.message)
            });

            await fetch(`http://localhost:2426/api/sharedTask/pending/user=${userId}`, {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    const data = await response.json();
                    console.log(data);
                    setPendingRequests(data);
                } else if (response.status === 403) {
                    window.location.href = "http://localhost:3000/forbidden";
                } else if (response.status === 404) {
                    console.log("Not found")
                } else {
                    console.log("Problem")
                }
            }).catch((err) => {
                console.log(err.message)
            });
        }

        fetchData()
    }, [tab, status])

    const changeTab = (newTab) => {
        setTab(newTab);
    }

    const handleChange = (event) => {

        const {value} = event.target;
        setEmail(value);
    }

    const openModal = (friendId) => {
        setModalIsOpen(true);
        setUserToSend(friendId);
    }
    const closeModal = () => {
        setModalIsOpen(false);
    }

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setNewTask((prevTask) => ({...prevTask, [name]: value}));
    };

    const searchForEmail = async () => {
        let userAuthEmail = localStorage.getItem('email');
        let userId = localStorage.getItem('userId');

        if (email === userAuthEmail) {
            setError(`This is your email!`);
        } else {
            let token = localStorage.getItem('jwt');

            const response1 = await fetch(`http://localhost:2426/api/user/email=${email}`, {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            });

            if (response1.status === 200) {
                const data = await response1.json();
                console.log(data);
                await setUser(data);

                await fetch(`http://localhost:2426/api/friendship/check?user1Id=${userId}&user2Id=${data.id}`, {
                    method: "GET",
                    headers: {
                        Authorization: 'Bearer ' + token,
                    }
                }).then(async (response) => {
                    if (response.status === 200) {
                        const data = await response.json();
                        await setStatus(data.status);
                        console.log(status);
                        // window.location.reload();
                    } else if (response.status === 403) {
                        console.log("Forbidden")
                        window.location.href = "http://localhost:3000/forbidden";
                    } else if (response.status === 404) {
                        setError(`User with email ${email} doesn't exist`);
                        console.log("Not found")
                        setStatus('')
                    } else {
                        console.log("Problem")
                    }
                }).catch((err) => {
                    console.log(err.message)
                });

            } else if (response1.status === 403) {
                window.location.href = "http://localhost:3000/forbidden";
            } else if (response1.status === 404) {
                setError(`User with email ${email} doesn't exist`);
                setUser('');
                console.log("Not found");
            } else {
                console.log("Problem");
            }
        }
    }

    const sendFriendRequest = async () => {
        let id = localStorage.getItem('userId');
        let token = localStorage.getItem('jwt');

        const friendRequest = {
            "firstUserId": id,
            "secondUserId": user.id,
            "status": "pending"
        }

        await fetch('http://localhost:2426/api/friendship', {
            method: "POST",
            headers: {
                Authorization: 'Bearer ' + token,
                'content-type': 'application/json'
            },
            body: JSON.stringify(friendRequest)
        }).then(async (response) => {
            if (response.status === 200) {
                setStatus('pending')
                console.log("ok")
            } else if (response.status === 403) {
                console.log("Forbidden")

            } else {
                console.log(`Problem`);
            }
        }).catch((err) => {
            console.log(err.message)
        });
    }

    const acceptRequest = async (id) => {
        let token = localStorage.getItem('jwt');
        await fetch(`http://localhost:2426/api/friendship/${id}/accept`, {
            method: "PUT",
            headers: {
                Authorization: 'Bearer ' + token,
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log("ok")
                setStatus('accepted')
            } else if (response.status === 403) {
                window.location.href = "http://localhost:3000/forbidden";
            } else {
                console.log("error");
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const denyRequest = async (id) => {
        let token = localStorage.getItem('jwt');
        await fetch(`http://localhost:2426/api/friendship/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: 'Bearer ' + token,
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log("ok")
                setStatus('')
            } else if (response.status === 403) {
                window.location.href = "http://localhost:3000/forbidden";
            } else {
                console.log("error");
            }
        }).catch((err) => {
            console.log(err);
        });
    }


    const inviteFriend = async () => {
        let id = localStorage.getItem('userId');
        let token = localStorage.getItem('jwt');

        newTask.sendTo = userToSend;
        newTask.date = moment(startDate).format('YYYY-MM-DD');

        const response = await fetch(`http://localhost:2426/api/friendship/check?user1Id=${id}&user2Id=${userToSend}`, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + token,
            }
        });

        if (response.status === 200) {
            const friendship = await response.json();
            newTask.friendshipId = friendship.id;
            console.log(friendship);
        } else if (response.status === 403) {
            window.location.href = "http://localhost:3000/forbidden";
        } else {
            console.log("error");
        }

        console.log(newTask);


        await fetch('http://localhost:2426/api/sharedTask', {
            method: "POST",
            headers: {
                Authorization: 'Bearer ' + token,
                'content-type': 'application/json'
            },
            body: JSON.stringify(newTask)
        }).then(async (response) => {
            if (response.status === 200) {
                console.log("ok")
            } else if (response.status === 403) {
                console.log("Forbidden")

            } else {
                console.log(`Problem`);
            }
        }).catch((err) => {
            console.log(err.message)
        });

        setNewTask({
            title: '',
            description: '',
            priority: '#efa481',
            date: '',
            friendshipId: 0,
            sendTo: 0,
            status: 'pending'
        });

        setModalIsOpen(false);
    }

    const handleKeypress = e => {
        if (e.which === 13) {
            searchForEmail();
        }
    };

    const denyInvite = async (id) => {
        let token = localStorage.getItem('jwt');
        await fetch(`http://localhost:2426/api/sharedTask/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: 'Bearer ' + token,
            }
        }).then(async (response) => {
            if (response.status === 200) {
                console.log("ok");
                window.location.reload();
            } else if (response.status === 403) {
                window.location.href = "http://localhost:3000/forbidden";
            } else {
                console.log("Big problem")
            }
        }).catch((err) => {
            console.log(err.message)
        });
    }


    const acceptInvite = async (id) => {
        let token = localStorage.getItem('jwt');
        await fetch(`http://localhost:2426/api/sharedTask/${id}`, {
            method: "POST",
            headers: {
                Authorization: 'Bearer ' + token,
            }
        }).then(async (response) => {
            if (response.status === 200) {
                console.log("ok");
                window.location.reload();
            } else if (response.status === 403) {
                window.location.href = "http://localhost:3000/forbidden";
            } else {
                console.log("Big problem")
            }
        }).catch((err) => {
            console.log(err.message)
        });
    }

    return (
        <div style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: height - 60,
            width: width - 17
        }}>
            <div className="friend-container">
                <div className="left-container">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">

                                {
                                    friends ? (
                                        friends.map((friend, index) => (
                                            <div className="people-nearby" key={index}>
                                                <div className="nearby-user">
                                                    <div className="row">
                                                        <div className="col-md-1 col-sm-2">
                                                            <PersonFill className="person-fill"></PersonFill>
                                                        </div>
                                                        <div className="col-md-4 col-sm-6"
                                                             style={{fontWeight: "bolder", color: "#fffdfd"}}>
                                                            <h5>{friend.firstname} {friend.lastname}</h5>
                                                            <p style={{
                                                                fontWeight: "bold",
                                                                color: "#31f3f3"
                                                            }}>{friend.email}</p>
                                                        </div>
                                                        <div className="col-md-1 col-sm-1">
                                                            <button className="btn btn-primary pull-right"
                                                                    onClick={() => openModal(friend.id)}>Invite
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <p>nothing</p>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>


                <div className="right-container">
                    <div className="container">
                        <nav aria-label="Page navigation">
                            <ul className="pagination pagination-lg row no-gutters justify-content-center"
                                style={{marginBlockStart: "10px"}}>
                                <li className="page-item " style={{width: "150px"}}>
                                    <a className="page-link shadow-sm" onClick={() => changeTab('friends')}>Friends</a>
                                </li>
                                <li className="page-item " style={{width: "150px"}}>
                                    <a className="page-link shadow-sm"
                                       onClick={() => changeTab('activities')}>Activities</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    {
                        tab === 'friends' ? (
                            <div>
                                <div className="container" style={{width: "70%"}}>
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="input-group mb-sm-2">
                                                <input type="text" className="form-control" placeholder="User email"
                                                       aria-label="User email" aria-describedby="basic-addon2"
                                                       value={email}
                                                       onChange={handleChange} onKeyPress={handleKeypress}/>
                                                <div className="input-group-append">
                                                    <Search onClick={() => searchForEmail()}
                                                            style={{marginLeft: "4px", marginTop: "5px"}}></Search>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            {
                                                user ? (
                                                    <div className="search-response">
                                                        <h3>{user.firstname} {user.lastname}</h3>
                                                        {
                                                            status === '' ? (
                                                                <button className="btn btn-success"
                                                                        onClick={sendFriendRequest}>Add</button>
                                                            ) : (
                                                                <p>{status}</p>
                                                            )
                                                        }
                                                    </div>
                                                ) : (
                                                    <p>{error}</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                                {
                                    requests && requests.length > 0 ? (
                                            <div className="container" style={{marginBlockStart: "20px", width: "70%"}}>
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h3>Requests</h3>
                                                    </div>
                                                    <div className="card-body">
                                                        {
                                                            requests ? (
                                                                requests.map((request, index) => (
                                                                    request ? (
                                                                        <div key={index} className="friend-request">
                                                                            <h4>{request.firstUser.firstname} {request.firstUser.lastname} {request.firstUser.email}</h4>
                                                                            <div>
                                                                                <button className="btn btn-success"
                                                                                        onClick={() => acceptRequest(request.id)}>Accept
                                                                                </button>
                                                                                <button className="btn btn-danger"
                                                                                        onClick={() => denyRequest(request.id)}>Deny
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <></>
                                                                    )
                                                                ))
                                                            ) : (
                                                                <p>No requests</p>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ) :
                                        (
                                            <></>
                                        )
                                }
                            </div>

                        ) : (
                            <div>
                                <div className="container" style={{width: "70%"}}>
                                    <div className="card">
                                        <div className="card-header"
                                             style={{textAlign: "center", alignContent: "center"}}>
                                            <h3>Proposed activities</h3>
                                        </div>
                                        <div className="card-body" style={{display: "flex", justifyContent: "center"}}>
                                            {
                                                pendingRequests ? (
                                                    pendingRequests.map((task, index) => (
                                                        <div key={index} className="card" style={{width: "80%"}}>
                                                            <div className="card-header" style={{
                                                                fontWeight: "bold",
                                                                fontSize: "20px",
                                                                backgroundColor: task.priority
                                                            }}>
                                                                {task.title}
                                                                <div className="buttons">
                                                                    <button className="btn btn">
                                                                        <CheckSquareFill className="btn-icon-task"
                                                                                         style={{color: "#378d2a"}}
                                                                                         onClick={() => acceptInvite(task.id)}></CheckSquareFill>
                                                                    </button>
                                                                    <button className="btn btn">
                                                                        <XSquareFill className="btn-icon-task"
                                                                                     style={{color: "#fa0808"}}
                                                                                     onClick={() => denyInvite(task.id)}></XSquareFill>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="card-body" style={{fontSize: "18px"}}>
                                                                {task.description}
                                                            </div>
                                                            <div className="card-footer"
                                                                 style={{fontWeight: "bold", textAlign: "center"}}>
                                                                Date: {task.date}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <h1>Waiting</h1>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )
                    }
                </div>

                <Modal show={modalIsOpen} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Propose Activity</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" name="title" value={newTask.title} onChange={handleInputChange}
                                   className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="description" value={newTask.content} onChange={handleInputChange}
                                      className="form-control"></textarea>
                        </div>
                        <div className="form-group" style={{marginBottom: "10px", maxWidth: "183px"}}>
                            <label>Date</label>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={inviteFriend}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default Friends;