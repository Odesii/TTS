import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CHANGE_PASSWORD } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import './style.css'

function ChangePassword() {
    // Track the state of each field's value
    const [formState, setFormState] = useState({
        password: "",
    });
    const [changePassword] = useMutation(CHANGE_PASSWORD);

    // Track the state of the error and success messages
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState("");
    
    // Function to handle a submit event
    async function handleSubmit(event) {
        // Prevent the page from reloading
        event.preventDefault();

        // Check for form validation on submission
        if (validateForm()) {
            const token = Auth.loggedIn() ? Auth.getToken() : null;

            if (!token) {
                return false;
            }

            // Send a success message
            setSuccess("Password successfully updated!");

            try {
                const { data } = await changePassword({
                    variables: { ...formState },
                });
          
                if (!data) {
                    throw new Error('something went wrong!');
                }
            } catch (e) {
                console.error(e);
            }

            // Reset the input boxes and reset each of the field values
            event.target.reset();
            setFormState({ email: ""});
        }
    }

    // Helper function that validates each field upon submission
    function validateForm() {
        // If there are still empty fields
        if (!formState.password) {
            setErrorMessage("Please enter a password!");
            return false;
        }

        // Otherwise, the submission seems good to go
        else {
            setErrorMessage(null);
            return true;
        }
    }

    const handleChange = (event) => {
        setSuccess(null);
        const { name, value } = event.target;
    
        setFormState({
          ...formState,
          [name]: value,
        });
    };

    return (
        <>
            <section className="form-box">
                {/* Call the form handler when the submit button is clicked */}
                <form onSubmit={handleSubmit}>
                    {/* Fields with handlers if the user has invalid input (or lack of) */}

                    <label htmlFor="password">New Password</label>
                    <input type="password" name="password" id="password" onChange={handleChange} />

                    {/* Different messages display based on the error/success messages
                        Empty space if either/neither exists to maintain a smooth display */}
                    {errorMessage && !success && <p id="error">{errorMessage}</p>}
                    {!errorMessage && !success && <p id="error">&nbsp;</p>}
                    {errorMessage && success && <p id="error">&nbsp;</p>}
                    {!errorMessage && success && <p id="error">{success}</p>}

                    <button id="submit">Submit</button>
                </form>
            </section>
        </>
    )
}

export default ChangePassword;
