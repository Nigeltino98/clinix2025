import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import { postApi } from '../../../../api/api'
import { toastsuccess, } from '../../../utils/notifications'
import ProtectedRoute from '../../../protected/ProtectedRoute'


const Addform = () => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const user = useSelector((state) => state.auth.user)
    const initialState = {
        description: '',
        subject: '',
        staff: '',
        category: 'Resident',
        resident: '',
        attachment: { name: 'File' }
    }
    const [state, setState] = useState(initialState)
    const residents = useSelector((state) => state.resident.residentList)
    // const staff = useSelector((state) => state.staff.staffList)
    const token = useSelector((state) => state.auth.token).token
    
    const handleReset = () => {
        setValidated(false);
        setState(initialState)
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const formData = new FormData();
            formData.append('attachment', state.attachment);
            formData.append('description', state.description);
            formData.append('subject', state.subject);
            formData.append('staff', state.staff);
            formData.append('category', state.category);
            formData.append('resident', state.resident);
            postApi(_ => {
                toastsuccess("Upload Completed")
                handleReset()
            },
                token, `/api/attachment/`, formData, errors_list => { setErrors(errors_list) })
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

            case 'staff':
                setState({
                    ...state,
                    staff: event.target.value
                })
                break;

            case 'resident':
                setState({
                    ...state,
                    resident: event.target.value
                })
                break;
            case 'subject':
                setState({
                    ...state,
                    subject: event.target.value
                })
                break;
            case 'category':
                setState({
                    ...state,
                    category: event.target.value
                })
                break;
            case 'attachment':
                setState({
                    ...state,
                    attachment: event.target.files[0]
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
                <div className="ms-panel-header ms-panel-custome">
                    <h6>Upload</h6>
                    <ProtectedRoute perm="view_attachments">
                        <Link to="/attacthment">Attachments</Link>
                    </ProtectedRoute>
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
                                        value={state.subject}
                                        type="text"
                                        placeholder="Subject"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label>Description</Form.Label>
                                {errors.description && errors.description.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="description"
                                        onChange={handleChange}
                                        required
                                        value={state.description}
                                        type="text"
                                        as="textarea"
                                        rows={3}
                                        placeholder="Description"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                                <Form.Label>Module</Form.Label>
                                {errors.category && errors.category.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <Form.Control as="select" onChange={handleChange}
                                    name="category"
                                    value={state.category}        >
                                    <option value='Finance' > Finance</option>
                                    <option value='Resident'> Resident</option>
                                    <option value='Home'> Home</option>
                                    <option value='GeneralInfo'> General</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom09">
                                <Form.Label>File</Form.Label>
                                {errors.attachment && errors.attachment.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.File
                                        name="attachment"
                                        label={state.attachment.name}
                                        onChange={handleChange}
                                        lang="en"
                                        custom
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            {/* <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Staff</Form.Label>
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="staff"
                                        value={state.staff}
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
                                        value={state.resident}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {residents.map(resident => (
                                            <option key={resident.national_id} value={resident.national_id}>{resident.first_name} {resident.last_name}</option>
                                        ))}
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

export default Addform;