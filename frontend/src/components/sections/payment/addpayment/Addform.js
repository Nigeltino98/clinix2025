import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { postApi, getApi } from '../../../../api/api'
import { Modal } from 'react-bootstrap';
import { toastsuccess } from '../../../utils/notifications'
import AddReceipt from '../../../modals/AddReceipt';
import ProtectedRoute from '../../../protected/ProtectedRoute'
import { staffActions } from '../../../../store/staff'

const Addform = () => {
    const dispatch = useDispatch()
    const [errors, setErrors] = useState(false);
    const [validated, setValidated] = useState(false);
    const [showAddReceipt, setshowAddReceipt] = useState(false)
    const token = useSelector((state) => state.auth.token).token
    const staff = useSelector((state) => state.staff.staffList)
    const residents = useSelector((state) => state.resident.residentList)
    const user = useSelector((state) => state.auth.user)
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const initialState = {
        transaction_type: 'Bank',
        amount: '',
        description: '',
        tag_number: '',
        staff: '',
        state: 'cr',
        receipt: '',
        resident: '',
        receipt_number: '',
        attachment: "",

    }
    const [state, setState] = useState(initialState)
    let pic_label = ""
    if (typeof state.attachment === 'string') {
        pic_label = state.attachment
    } else if (selected_resident.profile_pic === null) {
        pic_label = " Choose a pic"
    } else {
        pic_label = state.attachment.name
    }

    const handleReset = () => {
        setValidated(false);
        setState(initialState)
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (typeof state.attachment === 'string') {
                const data = { ...state }
                delete data["attachment"]
                postApi(_ => {
                    toastsuccess("Payment added successfully")
                    setState(initialState)
                }, token, `/api/transaction/`, data, errors_list => { setErrors(errors_list) })
            } else {
                const formData = new FormData();
                formData.append('transaction_type', state.transaction_type);
                formData.append('attachment', state.attachment);
                formData.append('resident', state.resident);
                formData.append('amount', state.amount);
                formData.append('receipt_number', state.receipt_number);
                formData.append('description', state.description);
                formData.append('staff_witnesses', state.staff_witnesses);
                formData.append('staff', state.staff);
                formData.append('state', state.state);
                postApi(_ => {
                    toastsuccess("Payment added successfully")
                    handleReset()
                }, token, `/api/transaction/`, formData, errors_list => { setErrors(errors_list) })
            }

        }

        setValidated(true);
    };

    const handleAddReceipt = () => {
        setshowAddReceipt(true)
    }

    const receiptHandler = (data) => {
        setState(prevState => ({
            ...prevState,
            receipt: data.data.id
        }))
        setshowAddReceipt(false)
    }

    const handleChange = (event) => {
        switch (event.target.name) {

            case 'transaction_type':
                setState({
                    ...state,
                    transaction_type: event.target.value
                })
                break;

            case 'resident':
                setState({
                    ...state,
                    resident: event.target.value
                })
                break;

            case 'amount':
                setState({
                    ...state,
                    amount: event.target.value
                })
                break;

            case 'receipt_number':
                setState({
                    ...state,
                    receipt_number: event.target.value
                })
                break;

            case 'description':
                setState({
                    ...state,
                    description: event.target.value
                })
                break;

            case 'staff_witnesses':
                setState({
                    ...state,
                    staff_witnesses: event.target.value
                })
                break;
            case 'tag_number':
                setState({
                    ...state,
                    tag_number: event.target.value
                })
                break;

            case 'staff':
                setState({
                    ...state,
                    staff: event.target.value
                })
                break;

            case 'state':
                setState({
                    ...state,
                    state: event.target.value
                })
                break;

            case 'attachment':
                setState({
                    ...state,
                    attachment: event.target.files[0]
                })
                break;

            default:
        }

    }

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            staff: user.id,
            resident: JSON.stringify(selected_resident) !== '{}' ? selected_resident.national_id : ''
        }))
    }, [user, selected_resident])

    useEffect(() => {
        getApi(response => { dispatch(staffActions.setStaff(response.data)) }, token, "/api/staff")
    }, [user, selected_resident])

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel">
                <div className="ms-panel-header ms-panel-custome">
                    <h6>Add Transaction</h6>
                    <ProtectedRoute perm="add_finance">
                        <Link to="/payment">Transactions</Link>
                    </ProtectedRoute>
                </div>
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom01">
                                <Form.Label>Description</Form.Label>
                                {errors.description && errors.description.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="description"
                                        onChange={handleChange}
                                        required
                                        value={state.description}
                                        type="text"
                                        as="textarea"
                                        rows={3} placeholder="Description"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom02">
                                <Form.Label>Amount</Form.Label>
                                {errors.amount && errors.amount.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="amount"
                                        required
                                        onChange={handleChange}
                                        value={state.amount}
                                        type="text"
                                        placeholder="Amount"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom03">
                                <Form.Label>Transaction Type</Form.Label>
                                {errors.transaction_type && errors.transaction_type.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="transaction_type"
                                        value={state.transaction_type}
                                    >
                                        <option value='Cash' > Cash</option>
                                        <option value='Bank'> Bank</option>
                                        <option value='Other'> Other</option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Receipt Number</Form.Label>
                                {errors.receipt_number && errors.receipt_number.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="receipt_number"
                                        onChange={handleChange}
                                        value={state.receipt_number}
                                        type="text"
                                        placeholder="Receipt Number"
                                    />
                                </InputGroup>
                            </Form.Group>
                            {JSON.stringify(selected_resident) === '{}' &&
                                <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                                    <Form.Label>Resident</Form.Label>
                                    {errors.resident && errors.resident.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                    <InputGroup>
                                        <Form.Control as="select" onChange={handleChange}
                                            name="resident"
                                            required
                                            value={state.resident}
                                        >
                                            <option key="2a" > ------------- </option>
                                            {residents.map(user => (
                                                <option key={user.national_id} value={user.national_id}>{user.first_name} {user.last_name}</option>
                                            ))}
                                        </Form.Control>
                                    </InputGroup>
                                </Form.Group>
                            }
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Tag Number</Form.Label>
                                {errors.tag_number && errors.tag_number.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.Control
                                        name="tag_number"
                                        onChange={handleChange}
                                        value={state.tag_number}
                                        type="text"
                                        placeholder="Tag Number"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom09">
                                <Form.Label>Attatchment</Form.Label>
                                {errors.attachment && errors.attachment.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <InputGroup>
                                    <Form.File
                                        name="attachment"
                                        label={pic_label}
                                        onChange={handleChange}
                                        lang="en"
                                        custom
                                    />
                                </InputGroup>
                            </Form.Group>
                            {/* <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom04">
                                <Form.Label>Resident</Form.Label>
                                <InputGroup>
                                    <Form.Control as="select" onChange={handleChange}
                                        name="resident"
                                        value={state.resident}
                                    >
                                        <option key="2a" > ------------- </option>
                                        {residents.map(resident => (
                                            <option key={resident.national_id} value={resident.national_id}>{resident.first_name} {resident.last_name}</option>
                                        ))}
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group> */}
                            <Form.Group as={Col} md="6" className="mb-3" controlId="validationCustom07">
                                <Form.Label>Money In/Out</Form.Label>
                                {errors.state && errors.state.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                <Form.Control as="select" onChange={handleChange}
                                    name="state"
                                    value={state.state}
                                >
                                    <option value='cr' >Deposit</option>
                                    <option value='dr'> Withdrawal</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        {/* <Button type="submit" className="mt-4 d-inline w-20 mr-2" onClick={handleAddReceipt}>Attach Receipt</Button> */}
                        {/* <Button type="reset" variant="warning" className="mt-4 d-inline w-20 mr-2" onClick={handleReset}>Reset</Button> */}
                        <Button type="submit" className="mt-4 d-inline w-20">Save Payment</Button>
                    </Form>
                </div>
                <Modal show={showAddReceipt} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => { setshowAddReceipt(false) }} centered>
                    <Modal.Header className="ms-modal-header-radius-0">
                        <h4 className="modal-title text-white">Attach Receipt</h4>
                        <button type="button" className="close text-white" onClick={() => { setshowAddReceipt(false) }}>x</button>
                    </Modal.Header>
                    <Modal.Body className="p-0 text-left">
                        <AddReceipt handler={receiptHandler} />
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default Addform;