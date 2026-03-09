import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi, putApi} from '../../api/api'
import { useSelector, useDispatch } from 'react-redux'
import { residentActions } from '../../store/resident'
import { min_date, max_date } from '../utils/dob'
import Swal from 'sweetalert2';

const PatientEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const [state, setState] = useState({
        resident: "",
        reason: "",
        check_date: "",
        discharged_by: ""
    });
    const user = useSelector((state) => state.auth.user)
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const token = useSelector((state) => state.auth.token).token
    const residents = useSelector((state) => state.resident.residentList)
    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        setValidated(true);
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {

            postApi(_ => {
              props.handleClose()
              selected_resident.is_discharged_status = true;
              dispatch(residentActions.dischargedResident(selected_resident.id));
              console.log('Updated selected_resident:', selected_resident);
              Swal.fire('Discharged!', 'Resident has been discharged.', 'success');
            }, token, `/api/resident-discharge/`,
               state
               , (errors_list) => { setErrors(errors_list) })
        }
       };

    

  
    const handleChange = (event) => {
        switch (event.target.name) {

            case 'reason':
                setState({
                    ...state,
                    reason: event.target.value
                })
                break;

            case 'check_date':
                setState({
                    ...state,
                    check_date: event.target.value
                })
                break;

            case 'type':
                setState({
                    ...state,
                    type: event.target.value
                })
                break;

            default:

        }
    }

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            resident: selected_resident.national_id,
            discharged_by: user.id,
        }))
    }, [dispatch, token])
    
    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Reason</Form.Label>
                                {errors.reason && errors.reason.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="reason"
                                        required
                                        as="textarea"
                                        onChange={handleChange}
                                        value={state.reason}
                                        type="text"
                                        placeholder="Reason"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Resident</Form.Label>
                                {errors.last_name && errors.last_name.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="last_name"
                                        required
                                        onChange={handleChange}
                                        value={selected_resident.last_name}
                                        type="text"
                                        placeholder="Enter Last Name"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Check in / out</Form.Label>
                                {errors.type && errors.type.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="type">
                                        <option value="checkin" > Check In </option>
                                        <option value="checkout" > Check Out </option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom10">
                                <Form.Label>Check Date</Form.Label>
                                {errors.check_date && errors.check_date.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="check_date"
                                        required
                                        onChange={handleChange}
                                        value={state.check_date}
                                        type="datetime-local"
                                        placeholder="Due On"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="submit" className="mt-4 d-inline w-20 ">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default PatientEdit;