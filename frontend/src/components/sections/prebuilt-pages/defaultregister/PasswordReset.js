import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { postApi } from '../../../../api/api'
import { toastsuccess } from '../../../utils/notifications'

const Content = () => {
    const [validated, setValidated] = useState(false);
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const [success, setSucces] = useState(false)
    const [errors, setErrors] = useState(false)

    const [state, setState] = useState({
        token: "",
        password: "",
        password2: ""
    })

    const samePassowrd = () => state.password === state.password2

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (!samePassowrd()) {
            setErrors({ password2: ["Passwords didn't match"] })
            return;
        }

        setValidated(true);

        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        postApi(() => {
            setSucces(true);
            toastsuccess("Well Done! :  Password changed, Login with your new password.")
        }, "", "/api/password_reset/confirm/", state, errors_list => {
            setErrors(errors_list)
        })
    };

    useEffect(() => {
        const tkn = params.get("token")
        setState(prev => ({ ...prev, token: tkn }))
    }, [])

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value })
    }

    return (
        <div className="ms-content-wrapper ms-auth">
            {!success && (
                <div className="ms-auth-container">
                    <div className="ms-auth-col">
                        <div className="ms-auth-bg" />
                    </div>
                    <div className="ms-auth-col">
                        <div className="ms-auth-form">
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <h1>Reset Password</h1>
                                <p>Please enter your new password to continue</p>

                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    {errors.password && errors.password.map(err =>
                                        <p key={err} className="ms-text-danger">{err}</p>
                                    )}
                                    <InputGroup>
                                        <Form.Control
                                            name="password"
                                            onChange={handleChange}
                                            required
                                            type="password"
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Repeat Password</Form.Label>
                                    {errors.password2 && errors.password2.map(err =>
                                        <p key={err} className="ms-text-danger">{err}</p>
                                    )}
                                    <InputGroup>
                                        <Form.Control
                                            name="password2"
                                            onChange={handleChange}
                                            required
                                            type="password"
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Button type="submit" className="mt-4 w-100">
                                    Reset Password
                                </Button>

                                <p className="mt-3 text-center">
                                    <Link to="/login">Login</Link>
                                </p>
                            </Form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Content;
