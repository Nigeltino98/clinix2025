import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col, Row } from 'react-bootstrap';
import { postApi } from '../../api/api'
import { useDispatch, useSelector } from 'react-redux'


const AddWeight = (props) => {
    const [errors, setErrors] = useState(false);
    const [validated, setValidated] = useState(false);
    const user = useSelector((state) => state.auth.user)
    const selected_resident = useSelector((selected_resident) => selected_resident.resident.selectedResident)
    const token = useSelector((state) => state.auth.token).token
    const dispatch = useDispatch()
    const [state, setState] = useState({
        emotion: 'unknown',
        additional_info: '',
        resident: '',
        staff: '',
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(_ => { props.handleClose('mood') }, token, `/api/mood/`, state, errors_list => { setErrors(errors_list) })
        }

        setValidated(true);
    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'additional_info':
                setState({
                    ...state,
                    additional_info: event.target.value
                })
                break;
            case 'emotion':
                setState({
                    ...state,
                    emotion: event.target.value
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
                        <Row>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Emotion</Form.Label>
                                {errors.emotion && errors.emotion.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                                  name="emotion"
                                                  value={state.emotion}
                                    >
                                        <option value="unknown">❓ Unknown</option>
                                        <option value="happy">😃 Happy</option>
                                        <option value="joyful">😊 Joyful</option>
                                        <option value="sad">😔 Sad</option>
                                        <option value="content">🙂 Content</option>
                                        <option value="worried">😟 Worried</option>
                                        <option value="fearful">😨 Fearful</option>
                                        <option value="sleepy">🥱 Sleepy</option>
                                        <option value="confused">😕 Confused</option>
                                        <option value="tearful">😢 Tearful</option>
                                        <option value="angry">😡 Angry</option>
                                        <option value="annoyed">🙄 Annoyed</option>
                                        <option value="sleeping">😴 Sleeping</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom11">
                                <Form.Label>Additional Infomation</Form.Label>
                                {errors.additional_info && errors.additional_info.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="additional_info"
                                        onChange={handleChange}
                                        as="textarea" rows={3}
                                        value={state.additional_info}

                                    />
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Button type="submit" className="mt-4 d-inline w-20 ">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddWeight;