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
        washing: '',
        shaving: '',
        prompting: '',
        oral_care: '',
        toilet_use: '',
        getting_up: '',
        getting_dressed: '',
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
            postApi(_ => { props.handleClose('morning') }, token, `/api/morning-routine/`, state, errors_list => { setErrors(errors_list) })
        }

        setValidated(true);
    };

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'washing':
                setState({
                    ...state,
                    washing: event.target.value
                })
                break;
            case 'shaving':
                setState({
                    ...state,
                    shaving: event.target.value
                })
                break;
            case 'prompting':
                setState({
                    ...state,
                    prompting: event.target.value
                })
                break;
            case 'oral_care':
                setState({
                    ...state,
                    oral_care: event.target.value
                })
                break;
            case 'toilet_use':
                setState({
                    ...state,
                    toilet_use: event.target.value
                })
                break;
            case 'getting_up':
                setState({
                    ...state,
                    getting_up: event.target.value
                })
                break;
            case 'additional_info':
                setState({
                    ...state,
                    additional_info: event.target.value
                })
                break;
            case 'getting_dressed':
                setState({
                    ...state,
                    getting_dressed: event.target.value
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
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Washing</Form.Label>
                                {errors.washing && errors.washing.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="washing"
                                        value={state.washing}
                                    >
                                        <option value="bath">Bath</option>
                                        <option value="shower">Shower</option>
                                        <option value="half-body">Half Body</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Shaving</Form.Label>
                                {errors.shaving && errors.shaving.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="shaving"
                                        required
                                        as="textarea" rows={3}
                                        onChange={handleChange}
                                        value={state.shaving}
                                        type="text"
                                        placeholder="Shaving"
                                    />
                                </InputGroup>
                            </Form.Group>


                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Prompting/Encouragement required</Form.Label>
                                {errors.prompting && errors.prompting.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="prompting"
                                        required
                                        as="textarea" rows={3}
                                        onChange={handleChange}
                                        value={state.prompting}
                                        type="text"
                                        placeholder="Prompting/Encouragement required"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Toilet Use</Form.Label>
                                {errors.toilet_use && errors.toilet_use.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="toilet_use"
                                        required
                                        as="textarea" rows={3}
                                        onChange={handleChange}
                                        value={state.toilet_use}
                                        type="text"
                                        placeholder="Toilet Use"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Oral Care</Form.Label>
                                {errors.oral_care && errors.oral_care.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="oral_care"
                                        required
                                        as="textarea" rows={3}
                                        onChange={handleChange}
                                        value={state.oral_care}
                                        type="text"
                                        placeholder="Oral Care"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Getting up</Form.Label>
                                {errors.getting_up && errors.getting_up.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="getting_up"
                                        required
                                        onChange={handleChange}
                                        value={state.getting_up}
                                        type="text"
                                        placeholder="Getting up"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Getting Dressed</Form.Label>
                                {errors.getting_dressed && errors.getting_dressed.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="getting_dressed"
                                        required
                                        as="textarea" rows={3}
                                        onChange={handleChange}
                                        value={state.getting_dressed}
                                        type="text"
                                        placeholder="Getting Dressed"
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

                        </Form.Row>
                        <Button type="submit" className="mt-4 d-inline w-20 ">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddWeight;