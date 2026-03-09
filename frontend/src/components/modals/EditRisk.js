import React, { useState } from 'react';
import { Form, InputGroup, Button, Col, Row } from 'react-bootstrap';
import { putApi } from '../../api/api'
import { useDispatch, useSelector } from 'react-redux'
import { riskActions } from '../../store/riskAssessment'
//import { toast } from 'react-toastify';
import { toastsuccess } from '../utils/notifications'


const EditQuestion = (props) => {
    const [validated, setValidated] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const residents = useSelector((state) => state.resident.residentList)
    const selected_risk = useSelector((state) => state.risk.selectedrisk)

    const dispatch = useDispatch()
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            putApi(_ => {
                toastsuccess("Edit successfully done");
                if (props.refreshRisks) props.refreshRisks();  // ✅ refresh list
                props.handleClose();                           // ✅ close modal
            }, token, `/api/risk/`, selected_risk, selected_risk.id)
        }
        setValidated(true);
    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'title':
                dispatch(riskActions.setSelectedrisk({
                    ...selected_risk,
                    title: event.target.value
                }))
                break;

            case 'category':
                dispatch(riskActions.setSelectedrisk({
                    ...selected_risk,
                    category: event.target.value
                }))
                break;

            case 'identified_risk':
                dispatch(riskActions.setSelectedrisk({
                    ...selected_risk,
                    identified_risk: event.target.value
                }))
                break;

            case 'details':
                dispatch(riskActions.setSelectedrisk({
                    ...selected_risk,
                    details: event.target.value
                }))
                break;

            case 'resident':
                dispatch(riskActions.setSelectedrisk({
                    ...selected_risk,
                    resident: event.target.value
                }))
                break;

            case 'information_sources_used':
                dispatch(riskActions.setSelectedrisk({
                    ...selected_risk,
                    information_sources_used: event.target.value
                }))
                break;
            case 'next_assement_date':
                dispatch(riskActions.setSelectedrisk({
                    ...selected_risk,
                    next_assement_date: event.target.value
                }))
                break;
            case 'is_further_information_needed':
                dispatch(riskActions.setSelectedrisk({
                    ...selected_risk,
                    is_further_information_needed: event.target.value
                }))
                break;

            case 'yes_no':
                dispatch(riskActions.setSelectedrisk({
                    ...selected_risk,
                    yes_no: event.target.value
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
                        <Row className="g-3">

                            <Col md={6}>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="title"
                                    value={selected_risk.title || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Label>Identified Risk</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="identified_risk"
                                    value={selected_risk.identified_risk || ''}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Label>Details</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="details"
                                    value={selected_risk.details || ''}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Label>Resident</Form.Label>
                                <Form.Select
                                    name="resident"
                                    value={selected_risk.resident || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">-------------</option>
                                    {residents.map(user => (
                                        <option
                                            key={user.national_id}
                                            value={user.national_id}
                                        >
                                            {user.first_name} {user.last_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={6}>
                                <Form.Label>Information Sources Used</Form.Label>
                                <Form.Select
                                    name="information_sources_used"
                                    value={selected_risk.information_sources_used || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-------------</option>
                                    <option value="APPLICANT">APPLICANT</option>
                                    <option value="CARERS/FRIENDS">CARERS/FRIENDS</option>
                                    <option value="REFERRER">REFERRER</option>
                                    <option value="OTHER AGENCIES">OTHER AGENCIES</option>
                                </Form.Select>
                            </Col>

                            <Col md={6}>
                                <Form.Label>Next Evaluation Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="next_assement_date"
                                    value={selected_risk.next_assement_date || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Check
                                    label="Is Further Information Needed"
                                    name="is_further_information_needed"
                                    checked={!!selected_risk.is_further_information_needed}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Label>Yes / No</Form.Label>
                                <Form.Select
                                    name="yes_no"
                                    value={selected_risk.yes_no || ''}
                                    onChange={handleChange}
                                >
                                    <option value="Unknown">Unknown</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
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

export default EditQuestion;