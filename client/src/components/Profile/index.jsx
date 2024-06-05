import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../utils/queries';
import Auth from '../../utils/auth';
import Nav from '../Nav';
import Page from '../Page';
import './style.css';

function Profile() {
    const { loading, data } = useQuery(GET_USER);
    const userData = data?.myProfile || {};

    const [pages] = useState([
        { page: "Profile" },
        { page: "Email" },
        { page: "Password" },
        { page: "Delete" }
    ]);
    
    // Use this to change the state of the pages
    const [current, setCurrent] = useState(pages[0]);

    if (loading) {
        return <h2>LOADING...</h2>
    }

    function redirect() {
        window.location.replace('/login');
    }

    return (
        <section className="layout">
            {Auth.loggedIn() ? (
                <>
                    <Link to='/'>
                        Go home
                    </Link>
                    <Nav pages={pages} current={current} setCurrent={setCurrent} />
                    <h2>Welcome to your profile, {userData.username}</h2>
                    <h3>Shrooms: <span className="shrooms"></span> </h3>
                    
                    <Page current={current} />
                </>
            ) : (
                <>
                    <h2>You must be logged in to view this page.</h2>
                    {redirect()}
                </>
            )}
        </section>
    )
}

export default Profile;
