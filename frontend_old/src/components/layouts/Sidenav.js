import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from 'react-perfect-scrollbar';
import { Accordion, NavLink } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap';
import SelectResident from '../../components/modals/SelectResident';
import ProtectedRoute from '../protected/ProtectedRoute'

const Sidenav = () => {
    const navToggle = () => {
        document.getElementById('body').classList.toggle('ms-aside-left-open');
        document.getElementById('ms-side-nav').classList.toggle('ms-aside-open');
        document.getElementById('overlayleft').classList.toggle('d-block');
    }
    const resident = useSelector((state) => state.resident.selectedResident)
    const [showResident, setshowResident] = useState(false)
    const handleResidentChoice = () => {
        setshowResident(true)
    }
    const handleClose = () => {
        setshowResident(false)
    }
    return (
        <Fragment>
            <div className="ms-aside-overlay ms-overlay-left ms-toggler" id="overlayleft" onClick={navToggle} />
            {/* Sidebar Navigation Left */}
            <Scrollbar id="ms-side-nav" className="side-nav fixed ms-aside-scrollable ms-aside-left">
                {/* Logo */}
                <div className="logo-sn ms-d-block-lg">
                    <Link className="pl-0 ml-0 text-center" to="/">
                    </Link>
                    {JSON.stringify(resident) !== '{}' &&
                        <>

                            <Link to="/resident/detail" className="text-center ms-logo-img-link">
                                {resident.profile_pic &&
                                    <img src={resident.profile_pic} alt={resident.email} />
                                }
                            </Link>
                            <Link to="/resident/detail" className="text-center">
                                <h5 className="text-center text-white ">{resident.first_name} {resident.last_name}</h5>
                            </Link>
                        </>
                    }
                    <Link to="#" onClick={handleResidentChoice}><h2 className="text-center text-white mb-3"><i className="flaticon-reuse mr-2" />choose resident</h2></Link>
                </div>
                {/* Navigation */}
                <Accordion className="accordion ms-main-aside fs-14" id="side-nav-accordion">
                    {/* Dashboard */}
                    <ProtectedRoute perm="view_reminder">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="0" className="has-chevron">
                                <span><i className="material-icons fs-16">dashboard</i>Diary </span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <ul>
                                    <li> <Link to="/">Diary </Link> </li>
                                    <li> <Link to="/rota">Rota </Link> </li>
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    {/* /Dashboard */}
                    {/* Department */}
                    <ProtectedRoute perm="view_home">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="3" className="has-chevron">
                                <span><i className="fas fa-home" />Home</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="3">
                                <ul>
                                    <ProtectedRoute perm="add_home">
                                        <li> <Link to="/home/add-home">Add Home</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="view_home">
                                        <li> <Link to="/home">Home List</Link> </li>
                                    </ProtectedRoute>
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    {/* Doctor */}
                    <ProtectedRoute perm="view_user">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="1" className="has-chevron">
                                <span><i className="fas fa-stethoscope" />Staff</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <ul>
                                    <ProtectedRoute perm="add_user">
                                        <li> <Link to="/staff/add-staff">Add Staff</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="view_user">
                                        <li> <Link to="/staff">Staff List</Link> </li>
                                    </ProtectedRoute>
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    {/* Patient */}
                    <ProtectedRoute perm="view_resident">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="2" className="has-chevron">
                                <span><i className="fas fa-user" />Resident</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="2">
                                <ul>
                                    <ProtectedRoute perm="add_resident">
                                        <li> <Link to="/resdient/add-resdient">Add Resident</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="view_resident">
                                        <li> <Link to="/resident">Resident List</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="view_resident">
                                        <li> <Link to="/resident/discharged-resident">Discharged Resident List</Link> </li>
                                    </ProtectedRoute>
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    {/* Patient */}

                    {/* Schedule */}
                    <ProtectedRoute perm="view_resident"> 
                       <li className="menu-item">
                           <Accordion.Toggle as={NavLink} variant="link" eventKey="4" className="has-chevron">
                               <span><i className="fas fa-list-alt" />Handover</span>
                           </Accordion.Toggle>
                           <Accordion.Collapse eventKey="4">
                              <ul>
                                  <li> <Link to="/handover">HandOver</Link> </li>
                                  <ProtectedRoute perm="view_note">
                                        <li> <Link to="/note/deleted-notes">Deleted Daily Notes</Link> </li>
                                  </ProtectedRoute>
                              </ul>
                           </Accordion.Collapse>
                       </li>
                    </ProtectedRoute>
                    {/* Schedule */}
                    {/* Appointment */}
                    <ProtectedRoute perm="view_appointment">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="5" className="has-chevron">
                                <span><i className="far fa-check-square" />Appointment</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="5">
                                <ul>
                                    <ProtectedRoute perm="add_appointment">
                                        <li> <Link to="/appointment/add-appointment">Add Appointment</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="view_appointment">
                                        <li> <Link to="/appointment">Appointment List</Link> </li>
                                    </ProtectedRoute>
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    {/* Appointment */}
                    {/* Payment */}
                    <ProtectedRoute perm="view_finance">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="6" className="has-chevron">
                                <span><i className="fas fa-credit-card" />Finances</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="6">
                                <ul>
                                    <ProtectedRoute perm="add_finance">
                                        <li> <Link to="/payment/add-payment">Add Transactions</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="view_finance">
                                        <li> <Link to="/payment">Transactions</Link> </li>
                                    </ProtectedRoute>
                                    {/* <li> <Link to="/payment/payment-invoice">Petty Cash </Link> </li> */}
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    {/* Payment */}
                    {/* Report */}
                    
                    {/* House */}
                    <li className="menu-item">
                        <Accordion.Toggle as={NavLink} variant="link" eventKey="7" className="has-chevron">
                             <span><i className="fas fa-home" />House</span>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="7">
                            <ul>
                                <li> <Link to="/house-overview">House Overview</Link> </li>
                                <li> <Link to="/house-asset">House Assets</Link> </li>
                                <li> <Link to="/house-stock">House Stock</Link> </li>
                                <li> <Link to="/repair-record">House Repairs and Damages</Link> </li>
                                {/* Add more links related to the House module here */}
                            </ul>
                        </Accordion.Collapse>
                    </li>
                    {/* <li className="menu-item">
                        <Accordion.Toggle as={NavLink} variant="link" eventKey="7" className="has-chevron">
                            <span><i className="fas fa-file-alt" />Daily Notes</span>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="7">
                            <ul>
                                <li> <Link to="/note">Note List</Link> </li>
                                <li> <Link to="/note/add-note">Write a  Note</Link> </li>

                            </ul>
                        </Accordion.Collapse>
                    </li> */}
                    {/* Report */}
                    {/* Human Resource */}
                    <ProtectedRoute perm="view_assessment">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="8" className="has-chevron">
                                <span><i className="fas fa-file-alt" />Assesments</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="8">
                                <ul>
                                    <ProtectedRoute perm="view_assessment">
                                        <li> <Link to="/assessment">Assessments</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="add_evaluation">
                                        <li> <Link to="/evaluation/add-evaluation">Start Evaluation</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="view_evaluation">
                                        <li> <Link to="/evaluation">Evaluations</Link> </li>
                                    </ProtectedRoute>
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    <ProtectedRoute perm="view_supportplan">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="12" className="has-chevron">
                                <span><i className="fas fa-sitemap" />Support Plan</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="12">
                                <ul>
                                    <ProtectedRoute perm="view_supportplan">
                                        <li> <Link to="/supportplan">Support Plans</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="add_supportplan">
                                        <li> <Link to="/supportplan/add-supportplan">Start Asessment</Link> </li>
                                    </ProtectedRoute>
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    <ProtectedRoute perm="view_riskactionplan">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="13" className="has-chevron">
                                <span><i className="far fa-user-circle" />Risk Assesment</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="13">
                                <ul>
                                    <ProtectedRoute perm="view_riskactionplan">
                                        <li> <Link to="/riskassessment">Risk Assesment</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="add_riskactionplan">
                                        <li> <Link to="/riskassessment/add-riskassessment">Start Risk Asessment</Link> </li>
                                    </ProtectedRoute>
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    {/* Human Resource */}
                    {/* Bed */}
                    <ProtectedRoute perm="view_attachments">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="9" className="has-chevron">
                                <span><i className="fas fa-folder-open" />Attachments</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="9">
                                <ul>
                                    <ProtectedRoute perm="add_attachments">
                                        <li> <Link to="/attacthment/upload">Upload Attachment</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="view_attachments">
                                        <li> <Link to="/attacthment">Attachments</Link> </li>
                                    </ProtectedRoute>
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    {/* Bed */}
                    {/* Notice */}
                    <ProtectedRoute perm="view_suggestioncomplains">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="10" className="has-chevron">
                                <span><i className="far fa-file-alt" />Accident & Incidents</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="10">
                                <ul>
                                    <ProtectedRoute perm="add_suggestioncomplains">
                                        <li> <Link to="/suggesion/add-suggestion">Add </Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="view_suggestioncomplains">
                                        <li> <Link to="/suggesion"> List</Link> </li>
                                    </ProtectedRoute>
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    <ProtectedRoute perm="view_bodymap">
                       <li className="menu-item">
                           <Accordion.Toggle as={NavLink} variant="link" eventKey="20" className="has-chevron">
                               <span><i className="far fa-user" />Body Map </span>
                           </Accordion.Toggle>
                           <Accordion.Collapse eventKey="20">
                               <ul>
                                   <ProtectedRoute perm="view_bodymap">
                                      <li> <Link to="/body-map">Body Maps</Link> </li>
                                   </ProtectedRoute>
                                   <ProtectedRoute perm="add_bodymap">
                                      <li> <Link to="/body-map/add">Add Body Map</Link> </li>
                                   </ProtectedRoute>
                               </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                    <ProtectedRoute perm="view_confidentialrecord">
                        <li className="menu-item">
                            <Accordion.Toggle as={NavLink} variant="link" eventKey="20" className="has-chevron">
                                <span><i className="far fa-file-alt" />Admin Panel</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="20">
                                <ul>
                                    <ProtectedRoute perm="add_confidentialrecord">
                                        <li> <Link to="/confidential-info">Add Confidential Record</Link> </li>
                                    </ProtectedRoute>
                                    <ProtectedRoute perm="view_confidentialrecord">
                                        <li> <Link to="/confidential-list">Confidential List</Link> </li>
                                    </ProtectedRoute>
                                   
                                </ul>
                            </Accordion.Collapse>
                        </li>
                    </ProtectedRoute>
                </Accordion>
            </Scrollbar>
            <Modal show={showResident} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleClose} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Choose Resident</h4>
                    <button type="button" className="close text-white" onClick={handleClose}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <SelectResident handleClose={handleClose} />
                </Modal.Body>
            </Modal>
        </Fragment>
    );
}

export default Sidenav;