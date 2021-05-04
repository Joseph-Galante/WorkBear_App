import { useState, useEffect, useContext } from 'react';
import { MessageContext } from '../contexts/MessageContext';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import env from 'react-dotenv';

const AccountInfo = () =>
{
    // contexts
    const {userState, verifyUser } = useContext(UserContext);
    const [user, setUser] = userState;
    const { displayMessage, clearMessage } = useContext(MessageContext);

    // states
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // on component load
    useEffect(clearMessage, []);

    // functions
    const saveChanges = () =>
    {
        axios.put(`${env.BACKEND_URL}/users/profile`, { name, email }, { headers: { Authorization: user.id }}).then((res) =>
        {
            // console.log(res);
            setUser({ id: res.data.user.id, name: res.data.user.name, email: res.data.user.email });
            localStorage.setItem('userId', res.data.user.id);
        }).catch((error) => console.log(error.message));
        setEditing(false);
        displayMessage(true, 'Profile updated successfully.');
    }
    const cancelChanges = () =>
    {
        setEditing(false);
    }

    return (
        <div key="profileDisplay" className="profileDisplay">
            <h1 className="profileHeader">Account Info</h1>
            <span>------------------------------------------------------</span>
            <div className="profileInfo">
                <div key="labels" className="labels">
                    <div key="nameLabel" className="label">Name:</div>
                    <br></br>
                    <div key="emailLabel" className="label">Email:</div>
                </div>
                {editing ?    
                    <div key="info-inputs" className="info-inputs">
                        <input key="name-input" className="info-input" value={name} onChange={(e) => {setName(e.target.value)}}/>
                        <br></br>
                        <input key="email-input" className="info-input" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                        <div className="change-buttons">
                            <input key="cancel-changes" type="button" id="cancel-changes" value="Cancel Changes" onClick={() => cancelChanges()}/>
                            <input key="save-changes" type="button" id="save-changes" value="Save Changes" onClick={() => saveChanges()}/>
                        </div>
                    </div>
                    :
                    <div key="infos" className="infos">
                        <div key="name" className="info">{user.name}</div>
                        <br></br>
                        <div key="email" className="info">{user.email}</div>
                        <input id="editInfo" type="button" value="Edit" onClick={() => { setName(user.name); setEmail(user.email); setEditing(true) }}/>
                    </div>
                }
            </div>
        </div>
    )
}

export default AccountInfo;