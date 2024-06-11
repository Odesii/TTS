import { Link } from 'react-router-dom';
import './style.css';

function ProfileMain(props) {
    return (
        <>  
            <h2 className='greet'>Been Collecting Shrooms?, {props.userState.username}</h2>
            <h3 className='count'>Shrooms: <span className='bounce'>{props.userState.shrooms}</span> </h3>
            <Link to='/play'>
                <img className='play' src="assets/icons/play.png" alt="Play" />
            </Link>
        </>
    )
}

export default ProfileMain;
