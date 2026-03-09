import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { postApi, getApi } from '../../api/api';
import { toastsuccess } from '../utils/notifications';

const today = new Date().toISOString().split('T')[0];

const initialState = {
  asset_type: '',
  asset_name: '',
  date_reported: today,
  reminder_date: '',
  status: 'Pending',
  priority_level: '',
  house: '',
  photos: { name: 'Add a photo' },
  attachments: { name: 'Add any supporting attachment' },
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
  const [homes, setHomes] = useState([]);
  const [state, setState] = useState(initialState);

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token).token;
  const navigate = useNavigate();

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
      formData.append('priority_level', state.priority_level);
      formData.append('house', state.house);
      formData.append('description', state.description);
      formData.append('photos', state.photos);
      formData.append('attachments', state.attachments);

      postApi(
        () => {
          toastsuccess('Asset repair form added successfully');
          navigate(-1);
        },
        token,
        '/api/repair-record/',
        formData,
        (errors_list) => {
          setErrors(errors_list);
        }
      );
    }

    setValidated(true);
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === 'photos' || name === 'attachments') {
      setState({ ...state, [name]: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  useEffect(() => {
    if (user) {
      setState((prev) => ({
        ...prev,
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
      '/api/home/',
      (error) => console.error(error)
    );
  }, [token]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-bshadow-none">
        <div className="ms-panel-body">
          <h2 className="text-center" style={{ color: 'teal' }}>
            Please fill in the details for the asset that needs repair
          </h2>

          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <Form.Row>
              {/* All your form fields remain unchanged */}
            </Form.Row>

            <Button type="submit" className="mt-4 me-2">
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

export default AddHouseRepair;
