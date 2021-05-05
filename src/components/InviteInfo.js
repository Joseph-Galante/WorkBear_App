import { useState, useEffect, useContext } from 'react';
import { MessageContext } from '../contexts/MessageContext';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import env from 'react-dotenv';

const InviteInfo = () =>
{
    // contexts
    const {userState, verifyUser } = useContext(UserContext);
    const [user, setUser] = userState;
    const { displayMessage, clearMessage } = useContext(MessageContext);

    // states
    const [invites, setInvites] = useState([]);

    // on component load
    useEffect(clearMessage, []);

    // functions
    const getMyInvites = () =>
    {
        axios.get(`${env.BACKEND_URL}/users/invites`, { headers: { Authorization: user.id }}).then(res =>
        {
            console.log(res);
            setInvites(res.data.invites);
        })
    }
    useEffect(getMyInvites, []);

    const replyToInvite = (reply, inviteId) =>
    {
        axios.delete(`${env.BACKEND_URL}/users/invites/${inviteId}`, { headers: { Authorization: user.id}, data: { reply } }).then(res =>
        {
            // console.log(res);
            getMyInvites();
            displayMessage(reply === 'accept' ? true : false, reply == 'accept' ? 'Invite accepted.' : 'Invite declined.');
        }).catch(error => console.log(error.message));
    }

    return (
        <div className="profileDisplay">
            <div className="inviteInfo">
                <h1>Invites</h1>
                <span>------------------------------------------------------</span>
                {invites ? invites.length === 0 ? 'No invites' : 
                    invites.map(invite => { return (
                        <div className="invite">
                            {invite.message}
                            <div className="replyChoices">
                                <input type="button" id="replyAccept" value="Accept" onClick={() => {replyToInvite('accept', invite.id)}}/>
                                <input type="button" id="replyDecline" value="Decline" onClick={() => {replyToInvite('decline', invite.id)}}/>
                            </div>
                        </div>
                    )})
                    :
                    'Loading invites...'
                }
            </div>
        </div>
    )
}

export default InviteInfo;