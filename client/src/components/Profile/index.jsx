import { useState } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';
import Nav from '../Nav';
import Page from '../Page';

function Profile() {
    const [pages] = useState([
        { page: "Profile" },
        { page: "Email" },
        { page: "Password" },
        { page: "Delete" }
    ]);
    
    // Use this to change the state of the pages
    const [current, setCurrent] = useState(pages[0]);

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
