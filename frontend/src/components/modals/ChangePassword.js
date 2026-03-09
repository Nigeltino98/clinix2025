import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import {  useSelector } from 'react-redux'
import { truePutApi } from '../../api/api'
import { toastsuccess } from '../utils/notifications'

const Makeprescription = () => {
    const [validated, setValidated] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const [errors, setErrors] = useState(false);
    const [state, setState] = useState({
        "old_password": "",
        "new_password": "",
        "new_password2": ""
    });
    const [passwordType, setPasswordType] = useState("password")
    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }
    const samePassowrd = () => {
        if (state.new_password === state.new_password2) {
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
                truePutApi(_ => { toastsuccess("Password added successfully") }, token, `/api/change-password/`, state, errors_list => { setErrors(errors_list) })
            }
        } else {
            setErrors({
                ...errors,
                new_password2: ["Passwords didn't match"]
            })
        }

    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'old_password':
                setState({
                    ...state,
                    old_password: event.target.value
                })
                break;

            case 'new_password':
                setState({
                    ...state,
                    new_password: event.target.value
                })
                break;

            case 'new_password2':
                setState({
                    ...state,
                    new_password2: event.target.value
                })
                break;
            default:
        }
    }

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>

                        <Form.Group className="mb-12" controlId="validationCustom02">
                            <Form.Label>Old Password</Form.Label>
                            {errors.old_password && errors.old_password.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                            <InputGroup>
                                <Form.Control
                                    name="old_password"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    required
                                    type={passwordType}
                                    value={state.password}
                                    placeholder="Old Password"
                                />
                                <InputGroup.Text onClick={togglePassword}>
                                    <i className={passwordType === "text" ? 'fas fa-eye ms-text-primary' : 'fas fa-eye-slash ms-text-primary'} />
                                </InputGroup.Text>

                                <Form.Control.Feedback type="invalid"> Please provide a password.</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>


                        <Form.Group className="mb-12" controlId="validationCustom02">
                            <Form.Label>New Password</Form.Label>
                            {errors.new_password && errors.new_password.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                            <InputGroup>
                                <Form.Control
                                    name="new_password"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    required
                                    type={passwordType}
                                    value={state.password}
                                    placeholder="New Password"
                                />
                                <InputGroup.Text onClick={togglePassword}>
                                    <i className={passwordType === "text" ? 'fas fa-eye ms-text-primary' : 'fas fa-eye-slash ms-text-primary'} />
                                </InputGroup.Text>

                                <Form.Control.Feedback type="invalid"> Please provide a password.</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>


                        <Form.Group className="mb-12" controlId="validationCustom02">
                            <Form.Label>Repeat New Password</Form.Label>
                            {errors.new_password2 && errors.new_password2.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                            <InputGroup>
                                <Form.Control
                                    name="new_password2"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    required
                                    type={passwordType}
                                    value={state.password}
                                    placeholder="Repeat New Password"
                                />
                                <InputGroup.Text onClick={togglePassword}>
                                    <i className={passwordType === "text" ? 'fas fa-eye ms-text-primary' : 'fas fa-eye-slash ms-text-primary'} />
                                </InputGroup.Text>

                                <Form.Control.Feedback type="invalid"> Please provide a password.</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Button type="submit" className="mt-4 d-inline w-20 ">Submit</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Makeprescription;