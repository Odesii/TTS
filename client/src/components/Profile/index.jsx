import { useQuery } from '@apollo/client';
import { GET_USER } from '../../utils/queries';
import Auth from '../../utils/auth';
import './style.css';

function Profile() {
    const { loading, data } = useQuery(GET_USER);
    const userData = data?.myProfile || {};

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
                    <h2>Welcome to your profile, {userData.username}</h2>
                    <h3>Shrooms: <span className='shrooms'></span> </h3>
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
