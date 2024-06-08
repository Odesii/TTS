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
            <h1>Take Their Shrooms</h1>
            {Auth.loggedIn() ? (
                <>
                    <h2>Welcome {userData.username}</h2>
                    <Link to='/play'>
                        <img className='play' src="assets/icons/play.png" alt="Play" />
                    </Link>
                    <Link to='/profile'>
                        Profile
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
                </>
            )}
        </section>
    )
}

export default Home;
