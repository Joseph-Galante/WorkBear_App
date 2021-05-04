import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { MessageContext } from '../contexts/MessageContext';
import { UserContext } from '../contexts/UserContext';
import env from 'react-dotenv';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Redirect } from 'react-router';

const Task = (props) =>
{
    // contexts
    const {userState, verifyUser } = useContext(UserContext);
    const [user, setUser] = userState;
    const { displayMessage, clearMessage } = useContext(MessageContext);

    // states
    const [assigned, setAssigned] = useState({});
    const [shouldRedirect, setShouldRedirect] = useState('');

    // on component load
    useEffect(clearMessage, []);

    // functions
    const assignTask = (email) =>
    {
        axios.post(`${env.BACKEND_URL}/tasks/${props.task.id}/assign`, { email: email }, { headers: { Authorization: user.id }}).then((res) =>
        {
            console.log(res);
            setAssigned(email);
            displayMessage(true, `${email} has been assigned to task successfully.`);
            props.getProject();
        }).catch(error => console.log(error.message));
    }

    return (
        <div className="task" style={props.task.completed ? {backgroundColor: 'dodgerblue'} : {backgroundColor: 'black'}}>
            {shouldRedirect !== '' ? <Redirect to={`/tasks/${shouldRedirect}`}/> : null}
            <span className="taskInfo">
                {/* {console.log(props.task)} */}
                { props.task ?
                <>
                    <span className="taskStamp">
                        <span>Assigned to: </span>
                        {
                        user.email === props.users[0].email ?
                            <Dropdown options={props.users ? props.users.map(user => {return `${user.name}`}) : 'TBD'} onChange={(e) => {assignTask(e.value)}} value={props.task.user ? props.task.user.name : assigned.name} placeholder='TBD' />
                        :
                            props.task.user ? props.task.user.name :
                            <input type="button" id="assignSelf" value="Assign Self" onClick={() => {assignTask(user.email)}}/>
                        }
                    </span>
                    <span onClick={() => {setShouldRedirect(props.task.id)}}>{props.task.description ? props.task.description : 'Project Task'}</span>
                </>
                :
                'Loading task...'
                }
            </span>
        </div>
    )
}

export default Task;