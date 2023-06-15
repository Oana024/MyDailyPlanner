import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const Profile = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStats, setShowStats] = useState(false);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        console.log(percent);
    }, [percent]);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleButtonClick = async () => {
        let userId = localStorage.getItem('userId');
        let token = localStorage.getItem('jwt');

        let formattedStart = moment(startDate).format('YYYY-MM-DD');
        let formattedEnd = moment(endDate).format('YYYY-MM-DD');

        try {
            const response = await fetch(`http://localhost:2426/api/task/user=${userId}/between?start=${formattedStart}&end=${formattedEnd}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setTotalTasks(data.total);
                setCompletedTasks(data.completed);
            } else if (response.status === 403) {
                console.log('Forbidden');
            } else {
                console.log('Problem');
            }
        } catch (err) {
            console.log(err.message);
        }

        if (totalTasks !== 0) {
            setPercent((completedTasks / totalTasks) * 100);
            console.log(percent);
        }

        setShowStats(true);
    };

    return (
        <div>
            <div style={{ marginLeft: '20px', marginTop: '20px' }}>
                <h2>Select Date Range:</h2>
                <div>
                    <span style={{ marginRight: '10px' }}>Start:</span>
                    <DatePicker selected={startDate} onChange={handleStartDateChange} />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <span style={{ marginRight: '16px' }}>End:</span>
                    <DatePicker selected={endDate} minDate={startDate} onChange={handleEndDateChange} />
                </div>
                <button className="btn btn-success" style={{ marginTop: '15px' }} onClick={handleButtonClick}>
                    Show
                </button>
            </div>
            {showStats ? (
                <div style={{ marginTop: '40px' }}>
                    {totalTasks !== 0 ? (
                        <div>
                            <h3>Task Statistics:</h3>
                            <div>
                                <span style={{ marginRight: '8px' }}>Total Tasks:</span>
                                <span>{totalTasks}</span>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <span style={{ marginRight: '8px' }}>Completed Tasks:</span>
                                <span>{completedTasks}</span>
                            </div>
                            <div className="progress" style={{ width: '60%', marginTop: '20px' }}>
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${percent}%` }}
                                    aria-valuenow={percent}
                                    aria-valuemin="0" aria-valuemax="100"
                                >
                                    {percent}%
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3>No tasks in this period</h3>
                        </div>
                    )}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default Profile;