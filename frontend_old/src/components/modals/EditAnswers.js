import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { putApi } from '../../api/api'
import { useSelector, useDispatch } from 'react-redux'
import { answerActions } from '../../store/answer'

const EditAnswer = (props) => {
    const dispatch = useDispatch()
    const [validated, setValidated] = useState(false);
    const selected_ans = useSelector((state) => state.answer.selectedAnswer)
    const token = useSelector((state) => state.auth.token).token
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            putApi(() => { props.handleClose() }, token, "/api/posible-answear/", selected_ans, selected_ans.id)
        }

        setValidated(true);
    };
    const handleChange = (event) => {
        switch (event.target.name) {

            case 'answear':
                dispatch(answerActions.setSelectedAnswer({
                    ...selected_ans,
                    answear: event.target.value,
                }))
                break;

            case 'score':
                dispatch(answerActions.setSelectedAnswer({
                    ...selected_ans,
                    score: event.target.value
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
                                <Form.Label>Possible Answer</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="answear"
                                        onChange={handleChange}
                                        required
                                        value={selected_ans.answear}
                                        type="text"
                                        placeholder="Enter Possible Answer"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label>Score</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="score"
                                        onChange={handleChange}
                                        required
                                        value={selected_ans.score}
                                        type="text"
                                        placeholder="Enter Score"
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

export default EditAnswer;