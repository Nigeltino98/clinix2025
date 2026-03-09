import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux'

import { postApi } from '../../../../api/api'

const Withgap = (props) => {
    const token = useSelector((state) => state.auth.token).token
    const selected_evaluation = useSelector((state) => state.evaluation.selectedEvaluation)
    const [state, setState] = useState(
        {
            question: props.assessment.question.id,
            evaluation: selected_evaluation.id,
            answer: "",
            comment: ""
        }
    );
    const handleChange = (event) => {
        setState({
            ...state,
            answer: event.target.value
        })
    }

    const handleBlur = (event) => {

        setState({
            ...state,
            comment: event.target.value
        })
    }
    const handlePost = () => {
        postApi(_ => {
            props.successHandler()
        }, token, "/api/choices/", state)
    }

    useEffect(() => {
        if (state.answer !== "" && state.comment !== "") {
            handlePost()
        }
    }, [state]);

    return (
        <div className="ms-panel">
            <div className="ms-panel-header">
                <h6>{props.number}. {props.assessment.question.question}</h6>
            </div>
            <div className="ms-panel-body">
                <Form.Group as={Col} md="12" controlId="validationCustom01">
                    <Form.Label>Select Anwser</Form.Label>
                    <InputGroup>
                        <Form.Control as="select" name="answwer"
                            onChange={handleChange} disabled={props.disabled}>
                            {props.assessment.answers.map((answer, i) => (
                                <option key={i} value={answer.id} >{i}. {answer.answear}</option>
                            ))
                            }
                        </Form.Control>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="validationCustom01">
                    <Form.Label>Comment</Form.Label>
                    <InputGroup>
                        <Form.Control
                            onBlur={handleBlur}
                            name="comment"
                            required
                            type="text"
                            as="textarea"
                            placeholder="Comment"
                        />
                    </InputGroup>
                </Form.Group>
            </div>
        </div>
    );
}

export default Withgap;