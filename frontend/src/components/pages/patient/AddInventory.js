import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../api/api';
import { useDispatch, useSelector } from 'react-redux';

const AddInventory = (props) => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const selected_resident = useSelector((state) => state.resident.selectedResident);
  const token = useSelector((state) => state.auth.token).token;
  const dispatch = useDispatch();

  const [state, setState] = useState({
    item_names: '',
    quantity: 0,
    description:  '',
    category: '',
    resident: '',
    staff: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      postApi(
        (_) => {
          props.handleClose('inventory');
        },
        token,
        '/api/inventory/',
        state,
        (errors_list) => {
          setErrors(errors_list);
        }
      );
    }
    setValidated(true);
  };

  const handleChange = (event) => {
    switch (event.target.name) {
      case 'item_names':
        setState({
          ...state,
          item_names: event.target.value,
        });
        break;
      case 'quantity':
        setState({
          ...state,
          quantity: event.target.value,
        });
        break;
      case 'description':
        setState({
          ...state,
          description: event.target.value,
        });
        break;
      default:
    }
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      resident: selected_resident.national_id,
      staff: user.id,
    }));
  }, [dispatch, token, selected_resident]);

  return (
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-bshadow-none">
        <div className="ms-panel-body">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                <Form.Label>Item Names</Form.Label>
                {errors.item_name && errors.item_name.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="item_names"
                    required
                    onChange={handleChange}
                    value={state.item_names}
                    type="text"
                    placeholder="Item Names"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                <Form.Label>Quantity</Form.Label>
                {errors.quantity && errors.quantity.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="quantity"
                    required
                    min={1}
                    onChange={handleChange}
                    value={state.quantity}
                    type="number"
                    placeholder="Quantity"
                  />
                </InputGroup>
              </Form.Group>
               <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
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
            </Form.Row>
            <Button type="submit" className="mt-4 d-inline w-20">Save</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddInventory;
