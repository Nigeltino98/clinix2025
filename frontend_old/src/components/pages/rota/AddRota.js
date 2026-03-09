import React, { useEffect, useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../../api/api'
import { useSelector } from 'react-redux'


const PatientEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const user = useSelector((state) => state.auth.user)
    const staff = useSelector((state) => state.staff.staffList)
    const homes = useSelector((state) => state.home.homeList)

    const initialState = {
        shift: '',
        staff: '',
        created_by: '',
        assigned_home: '',
        start_date: '',
        end_date: ''
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
            }, token, `/api/rota/`,
                state, state.id, errors_list => { setErrors(errors_list) })
        }
    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'shift':
                setState({
                    ...state,
                    shift: event.target.value
                })
                break;

            case 'staff':
                setState({
                    ...state,
                    staff: event.target.value
                })
                break;

            case 'assigned_home':
                setState({
                    ...state,
                    assigned_home: event.target.value
                })
                break;

            case 'start_date':
                setState({
                    ...state,
                    start_date: event.target.value
                })
                break;

            case 'end_date':
                setState({
                    ...state,
                    end_date: event.target.value
                })
                break;

            case 'recur':
                setState({
                    ...state,
                    recur: event.target.value
                })
                break;

            default:

        }
    }
    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            created_by: user.id,
        }))
    }, [user])

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
                                        value={state.shift}
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
                                        value={state.staff}
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
                                        value={state.start_date}
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
                                        value={state.end_date}
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
                                        value={state.assigned_home}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {homes.map(home => (
                                            <option key={home.id} value={home.id}>{home.name}</option>
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

export default PatientEdit;