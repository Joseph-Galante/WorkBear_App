import axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { MessageContext } from '../contexts/MessageContext';
import env from 'react-dotenv';
import Comment from '../components/Comment';

const TaskDetails = (props) =>
{
    // contexts
    const { userState } = useContext(UserContext);
    const [ user, setUser ] = userState;
    const { displayMessage, clearMessage } = useContext(MessageContext);

    // states
    const [task, setTask] = useState({});
    const [commentId, setCommentId] = useState(null);
    const [commenting, setCommenting] = useState(false);
    const [description, setDescription] = useState('');
    const [shouldRedirect, setShouldRedirect] = useState('');

    // on component load
    useEffect(clearMessage, []);

    // functions
    const getTaskDetails = () =>
    {
        axios.get(`${env.BACKEND_URL}/tasks/${props.taskId}`).then((res) =>
        {
            // console.log(res);
            setTask(res.data.task);
        }).catch((error) => console.log(error.message));
    }
    useEffect(getTaskDetails, []);

    const addComment = (e) =>
    {
        e.preventDefault();
        // console.log(description);
        axios.post(`${env.BACKEND_URL}/tasks/${task.id}/comments`, { description }, { headers: { Authorization: user.id }}).then(res =>
        {
            // console.log(res);
            getTaskDetails();
            setCommenting(false);
        }).catch(error => console.log(error.message))
    }

    const completeTask = (e) =>
    {
        e.preventDefault();
        axios.put(`${env.BACKEND_URL}/tasks/${task.id}`, { completed: true }, { headers: { Authorization: user.id }}).then((res) =>
        {
            console.log(res);
            getTaskDetails();
            displayMessage(true, 'Task marked as complete.');
        }).catch(error => console.log(error.message))
    }

    return (
        <div className="taskDetailsPage">
            {shouldRedirect !== '' ? <Redirect to={`/projects/${shouldRedirect}`}/> : null}
            <div className="taskDetails">
                <input type="button" id="backToProjectFromTask" value="To Project" onClick={() => {setShouldRedirect(task.project.id)}}/>
                {task ?
                    <div>
                        {/* {console.log(task)} */}
                        <h3>{task.description} | Due: {task.dueDate ? task.dueDate : 'TBD'}</h3>
                        <h5>Assigned to: {task.user ? task.user.name : 'TBD'}</h5>
                        <h5>{task.completed ? 'Completed' : <span>Incomplete <input type="button" value="Mark As Complete" onClick={completeTask}/></span>}</h5>
                        <div className="comments">
                            <span className="commentsBar">
                                <h4>Comments:</h4>
                                <input type="button" value="Add Comment" onClick={() => {setCommenting(true)}} />
                            </span>
                            {
                                commenting ? 
                                    <form>
                                        <div key="commentDescription">
                                            <textarea id="commentDescription" value={description} placeholder="Comment" onChange={(e) => {setDescription(e.target.value)}}/>
                                        </div>
                                        <input type="submit" id="cancelComment" value="Cancel" onClick={() => {setDescription(''); setCommenting(false)}} />
                                        <input type="submit" id="writeComment" value="Write Comment" onClick={addComment} />
                                    </form>
                                    :
                                <>
                                    {task.comments ? 
                                        task.comments.length === 0 ?  
                                            'No comments' 
                                            : 
                                            task.comments.map(comment =>
                                            {
                                                // console.log(comment)
                                                return <Comment key={comment.id} user={comment.user} comment={comment}/>
                                            })
                                        :
                                        'Loading comments'
                                    }
                                </>
                            }
                        </div>
                    </div>
                    :
                    <div>Loading task...</div>
                }
            </div>
        </div>
    )
}

export default TaskDetails;