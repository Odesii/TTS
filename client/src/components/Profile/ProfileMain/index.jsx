import { useQuery } from '@apollo/client';
import { GET_USER } from '../../../utils/queries';
import { Link } from 'react-router-dom';
import './style.css';

function ProfileMain() {
    const { loading, data } = useQuery(GET_USER);
    const userData = data?.myProfile || {};

    if (loading) {
        return <h2>LOADING...</h2>
    }

    return (
        <>
            <h2 className='greet'>Been Collecting Shrooms?, {userData.username}</h2>
            <h3 className='count'>Shrooms: <span className='bounce'>{userData.shrooms}</span> </h3>
            <Link to='/play'>
                <img className='play' src="assets/icons/play.png" alt="Play" />
            </Link>
        </>
    )
}

export default ProfileMain;
