import { useState, useContext } from 'react';
import { MessageContext } from '../contexts/MessageContext';

const Messages = () =>
{
    // contexts
    const { messageState } = useContext(MessageContext);
    const [ message, setMessage ] = messageState;

    return (
        <div className={message.success}>
            {message.content === '' ?
                null
                :
                message.content
            }
        </div> 
    )
}

export default Messages;