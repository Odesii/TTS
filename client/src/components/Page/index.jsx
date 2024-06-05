import ProfileMain from '../Profile/ProfileMain';

function Page({current}) {
    // Return the element of the current page for rendering
    function render() {
        if (current.page === "Profile") {
            return <ProfileMain />;
        }

        else if (current.page === "Email") {
            return <div>email</div>;
        }

        else if (current.page === "Password") {
            return <div>password</div>;
        }

        else if (current.page === "Delete") {
            return <div>delete</div>;
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
