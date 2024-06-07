import { useQuery } from '@apollo/client';
import { GET_USER, GET_ITEMS } from '../../../utils/queries';
import './style.css';

function ProfileMain() {
    const { loading, data } = useQuery(GET_USER);
    const userData = data?.myProfile || {};

    if (loading) {
        return <h2>LOADING...</h2>
    }

    function test() {
        const items = getItems();
        for (let i = 0; i < items.length; i++) {
            let count = 0;

            for (let j = 0; j < userData.inventory.length; j++) {
                if (items[i]._id === userData.inventory[j]._id) {
                    count = count + 1;
                }
            }
            console.log(count);
        }
        // console.log(userData.inventory);
        // console.log(userData.healthPotions);
        // console.log(userData.get('attackPotions'));
        // console.log(userData.get('defensePotions'));
        // console.log(userData);
    }

    function getItems() {
        const { loading, data } = useQuery(GET_ITEMS);
        const itemData = data?.stockShop || {};
        return itemData;
    }

    return (
        <>
            <h2>Welcome to your profile, {userData.username}</h2>
            <h3>Shrooms: <span className="shrooms"></span> </h3>
            {test()}
        </>
    )
}

export default ProfileMain;
