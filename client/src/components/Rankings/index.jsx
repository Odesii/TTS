import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_PLAYERS } from '../../utils/queries';
import Auth from '../../utils/auth';
import './style.css';

function Rankings() {
    const id = Auth.getProfile().data._id;

    const { loading, data } = useQuery(GET_ALL_PLAYERS);
    const users = data?.getAllPlayers || {};
    let rank = 1;
    let myRank = 1;

    function redirect() {
        window.location.replace('/login');
    }

    if (loading) {
        return <h2>LOADING...</h2>
    }

    function loadRank() {
        for (let i = 0; i < users.length; i++) {
            if (users[i]._id === id) {
                break;
            }
            myRank = myRank + 1;
        }

        return (
            <h2 className="count spacing">
                My Rank: <span className='bounce'>{myRank}</span>
                &nbsp;&nbsp;
                Shrooms: <span className='bounce'>{users[myRank - 1].shrooms}</span>
            </h2>
        )
    }

    return (
        <section className="layout">
            {Auth.loggedIn() ? (
                <>
                    <Link to='/'>
                        Go home
                    </Link>
                    <section className="form-box scrollable-content">
                        {/* Call the form handler when the submit button is clicked */}
                        <form>
                            <h2>SHROOM ADDICTS</h2>
                            <section className="rank-labels">
                                <p>Rank</p>
                                <p>Username</p>
                                <p>Shrooms</p>
                            </section>
                            {users.filter((user, i) => i < 10).map((user, i) => (
                                <div key={user._id} className="rankers">
                                    <p>{rank + i}</p>
                                    <p>{user.username}</p>
                                    <p>{user.totalShrooms}</p>
                                </div>
                            ))}
                        </form>
                        <img src='assets/textures/bubbles.png' alt='bubble' className='bubble' />
                    </section>
                    {loadRank()}
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

export default Rankings;
