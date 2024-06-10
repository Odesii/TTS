import ProfileMain from '../Profile/ProfileMain';
import Shop from '../Profile/Shop';
import ChangeEmail from '../Profile/ChangeEmail';
import ChangePassword from '../Profile/ChangePassword';
import DeleteAccount from '../Profile/DeleteAccount';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../utils/queries';

function Page({current}) {
    const { loading, data } = useQuery(GET_USER);
    const [userState, setUserState] = useState(data?.myProfile);

    useEffect(() => {
        const userData = data?.myProfile || {};
        setUserState(userData);
    }, [data])

    if (loading) {
        return <h2>LOADING...</h2>
    }

    // Return the element of the current page for rendering
    function render() {
        if (current.page === "Profile") {
            return <ProfileMain userState={userState} />;
        }
        else if (current.page === "Shop") {
            return <Shop setUserState={setUserState} />;
        }

        else if (current.page === "Email") {
            return <ChangeEmail />;
        }

        else if (current.page === "Password") {
            return <ChangePassword />;
        }

        else if (current.page === "Delete") {
            return <DeleteAccount />;
        }
    }

    return (
        <section className="content">
            {/* Render the current page */}
            {render()}
        </section>
    );
}

export default Page;
