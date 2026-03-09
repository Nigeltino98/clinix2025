import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { residentActions } from '../../store/resident'
import { putApi } from '../../api/api'
import { toastsuccess } from '../utils/notifications'
import { min_date, max_date } from '../utils/dob'

const Makeprescription = () => {
    const [validated, setValidated] = useState(false);
    const homes = useSelector((state) => state.home.homeList)
    const selected_resident = useSelector((selected_resident) => selected_resident.resident.selectedResident)
    const token = useSelector((state) => state.auth.token).token

    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            putApi(_ => { toastsuccess("Resident added successfully") }, token, `/api/resident/`, selected_resident, selected_resident.national_id)

        }

        setValidated(true);
    };
    const handleChange = (event) => {
        switch (event.target.name) {

            case 'first_name':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    first_name: event.target.value
                }))
                break;

            case 'last_name':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    last_name: event.target.value
                }))
                break;

            case 'gender':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    gender: event.target.value
                }))
                break;

            case 'date_of_birth':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    date_of_birth: event.target.value
                }))
                break;

            case 'room':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    room: event.target.value
                }))
                break;

            case 'home':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    home: event.target.value
                }))
                break;

            case 'email':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    email: event.target.value
                }))
                break;

            case 'phone':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    phone: event.target.value
                }))
                break;

            case 'address':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    address: event.target.value
                }))
                break;
            default:


        }
    }

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-header">
                    <h6>Resident Information</h6>
                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label>First Name</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="first_name"
                                        onChange={handleChange}
                                        required
                                        value={selected_resident.first_name}
                                        type="text"
                                        placeholder="Enter First Name"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Last Name</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="last_name"
                                        required
                                        onChange={handleChange}
                                        value={selected_resident.last_name}
                                        type="text"
                                        placeholder="Enter Last Name"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                                <Form.Label>NI Number</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="national_id"
                                        required
                                        disabled
                                        value={selected_resident.national_id}
                                        type="text"
                                        placeholder="NI Number"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Home</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        as="select"
                                        onChange={handleChange}
                                        name="home"
                                        value={selected_resident.home}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {homes.map(home => (
                                            <option key={home.id} value={home.id}>{home.name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                                <Form.Label>Phone No.</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="phone"
                                        required
                                        onChange={handleChange}
                                        value={selected_resident.phone}
                                        type="number"
                                        placeholder="Phone No."
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom05">
                                <Form.Label>Email</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="email"
                                        required
                                        onChange={handleChange}
                                        value={selected_resident.email}
                                        type="email"
                                        placeholder="Email"
                                    />
                                </InputGroup>
                            </Form.Group>

                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom08">
                                <Form.Label>Room</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        required
                                        onChange={handleChange}
                                        value={selected_resident.room}
                                        type="text"
                                        placeholder="Room Number"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom10">
                                <Form.Label>Date of Birth</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="date_of_birth"
                                        min={min_date()}
                                        max={max_date()}
                                        required
                                        onChange={handleChange}
                                        value={selected_resident.date_of_birth}
                                        type="date"
                                        placeholder="Date of Birth"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom11">
                                <Form.Label>Add Address</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="address"
                                        onChange={handleChange}
                                        as="textarea"
                                        rows={3}
                                        value={selected_resident.address}

                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Gender</Form.Label>
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="gender"
                                        value={selected_resident.gender}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Control>
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

export default Makeprescription;