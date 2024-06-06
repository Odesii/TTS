import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ITEMS } from '../../utils/queries';
import Auth from '../../utils/auth';
import './style.css';

function Shop() {
    const { loading, data } = useQuery(GET_ITEMS);
    const itemData = data?.stockShop || {};

    const [success, setSuccess] = useState("");
    const [potionBought, setPotionBought] = useState("");

    function handleEvent(event) {
        event.preventDefault();
        setSuccess(`${potionBought} purchased!`);
    }
    
    async function handlePurchase(itemId, itemName) {
        console.log(itemId);
        setPotionBought(itemName);
        setSuccess(null);
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
                                    <button id="submit" onClick={() => handlePurchase(item._id, item.name)}>Purchase</button>
                                </div>
                            ))}

                            {!success && <p id="error">&nbsp;</p>}
                            {success && <p id="error">{success}</p>}

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
