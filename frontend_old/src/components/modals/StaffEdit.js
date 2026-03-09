import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { putApi, getApi } from '../../api/api'
import { groupActions } from '../../store/group'

const StaffEdit = (props) => {
    const dispatch = useDispatch()
    const [showEdit, setshowEdit] = useState(false)
    const [showdelete, setshowdelete] = useState("")
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const selected_staff = useSelector((selected_staff) => selected_staff.staff.selectedStaff)
    const groups = useSelector((state) => state.group.groupList)
    const token = useSelector((state) => state.auth.token).token
    const tt = { ...selected_staff }
    Object.keys(tt).forEach(function (key) {
        if (tt[key] === null || tt[key] === "undefined") {
            tt[key] = '';
        }
        if (key === "groups") {
            if (tt[key].length > 0) {
                tt[key] = tt[key][0].id
            } else {
                tt[key] = ''
            }
        }
    })
    delete tt["start_date"]
    const [state, setState] = useState(tt)
    console.log(state)
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();

        } else {
            const data = { ...state }
            if (typeof state.profile_pic === 'string') {
                delete data["profile_pic"]
                putApi(_ => { props.handleClose() }, token, `/api/staff/`, data, data.id, errors_list => { setErrors(errors_list) })

            } else {
                const formData = new FormData();
                formData.append('first_name', state.first_name);
                formData.append('last_name', state.last_name);
                formData.append('training', state.training);
                formData.append('groups', state.groups);
                formData.append('gender', state.gender);
                formData.append('next_of_kin', state.next_of_kin);
                formData.append('email', state.email);
                formData.append('mobile', state.mobile);
                formData.append('address', state.address);
                formData.append('location', state.location);
                formData.append('dob', state.dob);
                formData.append('marital_status', state.marital_status);
                formData.append('NHS_number', state.NHS_number);
                formData.append('religion', state.religion);
                formData.append('nationality', state.nationality);
                formData.append('tel1', state.tel1);
                formData.append('tel2', state.tel2);
                formData.append('ethnic_origin', state.ethnic_origin);
                formData.append('job_title', state.job_title);
                formData.append('department', state.department);
                formData.append('NI_number', state.NI_number);
                formData.append('pova_checked', state.pova_checked);
                formData.append('smoker', state.smoker);
                formData.append('full_driving_license', state.full_driving_license);
                formData.append('is_active', state.is_active);
                formData.append('is_staff', state.is_staff);
                formData.append('is_archived', state.is_archived);
                formData.append('profile_pic', state.profile_pic);
                putApi(_ => { props.handleClose() }, token, `/api/staff/`, formData, data.id, errors_list => { setErrors(errors_list) })
            }
        }

        setValidated(true);

    };


    const handleChange = (event) => {
        switch (event.target.name) {

            case 'first_name':
                setState({
                    ...state,
                    first_name: event.target.value
                })
                break;

            case 'last_name':
                setState({
                    ...state,
                    last_name: event.target.value
                })
                break;

            case 'training':
                setState({
                    ...state,
                    training: event.target.value
                })
                break;

            case 'gender':
                setState({
                    ...state,
                    gender: event.target.value
                })
                break;

            case 'next_of_kin':
                setState({
                    ...state,
                    next_of_kin: event.target.value
                })
                break;
            case 'groups':
                setState({
                    ...state,
                    groups: event.target.value
                })
                break;

            case 'email':
                setState({
                    ...state,
                    email: event.target.value
                })
                break;

            case 'mobile':
                setState({
                    ...state,
                    mobile: event.target.value
                })
                break;

            case 'address':
                setState({
                    ...state,
                    address: event.target.value
                })
                break;
            case 'location':
                setState({
                    ...state,
                    location: event.target.value
                })
                break;

            case 'dob':
                setState({
                    ...state,
                    dob: event.target.value
                })
                break;

            case 'NHS_number':
                setState({
                    ...state,
                    NHS_number: event.target.value
                })
                break;
            case 'marital_status':
                setState({
                    ...state,
                    marital_status: event.target.value
                })
                break;

            case 'nationality':
                setState({
                    ...state,
                    nationality: event.target.value
                })
                break;

            case 'religion':
                setState({
                    ...state,
                    religion: event.target.value
                })
                break;
            case 'ethnic_origin':
                setState({
                    ...state,
                    ethnic_origin: event.target.value
                })
                break;

            case 'tel1':
                setState({
                    ...state,
                    tel1: event.target.value
                })
                break;

            case 'tel2':
                setState({
                    ...state,
                    tel2: event.target.value
                })
                break;

            case 'job_title':
                setState({
                    ...state,
                    job_title: event.target.value
                })
                break;
            case 'department':
                setState({
                    ...state,
                    department: event.target.value
                })
                break;

            case 'NI_number':
                setState({
                    ...state,
                    NI_number: event.target.value
                })
                break;

            case 'pova_checked':
                setState({
                    ...state,
                    pova_checked: event.target.value
                })
                break;
            case 'smoker':
                setState({
                    ...state,
                    smoker: event.target.value
                })
                break;

            case 'full_driving_license':
                setState({
                    ...state,
                    full_driving_license: event.target.value
                })
                break;

            case 'start_date':
                setState({
                    ...state,
                    start_date: event.target.value
                })
                break;

            case 'profile_pic':
                setState({
                    ...state,
                    profile_pic: event.target.files[0]
                })
                break;

            default:

        }
    }
    useEffect(() => {
        getApi(response => { dispatch(groupActions.setGroup(response.data)) }, token, "/api/group")
    }, [showdelete, showEdit, token, dispatch])
    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-header">
                    <h6>Staff Information</h6>
                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label>First Name</Form.Label>
                                {errors.first_name && errors.first_name.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="first_name"
                                        onChange={handleChange}
                                        required
                                        value={state.first_name}
                                        type="text"
                                        placeholder="Enter First Name"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Last Name</Form.Label>
                                {errors.last_name && errors.last_name.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="last_name"
                                        required
                                        onChange={handleChange}
                                        value={state.last_name}
                                        type="text"
                                        placeholder="Enter Last Name"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                                <Form.Label>Job Role</Form.Label>
                                {errors.training && errors.training.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="training"
                                        onChange={handleChange}
                                        value={state.training}
                                        type="text"
                                        placeholder="Training"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Group</Form.Label>
                                {errors.groups && errors.groups.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="groups"
                                        value={state.groups}
                                    >
                                        <option key="2a">======================= </option>
                                        {groups.map(item => (
                                            <option key={item.id} value={item.id}>{item.name} </option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                                <Form.Label>Phone No.</Form.Label>
                                {errors.mobile && errors.mobile.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="mobile"
                                        required
                                        onChange={handleChange}
                                        value={state.mobile}
                                        type="text"
                                        placeholder="Phone No."
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom05">
                                <Form.Label>Email</Form.Label>
                                {errors.email && errors.email.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="email"
                                        required
                                        onChange={handleChange}
                                        value={state.email}
                                        type="email"
                                        placeholder="Email"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Next of Kin</Form.Label>
                                {errors.next_of_kin && errors.next_of_kin.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="next_of_kin"
                                        required
                                        onChange={handleChange}
                                        value={state.next_of_kin}
                                        type="text"
                                        as="textarea"
                                        rows={3}
                                        placeholder="Next of Kin"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Gender</Form.Label>
                                {errors.gender && errors.gender.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="gender"
                                        value={state.gender}
                                    >
                                        <option value="Other">=================</option>
                                        <option value="Other">Other</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom1">
                                <Form.Label>Add Address</Form.Label>
                                {errors.address && errors.address.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="address"
                                        onChange={handleChange}
                                        as="textarea" rows={3}
                                        value={state.address}

                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Location</Form.Label>
                                {errors.location && errors.location.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="location"
                                        onChange={handleChange}
                                        value={state.location}
                                        type="text"
                                        placeholder="Location"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom17">
                                <Form.Label>Date Of Birth</Form.Label>
                                {errors.dob && errors.dob.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="dob"
                                        required
                                        onChange={handleChange}
                                        type="date"
                                        placeholder="Date Of Birth"
                                        value={state.dob}

                                    />
                                </InputGroup>
                            </Form.Group>

                        </Form.Row>
                        <Form.Row>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>NHS Number</Form.Label>
                                {errors.NHS_number && errors.NHS_number.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="NHS_number"
                                        required
                                        onChange={handleChange}
                                        value={state.NHS_number}
                                        type="text"
                                        placeholder="Location"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom12">
                                <Form.Label>Marital Status</Form.Label>
                                {errors.marital_status && errors.marital_status.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="marital_status"
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Marital Status"
                                        value={state.marital_status}

                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Nationality</Form.Label>
                                {errors.nationality && errors.nationality.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="nationality"
                                        required
                                        onChange={handleChange}
                                        value={state.nationality}
                                        type="text"
                                        placeholder="Nationality"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="9">
                                <Form.Label>Religion</Form.Label>
                                {errors.religion && errors.religion.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="religion"
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Religion"
                                        value={state.religion}

                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Ethnic Origin</Form.Label>
                                {errors.ethnic_origin && errors.ethnic_origin.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="ethnic_origin"
                                        onChange={handleChange}
                                        value={state.ethnic_origin}
                                        type="text"
                                        placeholder="Ethnic Origin"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom13">
                                <Form.Label>Telephone 1</Form.Label>
                                {errors.tel1 && errors.tel1.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="tel1"
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Telephone 1"
                                        value={state.tel1}

                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Telephone 2</Form.Label>
                                {errors.tel2 && errors.tel2.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="tel2"
                                        onChange={handleChange}
                                        value={state.tel2}
                                        type="text"
                                        placeholder="Telephone 2"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom14">
                                <Form.Label>Job Title</Form.Label>
                                {errors.job_title && errors.job_title.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="job_title"
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Job Title"
                                        value={state.job_title}

                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Department</Form.Label>
                                {errors.department && errors.department.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="department"
                                        required
                                        onChange={handleChange}
                                        value={state.department}
                                        type="text"
                                        placeholder="Department"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom14">
                                <Form.Label>NI Number</Form.Label>
                                {errors.NI_number && errors.NI_number.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="NI_number"
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="NI Number"
                                        value={state.NI_number}

                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>POVA Checked</Form.Label>
                                {errors.pova_checked && errors.pova_checked.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select"
                                        name="pova_checked"
                                        onChange={handleChange}
                                        value={state.pova_checked}
                                    >
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom15">
                                <Form.Label>Smoker</Form.Label>
                                {errors.smoker && errors.smoker.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select"
                                        name="smoker"
                                        onChange={handleChange}
                                        value={state.smoker}
                                    >
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Full Driving License</Form.Label>
                                {errors.full_driving_license && errors.full_driving_license.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select"
                                        name="full_driving_license"
                                        onChange={handleChange}
                                        value={state.full_driving_license}
                                    >
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom09">
                                <Form.Label>Profile Pic</Form.Label>
                                {errors.profile_pic && errors.profile_pic.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.File
                                        name="profile_pic"
                                        label={typeof state.profile_pic === 'string' ? state.profile_pic : state.profile_pic.name}
                                        onChange={handleChange}
                                        lang="en"
                                        custom
                                        accept="image/*"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="submit" className="mt-4 d-inline w-20">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default StaffEdit;