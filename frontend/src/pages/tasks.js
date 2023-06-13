import Calendar from 'react-calendar'
import {useEffect, useState} from "react";
import 'react-calendar/dist/Calendar.css';
import "../css/calendar.css"
import {CalendarEventFill, CheckSquareFill, XSquareFill} from "react-bootstrap-icons";
import Modal from "react-modal";
import moment from "moment";
import CreatableSelect from "react-select/creatable";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Tasks = () => {
    const [value, onChange] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: '#4a9eb5',
        status: 'waiting',
        userId: ''
    });
    const [taskToBePostponed, setTaskToBePostponed] = useState();
    const [newDate, setNewDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        let token = localStorage.getItem('jwt');
        let userId = localStorage.getItem('userId');

        const formattedDate = moment(value).format('YYYY-MM-DD');

        async function fetchData() {
            await fetch(`http://localhost:2426/api/task/user/${userId}/date=${formattedDate}`, {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    const data = await response.json();
                    setTasks(data);
                } else if (response.status === 403) {
                    window.location.href = "http://localhost:3000/forbidden";
                } else {
                    console.log("Big problem")
                }
            }).catch((err) => {
                console.log(err.message)
            });

            await fetch(`http://localhost:2426/api/task/user=${userId}/tags`, {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    const data = await response.json();
                    const mapData = await data.map((tag) => ({label: tag, value: tag}));
                    setTags(mapData);
                } else if (response.status === 403) {
                    window.location.href = "http://localhost:3000/forbidden";
                } else {
                    console.log("Big problem")
                }
            }).catch((err) => {
                console.log(err.message)
            });
        }

        fetchData();
    }, [value]);


    const removeTask = async (index) => {
        let token = localStorage.getItem('jwt');
        await fetch(`http://localhost:2426/api/task/${index}`, {
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

    const completeTask = async (index) => {
        let token = localStorage.getItem('jwt');
        await fetch(`http://localhost:2426/api/task/${index}/status=completed`, {
            method: "PUT",
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

    const handleInputChange = (event) => {
        if (event.__isNew__) {
            const newTag = {
                value: event.value,
                label: event.label,
            };
            tags.push(newTag);
        } else {
            const {name, value} = event.target;
            setNewTask((prevTask) => ({...prevTask, [name]: value}));
        }
    };

    const addTask = async () => {
        newTask.userId = localStorage.getItem('userId');

        let token = localStorage.getItem('jwt');
        newTask.date = moment(value).format('YYYY-MM-DD');
        await fetch('http://localhost:2426/api/task', {
            method: "POST",
            body: JSON.stringify(newTask),
            headers: {
                Authorization: 'Bearer ' + token,
                'content-type': 'application/json'
            }
        }).then(async (response) => {
            if (response.status === 200) {
                let task = await response.json();
                let currTasks = tasks;
                currTasks.push(task);
                setTasks(currTasks);
                console.log("Big OK");
            } else if (response.status === 403) {
                console.log("Forbidden")

            } else {
                console.log("Big problem")
            }
        }).catch((err) => {
            console.log(err.message)
        });

        closeModal();

        setNewTask({title: '', description: '', priority: '#4a9eb5', status: 'waiting', userId: ''});
    }

    const handleButtonClick = (id) => {
        console.log(id)
        setTaskToBePostponed(id)
        setShowDatePicker((prevState) => !prevState);
    };

    const handleDateChange = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        console.log(formattedDate);
        setNewDate(date);
    };

    const postponeTask = async (id) => {
        let token = localStorage.getItem('jwt');
        const formattedDate = moment(newDate).format('YYYY-MM-DD');
        await fetch(`http://localhost:2426/api/task/${id}/date=${formattedDate}`, {
            method: "PUT",
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

        <div className="taskandcalendar">
            <div className="calendar">
                <Calendar onChange={onChange} value={value}/>
            </div>
            <div className="tasks">
                <div>
                    <button className="btn btn-primary" style={{marginBlockEnd: "10px", marginBlockStart: "10px"}}
                            onClick={openModal}>Add a new task
                    </button>
                </div>
                {
                    tasks ? (
                        tasks.map((task, index) => (
                            task.status === "waiting" ? (
                                <div key={index} className="card task" style={{marginBottom: showDatePicker && task.id === taskToBePostponed ? "300px" : "20px"}}>
                                    <div className="card-header"
                                         style={{backgroundColor: task.priority, fontWeight: "bold", fontSize: "18px"}}>
                                        {task.title}
                                        <div className="buttons">
                                            <button className="btn">
                                                <CalendarEventFill className="btn-icon-task"
                                                                   style={{color: "#ffc75a"}}
                                                                   onClick={() => handleButtonClick(task.id)}></CalendarEventFill>
                                            </button>
                                            <button className="btn btn">
                                                <CheckSquareFill className="btn-icon-task" style={{color: "#64d256"}}
                                                                 onClick={() => completeTask(task.id)}></CheckSquareFill>
                                            </button>
                                            <button className="btn btn">
                                                <XSquareFill className="btn-icon-task" style={{color: "#d6deff"}}
                                                             onClick={() => removeTask(task.id)}></XSquareFill>
                                            </button>
                                        </div>
                                        {showDatePicker && taskToBePostponed === task.id && (
                                            <div className="datepicker-wrapper" style={{marginBottom: "100px"}}>
                                                <DatePicker selected={newDate} onChange={handleDateChange}
                                                            open={showDatePicker}
                                                    // onClickOutside={() => setShowDatePicker(false)}
                                                            minDate={Date.now()}
                                                />
                                                <button className="save-btn" onClick={() => postponeTask(task.id)}>
                                                    <CheckSquareFill
                                                        style={{color: "#12bc24", width: "100%", height: "100%"}}>
                                                    </CheckSquareFill>
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">
                                            {task.description}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )
                        ))
                    ) : (
                        <h1>Waiting</h1>
                    )

                }
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} ariaHideApp={false}>
                <h2>Add task</h2>
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
                <div>
                    <label>Select task priority</label>
                    <select id="priority" name="priority" className="form-control" onChange={handleInputChange}>
                        <option value="#4a9eb5" label="Optional">Optional</option>
                        <option value="#f1630e" label="Important">Important</option>
                        <option value="#ff2d31" label="Urgent">Urgent</option>
                    </select>
                </div>
                <div>
                    <label>Select/Add a tag</label>
                    <CreatableSelect
                        className="basic-single"
                        classNamePrefix="select"
                        name="tag"
                        defaultValue={null}
                        onChange={(selectedOption) => handleInputChange({
                            target: {
                                value: selectedOption.value,
                                name: 'tag'
                            }
                        })}
                        isSearchable={true}
                        options={tags}
                    />
                </div>
                <button className="btn btn-primary" onClick={addTask}>Add</button>
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
            </Modal>

        </div>

    )
}

export default Tasks