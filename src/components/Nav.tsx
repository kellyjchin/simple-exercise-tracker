import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import hamburgerIcon from '../assets/hamburger.png'

function Nav() {
    const { session, signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    return (
        <>
            <nav className="desktop-nav d-none d-lg-flex">

                <ul className="nav-links d-flex">
                    { session ? <li>Welcome, {session.user.email}</li> : null }
                    <li><Link to="/">Home</Link></li>
                    { session ? <li><Link to="/dashboard">Dashboard</Link></li> : null }
                    { session ? 
                        <li><button onClick={() => signOut()}>Sign Out</button></li> 
                        : 
                        <li><Link to="/login">Login</Link></li> 
                    }
                </ul>
            </nav>

            <nav className="mobile-nav d-flex flex-column d-lg-none w-100 text-left navy text-white">
                <div className='user-and-control d-flex justify-content-between align-items-center py-2'>
                    { session ? <span className='p-2'>Welcome, {session.user.email}</span> : null }
                    <button onClick={() => setIsMobileMenuOpen(prev => !prev) } className='me-4 ms-auto hamburger-btn'>
                        <img src={hamburgerIcon} alt="Menu" width="24" height="24" className="hamburger-icon" />
                    </button>
                </div>

                <ul className={`nav-links p-0 flex-column ${isMobileMenuOpen ? 'd-flex' : 'd-none'}`}>

                    <li className='px-2 py-2'><Link onClick={() => setIsMobileMenuOpen(false)} className='text-white' to="/">Home</Link></li>
                    { session ? <li className='px-2 py-2'><Link onClick={() => setIsMobileMenuOpen(false)} className='text-white' to="/dashboard">Dashboard</Link></li> : null }
                    { session ? 
                        <li className='px-2 py-2'><button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className='text-white'>Sign Out</button></li> 
                        : 
                        <li className='px-2 py-2'><Link onClick={() => setIsMobileMenuOpen(false)} className='text-white' to="/login">Login</Link></li> 
                    }
                </ul>

            </nav>
        </>
    )
}

export default Nav