// contexts
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { MessageContext } from '../contexts/MessageContext';
// misc
import axios from 'axios';
import env from 'react-dotenv';

const Login = () =>
{
    // contexts
    const { userState } = useContext(UserContext);
    const { displayMessage, clearMessage } = useContext(MessageContext);
    
    // states
    const [user, setUser] = userState;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // on component load
    useEffect(clearMessage, []);

    // functions
    const handleSubmit = (e) =>
    {
        e.preventDefault();
        axios.post(`${env.BACKEND_URL}/users/login`, {
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
            // check for unauthorized message - wrong login info
            if (error.message === 'Request failed with status code 401')
            {
                displayMessage(false, 'Email or password is incorrect.');
            }
        })
    }

    // on component load
    useEffect(clearMessage, []);

    return (
        <div className="loginPage">
            <div className="loginForm">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input id="email" type="text" value={email} placeholder="Email" onChange={(e) => {setEmail(e.target.value)}}/>
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input id="password" type="password" value={password} placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                    </div>
                    <input type="submit" value="Login" onClick={handleSubmit}/>
                </form>
            </div>
        </div>
    )
}

export default Login;