import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { putApi } from '../../api/api'
import { useDispatch, useSelector } from 'react-redux'
import { questionAction } from '../../store/question'

const EditQuestion = (props) => {
    const [validated, setValidated] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const selected_question = useSelector((state) => state.question.selectedQuestion)
    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            putApi(_ => { props.handleClose() }, token, `/api/question/`, selected_question, selected_question.id)
        }

        setValidated(true);
    };
    const handleChange = (event) => {
        switch (event.target.name) {

            case 'question':
                dispatch(questionAction.setSelectedQuestion({
                    ...selected_question,
                    question: event.target.value
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
                                <Form.Label>Question</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="question"
                                        onChange={handleChange}
                                        required
                                        value={selected_question.question}
                                        type="text"
                                        placeholder="Enter Question"
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

export default EditQuestion;