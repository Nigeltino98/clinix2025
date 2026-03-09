import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { suggestionActions } from '../../store/suggestion'
import { putApi } from '../../api/api'
// TODO : solve the datetime and timezone issue
const SuggestionEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const residents = useSelector((state) => state.resident.residentList)
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const selected_suggestion = useSelector((state) => state.suggestion.selectedSuggestion)
    const token = useSelector((state) => state.auth.token).token
    const family = useSelector((state) => state.family.familyList)
    const family_to_display = [...family].filter(item => item.resident === selected_resident.national_id)
    const dispatch = useDispatch()
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const data = { ...selected_suggestion }
            putApi(_ => { props.handleClose() }, token, `/api/suggestion/`, data, data.id, errors => { setErrors(errors) })
        }

        setValidated(true);
    };

    const handleChange = (event) => {
        switch (event.target.name) {
            case 'report_type':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    report_type: event.target.value
                }))
                break;

            case 'subject':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    subject: event.target.value
                }))
                break;

            case 'follow_up_notes':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    follow_up_notes: event.target.value
                }))
                break;

            case 'future_preventative_action':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    future_preventative_action: event.target.value
                }))
                break;

            case 'family_informed':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    family_informed: event.target.value
                }))
                break;

            case 'action_taken':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    action_taken: event.target.value
                }))
                break;


            case 'incident_details':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    incident_details: event.target.value
                }))
                break;

            case 'location':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    location: event.target.value
                }))
                break;

            case 'date_occured':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    date_occured: event.target.value
                }))
                break;

            case 'next_assement_date':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    next_assement_date: event.target.value
                }))
                break;

            case 'status':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
                    status: event.target.value
                }))
                break;
            case 'resident':
                dispatch(suggestionActions.setSelectedSuggestion({
                    ...selected_suggestion,
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
                    <h6>Accident/Incident Information</h6>
                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Type</Form.Label>
                                {errors.report_type && errors.report_type.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="report_type"
                                        value={selected_suggestion.report_type}
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
                                        value={selected_suggestion.subject}
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
                                        value={selected_suggestion.follow_up_notes}
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
                                        value={selected_suggestion.future_preventative_action}
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
                                        value={selected_suggestion.action_taken}
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
                                        value={selected_suggestion.incident_details}
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
                                        value={selected_suggestion.location}
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
                                        value={selected_suggestion.date_occured}
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
                                        value={selected_suggestion.next_assement_date}
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
                                        value={selected_suggestion.status}
                                    >
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
                                        value={selected_suggestion.resident}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {residents.map(resident => (
                                            <option key={resident.national_id} value={resident.national_id}>{resident.first_name} {resident.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="submit" className="mt-4 d-inline w-20">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default SuggestionEdit;