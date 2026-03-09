import React, { useEffect, useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { postApi } from '../../api/api'

const HandoverPayment = (props) => {
    const dispatch = useDispatch()
    const [validated, setValidated] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const [passwordType, setPasswordType] = useState("password")
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const user = useSelector((state) => state.auth.user)
    const [state, setState] = useState({
        email: '',
        password: '',
        amount: props.total,
        resident: '',
    });
    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            console.log(state)
            postApi(() => { props.handleClose() }, token, "/api/handoverpayment/", state)
        }
        setValidated(true);
    };

    useEffect(() => {
        setState({
            ...state,
            resident: selected_resident.national_id,
        })
    }, [dispatch, user, selected_resident])
    const handeChange = (event) => {
        switch (event.target.name) {

            case 'email':
                setState({
                    ...state,
                    email: event.target.value
                })
                break;

            case 'password':
                setState({
                    ...state,
                    password: event.target.value
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
                        <Form.Row>
                            <Form.Group className="mb-3" controlId="validationCustom01">
                                <Form.Label>Email Address</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="email"
                                        onChange={handeChange}
                                        required
                                        type="email"
                                        value={state.email}
                                        placeholder="Email Address" />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group className="mb-5" controlId="validationCustom02">
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="password"
                                        autoComplete="off"
                                        onChange={handeChange}
                                        required
                                        type={passwordType}
                                        value={state.password}
                                        placeholder="Password" />
                                    <InputGroup.Text onClick={togglePassword}>
                                        <i className={passwordType === "text" ? 'fas fa-eye ms-text-primary' : 'fas fa-eye-slash ms-text-primary'} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="reset" variant="warning" className="mt-4 d-inline w-20 mr-2" >Close</Button>
                        <Button type="submit" className="mt-4 d-inline w-20">Sign Off</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default HandoverPayment;