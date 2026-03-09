import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { putApi } from '../../api/api'
import { useDispatch, useSelector } from 'react-redux'
import { assessmentActions } from '../../store/assessment'

const EditEvaluation = (props) => {
    const [validated, setValidated] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const selected_assessment = useSelector((state) => state.assessment.selectedAssessment)
    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            putApi(() => { props.handleClose() }, token, "/api/assessment/", selected_assessment, selected_assessment.id)
        }

        setValidated(true);
    };
    const handleChange = (event) => {
        switch (event.target.name) {

            case 'title':
                dispatch(assessmentActions.setSelectedAssessments({
                    ...selected_assessment,
                    title: event.target.value
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
                                        value={selected_assessment.title}
                                        type="title"
                                        placeholder="Enter Title"
                                    />
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

export default EditEvaluation;