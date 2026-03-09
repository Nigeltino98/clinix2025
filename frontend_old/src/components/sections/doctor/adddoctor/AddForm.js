import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi, getApi } from '../../../../api/api'
import { toastsuccess } from '../../../utils/notifications'
import ProtectedRoute from '../../../protected/ProtectedRoute'
import { groupActions } from '../../../../store/group'

const initialState = {
    training: '',
    first_name: '',
    last_name: '',
    gender: 'Other', nationality:'',
    date_of_birth: '',
    next_of_kin: '',
    NI_number:'',
    religion:'',
    full_driving_license:'',
    profile_pic: { name: "Choose a photo" },
    mobile: '',
    email: '',
    groups: [],
    address: '',
    category: '',
    homes: '', ethnic_origin: '', marital_status:'', 
}
const Addform = () => {
    const dispatch = useDispatch()
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const groups = useSelector((state) => state.group.groupList)
    const [state, setState] = useState(initialState)
    const [homes, setHomes] = useState([]);

    const handleReset = () => {
        setValidated(false);
        setState(initialState)
    }
    const categories = [
        { value: 'Manager' , label:'Manager' },
        { value: 'Senior Support Worker' , label:'Senior Support Worker' }, //these are the ranks of the staff
        { value: 'Support Worker' , label:'Support Worker' },
        { value: 'Agency Staff' , label:'Agency Staff' },
        { value: 'Banker' , label:'Banker' },
   
       ];

    const ethnicities = [
        { value: 'Asian' , label:'Asian' },
        { value: 'Black' , label:'Black' }, //these are the ethnicities of the staff
        { value: 'Middle-Eastern' , label:'Middle-Eastern' },
        { value: 'White' , label:'White' },
        { value: 'Other' , label:'Other' },
   
       ];

    const boolean = [
        { value: 'Yes', label:'Yes' },
        { value: 'No', label:'No' },
       
       ];



    const [selectedCategory, setSelectedCategory] = useState('');
    const handleSubmit = (event) => {
        setValidated(true);
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const formData = new FormData();
            formData.append('first_name', state.first_name);
            formData.append('last_name', state.last_name);
            formData.append('training', state.training);
            formData.append('groups', state.groups);
            formData.append('gender', state.gender);
            formData.append('next_of_kin', state.next_of_kin);
            formData.append('next_of_kin', state.next_of_kin);
            formData.append('email', state.email);
            formData.append('mobile', state.mobile);
            formData.append('address', state.address);
            formData.append('profile_pic', state.profile_pic);
            formData.append('password', state.last_name);
            formData.append('category', selectedCategory);
            formData.append('homes', state.homes);
            formData.append('ethnic_origin', state.ethnic_origin);
            formData.append('full_driving_license', state.full_driving_license);
            formData.append('marital_status', state.marital_status);
            formData.append('nationality', state.nationality);
            formData.append('religion', state.religion);
            formData.append('NI_number', state.NI_number);

            
            postApi(_ => {
                toastsuccess("Staff added successfully");
                handleReset();
            }, token, `/api/staff/`, formData, errors_list => { setErrors(errors_list) })
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
                    last_name: event.target.value,
                })
                break;

            case 'training':
                setState({
                    ...state,
                    training: event.target.value
                })
                break;

            case 'groups':
                setState({
                    ...state,
                    groups: event.target.value
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

            case 'email':
                setState({
                    ...state,
                    email: event.target.value
                })
                break;

            case 'address':
                setState({
                    ...state,
                    address: event.target.value
                })
                break;


            case 'mobile':
                setState({
                    ...state,
                    mobile: event.target.value
                })
                break;

            case 'profile_pic':
                setState({
                    ...state,
                    profile_pic: event.target.files[0]
                })
                break;

            
            case 'category':
                setState({
                    ...state,
                    category: event.target.value
                })
                break;

            case 'homes':
                setState({
                    ...state,
                    homes: event.target.value
                })
                break;

            case 'ethnic_origin':
                setState({
                    ...state,
                    ethnic_origin: event.target.value
                })
                break;
 
            case 'full_driving_license':
                setState({
                    ...state,
                    full_driving_license: event.target.value
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

            case 'NI_number':
                setState({
                    ...state,
                    NI_number: event.target.value
                })
                break;

            default:

        }
    }

    useEffect(() => {
        getApi(response => { dispatch(groupActions.setGroup(response.data)) }, token, "/api/group")
    }, [token, dispatch])

    useEffect(() => {
     const apiUrl = '/api/home/';
     console.log('Fetching homes...');

     getApi(
        (response) => {
          if (response && response.data) {
            console.log('Homes data:', response.data);
            setHomes(response.data);
          } else {
            console.error('Empty response:', response);
          }
         },
         token,
         apiUrl,
         (error) => {
            console.error('Error fetching homes:', error);
         }
       );
     }, [token]);

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel">
                <div className="ms-panel-header ms-panel-custome">
                    <h6>Add Staff</h6>
                    <ProtectedRoute perm="view_user">
                        <Link to="/staff">Staff List </Link>
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
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                              <Form.Label>Ethnicity</Form.Label>
                              {errors.ethnic_origin && errors.ethnic_origin.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
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
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Nationality</Form.Label>
                                {errors.nationality && errors.nationality.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control  onChange={handleChange}
                                        name="nationality" type="text" required value={state.nationality}
                                        placeholder="Nationality"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                                <Form.Label>Mobile No.</Form.Label>
                                {errors.mobile && errors.mobile.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                       name="mobile"
                                       required
                                       onChange={handleChange}
                                       value={state.mobile}
                                       type="text"
                                       placeholder="Mobile No."
                                     />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                                <Form.Label>Driver's License.</Form.Label>
                                {errors.full_driving_license && errors.full_driving_license.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                       as="select"
                                       name="full_driving_license"
                                       required
                                       onChange={handleChange}
                                       value={state.full_driving_license}
                                       type="text"
                                       placeholder="Valid Drivers license"
                                     >
                                       <option value="">Full Drivers License</option>
                                       {boolean.map((boolean) => (
                                         <option key={boolean.value} value={boolean.label}>
                                           {boolean.label}
                                         </option>
                                      ))}
                                   </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>National Insurance number</Form.Label>
                                {errors.NI_number && errors.NI_number.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control onChange={handleChange} value={state.NI_number}
                                        name="NI_number" type="text" placeholder="National Insurance Number"
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
                                <Form.Label>Gender</Form.Label>
                                {errors.gender && errors.gender.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="gender"
                                    >flaticon-list mr-2
                                        <option value="Other">Other</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Marital Status</Form.Label>
                                {errors.marital_status && errors.marital_status.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="marital_status"
                                    >flaticon-list mr-2
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Separated">Separated</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Religion</Form.Label>
                                {errors.religion && errors.religion.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control onChange={handleChange}
                                        name="religion" value={state.religion} type="text"
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
                                        placeholder="Next of Kin                                        "
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom17">
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
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom11">
                                <Form.Label>Start date</Form.Label>
                                {errors.start_date && errors.start_date.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="start_date"
                                        onChange={handleChange}
                                        type="date"
                                        placeholder="Start Date"
                                        value={state.dob}

                                    />
                                </InputGroup>
                            </Form.Group>
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

                            
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Category</Form.Label>
                                {errors.category && errors.category.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        as="select"
                                        onChange={(event) => setSelectedCategory(event.target.value)}
                                        name="category"
                                        value={selectedCategory}
                                        required
                                    >
                                        <option value="">Position/ Rank</option>
                                        {categories.map((category) => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>House Assigned</Form.Label>
                                {errors.homes && errors.homes.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        as="select"
                                        onChange={handleChange}
                                        name="homes"
                                        value={state.homes}
                                        required
                                    >
                                        <option value="">Select Home to assign</option>
                                        {homes.map((home) => (
                                            <option key={home.id} value={home.id}>
                                                {home.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="reset" variant="warning" className="mt-4 d-inline w-20 mr-2" onClick={handleReset}>Reset</Button>
                        <Button type="submit" className="mt-4 d-inline w-20">Create Staff</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Addform;