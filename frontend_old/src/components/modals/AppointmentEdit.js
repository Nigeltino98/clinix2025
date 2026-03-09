import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { appointmentActions } from '../../store/appointment'
import { putApi } from '../../api/api'

const AppointmentEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const homes = useSelector((state) => state.home.homeList)
    const staff = useSelector((state) => state.staff.staffList)
    const selected_appointment = useSelector((state) => state.appointment.selectedAppointment)
    const token = useSelector((state) => state.auth.token).token
    let due_time = '' + selected_appointment.due_time
    due_time = due_time.substring(0, due_time.length - 4)
    let start_time = '' + selected_appointment.start_time
    start_time = start_time.substring(0, start_time.length - 4)
    const dispatch = useDispatch()
    

    const handleSubmit = (event) => {
        setValidated(true);
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const data = { ...selected_appointment }
            putApi(_ => {
                props.handleClose()
            }, token, `/api/appointment/`,
                data, data.id, errors_list => { setErrors(errors_list) })
        }

    };
    
    const handleChange = (event) => {
        switch (event.target.name) {

            case 'description':
                dispatch(appointmentActions.setSelectedSelected({
                    ...selected_appointment,
                    description: event.target.value
                }))
                break;

            case 'start_time':
                dispatch(appointmentActions.setSelectedSelected({
                    ...selected_appointment,
                    start_time: event.target.value
                }))
                break;

            case 'due_time':
                dispatch(appointmentActions.setSelectedSelected({
                    ...selected_appointment,
                    due_time: event.target.value
                }))
                break;

            case 'staff':
                dispatch(appointmentActions.setSelectedSelected({
                    ...selected_appointment,
                    staff: event.target.value
                }))
                break;
            case 'status':
                dispatch(appointmentActions.setSelectedSelected({
                    ...selected_appointment,
                    status: event.target.value
                }))
                break;


            case 'resident':
                dispatch(appointmentActions.setSelectedSelected({
                    ...selected_appointment,
                    resident: event.target.value
                }))
                break;
            default:

        }
    }
    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-header">
                    <h6>Appointment Details </h6>
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
                                        value={selected_appointment.title}
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
                                        value={selected_appointment.description}
                                        type="text"
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter First Name"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Start Time</Form.Label>
                                {errors.start_time && errors.start_time.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="start_time"
                                        required
                                        onChange={handleChange}
                                        value={selected_appointment.start_time}
                                        type="datetime-local"
                                        placeholder="Start Time"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                                <Form.Label>Due Time</Form.Label>
                                {errors.due_time && errors.due_time.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="due_time"
                                        required
                                        onChange={handleChange}
                                        value={selected_appointment.due_time}
                                        type="datetime-local"
                                        placeholder="Due Time"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Appointment Status</Form.Label>
                                {errors.status && errors.status.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        value={selected_appointment.status}
                                        name="status">
                                        <option key="2a" > ------------- </option>
                                        <option key="Done" value="Done"> Done</option>
                                        <option key="Pending" value="Pending"> Pending</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Staff</Form.Label>
                                {errors.staff && errors.staff.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="staff"
                                        value={selected_appointment.staff}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {staff.map(user => (
                                            <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Home</Form.Label>
                                {errors.home && errors.home.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        value={selected_appointment.home}
                                        name="home">
                                        <option key="2a" > ------------- </option>
                                        {homes.map(home => (
                                            <option key={home.id} value={home.id}>{home.name} </option>
                                        ))}
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

export default AppointmentEdit;