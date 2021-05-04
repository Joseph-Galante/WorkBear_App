import { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { MessageContext } from '../contexts/MessageContext';
import axios from 'axios';
import env from 'react-dotenv';

const Projects = () =>
{
    // contexts
    const { userState } = useContext(UserContext);
    const [ user, setUser ] = userState;
    const { messageState, clearMessage } = useContext(MessageContext);

    // states
    const [projects, setProjects] = useState(null);
    const [shouldRedirect, setShouldRedirect] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [month, setMonth] = useState(1);
    const [day, setDay] = useState(1);
    const [year, setYear] = useState(21);

    // functions
    // get user's projects
    const getMyProjects = () =>
    {
        axios.get(`${env.BACKEND_URL}/projects`, { headers: { Authorization: user.id }}).then((res) =>
        {
            // console.log(res);
            // return project list
            const projects = res.data.projects.map((project) =>
            {
                return (
                    <div key={project.id} className="userProject" onClick={() => {setShouldRedirect(project.id)}}>
                        <span>{project.title} - {project.description} | Due: {project.dueDate ? project.dueDate : 'No Due Date'}</span>
                    </div>
                )
            })
            setProjects(projects);
        }).catch((error) => console.log(error.message));
    }
    useEffect(getMyProjects, []);

    const createProject = () =>
    {
        // create project
        axios.post(`${env.BACKEND_URL}/projects`, {
            title, description, dueDate: `${month}-${day}-${year}`
        }, { headers: { Authorization: user.id }}).then((res) =>
        {
            console.log(res);
            // refresh my project list
            // getMyProjects();
        }).catch((error) => console.log(error.message));
    }

    return (
        <div className="projectsPage">
            {shouldRedirect !== '' ? <Redirect to={`/projects/${shouldRedirect}`}/> : null}
            <div key="myProjects" className="myProjects">
                <h1>My Projects</h1>
                <span>----------------------------------------------------------------------------</span>
                {projects}
            </div>
            <div key="createProject" className="createProject">
                <h1>Start A New Project</h1>
                <span>----------------------------------------------------------------------------</span>
                <form onSubmit={createProject}>
                    <div key="projectTitle">
                        <label className="createProjectLabel" htmlFor="projectTitle">Title:</label>
                        <input type="text" value={title} placeholder="Title" onChange={(e) => {setTitle(e.target.value)}}/>
                    </div>
                    <div key="projectDescription">
                        <label className="createProjectLabel" htmlFor="projectDescription">Description:</label>
                        <input type="text" value={description} placeholder="Description" onChange={(e) => {setDescription(e.target.value)}}/>
                    </div>
                    <div key="projectDueDate">
                        <label  className="createProjectLabel" htmlFor="projectDueDate">Due Date (MM-DD-YY):</label>
                        <span className="dueDateSpan">
                            <input key="dueDateMonth" type="number" value={month} placeholder="MM" min={1} max={12} maxLength={2} onChange={(e) => {setMonth(e.target.value)}}/>
                            <input key="dueDateDay" type="number" value={day} placeholder="DD" min={1} max={31} maxLength={2} onChange={(e) => {setDay(e.target.value)}}/>
                            <input key="dueDateYear" type="number" value={year} placeholder="YY" min={21} max={99} maxLength={2} onChange={(e) => {setYear(e.target.value)}}/>
                        </span>
                    </div>
                    <input type="submit" value="Create Project"/>
                </form>
            </div>
        </div>
    )
}

export default Projects;