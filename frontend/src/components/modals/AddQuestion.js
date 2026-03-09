import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../api/api'
import { useSelector } from 'react-redux'


const AddQuestion = (props) => {
    const [validated, setValidated] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const selected_assessment = useSelector((selected_assessment) => selected_assessment.assessment.selectedAssessment)


    const [state, setState] = useState({
        question: '',
        assement: ''
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(_ => { props.handleClose('questions') }, token, `/api/question/`, state)
       }

        setValidated(true);
    };
    const handleChange = (event) => {
        switch (event.target.name) {

            case 'question':
                setState({
                    ...state,
                    question: event.target.value,
                    assement:selected_assessment.id
                    
                })
                break;
            default:

        }
    }

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
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
                                        value={state.question}
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

export default AddQuestion;