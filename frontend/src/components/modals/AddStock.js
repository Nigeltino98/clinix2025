import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi, getApi } from '../../api/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toastsuccess } from '../utils/notifications';

const initialState = {
  name: '',
  description: '',
  date_of_acquisition: '',
  recorded_by: '',
  quantity: '',
  expiry_date: '',
  house: '',
  perish_nonperish: 'non-perishable',
};

const categories = [
  { id: 1, name: 'Perishable' },
  { id: 2, name: 'Non-Perishable' },
];

const AddHouseStock = () => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState(initialState);
  const [homes, setHomes] = useState([]);

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token).token;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setState((prev) => ({
        ...prev,
        recorded_by: user.id,
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
      '/api/home/',
      (error) => console.error(error)
    );
  }, [token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      postApi(
        () => {
          toastsuccess('House Stock added successfully');
          navigate(-1);
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
    navigate(-1);
  };

  return (
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-bshadow-none">
        <div className="ms-panel-body">
          <h2 className="text-center line-between">Add Stock for a House</h2>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              {/* form fields unchanged */}
            </Form.Row>

            <Button
              type="submit"
              className="mt-4 d-inline w-20 me-2"
              disabled={validated}
            >
              Save
            </Button>

            <Button type="button" variant="primary" onClick={handleGoBack}>
              Back
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddHouseStock;
