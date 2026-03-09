import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../../api/api'
import { useSelector, useDispatch } from 'react-redux'
import { rotaActions } from '../../../store/rota'

const PatientEdit = (props) => {
    const dispatch = useDispatch()
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const staff = useSelector((state) => state.staff.staffList)
    const homes = useSelector((state) => state.home.homeList)
    const selected_rota = useSelector((state) => state.rota.selectedRota)


    const handleSubmit = (event) => {
        setValidated(true);
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(_ => {
                props.handleClose()
            }, token, `/api/rota/`,
                selected_rota, selected_rota.id, errors_list => { setErrors(errors_list) })
        }
    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'shift':
                dispatch(rotaActions.setSelectedRotas({
                    ...selected_rota,
                    shift: event.target.value
                }))
                break;

            case 'staff':
                dispatch(rotaActions.setSelectedRotas({
                    ...selected_rota,
                    staff: event.target.value
                }))
                break;

            case 'assigned_home':
                dispatch(rotaActions.setSelectedRotas({
                    ...selected_rota,
                    assigned_home: event.target.value
                }))
                break;

            case 'start_date':
                dispatch(rotaActions.setSelectedRotas({
                    ...selected_rota,
                    start_date: event.target.value
                }))
                break;

            case 'end_date':
                dispatch(rotaActions.setSelectedRotas({
                    ...selected_rota,
                    end_date: event.target.value
                }))
                break;

            case 'recur':
                dispatch(rotaActions.setSelectedRotas({
                    ...selected_rota,
                    recur: event.target.value
                }))
                break;

            case 'recur':
                dispatch(rotaActions.setSelectedRotas({
                    ...selected_rota,
                    recur: event.target.value
                }))
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
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Shift</Form.Label>
                                {errors.shift && errors.shift.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="shift"
                                        value={selected_rota.shift}
                                    >
                                        <option key="2a" > ------------- </option>
                                        <option key="Night" > Night </option>
                                        <option key="Day" > Day </option>
                                        <option key="Off" > Off </option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Staff</Form.Label>
                                {errors.staff && errors.staff.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="staff"
                                        value={selected_rota.staff}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {staff.map(stf => (
                                            <option key={stf.id} value={stf.id}>{stf.first_name} {stf.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Start Time</Form.Label>
                                {errors.start_date && errors.start_date.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="start_date"
                                        required
                                        onChange={handleChange}
                                        value={selected_rota.start_date}
                                        type="date"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>End Time</Form.Label>
                                {errors.end_date && errors.end_date.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="end_date"
                                        required
                                        onChange={handleChange}
                                        value={selected_rota.end_date}
                                        type="date"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Assigned Home</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        as="select"
                                        onChange={handleChange}
                                        name="assigned_home"
                                        value={selected_rota.assigned_home}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {homes.map(home => (
                                            <option key={home.id} value={home.id}>{home.name}</option>
                                        ))}
                                    </Form.Control>
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

export default PatientEdit;