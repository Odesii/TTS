import { useQuery } from '@apollo/client';
import { GET_ITEMS } from '../../utils/queries';
import Auth from '../../utils/auth';
import './style.css';

function Shop() {
    const { loading, data } = useQuery(GET_ITEMS);
    const itemData = data?.stockShop || {};

    function handlePurchase(event) {
        event.preventDefault();
        console.log("buying");
        const { id } = event.target;
        console.log(id);
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
                    <section className="form-box">
                        {/* Call the form handler when the submit button is clicked */}
                        <div>
                            {itemData.map((item) => (
                                <div key={item._id} onSubmit={handlePurchase}>
                                    <p>Item Name: {item.name}</p>
                                    <img src={item.image} />
                                    <p>Effect: {item.effect}</p>
                                    <button id="submit">Purchase</button>
                                </div>
                            ))}
                        </div>
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
