import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../api/api'
import { useSelector } from 'react-redux'


const AddAnswer = (props) => {
    const [validated, setValidated] = useState(false);
    const selected_question = useSelector((selected_question) => selected_question.question.selectedQuestion)

    
    const [state, setState] = useState({
        question: '',
        score: '',
        answear: '',
    })
    const token = useSelector((state) => state.auth.token).token

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(() => { props.handleClose() }, token, "/api/posible-answear/", state)
        }

        setValidated(true);
    };
    const handleChange = (event) => {
        switch (event.target.name) {

            case 'answear':
                setState({
                    ...state,
                    answear: event.target.value,
                    question: selected_question.id
                })
                break;

            case 'score':
                setState({
                    ...state,
                    score: event.target.value
                })
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
                                        value={state.answear}
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
                                        value={state.score}
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

export default AddAnswer;