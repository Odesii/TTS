import ProfileMain from '../Profile/ProfileMain';
import Shop from '../Shop';
import ChangeEmail from '../Profile/ChangeEmail';
import ChangePassword from '../Profile/ChangePassword';
import DeleteAccount from '../Profile/DeleteAccount';

function Page({current}) {
    // Return the element of the current page for rendering
    function render() {
        if (current.page === "Profile") {
            return <ProfileMain />;
        }
        else if (current.page === "Shop") {
            return <Shop />;
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
