import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MessageContext } from '../contexts/MessageContext';
import { UserContext } from '../contexts/UserContext';
import env from 'react-dotenv';
import Task from '../components/Task';

const ProjectDetails = (props) =>
{
    // contexts
    const {userState, verifyUser } = useContext(UserContext);
    const [user, setUser] = userState;
    const { displayMessage, clearMessage } = useContext(MessageContext);

    // states
    const [email, setEmail] = useState('');
    const [project, setProject] = useState({});
    const [taskId, setTaskId] = useState(null);
    const [inviting, setInviting] = useState(false);
    const [tasking, setTasking] = useState(false);
    const [description, setDescription] = useState('');
    const [month, setMonth] = useState(1);
    const [day, setDay] = useState(1);
    const [year, setYear] = useState(21);

    // on component load
    useEffect(clearMessage, []);

    // functions
    const getProjectDetails = () =>
    {
        axios.get(`${env.BACKEND_URL}/projects/${props.projectId}`).then((res) =>
        {
            // console.log(res);
            setProject(res.data.project);
        }).catch((error) => console.log(error.message));
    }
    useEffect(getProjectDetails, []);

    const inviteCollaborator = (e) =>
    {
        e.preventDefault();

        axios.post(`${env.BACKEND_URL}/projects/${project.id}/collaborators`, { email: email, message: `${user.name} has invited you to work on ${project.title}` }, { headers: { Authorization: user.id } }).then((res) =>
        {
            console.log(res);
            displayMessage(true, 'Collaboration invite sent.');
            getProjectDetails();
            setInviting(false);
        }).catch(error => 
        {
            console.log(error.message);
            // check if error was conflict from duplicate invites
            if (error.message === 'Request failed with status code 409')
            {
                displayMessage(false, 'User has already been invited to this project.');
            }
            // check if user tried to invite a user to an unowned project
            if (error.message === 'Request failed with status code 401')
            {
                displayMessage(false, 'You must own the project to invite collaborators.');
            }
            // check if user tried to invite a non-existent user
            if (error.message === 'Request failed with status code 400')
            {
                displayMessage(false, 'No user with the email provided exists.');
            }
        })
    }

    const addTask = (e) =>
    {
        e.preventDefault();
        // console.log(description);
        axios.post(`${env.BACKEND_URL}/projects/${project.id}/tasks`, { description: description, dueDate: `${month}-${day}-${year}` }, { headers: { Authorization: user.id }}).then(res =>
        {
            console.log(res);
            getProjectDetails();
            setTasking(false);
        }).catch(error => console.log(error.message))
    }

    return (
        <div className="projectDetailsPage">
            {inviting ? 
            <div className="inviteDetails">
                <input type="button" id="backToProject" value="Back" onClick={() => {setInviting(false)}}/>
                <h2>Invite A Collaborator</h2>
                <p>Enter the email of the user you want to invite to the project. Make sure this is correct so random users don't get added to your project.</p>
                <form className="inviteForm" onSubmit={inviteCollaborator}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <div></div>
                        <input id="email" type="text" value={email} placeholder="Email" onChange={(e) => {setEmail(e.target.value)}}/>
                    </div>
                    <input type="submit" value="Send Invite" onClick={inviteCollaborator}/>
                </form>
            </div>
            :
            <div className="projectDetails">
                {project ?
                    <div className="projectDisplay">
                        {/* {console.log(project)} */}
                        <h1>{project.title}</h1>
                        <span>----------------------------------------------------------------------------------------------------------------------------------------</span>
                        <h3>{project.description}</h3>
                        <h3>Due: {project.dueDate ? project.dueDate : 'TBD'}</h3>
                        <div className="collaborators">
                            <span className="collabBar">
                                <h2>Collaborators:</h2>
                                {project.users ? user.email === project.users[0].email ? <input type="button" value="Add Collaborator" onClick={() => {setInviting(true)}}/> : null : null}
                            </span>
                            <div className="collabSection">
                                    <h4 className="collabNames">{project.users ? project.users.map((u) => {return (<span className="collaborator" key={u.id}>{u.name === user.name ? `${u.name} (you)` : u.name}</span>)}) : null}</h4>
                            </div>
                        </div>
                        <div className="tasks">
                            <span className="tasksBar">
                                <h4>Tasks:</h4>
                                <input type="button" value="Add Task" onClick={() => {setTasking(true)}} />
                            </span>
                            <div className="taskSection">
                            {
                                tasking ? 
                                    <form>
                                        <div key="taskDescription">
                                            <input type="text" id="taskDescription" value={description} placeholder="Task" onChange={(e) => {setDescription(e.target.value)}}/>
                                        </div>
                                        <div key="taskDueDate">
                                            <label  className="addTaskLabel" htmlFor="taskDueDate">Due Date (MM-DD-YY):</label>
                                            <span className="dueDateSpan">
                                                <input key="dueDateMonth" type="number" value={month} placeholder="MM" min={1} max={12} maxLength={2} onChange={(e) => {setMonth(e.target.value)}}/>
                                                <input key="dueDateDay" type="number" value={day} placeholder="DD" min={1} max={31} maxLength={2} onChange={(e) => {setDay(e.target.value)}}/>
                                                <input key="dueDateYear" type="number" value={year} placeholder="YY" min={21} max={99} maxLength={2} onChange={(e) => {setYear(e.target.value)}}/>
                                            </span>
                                        </div>
                                        <input type="submit" id="cancelTask" value="Cancel" onClick={() => {setDescription(''); setTasking(false)}} />
                                        <input type="submit" id="addTask" value="Add Task" onClick={addTask} />
                                    </form>
                                    :
                                    <>
                                        {project.tasks ? 
                                            project.tasks.length === 0 ?  
                                                'No tasks' 
                                                :
                                                <div className="taskList">
                                                    {project.tasks.map(task =>
                                                    {
                                                        if (!task.completed) {return <Task key={task.id} users={project.users} task={task} getProject={getProjectDetails}/>}
                                                    })
                                                    }
                                                    {project.tasks.map(task =>
                                                    {
                                                        if (task.completed) {return <Task key={task.id} users={project.users} task={task} getProject={getProjectDetails}/>}
                                                    })
                                                    }
                                                </div>
                                            :
                                            'Loading tasks'
                                        }
                                    </>
                            }
                            </div>
                        </div>
                    </div>
                    :
                    <div>Loading project...</div>
                }
            </div>
            }
        </div>
    )
}

export default ProjectDetails;