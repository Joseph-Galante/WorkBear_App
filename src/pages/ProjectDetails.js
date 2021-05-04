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
        })
    }

    const addTask = (e) =>
    {
        e.preventDefault();
        // console.log(description);
        axios.post(`${env.BACKEND_URL}/projects/${project.id}/tasks`, { description }, { headers: { Authorization: user.id }}).then(res =>
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
                    <div>
                        {/* {console.log(project)} */}
                        <h1>{project.title}</h1>
                        <h3>{project.description} | Due: {project.dueDate ? project.dueDate : 'TBD'}</h3>
                        <div className="collaborators">
                            <span className="collabBar">
                                <h2>Collaborators:</h2>
                                <input type="button" value="Add Collaborator" onClick={() => {setInviting(true)}}/>
                            </span>
                            <div className="collabSection">
                                <div className="collaborator">
                                    <h4>{project.users ? project.users.map((user) => {return (<div key={user.id}>{user.name}<br></br></div>)}) : null}</h4>
                                </div>
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