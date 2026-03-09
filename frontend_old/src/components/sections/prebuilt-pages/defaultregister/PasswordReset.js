import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useLocation, Redirect } from "react-router-dom"
import { postApi } from '../../../../api/api'
import { toastsuccess } from '../../../utils/notifications'

const Content = () => {
    const [validated, setValidated] = useState(false);
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const [success, setSucces] = useState(false)
    const [errors, setErrors] = useState(false)
    
    const [state, setState] = useState({
        "token": "",
        "password": "",
        "password2": ""
    })

    const samePassowrd = () => {
        if (state.password2 === state.password) {
            return true
        }
        return false
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (samePassowrd() === true) {
            setValidated(true);
            if (form.checkValidity() === false) {
                event.stopPropagation();
            } else {
                postApi(() => {
                    setSucces(true);
                    toastsuccess("Well Done! :  Password changed, Login with your new password.")
                }, "", "/api/password_reset/confirm/", state, errors_list => { setErrors(errors_list) })
            }
        } else {
            setErrors({
                ...errors,
                password2: ["Passwords didn't match"]
            })
        }
    };

    useEffect(() => {
        const tkn = params.get("token")
        setState(preveState => ({ ...preveState, token: tkn }))
    }, [])

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'password':
                setState({
                    ...state,
                    password: event.target.value
                })
                break;

            case 'password2':
                setState({
                    ...state,
                    password2: event.target.value
                })
                break;
        }
    }
    return (
        <div className="ms-content-wrapper ms-auth">
            {success ?
                <Redirect replace to="/login" />
                : <div className="ms-auth-container">
                    <div className="ms-auth-col">
                        <div className="ms-auth-bg" />
                    </div>
                    <div className="ms-auth-col">
                        <div className="ms-auth-form">
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <h1>Reset Password</h1>
                                <p>Please enter your new password to continue</p>
                                <Form.Row>
                                    <Form.Group controlId="validationCustom04">
                                        <Form.Label>Password</Form.Label>
                                        {errors.password && errors.password.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                        <InputGroup>
                                            <Form.Control
                                                name='password'
                                                onChange={handleChange}
                                                required
                                                type="password"
                                                placeholder="Password"
                                            />
                                            <Form.Control.Feedback type="invalid"> Please provide a password.</Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="validationCustom04">
                                        <Form.Label>Repeat Password</Form.Label>
                                        {errors.password2 && errors.password2.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                        <InputGroup>
                                            <Form.Control
                                                name='password2'
                                                autoComplete="off"
                                                onChange={handleChange}
                                                required
                                                type="password"
                                                placeholder="Password"
                                            />
                                            <Form.Control.Feedback type="invalid"> Repeat the password</Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                </Form.Row>
                                <Button type="submit" className="mt-4 d-block w-100">Reset Password</Button>
                                <p className="mb-0 mt-3 text-center"><Link className="btn-link" to="/login">Login</Link> </p>
                            </Form>
                        </div>
                    </div>
                </div>}

        </div>
    );
}

export default Content;