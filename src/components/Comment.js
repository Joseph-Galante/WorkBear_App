import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { MessageContext } from '../contexts/MessageContext';
import { UserContext } from '../contexts/UserContext';
import env from 'react-dotenv';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const Comment = (props) =>
{
    // contexts
    const {userState, verifyUser } = useContext(UserContext);
    const [user, setUser] = userState;
    const { displayMessage, clearMessage } = useContext(MessageContext);

    return (
        <div className="comment">
            <span>
                { props.comment ?
                <>
                    <span>
                        <span className="commentStamp">
                            <span className="commentStampName">{props.comment.user.name}</span>
                            <span className="commentStampTime">{`${props.comment.createdAt.slice(5, 7)}-${props.comment.createdAt.slice(8, 10)}-${props.comment.createdAt.slice(2, 4)}`}</span>
                        </span>
                        {props.comment.description ? props.comment.description : 'Task Comment'}
                    </span>
                </>
                :
                'Loading comment...'
                }
            </span>
        </div>
    )
}

export default Comment;