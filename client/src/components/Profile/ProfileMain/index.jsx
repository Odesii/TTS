import { useQuery } from '@apollo/client';
import { GET_USER } from '../../../utils/queries';
import './style.css';

function ProfileMain() {
    const { loading, data } = useQuery(GET_USER);
    const userData = data?.myProfile || {};

    if (loading) {
        return <h2>LOADING...</h2>
    }

    return (
        <>
            <h2>Welcome to your profile, {userData.username}</h2>
            <h3>Shrooms: <span className="shrooms"></span> </h3>
        </>
    )
}

export default ProfileMain;
