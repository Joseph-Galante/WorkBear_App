import { useState, createContext } from 'react';
import env from 'react-dotenv';
import axios from 'axios';

const MessageContext = createContext();

const MessageProvider = ({children}) =>
{
    const [message, setMessage] = useState({ content: '', success: ''});

    const displayMessage = (success, message) =>
    {
        // display in green or red font
        success ? setMessage({ content: message, success: 'success' }) : setMessage({ content: message, success: 'failure' });
    }

    const clearMessage = () =>
    {
        setMessage('');
    }

    const state = {
        messageState: [message, setMessage],
        displayMessage,
        clearMessage
    };

    return (
        <MessageContext.Provider value={state}>
            {children}
        </MessageContext.Provider>
    )
}

export {MessageContext, MessageProvider}