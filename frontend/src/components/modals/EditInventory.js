import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { putApi } from '../../api/api';
import { useSelector, useDispatch } from 'react-redux';
import { inventoryActions } from '../../store/inventory'; // Assuming the Redux actions for inventory are defined here


const EditInventory = (props) => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const token = useSelector((state) => state.auth.token).token; // Assuming you have the token in the Redux state
  const selected_resident = useSelector((state) => state.resident.selectedResident);
  const selected_inventory = useSelector((state) => state.inventory.selectedInventory);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    setValidated(true);
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const data = { ...selected_inventory, resident: selected_resident.national_id };
      putApi(
        (_) => {
          props.handleClose();
        },
        token,
        `/api/inventory/`,
        data,
        selected_inventory.id,
        (errors) => {
          setErrors(errors);
        }
      );
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(inventoryActions.setSelectedInventory({
      ...selected_inventory,
      [name]: value,
    }));
  };

  return (
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-bshadow-none">
        <div className="ms-panel-header">
          <h6>Inventory Information</h6>
        </div>
        <div className="ms-panel-body">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationItemName">
                <Form.Label>Item Name</Form.Label>
                {errors.item_name && errors.item_name.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="item_name"
                    onChange={handleChange}
                    required
                    value={selected_inventory.item_name}
                    type="text"
                    placeholder="Enter Item Name"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3" controlId="validationQuantity">
                <Form.Label>Quantity</Form.Label>
                {errors.quantity && errors.quantity.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="quantity"
                    required
                    onChange={handleChange}
                    value={selected_inventory.quantity}
                    type="number"
                    placeholder="Enter Quantity"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="12" className="mb-3" controlId="validationDescription">
                <Form.Label>Description</Form.Label>
                {errors.description && errors.description.map((err) => <p key={err} className="ms-text-danger">{err}</p>)}
                <InputGroup>
                  <Form.Control
                    name="description"
                    onChange={handleChange}
                    required
                    value={selected_inventory.description}
                    as="textarea"
                    rows={3}
                    placeholder="Enter Description"
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

export default EditInventory;
