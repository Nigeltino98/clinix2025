import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { assessmentActions } from '../../../../store/assessment';
import { evaluationActions } from '../../../../store/evaluation'
import { residentActions } from '../../../../store/resident'
import { useDispatch, useSelector } from 'react-redux';
import { getApi, postApi } from '../../../../api/api'
import ProtectedRoute from '../../../protected/ProtectedRoute'

function Addform() {
    const [errors, setErrors] = useState(false);
    const [validated, setValidated] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const user = useSelector((state) => state.auth.user)
    const selected_resident = useSelector((selected_resident) => selected_resident.resident.selectedResident)
    const dispatch = useDispatch()
    const [state, setState] = useState({
        resident: '',
        staff: '',
        assessment: '',
        next_assement_date: '',
        discontinue: false
    })

    const assessment_list = useSelector((state) => state.assessment.assessmentList)
    const token = useSelector((state) => state.auth.token).token
    const resident_list = useSelector((state) => state.resident.residentList)
    const residents = [...resident_list]

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'resident':
                setState({
                    ...state,
                    resident: event.target.value
                })

                break;

            case 'assessment':
                setState({
                    ...state,
                    assessment: event.target.value
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
        getApi(response => { dispatch(assessmentActions.setAssessment(response.data)); }, token, "/api/assessment")
    }, [dispatch, token])

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            resident: selected_resident.national_id,
            staff: user.id,
        }))
    }, [dispatch, token])

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            let data = {...state}
            if (data.discontinue) {
                delete data["next_assement_date"]
            }
            if (JSON.stringify(selected_resident) === '{}') {
                const res = residents.find(item => item.national_id === state.resident)
                dispatch(residentActions.setSelectedResident(
                    res
                ))
            }
            postApi(response => {
                dispatch(evaluationActions.setSelectedEvaluation(response.data));
                setSubmitted(true)
            }, token, "/api/evaluation/", data)
        }

        setValidated(true);
    };
    return (
        <div className="col-xl-12 col-md-12">
            {!submitted ? <div className="ms-panel">
                <div className="ms-panel-header ms-panel-custome">
                    <h6>Start Evaluation</h6>
                    <ProtectedRoute perm="view_evaluation">
                        <Link to="/evaluation">Evaluations List</Link>
                    </ProtectedRoute>
                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            {JSON.stringify(selected_resident) === '{}' &&
                                <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                    <Form.Label>Resident</Form.Label>
                                    {errors.resident && errors.resident.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                    <InputGroup>
                                        <Form.Control as="select" onChange={handleChange}
                                            name="resident"
                                            value={state.resident}
                                            required
                                        >
                                            <option key="2a" > ------------- </option>
                                            {residents.map(resident => (
                                                <option key={resident.national_id} value={resident.national_id}>{resident.first_name} {resident.last_name}</option>
                                            ))}
                                        </Form.Control>
                                    </InputGroup>
                                </Form.Group>
                            }
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Select Assessment</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        as="select"
                                        name="assessment"
                                        value={state.assessment}
                                        onChange={handleChange} >
                                        <option key="00" value="00">===============</option>

                                        {assessment_list.map(assessment => (
                                            <option key={assessment.id} value={assessment.id} >{assessment.title}</option>
                                        ))}
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
                        <Button type="reset" variant="warning" className="mt-4 d-inline w-20 mr-2">Cancel</Button>
                        <Button type="submit" className="mt-4 d-inline w-20">Begin Evaluation</Button>
                    </Form>
                </div>
            </div > :
                <Redirect to='/evaluation/deatil' replace />
            }

        </div >
    );
}

export default Addform;