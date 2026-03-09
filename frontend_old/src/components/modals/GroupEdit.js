import React, { useEffect, useState } from 'react';
import { Form, InputGroup, Button, Col, Row, Container } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { truePutApi } from '../../api/api'
import { Link } from 'react-router-dom';
import ProtectedRoute from '../protected/ProtectedRoute'

const StaffEdit = (props) => {
    const dispatch = useDispatch()
    const [validated, setValidated] = useState(false);
    const [perms_to_display, setPermsToDisplay] = useState([]);
    const [errors, setErrors] = useState(false);
    const selected_group = useSelector((state) => state.group.selectedGroup)
    const permissions = useSelector((state) => state.permission.permissionList)
    const token = useSelector((state) => state.auth.token).token
    const [creat, setCreate] = useState([]);
    const [destry, setDestroy] = useState([]);
    const [name, setName] = useState('');

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();

        } else {
            const data = {
                "name": name,
                "id": selected_group.id,
                "destry": destry.map(item => {
                    return item.id
                }),
                "creat": creat.map(item => {
                    return item.id
                })
            }
            truePutApi(_ => { props.handleClose() }, token, `/api/set-permission/`, data, errors_list => { setErrors(errors_list) })
        }
        setValidated(true);
    };



    const handleChange = (event) => {
        setName(event.target.value)
    }
    const permissionChange = (event) => {
        const name = event.target.value
        const id = event.target.id
        const in_create = [...creat].some(item => item.codename === name)
        const in_dewstry = [...destry].some(item => item.codename === name)
        if (event.target.checked === true) {
            const data = {
                "name": name,
                "id": id,
                "set_action": false,
                "codename": name
            }
            if (in_create !== true) {
                setCreate([
                    ...creat,
                    data
                ])
                setDestroy([
                    ...destry.filter(item => item.codename !== name),
                ])
            }
        } else if (event.target.checked === false) {
            const data = {
                "name": name,
                "id": id,
                "set_action": false,
                "codename": name
            }
            if (in_dewstry !== true) {
                setDestroy([
                    ...destry,
                    data

                ])
                setCreate([
                    ...creat.filter(item => item.codename !== name),
                ])
            }
        }
    }
    useEffect(() => {
        setName(selected_group.name)
        const working_perms = permissions.map(permission => {
            if (selected_group.permissions.find(item => item.id === permission.id)) {
                return { ...permission, checked: true }
            } else {
                return { ...permission, checked: false }
            }
        })
        setPermsToDisplay(working_perms)
    }, [selected_group, permissions])


    useEffect(() => {

        if (destry.length > 0 || creat.length > 0) {
            const new_to_display = perms_to_display.map(perm => {
                if (destry.find(dr => dr.codename === perm.codename)) {
                    return { ...perm, checked: false }
                } else if (creat.find(cr => cr.codename === perm.codename)) {
                    return { ...perm, checked: true }
                } else {
                    return perm
                }
            })
            setPermsToDisplay(new_to_display)
        }

    }, [creat, destry])


    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel">
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label> Name</Form.Label>
                                {errors.name && errors.name.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="name"
                                        onChange={handleChange}
                                        required
                                        value={name}
                                        type="text"
                                        placeholder="Name"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Label> Permissions</Form.Label>
                        <Form.Row>
                            <Container>
                                <Row xs={1} md={2} lg={3}>
                                    {perms_to_display.map(permission =>
                                        <Col key={permission.id}>
                                            <label className="ms-switch">
                                                <input type="checkbox" id={permission.id} value={permission.codename} checked={permission.checked} onChange={permissionChange} />
                                                <span className="ms-switch-slider round" />
                                            </label>
                                            <span> {permission.name.replace("Can", "")} </span>
                                        </Col>
                                    )}
                                </Row>
                            </Container>
                        </Form.Row>
                        <Button type="submit" className="mt-4 d-inline w-20">Save</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default StaffEdit;