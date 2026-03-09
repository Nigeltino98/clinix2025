import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { postApi, getApi } from '../../api/api';
import { confidentialActions } from '../../store/confidential';
import { toastsuccess } from '../utils/notifications';

const today = new Date().toISOString().split('T')[0];
const initialState = {
   information: '',
   attachment: {name: "Add any supporting attachment" },

 };

const AddConfidential = (props) => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const selected_resident = useSelector((state) => state.resident.selectedResident);
  const token = useSelector((state) => state.auth.token).token;
  const dispatch = useDispatch();


const [state, setState] = useState(initialState);
const history = useHistory();

const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      postApi(
        (response) => {
         console.log ("Information added:", response.data);
         toastsuccess("Information added succesfully");

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

    // Handle file inputs separately
    if (name === 'attachments') {
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
      resident: selected_resident.national_id,
      created_by: user.id,
      added_on: new Date().toISOString(),
    }));
  }, [dispatch, token, selected_resident]);

   const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-bshadow-none">
        <div className="ms-panel-body">
        <Card>
            <Card.Header className="bg-dark text-white">
              <h2 className="text-center" style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                Please fill in below any confidential information
              </h2>
            </Card.Header>
         <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                <Form.Label>Information</Form.Label>
                {errors.information && errors.information.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
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
{/*           <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom05">
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
              </Form.Group> */}
            </Form.Row>    
            <Button type="submit" className="mt-4 d-inline w-20 mr-2">Save</Button>
            <button type="button" onClick={handleGoBack} className="btn btn-primary">Back</button>

          </Form>
         </Card.Body>
        </Card>
       </div>
      </div>
    </div>
   );
}

export default AddConfidential;