import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { putApi } from '../../api/api'
import { useSelector, useDispatch } from 'react-redux'
import { residentActions } from '../../store/resident'
import { min_date, max_date } from '../utils/dob'

const PatientEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const homes = useSelector((state) => state.home.homeList)
    const token = useSelector((state) => state.auth.token).token
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        setValidated(true);
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const data = { ...selected_resident }
            if (typeof selected_resident.profile_pic === 'string' || selected_resident.profile_pic === null) {
                delete data["profile_pic"]
                putApi(_ => {
                    props.handleClose()
                }, token, `/api/resident/`,
                    data, selected_resident.national_id, errors_list => { setErrors(errors_list) })
            } else {
                const formData = new FormData();
                formData.append('first_name', selected_resident.first_name);
                formData.append('last_name', selected_resident.last_name);
                formData.append('national_id', selected_resident.national_id);
                formData.append('gender', selected_resident.gender);
                formData.append('date_of_birth', selected_resident.date_of_birth);
                formData.append('room', selected_resident.room);
                formData.append('home', selected_resident.home);
                formData.append('email', selected_resident.email);
                formData.append('phone', selected_resident.phone);
                formData.append('address', selected_resident.address);
                formData.append('height', selected_resident.height);
                formData.append('profile_pic', selected_resident.profile_pic);
		formData.append('next_of_kin', selected_resident.next_of_kin);
                putApi(_ => {
                    props.handleClose()
                }, token, `/api/resident/`,
                    formData, selected_resident.national_id, errors_list => { setErrors(errors_list) })
            }

        }
    };

    let pic_label = ""
    if (typeof selected_resident.profile_pic === 'string') {
        pic_label = selected_resident.profile_pic
    } else if (selected_resident.profile_pic === null) {
        pic_label = " Choose a pic"
    } else {
        pic_label = selected_resident.profile_pic.name
    }

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

            case 'national_id':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    national_id: event.target.value
                }))
                break;

            case 'NHS_number':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    NHS_number: event.target.value
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

            case 'profile_pic':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    profile_pic: event.target.files[0]
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

            case 'height':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    height: event.target.value
                }))
                break;
    
            case 'next_of_kin':
                dispatch(residentActions.setSelectedResident({
                    ...selected_resident,
                    height: event.target.value
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
                                {errors.first_name && errors.first_name.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
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
                                {errors.last_name && errors.last_name.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
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
                                {errors.national_id && errors.national_id.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="national_id"
                                        required
                                        onChange={handleChange}
                                        value={selected_resident.national_id}
                                        type="text"
                                        placeholder="NI Number"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                                <Form.Label>NHS Number</Form.Label>
                                {errors.NHS_number && errors.NHS_number.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="NHS_number"
                                        required
                                        onChange={handleChange}
                                        value={selected_resident.NHS_number}
                                        type="text"
                                        placeholder="NHS Number"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                                <Form.Label>Mobile No.</Form.Label>
                                {errors.phone && errors.phone.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="phone"
                                        required
                                        onChange={handleChange}
                                        value={selected_resident.phone}
                                        type="number"
                                        placeholder="Mobile No."
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom05">
                                <Form.Label>Email</Form.Label>
                                {errors.email && errors.email.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
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
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Home</Form.Label>
                                {errors.home && errors.home.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="home"
                                        value={selected_resident.home}
                                    >
                                        <option >=================</option>
                                        {homes.map(home => (
                                            <option key={home.id} value={home.id}>{home.name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom08">
                                <Form.Label>Room</Form.Label>
                                {errors.room && errors.room.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="room"
                                        required
                                        onChange={handleChange}
                                        value={selected_resident.room}
                                        type="text"
                                        placeholder="Room Number"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom09">
                                <Form.Label>Profile Pic</Form.Label>
                                {errors.profile_pic && errors.profile_pic.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.File
                                        name="profile_pic"
                                        label={pic_label}
                                        onChange={handleChange}
                                        lang="en"
                                        custom
                                        accept="image/*"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom10">
                                <Form.Label>Date of Birth</Form.Label>
                                {errors.date_of_birth && errors.date_of_birth.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>

                                    <Form.Control
                                        name="date_of_birth"
                                        required
                                        min={min_date()}
                                        max={max_date()}
                                        onChange={handleChange}
                                        value={selected_resident.date_of_birth}
                                        type="date"
                                        placeholder="Date of Birth"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Gender</Form.Label>
                                {errors.gender && errors.gender.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="gender"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Height</Form.Label>
                                {errors.height && errors.height.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="height"
                                        required
                                        min={0}
                                        max={3}
                                        step={0.01}
                                        onChange={handleChange}
                                        value={selected_resident.height}
                                        type="number"
                                        placeholder="Height"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom11">
                                <Form.Label>Add Address</Form.Label>
                                {errors.address && errors.address.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="address"
                                        onChange={handleChange}
                                        as="textarea" rows={3}
                                        value={selected_resident.address}

                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom12">
                                <Form.Label>Next of Kin</Form.Label>
                                {errors.next_of_kin && errors.next_of_kin.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="next_of_kin"
                                        onChange={handleChange}
                                        required
                                        value={selected_resident.next_of_kin} // Use the "next_of_kin" value from the selected resident
                                        type="text"
                                        placeholder="Next of Kin"

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

export default PatientEdit;