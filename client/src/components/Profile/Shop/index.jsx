import { useState } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, useQuery, useMutation } from '@apollo/client';
import { GET_ITEMS, GET_PLAYER } from '../../../utils/queries';
import { ADD_TO_INVENTORY, UPDATE_SHROOMS } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import './style.css';

function Shop() {
    const client = new ApolloClient({
        link: new HttpLink({ uri: import.meta.env.VITE_DEPLOYED_GQL}), // Your GraphQL endpoint
        cache: new InMemoryCache(),
    });

    const id = Auth.getProfile().data._id;

    const { loading, data } = useQuery(GET_ITEMS);
    const itemData = data?.stockShop || {};

    const [addToInventory] = useMutation(ADD_TO_INVENTORY);

    const [success, setSuccess] = useState("");

    function handleEvent(event) {
        event.preventDefault();
        setSuccess(null);
    }
    
    async function handlePurchase(itemId, itemName, itemCost) {
        try {
            if (await handleUpdateShrooms(itemCost)) {
                const { data } = await addToInventory({
                    variables: { itemId: itemId }
                });

                if (!data) {
                    throw new Error('something went wrong!');
                }

                setSuccess(`${itemName} purchased!`);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function handleUpdateShrooms(itemCost) {
        try {
            const user = await client.query({
                query: GET_PLAYER,
                variables: { playerId: id }
            });

            if (user.data.getPlayer.shrooms >= itemCost) {
                await client.mutate({
                    mutation: UPDATE_SHROOMS,
                    variables: { shrooms: -itemCost, playerId: id }
                });

                return true;
            }

            else {
                setSuccess("You don't have enough shrooms!");
                return false;
            }
            
        } catch (e) {
            console.error(e);
        } 
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
                    <section className="form-box scrollable-content">
                        {/* Call the form handler when the submit button is clicked */}
                        <form onSubmit={handleEvent}>
                            {itemData.map((item) => (
                                <div key={item._id}>
                                    <p>{item.name}</p>
                                    <img src={item.image} />
                                    <p>Shrooms: {item.cost}</p>
                                    <p>Effect: {item.effect}</p>
                                    <button id="submit" onClick={() => handlePurchase(item._id, item.name, item.cost)}>Purchase</button>
                                </div>
                            ))}

                            {!success && <p id="error">&nbsp;</p>}
                            {success && <p id="error">{success}</p>}

                        </form>
                        <img src='assets/textures/bubbles.png' alt='bubble' className='bubble' />
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
