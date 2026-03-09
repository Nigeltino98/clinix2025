import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../../../api/api'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../../protected/ProtectedRoute'
import { toastsuccess } from '../../../utils/notifications'
const initialState = {
    name: '',
    address: '',
    capacity: 0
}


const Addform = () => {
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState(initialState)
    const token = useSelector((state) => state.auth.token).token
    
    const history = useHistory();

    const handleReset = () => {
        setValidated(false);
        setState(initialState)
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        setValidated(true);
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setValidated(true);
            postApi(_ => { toastsuccess("Home added successfully") }, token, `/api/home/`, state)
            handleReset()
        }
    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'name':
                setState({
                    ...state,
                    name: event.target.value
                })
                break;

            case 'address':
                setState({
                    ...state,
                    address: event.target.value
                })
                break;

            case 'capacity':
                setState({
                    ...state,
                    capacity: event.target.value
                })
                break;
            default:

        }
    }

      const handleGoBack = () => {
       history.goBack();
    };

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel">
                <div className="ms-panel-header ms-panel-custome">
                    <h6>Add Home</h6>
                    <ProtectedRoute perm="view_home">
                        <Link to="/home">Home List </Link>
                    </ProtectedRoute>
                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label>Home Name</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="name"
                                        onChange={handleChange}
                                        required
                                        value={state.name}
                                        type="text"
                                        placeholder="Enter Home Name"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Address</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="address"
                                        required
                                        onChange={handleChange}
                                        value={state.address}
                                        type="text"
                                        as="textarea"
                                        placeholder="Address"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Capacity</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="capacity"
                                        required
                                        onChange={handleChange}
                                        value={state.capacity}
                                        type="number"
                                        placeholder="Capacity"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="reset" variant="warning" className="mt-4 d-inline w-20 mr-2" onClick={handleReset}>Reset</Button>
                        <Button type="submit" className="mt-4 d-inline w-20 mr-2">Create Home</Button>
                        <button onClick={handleGoBack} className="btn btn-primary">Back</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Addform;