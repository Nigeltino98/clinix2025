import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import {  postApi } from '../../api/api'
import { useDispatch, useSelector } from 'react-redux'


const AddEvaluation = (props) => {
    const [validated, setValidated] = useState(false);
    const dispatch = useDispatch()
    const token = useSelector((state) => state.auth.token).token
    const user = useSelector((state) => state.auth.user)
    const [state, setState] = useState({
        title: '',
        staff: '',
    })
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(() => { props.handleClose() }, token, "/api/assessment/", state)
        }

        setValidated(true);
    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'title':
                setState({
                    ...state,
                    title: event.target.value
                })
                break;

            default:

        }
    }

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            staff: user.id,
        }))
    }, [dispatch, token])

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
                                        value={state.title}
                                        type="text"
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

export default AddEvaluation;