import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import { postApi } from '../../../../api/api'
import { toastsuccess } from '../../../utils/notifications'
import ProtectedRoute from '../../../protected/ProtectedRoute'


const Addform = () => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const user = useSelector((state) => state.auth.user)
    const staff_list = useSelector((state) => state.staff.staffList)
    const residents = useSelector((state) => state.resident.residentList)
    const initialState = {
        title: '',
        description: '',
        status: 'Pending',
        home: '',
        staff: '',
        created_by: '',
        resident: '',
        start_time: '',
        due_time: '',
        recur: '',
        notify_email:''
    }
    const [state, setState] = useState(initialState)
    const homes = useSelector((state) => state.home.homeList)
    const token = useSelector((state) => state.auth.token).token

    const handleReset = () => {
        setValidated(false);
        setState(initialState)
    }
    const handleSubmit = (event) => {
        setValidated(true);
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(_ => {
                toastsuccess("Appointment added successfully")
                handleReset();
            }, token, `/api/appointment/`, state,
                errors_list => { setErrors(errors_list) })
        }

    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'title':
                setState({
                    ...state,
                    title: event.target.value
                })
                break;

            case 'description':
                setState({
                    ...state,
                    description: event.target.value
                })
                break;

            case 'status':
                setState({
                    ...state,
                    status: event.target.value
                })
                break;

            case 'staff':
                setState({
                    ...state,
                    staff: event.target.value
                })
                break;

            case 'home':
                setState({
                    ...state,
                    home: event.target.value
                })
                break;

            case 'resident':
                setState({
                    ...state,
                    resident: event.target.value
                })
                break;
            case 'start_time':
                setState({
                    ...state,
                    start_time: event.target.value
                })
                break;

            case 'due_time':
                setState({
                    ...state,
                    due_time: event.target.value
                })
                break;

            case 'recur':
                setState({
                    ...state,
                    recur: event.target.value
                })
                break;

            case 'notify_email':
                setState({
                    ...state,
                    notify_email: event.target.value
                })
                break;

            default:

        }
    }

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            staff: user.id,
            created_by: user.id
        }))
    }, [user])


    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel">
                <div className="ms-panel-header ms-panel-custome">
                    <h6>Add Appointment</h6>
                    <ProtectedRoute perm="view_appointment">
                        <Link to="/appointment">Appointment List </Link>
                    </ProtectedRoute>
                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label>Title</Form.Label>
                                {errors.title && errors.title.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="title"
                                        onChange={handleChange}
                                        required
                                        value={state.title}
                                        type="text"
                                        placeholder="Title"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label>Description</Form.Label>
                                {errors.description && errors.description.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="description"
                                        onChange={handleChange}
                                        required
                                        value={state.description}
                                        type="text"
                                        as="textarea"
                                        rows={3}
                                        placeholder="Description"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationNotifyEmail">
                                <Form.Label>Notify Email Address</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="notify_email"
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="Enter email to notify"
                                        value={state.notify_email}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Appointment Status</Form.Label>
                                {errors.status && errors.status.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="status" value={state.status}>
                                        <option key="Done" value="Done"> Done</option>
                                        <option key="Pending" value="Pending"> Pending</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Staff</Form.Label>
                                {errors.staff && errors.staff.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="staff">
                                        {staff_list.map(staff => (
                                            <option key={staff.id} value={staff.id}>{staff.first_name}  {staff.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Resident</Form.Label>
                                {errors.resident && errors.resident.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="resident">
                                        required
                                        value={state.resident}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {residents.map(resident => (
                                            <option key={resident.national_id} value={resident.national_id}>{resident.first_name}  {resident.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            {/*<Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Home</Form.Label>
                                {errors.home && errors.home.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="home">
                                        <option key="2a" > ------------- </option>
                                        {homes.map(home => (
                                            <option key={home.id} value={home.id}>{home.name} </option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>*/}
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom10">
                                <Form.Label>Start On</Form.Label>
                                {errors.start_time && errors.start_time.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="start_time"
                                        required
                                        onChange={handleChange}
                                        value={state.start_time}
                                        type="datetime-local"
                                        placeholder="Start On"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom10">
                                <Form.Label>End On</Form.Label>
                                {errors.due_time && errors.due_time.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="due_time"
                                        required
                                        onChange={handleChange}
                                        value={state.due_time}
                                        type="datetime-local"
                                        placeholder="Due On"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Recur</Form.Label>
                                {errors.recur && errors.recur.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="recur">
                                        <option value="no" > No </option>
                                        <option value="daily" > Daily </option>
                                        <option value="weekly" > Weekly </option>
                                        <option value="monthly" > Monthly </option>
                                        <option value="yearly" > Yearly </option>
                                        <option value="norecur" > NoRecur </option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="reset" variant="warning" className="mt-4 d-inline w-20 mr-2" onClick={handleReset}>Reset fields</Button>
                        <Button type="submit" className="mt-4 d-inline w-20">Create Appointment</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Addform;