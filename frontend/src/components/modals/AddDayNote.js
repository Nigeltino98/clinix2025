import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../api/api'
import { useDispatch, useSelector } from 'react-redux'


const AddWeight = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const user = useSelector((state) => state.auth.user)
    const selected_resident = useSelector((selected_resident) => selected_resident.resident.selectedResident)
    const token = useSelector((state) => state.auth.token).token
    const dispatch = useDispatch()

    const [state, setState] = useState({
        description: '',
        resident: '',
        staff: '',
        subject: ''
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(_ => { props.handleClose('day_notes') }, token, `/api/note/`, state, errors_list => { setErrors(errors_list) })
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


            default:

        }
    }

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            resident: selected_resident.national_id,
            staff: user.id,
        }))
    }, [dispatch, token])
    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Description</Form.Label>
                                {errors.description && errors.description.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
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
                                <Form.Label>Description</Form.Label>
                                {errors.subject && errors.subject.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="subject"
                                        required
                                        onChange={handleChange}
                                        value={state.subject}
                                        type="text"
                                        placeholder="subject"
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

export default AddWeight;