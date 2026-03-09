import React, { useState } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import About from './About';
import Round from '../../ui-basic/progressbars/Round';
import LeaveHistory from '../../ui-basic/progressbars/LeaveHistory';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import PatientEdit from '../../../modals/PatientEdit';
import ProtectedRoute from '../../../protected/ProtectedRoute'

const Overview = () => {
    const selected_resident = useSelector((selected_resident) => selected_resident.resident.selectedResident)
    const [showEdit, setshowEdit] = useState(false)

    const handleShowEdit = () => {
        setshowEdit(true)
    }
    const handleCloseEdit = () => {
        setshowEdit(false)
    }
    return (
        <Tab.Container defaultActiveKey="tab1">
            {JSON.stringify(selected_resident) !== '{}' ?
                <>
                    <div className="ms-profile-overview">
                        <div className="ms-profile-cover">
                            <img className="ms-profile-img" src={selected_resident.profile_pic} alt={selected_resident.email} />
                            <div className="ms-profile-user-info">
                                <h1 className="ms-profile-username">{selected_resident.first_name} {selected_resident.last_name}</h1>
                                {/* <h2 className="ms-profile-role">Professional UX Designer</h2> */}
                            </div>
                            <div className="ms-profile-user-buttons">
                                <ProtectedRoute perm="chnage_resident">
                                    <Link to="#" onClick={() => handleShowEdit()} className="btn btn-light">
                                        <i className="material-icons">create</i> Edit Profile
                                    </Link>
                                </ProtectedRoute>
                            </div>
                        </div>
                        <Nav variant="tabs" className="ms-profile-navigation nav nav-tabs tabs-bordered">

                            <Nav.Item>
                                <Nav.Link eventKey="tab1">Personal Information </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="tab2">Daily Care</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="tab3">Leave History</Nav.Link>
                            </Nav.Item>
                            <ProtectedRoute perm="view_attachments">
                                <Nav.Item>
                                    <Nav.Link as={Link} to="/attacthment">Attatchments</Nav.Link>
                                </Nav.Item>
                            </ProtectedRoute>
                            <ProtectedRoute perm="view_finance">
                                <Nav.Item>
                                    <Nav.Link as={Link} to="/payment">Finance</Nav.Link>
                                </Nav.Item>
                            </ProtectedRoute>
                            <Nav.Item>
                                {/* <Nav.Link eventKey="tab6">Archive History</Nav.Link> */}
                            </Nav.Item>
                            <Nav.Item>
                               <Nav.Link as={Link} to="/resident/add-inventory">Add Inventory</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                               <Nav.Link as={Link} to="/resident/edit-inventory">Edit Inventory</Nav.Link>
                            </Nav.Item>
                               <Nav.Item>
                               <Nav.Link as={Link} to="/resident/InventoryList">InventoryList</Nav.Link>
                            </Nav.Item> 
                        </Nav>
                    </div>
                    <Tab.Content>
                        <Tab.Pane eventKey="tab1">
                            <About />
                        </Tab.Pane>
                        <Tab.Pane eventKey="tab2">
                            <div className="row">
                                <Round />
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="tab3">
                            <LeaveHistory />
                        </Tab.Pane>
                        <Tab.Pane eventKey="tab6">
                        </Tab.Pane>
                    </Tab.Content>
                </>
                :
                <div>
                    select a resident
                </div>
            }
            <Modal show={showEdit} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEdit} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Edit Resident</h4>
                    <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <PatientEdit handleClose={handleCloseEdit} />
                </Modal.Body>
            </Modal>

        </Tab.Container>
    );
}

export default Overview;