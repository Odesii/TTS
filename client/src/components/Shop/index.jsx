import Auth from '../../utils/auth';
import './style.css';

function Shop() {
    function redirect() {
        window.location.replace('/login');
    }

    return (
        <section className="layout">
            {Auth.loggedIn() ? (
                <>
                    <h2>POTION SHOP</h2>
                    <section className="form-box">
                        {/* Call the form handler when the submit button is clicked */}
                        <div>
                            <p>Item goes here</p>
                            <button id="submit">Purchase</button>
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
