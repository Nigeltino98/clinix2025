import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { noteActions } from '../../store/note'
import { putApi } from '../../api/api'

const NoteEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const selected_note = useSelector((selected_note) => selected_note.note.selectedNote)
    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const data = { ...selected_note }
            putApi(_ => { props.handleClose() }, token, `/api/note/`, data, data.id, errors_list => { setErrors(errors_list) })
        }
        setValidated(true);
    };
    const handleChange = (event) => {
        switch (event.target.name) {

            case 'subject':
                dispatch(noteActions.setSelectedNote({
                    ...selected_note,
                    subject: event.target.value
                }))
                break;

            case 'description':
                dispatch(noteActions.setSelectedNote({
                    ...selected_note,
                    description: event.target.value
                }))
                break;

            case 'type_of_note':
                dispatch(noteActions.setSelectedNote({
                    ...selected_note,
                    type_of_note: event.target.value
                }))
                break;

            case 'emotion':
                dispatch(noteActions.setSelectedNote({
                    ...selected_note,
                    emotion: event.target.value
                }))
                break;

            default:

        }
    }

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-header">
                    <h6>Note Information</h6>
                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label>Subject</Form.Label>
                                <Form.Control as="select" onChange={handleChange}
                                    name="subject"
                                    value={selected_note.subject}
                                >
                                    <option value='Cash' > Morning Routine</option>
                                    <option value='Bank'> Afternoon Routine</option>
                                    <option value='Other'> Night Notes</option>
                                    <option value='Other'> Fluid Chart</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Description</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        name="description"
                                        required
                                        onChange={handleChange}
                                        value={selected_note.description}
                                        type="text"
                                        as="textarea"
                                        rows={3}
                                        placeholder="Description"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Type of Note</Form.Label>
                                {errors.type_of_note && errors.type_of_note.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="type_of_note"
                                        value={selected_note.type_of_note}
                                    >
                                        <option value="">---------------</option>
                                        <option value="day">Day</option>
                                        <option value="night">Night</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Emotion</Form.Label>
                                {errors.emotion && errors.emotion.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="emotion"
                                        value={selected_note.emotion}
                                    >
                                        <option value="unknown">❓ Unknown</option>
                                        <option value="joyful">😊  Joyful</option>
                                        <option value="sad">😔 Sad</option>
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

export default NoteEdit;