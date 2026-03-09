import React, { useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { attachmentActions } from '../../store/attachment'
import { putApi } from '../../api/api'
// TODO : solve the issues with file upload
const AppointmentEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const residents = useSelector((state) => state.resident.residentList)
    const token = useSelector((state) => state.auth.token).token
    const selected_attachment = useSelector((selected_attachment) => selected_attachment.attachment.selectedAttachment)
    const dispatch = useDispatch()
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const formData = new FormData();
            if (typeof selected_attachment.attachment === 'string') {
                const data = { ...selected_attachment }
                delete data["attachment"]
                putApi(_ => { props.handleClose() }, token, `/api/attachment/`,
                    data, data.id, errors_list => { setErrors(errors_list) })
            } else {
                formData.append('id', selected_attachment.id);
                formData.append('attachment', selected_attachment.attachment);
                formData.append('subject', selected_attachment.subject);
                formData.append('staff', selected_attachment.staff);
                formData.append('category', selected_attachment.category);
                formData.append('resident', selected_attachment.resident);
                putApi(_ => { props.handleClose() }, token, `/api/attachment/`,
                    formData, selected_attachment.id, errors_list => { setErrors(errors_list) })
            }

        }
        setValidated(true);
    };
    const handleChange = (event) => {
        switch (event.target.name) {


            case 'category':
                dispatch(attachmentActions.setSelectedAttachment({
                    ...selected_attachment,
                    category: event.target.value
                }))
                break;

            case 'subject':
                dispatch(attachmentActions.setSelectedAttachment({
                    ...selected_attachment,
                    subject: event.target.value
                }))
                break;

            // case 'staff':
            //     dispatch(attachmentActions.setSelectedAttachment({
            //         ...selected_attachment,
            //         staff: event.target.value
            //     }))
            //     break;
            case 'resident':
                dispatch(attachmentActions.setSelectedAttachment({
                    ...selected_attachment,
                    resident: event.target.value
                }))
                break;
            case 'attachment':
                dispatch(attachmentActions.setSelectedAttachment({
                    ...selected_attachment,
                    attachment: event.target.files[0]
                }))
                break;
            default:

        }
    }

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-header">
                    <h6>Attachment Information</h6>
                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Subject</Form.Label>
                                {errors.subject && errors.subject.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="subject"
                                        required
                                        onChange={handleChange}
                                        value={selected_attachment.subject}
                                        type="text"
                                        placeholder="Subject"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                                <Form.Label>Category</Form.Label>
                                {errors.category && errors.category.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <Form.Control as="select" onChange={handleChange}
                                    name="category"
                                    value={selected_attachment.category}
                                >
                                    <option value='Finance' > Finance</option>
                                    <option value='Resident'> Resident</option>
                                    <option value='Home'> Home</option>
                                    <option value='GeneralInfo'> General</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            {/* <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Staff</Form.Label>
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="staff"
                                        value={selected_attachment.staff}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {staff.map(user => (
                                            <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group> */}
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Resident</Form.Label>
                                {errors.resident && errors.resident.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="resident"
                                        value={selected_attachment.resident}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {residents.map(resident => (
                                            <option key={resident.national_id} value={resident.national_id}>{resident.first_name} {resident.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom09">
                                <Form.Label>File</Form.Label>
                                {errors.attachment && errors.attachment.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.File
                                        name="attachment"
                                        label={typeof selected_attachment.attachment === 'string' ? selected_attachment.attachment : selected_attachment.attachment.name}
                                        onChange={handleChange}
                                        lang="en"
                                        custom
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

export default AppointmentEdit;