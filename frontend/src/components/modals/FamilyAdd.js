import React, { useEffect, useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../api/api'
import { useSelector } from 'react-redux'


const PatientEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const selected_resident = useSelector((state) => state.resident.selectedResident)

    const initialState = {
        first_name: '',
        last_name: '',
        title: 'Other',
        phone: '',
        email: '',
        address: '',
        type: 'Family',
        resident: '',
    }
    const [state, setState] = useState(initialState)


    const handleSubmit = (event) => {
        setValidated(true);
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(_ => {
                props.handleClose()
            }, token, `/api/family/`,
                state, state.id, errors_list => { setErrors(errors_list) })
        }
    };


    const handleChange = (event) => {
        switch (event.target.name) {

            case 'first_name':
                setState({
                    ...state,
                    first_name: event.target.value
                })
                break;

            case 'last_name':
                setState({
                    ...state,
                    last_name: event.target.value
                })
                break;

            case 'title':
                setState({
                    ...state,
                    title: event.target.value
                })
                break;


            case 'email':
                setState({
                    ...state,
                    email: event.target.value
                })
                break;

            case 'phone':
                setState({
                    ...state,
                    phone: event.target.value
                })
                break;

            case 'address':
                setState({
                    ...state,
                    address: event.target.value
                })
                break;

            case 'type':
                setState({
                    ...state,
                    type: event.target.value
                })
                break;

            default:

        }
    }
    console.log(selected_resident, state.resident)
    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            resident: JSON.stringify(selected_resident) !== '{}' ? selected_resident.national_id : ''
        }))
    }, [selected_resident])

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
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
                                        value={state.first_name}
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
                                        value={state.last_name}
                                        type="text"
                                        placeholder="Enter Last Name"
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
                                        value={state.phone}
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
                                        value={state.email}
                                        type="email"
                                        placeholder="Email"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Title</Form.Label>
                                {errors.title && errors.title.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="title"
                                        required
                                        onChange={handleChange}
                                        value={state.title}
                                        type="text"
                                        placeholder="Title"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Contact Type</Form.Label>
                                {errors.type && errors.type.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="type"
                                        value={state.type}
                                    >
                                        <option value="GP">GP</option>
                                        <option value="Psychiatrist">Psychiatrist</option>
                                        <option value="Dentist">Dentist</option>
                                        <option value="Optician">Optician</option>
                                        <option value="SocialWorker">Social Worker</option>
                                        <option value="CareCoordinator">Care Coordinator</option>
                                    </Form.Control>
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
                                        value={state.address}

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