import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../api/api';
import { useSelector } from 'react-redux';
import { toastsuccess } from '../utils/notifications';
import { useNavigate } from 'react-router-dom';

const AddDailyNote = (props) => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const selected_resident = useSelector(
    (state) => state.resident.selectedResident
  );
  const token = useSelector((state) => state.auth.token).token;

  const navigate = useNavigate();

  const [state, setState] = useState({
    entry: '',
    resident: '',
    staff: '',
    subject: '',
    emotion: 'unknown',
    type_of_note: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      postApi(
        () => {
          props.handleClose?.('notes');
          toastsuccess('Daily Note added successfully');
        },
        token,
        '/api/note/',
        state,
        (errors_list) => {
          setErrors(errors_list);
        }
      );
    }

    setValidated(true);
  };

  useEffect(() => {
    if (user && selected_resident) {
      setState((prevState) => ({
        ...prevState,
        staff: user.id,
        resident: selected_resident.national_id,
      }));
    }
  }, [user, selected_resident]);

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
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Subject</Form.Label>
                {errors.subject &&
                  errors.subject.map((err) => (
                    <p key={err} className="ms-text-danger">
                      {err}
                    </p>
                  ))}
                <InputGroup>
                  <Form.Control
                    name="subject"
                    required
                    onChange={handleChange}
                    value={state.subject}
                    type="text"
                    placeholder="Subject"
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Entry</Form.Label>
                {errors.entry &&
                  errors.entry.map((err) => (
                    <p key={err} className="ms-text-danger">
                      {err}
                    </p>
                  ))}
                <InputGroup>
                  <Form.Control
                    name="entry"
                    required
                    onChange={handleChange}
                    value={state.entry}
                    as="textarea"
                    rows={3}
                    placeholder="Entry"
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Day/Night note</Form.Label>
                <InputGroup>
                  <Form.Control
                    as="select"
                    name="type_of_note"
                    value={state.type_of_note}
                    onChange={handleChange}
                  >
                    <option value="">---------------</option>
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                  </Form.Control>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Emotion</Form.Label>
                <InputGroup>
                  <Form.Control
                    as="select"
                    name="emotion"
                    value={state.emotion}
                    onChange={handleChange}
                  >
                    <option value="unknown">❓ Unknown</option>
                    <option value="joyful">😊 Joyful</option>
                    <option value="sad">😔 Sad</option>
                    <option value="tearful">😢 Tearful</option>
                    <option value="angry">😡 Angry</option>
                    <option value="annoyed">🙄 Annoyed</option>
                    <option value="sleeping">😴 Sleeping</option>
                    <option value="sleepy">🥱 Sleepy</option>
                    <option value="content">🙂 Content</option>
                    <option value="worried">😟 Worried</option>
                    <option value="confused">😕 Confused</option>
                    <option value="fearful">😨 Fearful</option>
                  </Form.Control>
                </InputGroup>
              </Form.Group>
            </Form.Row>

            <Button type="submit" className="mt-4 d-inline w-20 me-2">
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

export default AddDailyNote;
