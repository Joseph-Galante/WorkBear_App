// contexts
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { MessageContext } from '../contexts/MessageContext';
// misc
import axios from 'axios';
import env from 'react-dotenv';

const Signup = () =>
{
    // contexts
    const { userState } = useContext(UserContext);
    const [user, setUser] = userState;
    const { displayMessage, clearMessage } = useContext(MessageContext);

    // states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    // on component load
    useEffect(clearMessage, []);

    // functions
    const handleSubmit = (e) =>
    {
        e.preventDefault();
        // check for mismatched passwords
        if (password !== passwordConfirm)
        {
            // console.log('passwords do not match');
            displayMessage(false, 'Passwords must match to be able to sign up.');
            return;
        }
        axios.post(`${env.BACKEND_URL}/users`, {
            name: name,
            email: email,
            password: password
        }).then((res) =>
        {
            // console.log(res);
            setUser({ id: res.data.user.id, name: res.data.user.name, email: res.data.user.email });
            localStorage.setItem('userId', res.data.user.id);
        }).catch((error) =>
        {
            console.log(error.message);
            if (error.message === 'Request failed with status code 409')
            {
                displayMessage(false, 'Email already taken. Enter a different one or login with your password.')
            }
        })
    }

    // on component load
    useEffect(clearMessage, []);

    return (
        <div className="signupPage">
            <div className="signupForm">
                <h1>Create an Account</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <div></div>
                        <input id="name" type="text" value={name} placeholder="Name" onChange={(e) => {setName(e.target.value)}}/>
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <div></div>
                        <input id="email" type="text" value={email} placeholder="Email" onChange={(e) => {setEmail(e.target.value)}}/>
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <div></div>
                        <input id="password" type="password" value={password} placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                    </div>
                    <div>
                        <label htmlFor="passwordConfirm">Confirm Password:</label>
                        <div></div>
                        <input id="passwordConfirm" type="password" value={passwordConfirm} placeholder="Confirm Password" onChange={(e) => {setPasswordConfirm(e.target.value)}}/>
                    </div>
                    <input type="submit" value="Signup" onClick={handleSubmit}/>
                </form>
            </div>
        </div>
    )
}

export default Signup;