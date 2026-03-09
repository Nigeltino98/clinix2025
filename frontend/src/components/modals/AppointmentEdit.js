import React, { useState } from 'react';
import { Form, InputGroup, Button, Col, Row } from 'react-bootstrap';
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
                    <h6>Appointment Details</h6>
                </div>

                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="g-3">

                            {/* Title */}
                            <Col md={6}>
                                <Form.Label>Title</Form.Label>
                                {errors.title?.map(err => (
                                    <p key={err} className="ms-text-danger">{err}</p>
                                ))}
                                <Form.Control
                                    name="title"
                                    required
                                    value={selected_appointment.title || ''}
                                    onChange={handleChange}
                                />
                            </Col>

                            {/* Description */}
                            <Col md={6}>
                                <Form.Label>Description</Form.Label>
                                {errors.description?.map(err => (
                                    <p key={err} className="ms-text-danger">{err}</p>
                                ))}
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={selected_appointment.description || ''}
                                    onChange={handleChange}
                                />
                            </Col>

                            {/* Start Time */}
                            <Col md={6}>
                                <Form.Label>Start Time</Form.Label>
                                {errors.start_time?.map(err => (
                                    <p key={err} className="ms-text-danger">{err}</p>
                                ))}
                                <Form.Control
                                    type="datetime-local"
                                    name="start_time"
                                    value={selected_appointment.start_time || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>

                            {/* Due Time */}
                            <Col md={6}>
                                <Form.Label>Due Time</Form.Label>
                                {errors.due_time?.map(err => (
                                    <p key={err} className="ms-text-danger">{err}</p>
                                ))}
                                <Form.Control
                                    type="datetime-local"
                                    name="due_time"
                                    value={selected_appointment.due_time || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>

                            {/* Status */}
                            <Col md={6}>
                                <Form.Label>Appointment Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={selected_appointment.status || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">-------------</option>
                                    <option value="Done">Done</option>
                                    <option value="Pending">Pending</option>
                                </Form.Select>
                            </Col>

                            {/* Staff */}
                            <Col md={6}>
                                <Form.Label>Staff</Form.Label>
                                <Form.Select
                                    name="staff"
                                    value={selected_appointment.staff || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">-------------</option>
                                    {staff.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.first_name} {user.last_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            {/* Home */}
                            <Col md={6}>
                                <Form.Label>Home</Form.Label>
                                <Form.Select
                                    name="home"
                                    value={selected_appointment.home || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">-------------</option>
                                    {homes.map(home => (
                                        <option key={home.id} value={home.id}>
                                            {home.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                        </Row>

                        <Button type="submit" className="mt-4">
                            Save
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentEdit;
