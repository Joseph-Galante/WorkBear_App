import { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router';
import { MessageContext } from '../contexts/MessageContext';

const Home = () =>
{
    // contexts
    const { displayMessage, clearMessage } = useContext(MessageContext);

    // states
    const [shouldRedirect, setShouldRedirect] = useState('');

    // on component load
    useEffect(clearMessage, []);

    return (
        <div className="homePage">
            {shouldRedirect !== '' ? <Redirect to={shouldRedirect}/> : null}
            <div className="welcomeSign">
                <h1 style={{ fontSize: "48px", fontWeight: "bolder" }}>Welcome to WorkBear</h1>
                <h3 className="about">WorkBear is a project management app made to help streamline projects of any size by providing a system to track project members and their tasks. You are required to create an account before starting any projects. Signup now to get your projects streamlined in no time!</h3>
                <img id="homeTrail" src="https://i.imgur.com/xOxDuMw.png"/>
                <input type="submit" value="Get Started!" onClick={() => {setShouldRedirect('/signup')}} />
            </div>
        </div>
    )
}

export default Home;