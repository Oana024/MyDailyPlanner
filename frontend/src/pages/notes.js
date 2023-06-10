import {useEffect, useState} from "react";
import Modal from 'react-modal';
import {PencilSquare} from "react-bootstrap-icons";
import {TrashFill} from "react-bootstrap-icons";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' , userId: ''});
    const [oldNote, setOldNote] = useState({ title: '', content: '' , userId: ''});

    useEffect( () => {
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

    const openEditModal = async (id) => {
        let token = localStorage.getItem('jwt');
        await fetch(`http://localhost:2426/api/note/${id}`, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + token,
            }
        }).then(async (response) => {
            if (response.status === 200) {
                const data = await response.json();
                setOldNote(data);
            } else if (response.status === 403) {
                console.log("Forbidden")
            } else {
                console.log("Big problem")
            }
        }).catch((err) => {
            console.log(err.message)
        });

        console.log(oldNote);
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewNote((prevNote) => ({ ...prevNote, [name]: value }));
    };

    const handleEdit = (event) => {
        const { name, value } = event.target;
        setOldNote((prevNote) => ({ ...prevNote, [name]: value }));
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
        
        setNewNote({ title: '', content: '' , userId: ''});

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

    const editNote = async () => {
        let token = localStorage.getItem('jwt');
        let id = oldNote.id;
        await fetch(`http://localhost:2426/api/note/${id}`, {
            method: "PUT",
            body: JSON.stringify(oldNote),
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

        closeEditModal();
    }

    return (
        <div className="container">
            <h1>My Notes</h1>

            <div className="row">
            {notes.map((note, index) => (
                <div key={index} className="col-sm-4">
                    <div className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="card-title" contentEditable='true'>{note.title}</h5>
                                <div>
                                    <button className="btn btn-sm btn-primary me-1" onClick={() => openEditModal(note.id)}>
                                        <PencilSquare/>
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => removeNote(note.id)}>
                                        <TrashFill/>
                                    </button>
                                </div>
                            </div>
                            <p className="card-text">{note.content}</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
                +
            </button>

            <Modal isOpen={addModalIsOpen} onRequestClose={closeAddModal} ariaHideApp={false}>
                <h2>Add note</h2>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={newNote.title} onChange={handleInputChange} className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea name="content" value={newNote.content} onChange={handleInputChange} className="form-control"></textarea>
                </div>
                <button className="btn btn-primary" onClick={addNote}>Add</button>
                <button className="btn btn-secondary" onClick={closeAddModal}>Close</button>
            </Modal>


            <Modal isOpen={editModalIsOpen} onRequestClose={closeEditModal} ariaHideApp={false}>
                <h2>Add note</h2>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={oldNote.title} onChange={handleEdit} className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea name="content" value={oldNote.content} onChange={handleEdit} className="form-control"></textarea>
                </div>
                <button className="btn btn-primary" onClick={editNote}>Save</button>
                <button className="btn btn-secondary" onClick={closeEditModal}>Close</button>
            </Modal>

        </div>

    )
}

export default Notes;