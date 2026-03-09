import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../../api/api';
import { toastsuccess } from '../utils/notifications';

const initialState = {
  information: '',
  attachment: { name: 'Add any supporting attachment' },
};

const AddConfidential = () => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const selected_resident = useSelector(
    (state) => state.resident.selectedResident
  );
  const token = useSelector((state) => state.auth.token).token;

  const dispatch = useDispatch();
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
          toastsuccess('Information added successfully');
          navigate(-1);
        },
        token,
        '/api/confidential-info/',
        state,
        (errors_list) => {
          setErrors(errors_list);
        }
      );
    }
    setValidated(true);
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === 'attachments') {
      setState({
        ...state,
        [name]: files[0],
      });
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    if (user && selected_resident) {
      setState((prevState) => ({
        ...prevState,
        resident: selected_resident.national_id,
        created_by: user.id,
        added_on: new Date().toISOString(),
      }));
    }
  }, [user, selected_resident]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-bshadow-none">
        <div className="ms-panel-body">
          <Card>
            <Card.Header className="bg-dark text-white">
              <h2
                className="text-center"
                style={{ fontSize: '24px', fontWeight: 'bold' }}
              >
                Please fill in below any confidential information
              </h2>
            </Card.Header>

            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Row>
                  <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Information</Form.Label>
                    {errors.information?.map((err) => (
                      <p key={err} className="ms-text-danger">
                        {err}
                      </p>
                    ))}
                    <InputGroup>
                      <Form.Control
                        name="information"
                        required
                        onChange={handleChange}
                        value={state.information}
                        type="text"
                        placeholder="Information"
                      />
                    </InputGroup>
                  </Form.Group>
                </Form.Row>

                <Button type="submit" className="mt-4 me-2">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleGoBack}
                >
                  Back
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddConfidential;
