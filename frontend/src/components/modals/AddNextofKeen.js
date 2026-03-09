import React, { useEffect, useState } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { postApi } from '../../api/api'
import { useSelector } from 'react-redux'


const PatientEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const selected_resident = useSelector((state) => state.resident.selectedResident)

    const initialState = {
        family: '',
        resident: '',
    }
    const [state, setState] = useState(initialState)


    const handleSubmit = (event) => {
        setValidated(true);
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            postApi(_ => {
                props.handleClose()
            }, token, `/api/nextofkin/`,
                state, state.id, errors_list => { setErrors(errors_list) })
        }
    };


    const handleChange = (event) => {
        switch (event.target.name) {

            case 'family':
                setState({
                    ...state,
                    family: event.target.value
                })
                break;

            default:

        }
    }
    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            resident: selected_resident.national_id,
        }))
    }, [selected_resident])

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Contact</Form.Label>
                                {errors.family && errors.family.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="family"
                                        value={state.family}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {props.family_to_display.map(family => (
                                            <option key={family.id} value={family.id}>{family.first_name} {family.last_name}</option>
                                        ))}
                                    </Form.Control>
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