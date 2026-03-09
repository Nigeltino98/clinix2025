import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../api/api'
import { useDispatch, useSelector } from 'react-redux'


const AddWeight = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const user = useSelector((state) => state.auth.user)
    const selected_resident = useSelector((selected_resident) => selected_resident.resident.selectedResident)
    const family = useSelector((state) => state.family.familyList)
    const token = useSelector((state) => state.auth.token).token
    const family_to_display = [...family].filter(item => item.resident === selected_resident.national_id)
    const dispatch = useDispatch()

    const [state, setState] = useState({
        description: '',
        report_type: 'accident',
        subject: '',
        follow_up_notes: '',
        future_preventative_action: '',
        action_taken: '',
        incident_details: '',
        date_occured: '',
        status: '',
        location: '',
        resident: '',
        staff: '',
        discontinue: false,
        next_assement_date: '',

    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            let data = { ...state }
            if (data.discontinue) {
                delete data["next_assement_date"]
            }
            postApi(() => { props.handleClose('accident') }, token, "/api/suggestion/", data, errors_list => { setErrors(errors_list) })
        }
        setValidated(true);
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

            case 'status':
                setState({
                    ...state,
                    status: event.target.value
                })
                break;

            case 'next_assement_date':
                setState({
                    ...state,
                    next_assement_date: event.target.value
                })
                break;

            case 'discontinue':
                setState({
                    ...state,
                    discontinue: event.target.checked
                })
                break;
            default:

        }
    }

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            resident: selected_resident.national_id,
            staff: user.id,
        }))
    }, [dispatch, token])

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Type</Form.Label>
                                {errors.report_type && errors.report_type.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="report_type"
                                        value={state.report_type}
                                    >
                                        <option value="accident">Accident</option>
                                        <option value="incident">Incident</option>
                                        <option value="compliment">Compliment</option>
                                        <option value="complaint">Complaint</option>
                                        <option value="suggestion">Suggestion</option>
                                        <option value="near">Near miss</option>
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
                                        placeholder="Subject"
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
                                        as="textarea"
                                        onChange={handleChange}
                                        value={state.follow_up_notes}
                                        type="text"
                                        placeholder="Follow Up Notes"
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
                                        as="textarea"
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
                                        as="textarea"
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
                                        as="textarea"
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
                                        as="textarea"
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
                                <Form.Label>Discontinue Evaluation</Form.Label>
                                {errors.discontinue && errors.discontinue.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <Form.Check
                                    name="discontinue"
                                    value={true}
                                    type="checkbox"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {!state.discontinue &&
                                <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                    <Form.Label>Next Evaluation Date</Form.Label>
                                    {errors.next_assement_date && errors.next_assement_date.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                    <InputGroup>
                                        <Form.Control
                                            name="next_assement_date"
                                            required
                                            onChange={handleChange}
                                            value={state.next_assement_date}
                                            type="datetime-local"
                                            placeholder="Next Evaluation Date"
                                        />
                                    </InputGroup>
                                </Form.Group>
                            }
                        </Form.Row>
                        <Button type="submit" className="mt-4 d-inline w-20 ">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddWeight;