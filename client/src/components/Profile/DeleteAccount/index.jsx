import Auth from '../../../utils/auth';

import { useMutation } from '@apollo/client';
import { DELETE_ACCOUNT } from '../../../utils/mutations';

function DeleteAccount() {
    const [deleteAccount] = useMutation(DELETE_ACCOUNT);

    async function handleDelete(event) {
        event.preventDefault();

        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            const { data } = await deleteAccount({
                variables: { _id: '' }
            })

            if (!data.ok) {
                throw new Error('something went wrong!');
            }
        } catch (err) {
            console.error(err);
        }

        Auth.logout();
    }

    return (
        <>
            <section className="form-box">
                {/* Call the form handler when the submit button is clicked */}
                <form onSubmit={handleDelete}>
                    {/* Fields with handlers if the user has invalid input (or lack of) */}

                    <h2>Delete Your Account?</h2>

                    {/* Different messages display based on the error/success messages
                        Empty space if either/neither exists to maintain a smooth display */}

                    <button id="submit">Delete</button>
                </form>
            </section>
        </>
    )
}

export default DeleteAccount;
