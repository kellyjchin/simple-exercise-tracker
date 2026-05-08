import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
    const { session } = useAuth();

    return (
        <>
            <h1>Simple Exercise Tracker (SET) 1.0</h1>
            <p>Welcome! Here you can... track your exercises lol.</p>
            {session ? <Link to="/dashboard">Go to Dashboard</Link> : <Link to="/login">Login</Link>}
        </>
    )
}

export default Home