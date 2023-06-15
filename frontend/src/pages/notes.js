import {useEffect, useState} from "react";
import {CheckCircleFill} from "react-bootstrap-icons";
import {TrashFill} from "react-bootstrap-icons";
import {Modal, Button} from 'react-bootstrap';
import image from '../images/background.jpg'
import {useWindowSize} from "./useWindowSize";

const Notes = () => {
    const [width, height] = useWindowSize();
    const [notes, setNotes] = useState([]);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [newNote, setNewNote] = useState({title: '', content: '', userId: ''});
    const [editedNote, setEditedNote] = useState({title: '', content: '', userId: 0});

    useEffect(() => {
        console.log("1");
        let token = localStorage.getItem('jwt');
        let userId = localStorage.getItem('userId');

        async function fetchData() {
            await fetch(`http://localhost:2426/api/note/user/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    const data = await response.json();
                    setNotes(data);
                } else if (response.status === 403) {
                    console.log("Forbidden")
                    window.location.href = "http://localhost:3000/forbidden";
                } else {
                    console.log("Big problem")
                }
            }).catch((err) => {
                console.log(err.message)
            });
        }

        fetchData();
    }, []);


    const openAddModal = () => {
        setAddModalIsOpen(true);
    };

    const closeAddModal = () => {
        setAddModalIsOpen(false);
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setNewNote((prevNote) => ({...prevNote, [name]: value}));
    };

    const addNote = async () => {
        newNote.userId = localStorage.getItem('userId');
        console.log(newNote)

        let token = localStorage.getItem('jwt');

        console.log(token)
        await fetch('http://localhost:2426/api/note', {
            method: "POST",
            body: JSON.stringify(newNote),
            headers: {
                Authorization: 'Bearer ' + token,
                'content-type': 'application/json'
            }
        }).then(async (response) => {
            if (response.status === 200) {
                let note = await response.json();
                console.log(note);
                let currNotes = notes;
                currNotes.push(note);
                setNotes(currNotes);
                console.log("Big OK");
            } else if (response.status === 403) {
                console.log("Forbidden")

            } else {
                console.log("Big problem")
            }
        }).catch((err) => {
            console.log(err.message)
        });

        closeAddModal();

        setNewNote({title: '', content: '', userId: ''});

    }

    const removeNote = async (index) => {
        let token = localStorage.getItem('jwt');
        await fetch(`http://localhost:2426/api/note/${index}`, {
            method: "DELETE",
            headers: {
                Authorization: 'Bearer ' + token,
            }
        }).then(async (response) => {
            if (response.status === 200) {
                console.log("ok");
                window.location.reload();
            } else if (response.status === 403) {
                console.log("Forbidden")
            } else {
                console.log("Big problem")
            }
        }).catch((err) => {
            console.log(err.message)
        });
    }

    const editNote = async (id) => {

        if (editedNote.id !== 0) {
            let token = localStorage.getItem('jwt');
            await fetch(`http://localhost:2426/api/note/${id}`, {
                method: "PUT",
                body: JSON.stringify(editedNote),
                headers: {
                    Authorization: 'Bearer ' + token,
                    'content-type': 'application/json'
                },
            }).then(async (response) => {
                if (response.status === 200) {
                    console.log("edit");
                    window.location.reload();
                } else if (response.status === 403) {
                    console.log("Forbidden")
                } else {
                    console.log("Big problem")
                }
            }).catch((err) => {
                console.log(err.message)
            });
        }
    }

    const editTitle = (value, id) => {
        if (editedNote.id !== id) {
            setEditedNote(notes.find(n => n.id === id));
        }
        editedNote.title = value.target.textContent;
        console.log(value.target.textContent)
    }

    const editContent = (value, id) => {
        if (editedNote.id !== id) {
            setEditedNote(notes.find(n => n.id === id));
        }
        editedNote.content = value.target.textContent;
        console.log(value.target.textContent)
    }

    return (
        <div style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: height - 60,
            width: width - 17
        }}>
            <div>
                <div className="container">
                    <div className="row">
                        {notes.map((note, index) => (
                            <div key={index} className="col-sm-4">
                                <div className="card mb-3" style={{backgroundColor: "#fdd8c9"}}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h3 className="card-title" onInput={(event) => editTitle(event, note.id)}
                                                contentEditable='true' style={{fontFamily: 'cursive'}}>{note.title}</h3>
                                            <div>
                                                <button className="btn btn-sm btn-success me-1"
                                                        onClick={() => editNote(note.id)}>
                                                    <CheckCircleFill/>
                                                </button>
                                                <button className="btn btn-sm btn-danger"
                                                        onClick={() => removeNote(note.id)}>
                                                    <TrashFill/>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="card-text" onInput={(event) => editContent(event, note.id)}
                                           contentEditable='true'>{note.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" onClick={openAddModal}>
                        +
                    </button>

                    <Modal show={addModalIsOpen} onHide={closeAddModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add note</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" name="title" value={newNote.title} onChange={handleInputChange}
                                       className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <textarea name="content" value={newNote.content} onChange={handleInputChange}
                                          className="form-control"></textarea>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeAddModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={addNote}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default Notes;