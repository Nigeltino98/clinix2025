import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { postApi } from '../../../../api/api'
import { toastsuccess } from '../../../utils/notifications'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';


const Content = () => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const [success, setSucces] = useState(false)
    const [state, setState] = useState({
        "email": "",
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            Swal.fire({
                title: 'Reset Warning',
                text: `Are you sure you to reset Password ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, reset!'
            }).then(function (result) {
                if (result.value) {
                    postApi(() => {
                        setSucces(true);
                        toastsuccess("Well Done! :  Check your email for the reset link.")
                    }, "", "/api/password_reset/", state, errors_list => { setErrors(errors_list) })
                }
            });


        }
        setValidated(true);
    };


    const handleChange = (event) => {
        setState({
            ...state,
            email: event.target.value
        })
    }
    return (
        <div className="ms-content-wrapper ms-auth">
            <div className="ms-auth-container">
                <div className="ms-auth-col">
                    <div className="ms-auth-bg" />
                </div>
                <div className="ms-auth-col">
                    <div className="ms-auth-form">
                        {!success ?
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <h1>Reset Password</h1>
                                <p>Please enter your email and click on the link sent to you email</p>
                                    <Form.Group controlId="validationCustom03">
                                        <Form.Label>Email Address</Form.Label>
                                        {errors.email && errors.email.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                        <InputGroup>
                                            <Form.Control
                                                name="email"
                                                required

                                                onChange={handleChange}
                                                type="email"
                                                placeholder="Email Address"
                                            />
                                            <Form.Control.Feedback type="invalid"> Please provide a valid email.</Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                <Button type="submit" className="mt-4 d-block w-100">Reset Password</Button>
                                <p className="mb-0 mt-3 text-center">Already have a password ? <Link className="btn-link" to="/login">Login</Link> </p>
                            </Form> :
                            <div>
                                <div className="alert alert-success" role="alert">
                                    <i className="flaticon-tick-inside-circle" /> <strong>Well done! </strong>
                                    Check your email for the reset link.
                                </div>
                                <p className="mb-0 mt-3 text-center">Try to <Link className="btn-link" to="/login">Login</Link> </p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;