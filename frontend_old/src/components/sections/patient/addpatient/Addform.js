import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import { postApi } from '../../../../api/api'
import { toastsuccess } from '../../../utils/notifications'
import { min_date, max_date } from '../../../utils/dob'
import ProtectedRoute from '../../../protected/ProtectedRoute'

const initialState = {
    national_id: '',
    first_name: '',
    last_name: '',
    gender: 'Other',
    date_of_birth: '',
    room: '',
    home: '',
    profile_pic: { name: "Choose a photo" },
    phone: '',
    NHS_number: '',
    email: '',
    address: '',
    height: '',
    next_of_kin: '',
    allergies: '',
    clinical_diagnosis: '',
    risk:'',
    date_of_admission: '',
    ethnic_origin: '',
    medical_condition: '',
    marital_status: '',
    dentist_name: '',
    dentist_phone: '',
    dentist_address: '',
    gp_name: '',
    gp_phone: '',
    gp_address: '',
    sw_name: '',
    sw_phone: '',
    sw_address: '',
    pharma_name: '',
    pharma_phone: '',
    pharma_address: '',


}
const Addform = () => {

    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const [state, setState] = useState(initialState)
    const token = useSelector((state) => state.auth.token).token
    const homes = useSelector((state) => state.home.homeList)
    const handleReset = () => {
        setValidated(false);
        setState(initialState)
    }

    const ethnicities = [
        { value: 'Asian' , label:'Asian' },
        { value: 'Black' , label:'Black' }, //these are the ethnicities of the staff
        { value: 'Middle-Eastern' , label:'Middle-Eastern' },
        { value: 'White' , label:'White' },
        { value: 'Other' , label:'Other' },

       ];
    const handleSubmit = (event) => {
        setValidated(true);
        const form = event.currentTarget;
        const formData = new FormData();
        formData.append('national_id', state.national_id);
        formData.append('NHS_number', state.NHS_number);
        formData.append('first_name', state.first_name);
        formData.append('last_name', state.last_name);
        formData.append('gender', state.gender);
        formData.append('date_of_birth', state.date_of_birth);
        formData.append('room', state.room);
        formData.append('home', state.home);
        formData.append('profile_pic', state.profile_pic);
        formData.append('phone', state.phone);
        formData.append('email', state.email);
        formData.append('address', state.address);
        formData.append('height', state.height);
        formData.append('next_of_kin', state.next_of_kin);
        formData.append('allergies', state.allergies);
        formData.append('risk', state.risk);
        formData.append('clinical_diagnosis', state.clinical_diagnosis);
        formData.append('medical_condition', state.medical_condition);
        formData.append('marital_status', state.marital_status);
        formData.append('date_of_admission', state.date_of_admission);
        formData.append('ethnic_origin', state.ethnic_origin);
        formData.append('dentist_name', state.dentist_name);
        formData.append('dentist_phone', state.dentist_phone);
        formData.append('dentist_address', state.dentist_address);
        formData.append('gp_name', state.gp_name);
        formData.append('gp_phone', state.gp_phone);
        formData.append('gp_address', state.gp_address);
        formData.append('sw_name', state.sw_name);
        formData.append('sw_phone', state.sw_phone);
        formData.append('sw_address', state.sw_address);
        formData.append('pharma_name', state.pharma_name);
        formData.append('pharma_phone', state.pharma_phone);
        formData.append('pharma_address', state.pharma_address);


        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(_ => {
                toastsuccess("Resident added successfully");
                handleReset();
            }, token, `/api/resident/`, formData, errors_list => { setErrors(errors_list) })
        }


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

            case 'national_id':
                setState({
                    ...state,
                    national_id: event.target.value
                })
                break;

            case 'NHS_number':
                setState({
                    ...state,
                    NHS_number: event.target.value
                })
                break;

            case 'gender':
                setState({
                    ...state,
                    gender: event.target.value
                })
                break;

            case 'date_of_birth':
                setState({
                    ...state,
                    date_of_birth: event.target.value
                })
                break;

            case 'room':
                setState({
                    ...state,
                    room: event.target.value
                })
                break;

            case 'home':
                setState({
                    ...state,
                    home: event.target.value
                })
                break;

            case 'profile_pic':
                setState({
                    ...state,
                    profile_pic: event.target.files[0]
                })
                break;

            case 'email':
                setState({
                    ...state,
                    email: event.target.value
                })
                break;

            case 'phone':
                setState({
                    ...state,
                    phone: event.target.value
                })
                break;

            case 'address':
                setState({
                    ...state,
                    address: event.target.value
                })
                break;

            case 'height':
                setState({
                    ...state,
                    height: event.target.value
                })
                break;

            case 'next_of_kin':
		        setState({
		            ...state,
                    next_of_kin: event.target.value
		        })
                break;

            case 'allergies':
                setState({
                    ...state,
                    allergies: event.target.value
                })
                break;

            case 'clinical_diagnosis' :
                setState({
                    ...state,
                    clinical_diagnosis: event.target.value
                })
                break;

            case 'medical_condition'  :
                setState({
                    ...state,
                    medical_condition: event.target.value
                })
                break;

            case 'ethnic_origin' :
                setState({
                    ...state,
                    ethnic_origin: event.target.value
                })
                break;

            case 'marital_status' :
                setState({
                    ...state,
                    marital_status: event.target.value
                })
                break;

            case 'risk' :
                setState({
                    ...state,
                    risk: event.target.value
                })
                break;

            case 'dentist_name':
		        setState({
		            ...state,
                    dentist_name: event.target.value
		        })
                break;

            case 'date_of_admission'   :
                setState({
                    ...state,
                    date_of_admission: event.target.value
                })
                break;

            case 'dentist_phone':
		        setState({
		            ...state,
                    dentist_phone: event.target.value
                })
                break;

            case 'dentist_address':
		        setState({
		            ...state,
                    dentist_address: event.target.value
		        })
		        break;

            case 'gp_name':
		        setState({
		            ...state,
                    gp_name: event.target.value
		        })
                break;

            case 'gp_phone':
		        setState({
		            ...state,
                    gp_phone: event.target.value
                })
                break;

            case 'gp_address':
		        setState({
		            ...state,
                    gp_address: event.target.value
		        })
		        break;

            case 'sw_name':
		        setState({
		            ...state,
                    sw_name: event.target.value
		        })
                break;

            case 'sw_phone':
		        setState({
		            ...state,
                    sw_phone: event.target.value
                })
                break;

            case 'sw_address':
		        setState({
		            ...state,
                    sw_address: event.target.value
		        })
		        break;

            case 'pharma_name':
		        setState({
		            ...state,
                    pharma_name: event.target.value
		        })
                break;

            case 'pharma_phone':
		        setState({
		            ...state,
                    pharma_phone: event.target.value
                })
                break;

            case 'pharma_address':
		        setState({
		            ...state,
                    pharma_address: event.target.value
		        })
		        break;
            default:

        }
    }


    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel">
                <div className="ms-panel-header ms-panel-custome">
                    <h6>Add Resident</h6>
                    <ProtectedRoute perm="view_resident">
                        <Link to="/resident">Resident List </Link>
                    </ProtectedRoute>
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
                                <Form.Label>Surname</Form.Label>
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
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                                <Form.Label>NI Number</Form.Label>
                                {errors.national_id && errors.national_id.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="national_id"
                                        required
                                        onChange={handleChange}
                                        value={state.national_id}
                                        type="text"
                                        placeholder="NI Number"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                                <Form.Label>NHS Number</Form.Label>
                                {errors.NHS_number && errors.NHS_number.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="NHS_number"
                                        required
                                        onChange={handleChange}
                                        value={state.NHS_number}
                                        type="text"
                                        placeholder="NHS Number"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom10">
                                <Form.Label>Date of Admission</Form.Label>
                                {errors.date_of_admission && errors.date_of_admission.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="date_of_admission"
                                        required
                                        min={min_date()}
                                        max={max_date()}
                                        onChange={handleChange}
                                        value={state.date_of_admission}
                                        type="date"
                                        placeholder="Admission Date"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Clinical Diagnosis</Form.Label>
                                {errors.clinical_diagnosis && errors.clinical_diagnosis.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="clinical_diagnosis"
                                        onChange={handleChange}
                                        value={state.clinical_diagnosis}
                                        type="text"
                                        placeholder="Clinical Diagnosis"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Medical Condition</Form.Label>
                                {errors.medical_condition && errors.medical_condition.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="medical_condition"
                                        onChange={handleChange}
                                        value={state.medical_condition}
                                        type="text"
                                        placeholder="Medical Condition"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Risk</Form.Label>
                                {errors.risk && errors.risk.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="risk"
                                        onChange={handleChange}
                                        value={state.risk}
                                        type="text"
                                        placeholder="Risk associated with resident"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Allergies</Form.Label>
                                {errors.allergies && errors.allergies.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="allergies"
                                        onChange={handleChange}
                                        value={state.allergies}
                                        type="text"
                                        placeholder="Allergies"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Ethnicity</Form.Label>
                                {errors.ethnic_origin && errors.ethnic_origin.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        as="select"
                                        name="ethnic_origin"
                                        onChange={handleChange}
                                        value={state.ethnic_origin}
                                        type="text"
                                        placeholder="Ethnicity"
                                    >
                                      <option value="">Select Ethnicity</option>
                                         {ethnicities.map((ethnicity) => (
                                           <option key={ethnicity.value} value={ethnicity.label}>
                                             {ethnicity.label}
                                           </option>
                                         ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Marital Status</Form.Label>
                                {errors.marital_status && errors.marital_status.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        as="select"
                                        name="marital_status"
                                        onChange={handleChange}
                                        value={state.marital_status}
                                        placeholder="Marital Status"

                                    >flaticon-list mr-2
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Separated">Separated</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                                <Form.Label>Phone No.</Form.Label>
                                {errors.phone && errors.phone.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="phone"
                                        onChange={handleChange}
                                        value={state.phone}
                                        type="number"
                                        placeholder="Phone No."
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom05">
                                <Form.Label>Email</Form.Label>
                                {errors.email && errors.email.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="email"
                                        onChange={handleChange}
                                        value={state.email}
                                        type="email"
                                        placeholder="Email"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Home</Form.Label>
                                {errors.home && errors.home.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="home"
                                    >
                                        <option > ======================= </option>

                                        {homes.map(home => (
                                            <option key={home.id} value={home.id}>{home.name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            {/*<Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom08">
                                <Form.Label>Room</Form.Label>
                                {errors.room && errors.room.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="room"
                                        required
                                        onChange={handleChange}
                                        value={state.room}
                                        type="text"
                                        placeholder="Room Number"
                                    />
                                </InputGroup>
                            </Form.Group>*/}
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom09">
                                <Form.Label>Profile Pic</Form.Label>
                                {errors.profile_pic && errors.profile_pic.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.File
                                        name="profile_pic"
                                        label={state.profile_pic.name}
                                        onChange={handleChange}
                                        lang="en"
                                        custom
                                        accept="image/*"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom10">
                                <Form.Label>Date of Birth</Form.Label>
                                {errors.date_of_birth && errors.date_of_birth.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="date_of_birth"
                                        required
                                        min={min_date()}
                                        max={max_date()}
                                        onChange={handleChange}
                                        value={state.date_of_birth}
                                        type="date"
                                        placeholder="Date of Birth"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Gender</Form.Label>
                                {errors.gender && errors.gender.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="gender"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom11">
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
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Height</Form.Label>
                                {errors.height && errors.height.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="height"
                                        required
                                        min={0}
                                        max={3}
                                        step={0.01}
                                        onChange={handleChange}
                                        value={state.height}
                                        type="number"
                                        placeholder="Height"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom12">
                                <Form.Label>Next of Kin</Form.Label>
                                {errors.next_of_kin && errors.next_of_kin.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="next_of_kin"
                                        onChange={handleChange}
                                        value={state.next_of_kin}
                                        type="text"
                                        placeholder="Next of Kin"
                                   />
                               </InputGroup>
                           </Form.Group>
                           <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom13">
                                <Form.Label>Dentist Name</Form.Label>
                                {errors.dentist_name && errors.dentist_name.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="dentist_name"
                                        onChange={handleChange}
                                        value={state.dentist_name}
                                        type="text"
                                        placeholder="Dentist name"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom14">
                                <Form.Label>Dentist Phone number</Form.Label>
                                {errors.dentist_phone && errors.dentist_phone.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="dentist_phone"
                                        onChange={handleChange}
                                        value={state.dentist_phone}
                                        type="text"
                                        placeholder="Dentist Phone Number"
                                   />
                               </InputGroup>
                           </Form.Group>
                           <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom15">
                                <Form.Label>Dentist Address</Form.Label>
                                {errors.dentist_address && errors.dentist_address.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="dentist_address"
                                        onChange={handleChange}
                                        value={state.dentist_address}
                                        type="text"
                                        placeholder="Dentist Address"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom16">
                                <Form.Label>General Practitioner</Form.Label>
                                {errors.gp_name && errors.gp_name.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="gp_name"
                                        onChange={handleChange}
                                        value={state.gp_name}
                                        type="text"
                                        placeholder="General Practitioner"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom17">
                                <Form.Label>GP Phone number</Form.Label>
                                {errors.gp_phone && errors.gp_phone.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="gp_phone"
                                        onChange={handleChange}
                                        value={state.gp_phone}
                                        type="text"
                                        placeholder="GP Phone Number"
                                   />
                               </InputGroup>
                           </Form.Group>
                           <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom18">
                                <Form.Label>GP Address</Form.Label>
                                {errors.gp_address && errors.gp_address.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="gp_address"
                                        onChange={handleChange}
                                        value={state.gp_address}
                                        type="text"
                                        placeholder="GP Address"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom19">
                                <Form.Label>Social Worker Name</Form.Label>
                                {errors.sw_name && errors.sw_name.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="sw_name"
                                        onChange={handleChange}
                                        value={state.sw_name}
                                        type="text"
                                        placeholder="Social Worker"
                                   />
                               </InputGroup>
                           </Form.Group>
                           <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom20">
                                <Form.Label>Social Worker Phone</Form.Label>
                                {errors.sw_phone && errors.sw_phone.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="sw_phone"
                                        onChange={handleChange}
                                        value={state.sw_phone}
                                        type="text"
                                        placeholder="Social Worker Phone number"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom21">
                                <Form.Label>Social Worker Address</Form.Label>
                                {errors.sw_address && errors.sw_address.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="sw_address"
                                        onChange={handleChange}
                                        value={state.sw_address}
                                        type="text"
                                        placeholder="Social Worker Address"
                                   />
                               </InputGroup>
                           </Form.Group>
                           <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom22">
                                <Form.Label>Pharmacist's Name</Form.Label>
                                {errors.pharma_name && errors.pharma_name.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="pharma_name"
                                        onChange={handleChange}
                                        value={state.pharma_name}
                                        type="text"
                                        placeholder="Pharmacist Name"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom23">
                                <Form.Label>Pharmacist Phone number</Form.Label>
                                {errors.pharma_phone && errors.pharma_phone.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="pharma_phone"
                                        onChange={handleChange}
                                        value={state.pharma_phone}
                                        type="text"
                                        placeholder="Pharmacist Phone Number"
                                   />
                               </InputGroup>
                           </Form.Group>
                           <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom24">
                                <Form.Label>Pharmacist Address</Form.Label>
                                {errors.pharma_address && errors.pharma_address.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="pharma_address"
                                        onChange={handleChange}
                                        value={state.pharma_address}
                                        type="text"
                                        placeholder="Pharmacist Address"
                                    />
                                </InputGroup>
                            </Form.Group>


                        </Form.Row>
                        <Button type="reset" variant="warning" className="mt-4 d-inline w-20 mr-2" onClick={handleReset}>Reset</Button>
                        <Button type="submit" className="mt-4 d-inline w-20">Create Resident</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Addform;