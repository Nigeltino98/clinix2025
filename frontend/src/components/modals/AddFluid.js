import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col, Row } from 'react-bootstrap';
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
        amount: 0,
        amount_offered: 0,
        type_of_fluid: '',
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
            postApi(_ => { props.handleClose('fluid') }, token, `/api/fluid-intake/`, state, errors_list => { setErrors(errors_list) })
        }

        setValidated(true);
    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'amount':
                setState({
                    ...state,
                    amount: event.target.value
                })
                break;
            case 'amount_offered':
                setState({
                    ...state,
                    amount_offered: event.target.value
                })
                break;
            case 'type_of_fluid':
                setState({
                    ...state,
                    type_of_fluid: event.target.value
                })
                break;
            case 'additional_info':
                setState({
                    ...state,
                    additional_info: event.target.value
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
    }, [dispatch, token, selected_resident])

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Fluid Offered</Form.Label>
                                {errors.amount_offered && errors.amount_offered.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        min={0}
                                        max={300}
                                        name="amount_offered"
                                        required
                                        onChange={handleChange}
                                        value={state.amount_offered}
                                        type="number"
                                        placeholder="Fluid Offered (ml)"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Fluid Taken</Form.Label>
                                {errors.amount && errors.amount.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        min={0}
                                        max={300}
                                        name="amount"
                                        required
                                        onChange={handleChange}
                                        value={state.amount}
                                        type="number"
                                        placeholder="Fluid Taken (ml)"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Type Of Fluid"</Form.Label>
                                {errors.type_of_fluid && errors.type_of_fluid.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="type_of_fluid"
                                        required
                                        as="textarea" rows={3}
                                        onChange={handleChange}
                                        value={state.type_of_fluid}
                                        type="text"
                                        placeholder="Type Of Fluid"
                                    />
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

                        </Row>
                        <Button type="submit" className="mt-4 d-inline w-20 ">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddWeight;