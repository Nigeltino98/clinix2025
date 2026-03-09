import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { toastsuccess } from '../../../utils/notifications'
import { postApi, getApi } from '../../../../api/api'
import { familyAction } from '../../../../store/family'
import ProtectedRoute from '../../../protected/ProtectedRoute'


const Addform = () => {
    const dispatch = useDispatch()
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const user = useSelector((state) => state.auth.user)
    const residents = useSelector((state) => state.resident.residentList)
    const selected_resident = useSelector((selected_resident) => selected_resident.resident.selectedResident)
    const family = useSelector((state) => state.family.familyList)
    const family_to_display = [...family].filter(item => item.resident === selected_resident.national_id)

    const initialState = {
        description: '',
        report_type: 'accident',
        subject: '',
        follow_up_notes: '',
        future_preventative_action: '',
        action_taken: '',
        incident_details: '',
        date_occured: '',
        next_assement_date: '',
        status: 'low',
        location: '',
        resident: '',
        staff: '',
    }
    const [state, setState] = useState(initialState)
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
                toastsuccess("Suggestion added successfully")
                handleReset()
            },
                token, `/api/suggestion/`, state, errors_list => { setErrors(errors_list) })
        }


    };

    const handleChange = (event) => {
        switch (event.target.name) {
            case 'report_type':
                setState({
                    ...state,
                    report_type: event.target.value
                })
                break;

            case 'subject':
                setState({
                    ...state,
                    subject: event.target.value
                })
                break;

            case 'follow_up_notes':
                setState({
                    ...state,
                    follow_up_notes: event.target.value
                })
                break;

            case 'future_preventative_action':
                setState({
                    ...state,
                    future_preventative_action: event.target.value
                })
                break;

            case 'family_informed':
                setState({
                    ...state,
                    family_informed: event.target.value
                })
                break;

            case 'action_taken':
                setState({
                    ...state,
                    action_taken: event.target.value
                })
                break;


            case 'incident_details':
                setState({
                    ...state,
                    incident_details: event.target.value
                })
                break;

            case 'location':
                setState({
                    ...state,
                    location: event.target.value
                })
                break;

            case 'date_occured':
                setState({
                    ...state,
                    date_occured: event.target.value
                })
                break;

            case 'next_assement_date':
                setState({
                    ...state,
                    next_assement_date: event.target.value
                })
                break;

            case 'status':
                setState({
                    ...state,
                    status: event.target.value
                })
                break;
            case 'resident':
                setState({
                    ...state,
                    resident: event.target.value
                })
                break;

            default:

        }
    }
    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            staff: user.id,
        }))
    }, [user])

    useEffect(() => {
        getApi(response => { dispatch(familyAction.setFamily(response.data)) }, token, "/api/family")
    }, [dispatch, token])

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel">
                <div className="ms-panel-header ms-panel-custome">
                    <h6>Add Accident & Incident</h6>
                    <ProtectedRoute perm="view_suggestioncomplains">
                        <Link to="/suggesion">Accident & Incident List</Link>
                    </ProtectedRoute>
                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Type of report</Form.Label>
                                {errors.report_type && errors.report_type.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="report_type"
                                        value={state.report_type}
                                    >
                                        <option value="accident">accident</option>
                                        <option value="incident">incident</option>
                                        <option value="compliment">compliment</option>
                                        <option value="complaint">complaint</option>
                                        <option value="suggestion">suggestion</option>
                                        <option value="near">near miss</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Subject</Form.Label>
                                {errors.subject && errors.subject.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="subject"
                                        required
                                        onChange={handleChange}
                                        value={state.subject}
                                        type="text"
                                        placeholder="subject"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Follow Up Notes</Form.Label>
                                {errors.follow_up_notes && errors.follow_up_notes.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="follow_up_notes"
                                        required
                                        onChange={handleChange}
                                        value={state.follow_up_notes}
                                        type="text"
                                        placeholder="follow_up_notes"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Future Preventative Action</Form.Label>
                                {errors.future_preventative_action && errors.future_preventative_action.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="future_preventative_action"
                                        required
                                        onChange={handleChange}
                                        value={state.future_preventative_action}
                                        type="text"
                                        placeholder="Future Preventative Action"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Action Taken</Form.Label>
                                {errors.action_taken && errors.action_taken.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="action_taken"
                                        required
                                        onChange={handleChange}
                                        value={state.action_taken}
                                        type="text"
                                        placeholder="Action Taken"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Incident Details</Form.Label>
                                {errors.incident_details && errors.incident_details.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="incident_details"
                                        required
                                        onChange={handleChange}
                                        value={state.incident_details}
                                        type="text"
                                        placeholder="Incident Details"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Location</Form.Label>
                                {errors.location && errors.location.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="location"
                                        required
                                        onChange={handleChange}
                                        value={state.location}
                                        type="text"
                                        placeholder="Location"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Date Occured</Form.Label>
                                {errors.date_occured && errors.date_occured.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="date_occured"
                                        required
                                        onChange={handleChange}
                                        value={state.date_occured}
                                        type="datetime-local"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Review Date</Form.Label>
                                {errors.next_assement_date && errors.next_assement_date.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="next_assement_date"
                                        required
                                        onChange={handleChange}
                                        value={state.next_assement_date}
                                        type="datetime-local"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Status</Form.Label>
                                {errors.status && errors.status.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                                  name="status"
                                                  value={state.status}
                                    >
                                        <option value=""></option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Resident</Form.Label>
                                {errors.resident && errors.resident.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="resident"
                                        value={state.resident}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {residents.map(resident => (
                                            <option key={resident.national_id} value={resident.national_id}>{resident.first_name} {resident.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="reset" variant="warning" className="mt-4 d-inline w-20 mr-2" onClick={handleReset}>Reset</Button>
                        <Button type="submit" className="mt-4 d-inline w-20">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Addform;