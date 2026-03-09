import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { Form, InputGroup, Button, Col, Row } from 'react-bootstrap';
import { postApi, getApi } from '../../../../api/api'
import { toastsuccess } from '../../../utils/notifications'
import ProtectedRoute from '../../../protected/ProtectedRoute'
import { groupActions } from '../../../../store/group'

const initialState = {
    training: '',
    first_name: '',
    last_name: '',
    gender: 'Other', nationality:'',
    start_date: '',
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
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        const formData = new FormData();
        Object.keys(state).forEach((key) => {
            formData.append(key, state[key]);
        });
        formData.append('password', state.last_name);
        formData.append('category', selectedCategory);

        postApi(
            () => {
                toastsuccess('Staff added successfully');
                handleReset();
            },
            token,
            '/api/staff/',
            formData,
            (errors_list) => setErrors(errors_list)
        );
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        setState({
            ...state,
            [name]: files ? files[0] : value,
        });
    };




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

                    <Row>
                        <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                            <Form.Label>First Name</Form.Label>
                            {errors.first_name && errors.first_name.map(err =>
                                <p key={err} className="ms-text-danger">{err}</p>
                            )}
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
                            {errors.last_name && errors.last_name.map(err =>
                                <p key={err} className="ms-text-danger">{err}</p>
                            )}
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
                    </Row>

                    <Row>
                        <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                            <Form.Label>Group</Form.Label>
                            {errors.groups && errors.groups.map(err =>
                                <p key={err} className="ms-text-danger">{err}</p>
                            )}
                            <InputGroup>
                                <Form.Control
                                    as="select"
                                    onChange={handleChange}
                                    name="groups"
                                    value={state.groups}
                                >
                                    <option>=======================</option>
                                    {groups.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </Form.Control>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Ethnicity</Form.Label>
                            {errors.ethnic_origin && errors.ethnic_origin.map(err =>
                                <p key={err} className="ms-text-danger">{err}</p>
                            )}
                            <InputGroup>
                                <Form.Control
                                    as="select"
                                    name="ethnic_origin"
                                    onChange={handleChange}
                                    value={state.ethnic_origin}
                                >
                                    <option value="">Select Ethnicity</option>
                                    {ethnicities.map(e => (
                                        <option key={e.value} value={e.label}>{e.label}</option>
                                    ))}
                                </Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Nationality</Form.Label>
                        {errors.nationality?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Control
                            name="nationality"
                            type="text"
                            required
                            value={state.nationality}
                            onChange={handleChange}
                            placeholder="Nationality"
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Mobile No.</Form.Label>
                        {errors.mobile?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Control
                            name="mobile"
                            type="text"
                            required
                            value={state.mobile}
                            onChange={handleChange}
                            placeholder="Mobile No."
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Driver's License</Form.Label>
                        {errors.full_driving_license?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Select
                            name="full_driving_license"
                            required
                            value={state.full_driving_license}
                            onChange={handleChange}
                          >
                            <option value="">Full Drivers License</option>
                            {boolean.map(item => (
                              <option key={item.value} value={item.label}>
                                {item.label}
                              </option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>National Insurance Number</Form.Label>
                        {errors.NI_number?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Control
                            name="NI_number"
                            type="text"
                            value={state.NI_number}
                            onChange={handleChange}
                            placeholder="National Insurance Number"
                          />
                        </InputGroup>
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        {errors.email?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Control
                            name="email"
                            type="email"
                            required
                            value={state.email}
                            onChange={handleChange}
                            placeholder="Email"
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        {errors.gender?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Select
                            name="gender"
                            value={state.gender}
                            onChange={handleChange}
                          >
                            <option value="">Select Gender</option>
                            <option value="Other">Other</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Marital Status</Form.Label>
                        {errors.marital_status?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Select
                            name="marital_status"
                            value={state.marital_status}
                            onChange={handleChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Separated">Separated</option>
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Religion</Form.Label>
                        {errors.religion?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Control
                            name="religion"
                            type="text"
                            value={state.religion}
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Next of Kin</Form.Label>
                        {errors.next_of_kin?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Control
                            name="next_of_kin"
                            as="textarea"
                            rows={3}
                            required
                            value={state.next_of_kin}
                            onChange={handleChange}
                            placeholder="Next of Kin"
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        {errors.address?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Control
                            name="address"
                            as="textarea"
                            rows={3}
                            value={state.address}
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        {errors.start_date?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Control
                            name="start_date"
                            type="date"
                            value={state.start_date}
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Profile Picture</Form.Label>
                        {errors.profile_pic?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <Form.Control
                          name="profile_pic"
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Category</Form.Label>
                        {errors.category?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Select
                            name="category"
                            value={selectedCategory}
                            required
                            onChange={(e) => setSelectedCategory(e.target.value)}
                          >
                            <option value="">Position / Rank</option>
                            {categories.map(category => (
                              <option key={category.value} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>House Assigned</Form.Label>
                        {errors.homes?.map(err => (
                          <p key={err} className="ms-text-danger">{err}</p>
                        ))}
                        <InputGroup>
                          <Form.Select
                            name="homes"
                            value={state.homes}
                            required
                            onChange={handleChange}
                          >
                            <option value="">Select Home to assign</option>
                            {homes.map(home => (
                              <option key={home.id} value={home.id}>
                                {home.name}
                              </option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Row>

                    <Button
                        type="reset"
                        variant="warning"
                        className="mt-4 d-inline w-20 mr-2"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>

                    <Button type="submit" className="mt-4 d-inline w-20">
                        Create Staff
                    </Button>

                </Form>
            </div>
        </div>
    </div>
           );
};

export default Addform;

