import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi, getApi } from '../../api/api';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
//import '../../assets/css/AddHouseStock.css'; // Update the CSS file if needed
import { toastsuccess } from '../utils/notifications';

const initialState = {
  name: '',
  description: '',
  date_of_acquisition: '',
  recorded_by: '', // Dynamically populate this field with the logged-in user's name
  quantity: '',
  expiry_date:'',
  house:'',
  perish_nonperish:'non-perishable',
};

const categories = [
   { id: 1, name: 'Perishable' },
   { id: 2, name: 'Non-Perishable' },
];

const AddHouseStock = () => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token).token;

  const [state, setState] = useState(initialState);
  const [homes, setHomes] = useState([]);
  const history = useHistory();


  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      recorded_by: user.id,
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

  


  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      postApi(
        (response) => {
          console.log('House stock added:', response.data);
          toastsuccess('House Stock added successfully');
        },
        token,
        '/api/house-stock/',
        state,
        (errors_list) => {
          setErrors(errors_list);
        }
      );
    }
    setValidated(true);
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleGoBack = () => {
     
     history.goBack();
   };

  return (
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-bshadow-none">
        <div className="ms-panel-body">
          <h2 className="text-center line-between">
            Add Stock for a House
          </h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                <Form.Label>Stock Name</Form.Label>
                {errors.name && errors.name.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="name"
                    required
                    onChange={handleChange}
                    value={state.name}
                    type="text"
                    placeholder="Stock Name"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                <Form.Label>Description</Form.Label>
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
                <Form.Label>Date of Acquisition</Form.Label>
                {errors.date_of_acquisition && errors.date_of_acquisition.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="date_of_acquisition"
                    required
                    onChange={handleChange}
                    value={state.date_of_acquisition}
                    type="date"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                <Form.Label>Quantity</Form.Label>
                {errors.quantity && errors.quantity.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="quantity"
                    required
                    onChange={handleChange}
                    value={state.quantity}
                    type="text"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                <Form.Label>Expiry Date</Form.Label>
                {errors.expiry_date && errors.expiry_date.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="expiry_date"
                    required
                    onChange={handleChange}
                    value={state.expiry_date}
                    type="date"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                <Form.Label>House</Form.Label>
                {errors.house && errors.house.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    as="select"
                    name="house"
                    //required
                    onChange={handleChange}
                    value={state.house}
                    type="text"
                   >
                       <option value="">Select Home</option>
                       {homes.map((home) => (
                          <option key={home.id} value={home.id}>
                             {home.name}
                          </option>
                      ))}
                  </Form.Control>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                <Form.Label>Perishable/ Non Perishable</Form.Label>
                {errors.perish_nonperish && errors.perish_nonperish.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    as="select"
                    name="perish_nonperish"
                    required
                    onChange={handleChange}
                    value={state.perish_nonperish}
                    type="text"
                  >
                     <option vallaue=""> If Perishable </option>
                     {categories.map((category) => (
                       <option key={category.id} value={category.name}>
                         {category.name}
                       </option>
                    ))}
                  </Form.Control>
                </InputGroup>
              </Form.Group>
            </Form.Row>
            <Button type="submit" className="mt-4 d-inline w-20 mr-2 disabled={validated}" >Save</Button>
            <button type="button" onClick={handleGoBack} className="btn btn-primary">Back</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddHouseStock;
