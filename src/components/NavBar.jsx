import { Link, useLocation } from "react-router-dom";
import '../css/NavBar.css'

function NavBar(){
    const location = useLocation()

    return (
        <nav className='navbar'>
            <div className='navbar-brand'>
                <Link to='/'>
                    <span className='brand-icon'>🌊</span>
                    <span className='brand-text'>
                        Movie Surfer
                        <span className='brand-by'>by Asad</span>
                    </span>
                </Link>
            </div>
            <div className='navbar-links'>
                <Link to='/' className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    Home
                </Link>
                <Link to='/favorites' className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}>
                    Favorites
                </Link>
            </div>
        </nav>
    )
}

export default NavBar