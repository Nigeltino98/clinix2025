import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { postApi, getApi } from '../../api/api';
import { repairActions } from '../../store/repairs';
import { toastsuccess } from '../utils/notifications';

const today = new Date().toISOString().split('T')[0]; // Get today's date in 'yyyy-mm-dd' format
const initialState = {
  asset_type: '',
  asset_name: '',
  date_reported: today,
  reminder_date: '',
  status: 'Pending',
  priority_level: '',
  house: '',
  photos: { name: "Add a photo" }, 
  attachments:  {name: "Add any supporting attachment" },
  description: '',
};

const categories = [
  { id: 1, name: 'House Furniture' },
  { id: 2, name: 'House Machinery' },
  { id: 3, name: 'Vehicles' },
  { id: 4, name: 'Cleaning Equipment' },
  { id: 5, name: 'Electrical Gadgets' },
  { id: 6, name: 'General/Other..' },
];

const AddHouseRepair = () => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token).token;

  const [homes, setHomes] = useState([]);

  const [state, setState] = useState(initialState);
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const formData = new FormData();
      formData.append('asset_type', state.asset_type);
      formData.append('asset_name', state.asset_name);
      formData.append('date_reported', state.date_reported);
      formData.append('reminder_date', state.reminder_date);
      formData.append('status', state.status);
      formData.append('priority_level', state.status);
      formData.append('house', state.house);
      formData.append('description', state.description);
      formData.append('photos', state.photos); // Append the file
      formData.append('attachments', state.attachments); // Append the file

      postApi(
        (response) => {
          console.log('Asset repair form added:', response.data);
          toastsuccess('Asset repair form added successfully');
        },
        token,
        '/api/repair-record/',
        formData, // Send the formData object
        (errors_list) => {
          setErrors(errors_list);
        }
      );
    }
    setValidated(true);
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    // Handle file inputs separately
    if (name === 'photos' || name === 'attachments') {
      setState({
        ...state,
        [name]: files[0], // Update with the selected file
      });
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }

  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      recorded_by: user.id,
      recorded_on: new Date().toISOString(),
    }));
  }, [user]);

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

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-bshadow-none">
        <div className="ms-panel-body">
          <h2
            className="text-center line-between"
            style={{
              fontSize: '26px',
              fontWeight: 'bold',
              color: 'teal',
              position: 'relative',
              backgroundColor: 'black',
              bottom: '-5px',
            }}
          >
            Please fill in the details as required for the asset/equipment that needs to be repaired
          </h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Row>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                <Form.Label>Asset/Equipment</Form.Label>
                {errors.asset_name && errors.asset_name.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="asset_name"
                    required
                    onChange={handleChange}
                    value={state.asset_name}
                    type="text"
                    placeholder="Name"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                <Form.Label>Asset Type</Form.Label>
                {errors.asset_type && errors.asset_type.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    as="select"
                    name="asset_type"
                    required
                    onChange={handleChange}
                    value={state.asset_type}
                    type="text"
                    placeholder="Asset Class"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Control>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                <Form.Label>Fault description</Form.Label>
                {errors.description && errors.description.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="description"
                    required
                    onChange={handleChange}
                    value={state.description}
                    type="text"
                    placeholder="Description"
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                <Form.Label>Date Reported</Form.Label>
                {errors.date_reported && errors.date_reported.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="date_reported"
                    required
                    onChange={handleChange}
                    value={state.date_reported}
                    type="date"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                <Form.Label>Reminder Date</Form.Label>
                {errors.reminder_date && errors.reminder_date.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="reminder_date"
                    required
                    onChange={handleChange}
                    value={state.reminder_date}
                    type="date"
                    placeholder="Date of completion"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom05">
                <Form.Label>Status</Form.Label>
                {errors.status && errors.status.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    as="select"
                    name="status"
                    onChange={handleChange}
                    value={state.status}
                    type="text"
                    placeholder="Progress of repair"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Form.Control>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom05">
                <Form.Label>Priority Level</Form.Label>
                {errors.priority_level && errors.priority_level.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    as="select"
                    name="priority_level"
                    onChange={handleChange}
                    value={state.priority_level}
                    type="text"
                    placeholder="Level of Priority"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Control>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                <Form.Label>Home</Form.Label>
                {errors.house && errors.house.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    as="select"
                    name="house"
                    onChange={handleChange}
                    value={state.house}
                  >
                    <option value="">Select home</option>
                    {homes.map((home) => (
                      <option key={home.id} value={home.id}>
                        {home.name}
                      </option>
                    ))}
                  </Form.Control>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                <Form.Label>Asset Photo</Form.Label>
                {errors.photos && errors.photos.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.File
                    name="photos"
                    required
                    onChange={handleChange}
                    label={state.photos ? state.photos.name : "Add a photo"} // Display the file name if selected
                    lang="en"
                    custom
                    accept="image/*"
                  />
                </InputGroup>
              </Form.Group> 
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom05">
                <Form.Label>Attachments</Form.Label>
                {errors.attachments && errors.attachments.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.File
                    name="attachments"
                    label={state.attachments ? state.attachments.name : "Add any supporting attachment"} // Display the file name if selected
                    onChange={handleChange}
                    type="file"
                    custom
                  />
                </InputGroup>
              </Form.Group>
            </Form.Row>
            <Button type="submit" className="mt-4 d-inline w-20 mr-2">Save</Button>
            <button type="button" onClick={handleGoBack} className="btn btn-primary">Back</button>
                 
          </Form>
        </div>
      </div>
    </div>
   );
}

export default AddHouseRepair;