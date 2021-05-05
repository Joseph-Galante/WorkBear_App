import { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { MessageContext } from '../contexts/MessageContext';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import env from 'react-dotenv';

const ProjectInfo = () =>
{
    // contexts
    const {userState, verifyUser } = useContext(UserContext);
    const [user, setUser] = userState;
    const { displayMessage, clearMessage } = useContext(MessageContext);

    // states
    const [projects, setProjects] = useState(null);
    const [shouldRedirect, setShouldRedirect] = useState('');

    // on component load
    useEffect(clearMessage, []);

    // functions
    
    // get user's projects
    const getMyProjects = () =>
    {
        axios.get(`${env.BACKEND_URL}/projects`, { headers: { Authorization: user.id }}).then((res) =>
        {
            // console.log(res);
            const projects = res.data.projects.map((project) =>
            {
                return (
                    <div key={project.id} className="userProjectProfile" onClick={() => {setShouldRedirect(project.id)}}>
                        <span>{project.title} - {project.description} | Due: {project.dueDate}</span>
                    </div>
                )
            })
            setProjects(projects);
        }).catch((error) => console.log(error.message));
    }
    useEffect(getMyProjects, []);

    return (
        <div key="profileDisplay" className="profileDisplay">
            {shouldRedirect !== '' ? <Redirect to={`/projects/${shouldRedirect}`}/> : null}
            <h1 className="profileHeader">Projects</h1>
            <span>------------------------------------------------------</span>
            <div className="projectInfo">
                {projects ? projects : <span>Getting projects...</span>}
            </div>
        </div>
    )
}

export default ProjectInfo;