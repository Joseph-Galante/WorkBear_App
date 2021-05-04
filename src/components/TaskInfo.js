import { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { MessageContext } from '../contexts/MessageContext';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import env from 'react-dotenv';

const TaskInfo = () =>
{
    // contexts
    const {userState, verifyUser } = useContext(UserContext);
    const [user, setUser] = userState;
    const { displayMessage, clearMessage } = useContext(MessageContext);

    // states
    const [tasks, setTasks] = useState([]);
    const [shouldRedirect, setShouldRedirect] = useState('');

    // on component load
    useEffect(clearMessage, []);

    // functions
    
    // get user's tasks
    const getMyTasks = () =>
    {
        axios.get(`${env.BACKEND_URL}/tasks`, { headers: { Authorization: user.id }}).then((res) =>
        {
            // console.log(res);
            const tasks = res.data.tasks.map((task) =>
            {
                return (
                    <div key={task.id} className="userTaskProfile" onClick={() => {setShouldRedirect(task.id)}}>
                        <span>{task.description} | Due: {task.dueDate}</span>
                    </div>
                )
            })
            setTasks(tasks);
        }).catch((error) => console.log(error.message));
    }
    useEffect(getMyTasks, []);

    return (
        <div key="profileDisplay" className="profileDisplay">
            {shouldRedirect !== '' ? <Redirect to={`/tasks/${shouldRedirect}`}/> : null}
            <h1 className="profileHeader">Tasks</h1>
            <span>------------------------------------------------------</span>
            <div className="projectInfo">
                {tasks ? tasks.length === 0 ? 'No tasks' : tasks : <span>Getting tasks...</span>}
            </div>
        </div>
    )
}

export default TaskInfo;