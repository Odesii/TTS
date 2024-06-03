// import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import './style.css'

function Register() {
    // Track the state of each field's value
    const [formState, setFormState] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [createUser, { error }] = useMutation(CREATE_USER);

    // Track the state of the error and success messages
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState("");
    
    // Function to handle a submit event
    async function handleSubmit(event) {
        // Prevent the page from reloading
        event.preventDefault();

        // Check for form validation on submission
        if (validateForm()) {
            // Send a success message
            setSuccess("Successfully registered!");

            try {
                const { data } = await createUser({
                    variables: { ...formState },
                });
          
                Auth.login(data.createUser.token);
            } catch (e) {
                console.error(e);
            }

            // Reset the input boxes and reset each of the field values
            event.target.reset();
            setFormState({ username: "", email: "", password: "" });
        }
    }

    // Helper function that validates each field upon submission
    function validateForm() {
        // If there are still empty fields
        if (!formState.username || !formState.email || !formState.password) {
            setErrorMessage("All fields are required!");
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
        const { name, value } = event.target;
    
        setFormState({
          ...formState,
          [name]: value,
        });
    };

    return (
        <section className="layout">
            <h2>This is the register page</h2>
            <section className="form-box">
                {/* Call the form handler when the submit button is clicked */}
                <form onSubmit={handleSubmit}>
                    {/* Fields with handlers if the user has invalid input (or lack of) */}
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" onChange={handleChange} />

                    <label htmlFor="email">E-mail</label>
                    <input type="text" name="email" id="email" onChange={handleChange} />

                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" onChange={handleChange} />

                    {/* Different messages display based on the error/success messages
                        Empty space if either/neither exists to maintain a smooth display */}
                    {errorMessage && !success && <p id="error">{errorMessage}</p>}
                    {!errorMessage && !success && <p id="error">&nbsp;</p>}
                    {errorMessage && success && <p id="error">&nbsp;</p>}
                    {!errorMessage && success && <p id="error">{success}</p>}

                    <button id="submit">Submit</button>
                </form>

                {error && (
                    <div className="my-3 p-3 bg-danger text-white">
                        {error.message}
                    </div>
                )}
            </section>
            <Link to='/login'>
                Login instead?
            </Link>
            <Link to='/'>
                Go Home
            </Link>
        </section>
    )
}

export default Register;
