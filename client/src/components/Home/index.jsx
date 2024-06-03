// import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../utils/queries';
import Auth from '../../utils/auth';
import './style.css'

function Home() {
    const { loading, data } = useQuery(GET_USER);
    const userData = data?.myProfile || {};

    if (loading) {
        return <h2>LOADING...</h2>
    }

    return (
        <section className="layout">
            {Auth.loggedIn() ? (
                <>
                    <h2>Welcome back, {userData.username}</h2>
                    <Link to='/'>
                        Play button goes here
                    </Link>
                    <Link onClick={Auth.logout}>Logout</Link>
                </>
            ) : (
                <>
                    <h2>Welcome to TTS ya noob, now go steal ya bozo</h2>
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
