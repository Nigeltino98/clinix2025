import React, { useEffect, useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import { postApi } from '../../../../api/api'
import { toastsuccess } from '../../../utils/notifications'

const Addform = () => {
    const [validated, setValidated] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const user = useSelector((state) => state.auth.user)

    const initialState = {
        description: '',
        staff: '',
        subject: '',
        type_of_note: 'day'
    }
    const [state, setState] = useState(initialState)

    const handleReset = () => {
        setState(initialState)
    }
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(_ => { toastsuccess("Note Record added successfully") }, token, `/api/note/`, state)
        }
        setValidated(true);
    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'description':
                setState({
                    ...state,
                    description: event.target.value
                })
                break;

            case 'subject':
                setState({
                    ...state,
                    subject: event.target.value
                })
                break;

            case 'type_of_note':
                setState({
                    ...state,
                    type_of_note: event.target.value
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
    }, [user])
    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel">
                {/* <div className="ms-panel-header ms-panel-custome">
                    <h6>Write Note</h6>
                    <Link to="/note">Notes List </Link>
                </div> */}
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Subject</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="subject"
                                        required
                                        onChange={handleChange}
                                        value={state.subject}
                                        type="text"
                                        placeholder="Subject"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Description</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="description"
                                        required
                                        onChange={handleChange}
                                        value={state.description}
                                        type="text"
                                        as="textarea"
                                        rows={3}
                                        placeholder="Description"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Type of Note</Form.Label>
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="type_of_note"
                                        value={state.type_of_note}
                                    >
                                        <option value="day">Day</option>
                                        <option value="night">Night</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="reset" variant="warning" className="mt-4 d-inline w-20 mr-2" onClick={handleReset}>Reset</Button>
                        <Button type="submit" className="mt-4 d-inline w-20">Add Note</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Addform;