import { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, useQuery, useMutation } from '@apollo/client';
import { GET_ITEMS, GET_PLAYER } from '../../../utils/queries';
import { ADD_TO_INVENTORY, UPDATE_SHROOMS } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import './style.css';

function Shop(props) {
    const client = new ApolloClient({
        link: new HttpLink({ uri: import.meta.env.VITE_DEPLOYED_GQL}), // Your GraphQL endpoint
        cache: new InMemoryCache(),
    });

    const id = Auth.getProfile().data._id;

    const { loading, data } = useQuery(GET_ITEMS);
    const itemData = data?.stockShop || {};

    const [addToInventory] = useMutation(ADD_TO_INVENTORY);

    const [message, setMessage] = useState("");
    const [updatedMessage, setUpdatedMessage] = useState(false);

    useEffect(() => {
        if (message && !updatedMessage) {
            const messageTimer = setTimeout(() => {
                setMessage(null);
                setUpdatedMessage(false);
            }, 3000);

            return () => clearTimeout(messageTimer);
        }
    }, [message, updatedMessage])

    function handleEvent(event) {
        event.preventDefault();
    }
    
    async function handlePurchase(itemId, itemName, itemCost) {
        try {
            if (await handleUpdateShrooms(itemId, itemCost)) {
                const { data } = await addToInventory({
                    variables: { itemId: itemId }
                });

                if (!data) {
                    throw new Error('something went wrong!');
                }

                setMessage(`${itemName} purchased!`);
                setUpdatedMessage(true);

                setTimeout(() => {
                    setUpdatedMessage(false);
                }, 100);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function handleUpdateShrooms(itemId, itemCost) {
        try {
            const user = await client.query({
                query: GET_PLAYER,
                variables: { playerId: id }
            });

            if (user.data.getPlayer.shrooms >= itemCost) {
                let count = 0;

                for (let i = 0; i < user.data.getPlayer.inventory.length; i++) {
                    if (user.data.getPlayer.inventory[i]._id.toString() === itemId) {
                        count = count + 1;
                    }
                }

                if (count >= 99) {
                    setMessage("You can't hold any more of those potions!");
                    setUpdatedMessage(true);

                    setTimeout(() => {
                        setUpdatedMessage(false);
                    }, 100);
                    return false;
                }

                else {
                    await client.mutate({
                        mutation: UPDATE_SHROOMS,
                        variables: { shrooms: -itemCost, playerId: id }
                    });

                    const data = await client.query({
                        query: GET_PLAYER,
                        variables: { playerId: id }
                    });

                    const result = data?.data.getPlayer || {};
                    props.setUserState(result)
                    return true;
                }
            }

            else {
                setMessage("You don't have enough shrooms!");
                setUpdatedMessage(true);

                setTimeout(() => {
                    setUpdatedMessage(false);
                }, 100);
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
                    <section className="form-box scrollable-content">
                        {/* Call the form handler when the submit button is clicked */}
                        <form onSubmit={handleEvent}>
                            <h2>Potion Shop</h2>
                            {itemData.map((item) => (
                                <div key={item._id}>
                                    <p>{item.name}</p>
                                    <img src={item.image} />
                                    <p>Shrooms: {item.cost}</p>
                                    <p>Effect: {item.effect}</p>
                                    <button id="submit" onClick={() => handlePurchase(item._id, item.name, item.cost)}>Purchase</button>
                                </div>
                            ))}

                            {!message && <p id="error">&nbsp;</p>}
                            {message && <p id="error">{message}</p>}

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
