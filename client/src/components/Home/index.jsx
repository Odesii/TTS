// import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../utils/queries';
import Auth from '../../utils/auth';
import './style.css';

function Home() {
    const { loading, data } = useQuery(GET_USER);
    const userData = data?.myProfile || {};

    if (loading) {
        return <h2>LOADING...</h2>
    }

    return (
        <section className="layout">
            <img className="logo" src='assets/icons/TTS.png' alt='logo' />
            {Auth.loggedIn() ? (
                <>
                    <h2>Welcome {userData.username}</h2>
                    <Link to='/play'>
                        <img className='play' src="assets/icons/play.png" alt="Play" />
                    </Link>
                    <Link to='/profile'>
                        Profile
                    </Link>
                    <Link to='/rankings'>
                        Rankings
                    </Link>
                    <Link onClick={Auth.logout}>Logout</Link>
                </>
            ) : (
                <>
                    <Link to='/login'>
                        Login
                    </Link>
                    <Link to='/register'>
                        Register
                    </Link>
                    <img src='assets/textures/bubbles.png' alt='bubble' className='bubble' />
                </>
            )}
        </section>
    )
}

export default Home;
