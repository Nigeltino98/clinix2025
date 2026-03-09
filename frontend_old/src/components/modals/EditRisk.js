import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
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
                <div className="ms-panel-header">

                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label>Title</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="title"
                                        onChange={handleChange}
                                        required
                                        value={selected_risk.title}
                                        type="text"
                                        as="textarea"
                                        rows={3} placeholder="Title"
                                    />
                                </InputGroup>
                            </Form.Group>
                            {/*<Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Category</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="category"
                                        required
                                        onChange={handleChange}
                                        value={selected_risk.category}
                                        as="select"
                                    >
                                        <option value='HousingTenancy' >Housing/Tenancy</option>
                                        <option value='Risk' >Risk</option>
                                        <option value='FinanceMoneyBenefitManagement' >Finance/Money/Benefit Management</option>
                                        <option value='RentArrearsServiceUsers' >Rent Arrears - Service Users</option>
                                        <option value='RentArrearsServiceUsers' >Rent Arrears - Service Users</option>
                                        <option value='Education' >Education</option>
                                        <option value='Training' >Training</option>
                                        <option value='Employment' >Employment</option>
                                        <option value='MentalHealthSubstanceUse' >Mental Health/Substance Use</option>
                                        <option value='EthnicCulturalReligiousNeeds' >Ethnic/Cultural/Religious Needs -</option>
                                        <option value='LeisureSocialNetwork' >LeisureSocialNetwork</option>
                                        <option value='MovingOn' >Moving On</option>
                                        <option value='FurtherConcernsNeeds' >Further Concerns/Needs -</option>
                                        <option value='ServicesprovidedbyHousingorEstateManagementService' >Services provided by Housing or Estate Management Service</option>
                                        <option value='ServicesprovidedbySupportWorker' >Services provided by Support Worker</option>
                                        <option value='SupportWorkersViewsofIssuesNeedsorActions' >Support Worker's Views of Issues, Needs or Actions</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>*/}
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                                <Form.Label>Identified Risk</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="identified_risk"
                                        value={selected_risk.identified_risk}
                                        as="textarea"
                                        type="text"
                                        onChange={handleChange}
                                    >
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                                <Form.Label>Details</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        as="textarea"
                                        type="text"
                                        name="details"
                                        onChange={handleChange}
                                        value={selected_risk.details}
                                    >

                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                                <Form.Label>Resident</Form.Label>
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="resident"
                                        value={selected_risk.resident}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {residents.map(user => (
                                            <option key={user.national_id} value={user.national_id}>{user.first_name} {user.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Information Sources Used</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="information_sources_used"
                                        required
                                        as="select"
                                        onChange={handleChange}
                                        value={selected_risk.information_sources_used}
                                        placeholder="Information Sources Used"
                                    >
                                        <option value='APPLICANT' >APPLICANT</option>
                                        <option value='CARERS/FRIENDS' >CARERS/FRIENDS</option>
                                        <option value='REFERRER' >REFERRER</option>
                                        <option value='OTHER AGENCIES'> OTHER AGENCIES</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Next Evaluation Date</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="next_assement_date"
                                        required
                                        onChange={handleChange}
                                        value={selected_risk.next_assement_date}
                                        type="date"
                                        placeholder="Next Assement Date"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Is Further Information Needed</Form.Label>
                                {/* {errors.is_further_information_needed && errors.is_further_information_needed.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })} */}
                                <Form.Check
                                    name="is_further_information_needed"
                                    value={selected_risk.is_further_information_needed}
                                    type="checkbox"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Yes/No</Form.Label>
                                <Form.Control as="select" onChange={handleChange}
                                    name="yes_no"
                                    value={selected_risk.yes_no}
                                >
                                    <option value='Unkown' >Unkown</option>
                                    <option value='Yes' >Yes</option>
                                    <option value='No'> No</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Button type="submit" className="mt-4 d-inline w-20">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default EditQuestion;