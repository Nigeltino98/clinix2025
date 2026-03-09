import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { residentActions } from '../../store/resident'
import { homeActions } from '../../store/home'
import { getApi } from '../../api/api'

const StaffEdit = (props) => {
    const [validated, setValidated] = useState(false);
    const residents = useSelector((state) => state.resident.residentList)
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const token = useSelector((state) => state.auth.token).token

    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            props.handleClose()
        }

        setValidated(true);
    };
    const handleChange = (event) => {
        if (event.target.value === 'all') {
            dispatch(residentActions.setSelectedResident({}))
        } else {
            const resident_list = [...residents]
            const resident = resident_list.find(item => item.national_id === event.target.value);
            dispatch(residentActions.setSelectedResident(resident))

        }
    }
    useEffect(() => {
        getApi(response => { dispatch(homeActions.setHome(response.data)) }, token, "/api/home")
        getApi(response => { dispatch(residentActions.setResidents(response.data)) }, token, "/api/resident")
    }, [])
    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="12" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Resident</Form.Label>
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="resident" value={selected_resident.national_id ? selected_resident.national_id : 'all'} >
                                        <option key="2a" value="all" > All </option>
                                        {residents.map(resident => (
                                            <option key={resident.national_id} value={resident.national_id}>{resident.first_name} {resident.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Button type="submit" className="mt-4 d-inline w-20 ">Close</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default StaffEdit;