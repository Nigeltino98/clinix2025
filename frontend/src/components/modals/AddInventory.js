import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../api/api';
import { useDispatch, useSelector } from 'react-redux';
import '../../assets/css/AddInventory.css';
import { inventoryActions } from '../../store/inventory';
import {toastsuccess } from '../utils/notifications';
import useGroupAccess from '../hooks/useGroupAccess';


const initialState = {
  item_name: '',
  quantity: '',
  description: '',
  category: '',

 };

const AddInventory = (props) => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [allowedGroups, setAllowedGroups] = useState([]);
  const selected_resident = useSelector((state) => state.resident.selectedResident);
  const token = useSelector((state) => state.auth.token).token;
  const dispatch = useDispatch();
  const categories = [
    { id: 1, name: 'Documents' },
    { id: 2, name: 'Medication' },
    { id: 3, name: 'Personal Items' },
    { id: 4, name: 'Clothing' },
    { id: 5, name: 'Miscellaneous' },
   ];


  
  const [state, setState] = useState({
    item_name: '',
    quantity: 0,
    description: '',
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
        (response) => {
         console.log ("Inventory item added:", response.data);
         toastsuccess("Inventory Item added succesfully");
          
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
      case 'item_name':
        setState({
          ...state,
          item_name: event.target.value,
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
      case 'category':
        setState({
          ...state,
          category: event.target.value,
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
        <h2 className="text-center line-between" style={{ fontSize: '24px', fontWeight: 'bold', color: 'teal', position: 'relative', backgroundColor: 'black', bottom: '-5px' }}>
            Please fill in below any personal items or valuables that a resident has brought with them.
            <br />
            Fill in each item under the correct category.
          </h2>
 
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                <Form.Label>Item Name</Form.Label>
                {errors.item_name && errors.item_name.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="item_name"
                    required
                    onChange={handleChange}
                    value={state.item_name}
                    type="text"
                    placeholder="Item Name"
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
                    rows={3}
                    as="textarea"
                    onChange={handleChange}
                    value={state.description}
                    type="text"
                    placeholder="Description"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                <Form.Label>Category</Form.Label>
                {errors.category && errors.category.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    as="select"
                    name="category"
                    required
                    onChange={handleChange}
                    value={state.category}
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
            </Form.Row>
            <Button type="submit" className="mt-4 d-inline w-20">Save</Button>
          </Form>
       
        </div>
      </div>
    </div>
  );
}

export default AddInventory;
