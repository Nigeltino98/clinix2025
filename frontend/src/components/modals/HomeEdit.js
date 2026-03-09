import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { homeActions } from '../../store/home'
import { putApi } from '../../api/api'

const StaffEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const selected_home = useSelector((selected_home) => selected_home.home.selectedHome)
    const token = useSelector((state) => state.auth.token).token
    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            putApi(_ => { props.handleClose() }, token, `/api/home/`, selected_home, selected_home.id)
        }

        setValidated(true);
    };
    const handleChange = (event) => {
        switch (event.target.name) {

            case 'name':
                dispatch(homeActions.setSelectedHome({
                    ...selected_home,
                    name: event.target.value
                }))
                break;

            case 'address':
                dispatch(homeActions.setSelectedHome({
                    ...selected_home,
                    address: event.target.value
                }))
                break;

            case 'capacity':
                dispatch(homeActions.setSelectedHome({
                    ...selected_home,
                    capacity: event.target.value
                }))
                break;
                
            default:

        }
    }

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-header">
                    <h6>Home Information</h6>
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
                                        value={selected_home.name}
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
                                        as="textarea"
                                        rows={3}
                                        required
                                        onChange={handleChange}
                                        value={selected_home.address}
                                        placeholder="Enter Address"
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
                                        value={selected_home.capacity}
                                        type="number"
                                        placeholder="Capacity"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="submit" className="mt-4 d-inline w-20 ">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default StaffEdit;