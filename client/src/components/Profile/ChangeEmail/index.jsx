import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CHANGE_EMAIL } from '../../../utils/mutations';
import Auth from '../../../utils/auth';
import './style.css'

function ChangeEmail() {
    // Track the state of each field's value
    const [formState, setFormState] = useState({
        email: "",
    });
    const [changeEmail] = useMutation(CHANGE_EMAIL);

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
            setSuccess("Email successfully updated!");

            try {
                console.log("before await");
                const { data } = await changeEmail({
                    variables: { ...formState },
                });
                console.log("after await");
                console.log(data);
                console.log(formState);
          
                // if (!data.ok) {
                //     throw new Error('something went wrong!');
                // }
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
        if (!formState.email) {
            setErrorMessage("Please enter an email!");
            return false;
        }

        // If the email is invalid
        else if (!validate(formState.email)) {
            setErrorMessage("Please enter a valid email!");
            return false;
        }

        // Otherwise, the submission seems good to go
        else {
            setErrorMessage(null);
            return true;
        }
    }

    // Validate the email using a regex and convert the email to lowercase to test
    function validate(email) {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email.toLowerCase());
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

                    <label htmlFor="email">New E-mail</label>
                    <input type="text" name="email" id="email" onChange={handleChange} />

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

export default ChangeEmail;
