import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ITEMS } from '../../utils/queries';
import Auth from '../../utils/auth';
import './style.css';

function Shop() {
    const { loading, data } = useQuery(GET_ITEMS);
    const itemData = data?.stockShop || {};

    function handleEvent(event) {
        event.preventDefault();
    }
    
    async function handlePurchase(itemId) {
        console.log(itemId);
    }

    function redirect() {
        window.location.replace('/login');
    }

    if (loading) {
        return <h2>LOADING...</h2>
    }

    return (
        <section className="layout">
            {Auth.loggedIn() ? (
                <>
                    <h2>POTION SHOP</h2>
                    <Link to='/'>
                        Go home
                    </Link>
                    <section className="form-box">
                        {/* Call the form handler when the submit button is clicked */}
                        <form onSubmit={handleEvent}>
                            {itemData.map((item) => (
                                <div key={item._id}>
                                    <p>Item Name: {item.name}</p>
                                    <img src={item.image} />
                                    <p>Effect: {item.effect}</p>
                                    <button id="submit" onClick={() => handlePurchase(item._id)}>Purchase</button>
                                </div>
                            ))}
                        </form>
                    </section>
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

export default Shop;
