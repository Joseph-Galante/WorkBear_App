// link
import { Link } from 'react-router-dom'
// contexts
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const NavBar = () =>
{
    // states
    const { userState } = useContext(UserContext);
    const [user, setUser] = userState;

    // functions
    const logoutUser = () =>
    {
        localStorage.removeItem('userId');
        setUser({});
    }

    return (
        <nav>
            {user.id ?
                <span>
                    <span className="navLeft">
                        <Link className="navLink" to="/">Home</Link>{' | '}
                        <Link className="navLink" to="/projects">Projects</Link>
                    </span>
                    <span className="navRight">
                        <Link className="navLink" to="/profile">Profile</Link>{' | '}
                        <Link className="navLink" to="/" onClick={logoutUser}>Logout</Link>
                    </span>
                </span>
                :
                <span>
                    <span className="navLeft">
                        <Link className="navLink" to="/">Home</Link>
                    </span>
                    <span className="navRight">
                        <Link className="navLink" to="/signup">Signup</Link>{' | '}
                        <Link className="navLink" to="/login">Login</Link>
                    </span>
                </span>
            }
        </nav>
    )
}

export default NavBar;