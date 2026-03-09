import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi, getApi } from '../../api/api';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toastsuccess } from '../utils/notifications';

const initialState = {
  name: '',
  serial_number: '',
  date_of_acquisition: '',
  condition: '',
  location: '',
  recorded_by: '',
  recorded_on: '',
  category: '',
  value: '',
};

const categories = [
  { id: 1, name: 'Furniture' },
  { id: 2, name: 'Machinery' },
  { id: 3, name: 'Vehicles' },
  { id: 4, name: 'Cleaning Equipment' },
  { id: 5, name: 'Electrical Gadgets' },
  { id: 6, name: 'General/Other' },
];

const AddHouseAsset = () => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token).token;

  const [homes, setHomes] = useState([]);
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      postApi(
        () => {
          toastsuccess('House Asset added successfully');
          navigate(-1);
        },
        token,
        '/api/house-asset/',
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

  useEffect(() => {
    if (user) {
      setState((prevState) => ({
        ...prevState,
        recorded_by: user.id,
        recorded_on: new Date().toISOString(),
      }));
    }
  }, [user]);

  useEffect(() => {
    getApi(
      (response) => {
        if (response?.data) {
          setHomes(response.data);
        }
      },
      token,
      '/api/home/'
    );
  }, [token]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-bshadow-none">
        <div className="ms-panel-body">
          <h2
            className="text-center line-between"
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'teal',
              backgroundColor: 'black',
            }}
          >
            Please fill in below details for the house asset you want to record.
          </h2>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Name</Form.Label>
                {errors.name?.map((err) => (
                  <p key={err} className="ms-text-danger">{err}</p>
                ))}
                <Form.Control
                  name="name"
                  required
                  onChange={handleChange}
                  value={state.name}
                />
              </Form.Group>

              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Serial Number</Form.Label>
                {errors.serial_number?.map((err) => (
                  <p key={err} className="ms-text-danger">{err}</p>
                ))}
                <Form.Control
                  name="serial_number"
                  required
                  onChange={handleChange}
                  value={state.serial_number}
                />
              </Form.Group>

              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Value</Form.Label>
                {errors.value?.map((err) => (
                  <p key={err} className="ms-text-danger">{err}</p>
                ))}
                <Form.Control
                  name="value"
                  onChange={handleChange}
                  value={state.value}
                />
              </Form.Group>

              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Date of Acquisition</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_acquisition"
                  required
                  onChange={handleChange}
                  value={state.date_of_acquisition}
                />
              </Form.Group>

              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Condition</Form.Label>
                <Form.Control
                  name="condition"
                  required
                  onChange={handleChange}
                  value={state.condition}
                />
              </Form.Group>

              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  as="select"
                  name="location"
                  onChange={handleChange}
                  value={state.location}
                >
                  <option value="">Select Location</option>
                  {homes.map((home) => (
                    <option key={home.id} value={home.id}>
                      {home.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  required
                  onChange={handleChange}
                  value={state.category}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Button type="submit" className="mt-4 me-2">
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={handleGoBack}>
              Back
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddHouseAsset;
