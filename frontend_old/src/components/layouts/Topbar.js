import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, NavLink, Modal } from 'react-bootstrap';
import Scrollbar from 'react-perfect-scrollbar';
import Makeappointment from '../modals/Makeappointment';
import ChangePassword from '../modals/ChangePassword';
import Generatereport from '../modals/Generatereport';
import { useSelector, useDispatch } from 'react-redux'
import { authActions } from '../../store/auth'
import dateToYMD from '../utils/dates'
import logo from '../../assets/img/Seacole-Logo.png';
import ProtectedRoute from '../protected/ProtectedRoute'


const Topbar = () => {
    const user = useSelector((state) => state.auth.user)
    const isLoggedIn = useSelector((state) => state.auth.loggedin)
    const notification_list = useSelector((state) => state.notification.notificationList)
    let notifications
    if (user) {
        notifications = [...notification_list].filter(item => item.staff === user.id);
    } else {
        notifications = []
    }

    const dispatch = useDispatch()


    const getUserLocation = () => {
       if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
             (position) => {
               const { latitude, longitude } = position.coords;
              // Do something with the user's location (e.g., store it in state)
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      }
    };

    const [state, setState] = useState({
        showappointment: false,
        showchangepassword: false,
        showreport: false,
    })
    // appointment
    const handleAppointmentClose = () => {
        setState({
            showappointment: false
        });
    }
    // password Change
    const handlePasswordChangeShow = () => {
        setState({
            showchangepassword: true
        });
    }
    const handlePasswordChangeClose = () => {
        setState({
            showchangepassword: false
        });
    }
    const handleReportClose = () => {
        setState({
            showreport: false
        });
    }
    // Nav toggle
    const navToggle = () => {
        document.getElementById('body').classList.toggle('ms-aside-left-open');
        document.getElementById('ms-side-nav').classList.toggle('ms-aside-open');
        document.getElementById('overlayleft').classList.toggle('d-block');
    }
    const optionsToggle = () => {
        document.getElementById('ms-nav-options').classList.toggle('ms-slide-down');
    }

    return (
        <>
            {(isLoggedIn && user) && <Fragment>

                <nav className="navbar ms-navbar">
                    <div className="ms-aside-toggler ms-toggler pl-0" onClick={navToggle}>
                        <span className="ms-toggler-bar bg-black" />
                        <span className="ms-toggler-bar bg-black" />
                        <span className="ms-toggler-bar bg-black" />
                    </div>
                    <div className="logo-sn logo-sm"> SEACOLE HEALTHCARE
                        <Link className="pl-0 ml-0 text-center navbar-brand mr-0" to="/">
                            <img src={logo} alt="logo" />
                        </Link>
                    </div>
                    <ul className="ms-nav-list ms-inline mb-0" id="ms-nav-options">
                        <li className="ms-nav-item  ms-d-none">
                            <ProtectedRoute perm="view_appointment">
                                <Link to="/appointment/add-appointment" className="text-white" >
                                    <i className="flaticon-spreadsheet mr-2" /> Make an appointment
                                </Link>
                            </ProtectedRoute>
                        </li>
                        <li className="ms-nav-item ms-d-none">
                            <Link to="/note" className="text-white">
                                <i className="flaticon-pencil mr-2" /> Notes
                            </Link>
                        </li>
                        <li className="ms-nav-item ms-d-none" >
                            <ProtectedRoute perm="view_resident">
                                <Link to="/resident" className="text-white">
                                    <i className="fa fa-users  mr-2" /> Residents
                                </Link>
                            </ProtectedRoute>
                        </li>
                        <Dropdown className="ms-nav-item dropdown">
                            <Dropdown.Toggle as={NavLink} className={(notifications.length > 0) ? "p-0 text-disabled ms-has-notification" : "p-0 text-disabled"}>
                                <i className="flaticon-bell" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-right">
                                <Link to="/">
                                    <li className="dropdown-menu-header">
                                        <h6 className="dropdown-header ms-inline m-0"><span className="text-disabled">Reminders</span></h6>
                                        <span className="badge badge-pill badge-info">{notifications.length} New</span>
                                    </li>
                                </Link>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="ms-nav-item ms-nav-user dropdown">
                            <Dropdown.Toggle as={NavLink} className="p-0 toggle-icon-none">
                                <img className="ms-user-img ms-img-round float-right" src={user.profile_pic} alt="people" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-right user-dropdown" aria-labelledby="userDropdown">
                                {user &&

                                    <li className="dropdown-menu-header">
                                        <h6 className="dropdown-header ms-inline m-0"><span className="text-disabled">Welcome, {user.first_name} {user.last_name}</span></h6>
                                    </li>
                                }
                                <li className="dropdown-divider" />
                                <li className="dropdown-menu-footer">
                                    <Link className="media fs-14 p-2" to="" onClick={() => {
                                        dispatch(authActions.logout())
                                        sessionStorage.clear()
                                    }}>
                                        <span>
                                            <i className="flaticon-shut-down mr-2" />
                                            Logout
                                        </span>
                                    </Link>
                                </li>
                            </Dropdown.Menu>
                        </Dropdown>
                    </ul>
                    <div className="ms-toggler ms-d-block-sm pr-0 ms-nav-toggler" onClick={optionsToggle}>
                        <span className="ms-toggler-bar bg-black" />
                        <span className="ms-toggler-bar bg-black" />
                        <span className="ms-toggler-bar bg-black" />
                    </div>
                </nav>
                {/* Appointment */}
                <Modal show={state.showappointment} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleAppointmentClose} centered>
                    <Modal.Header className="ms-modal-header-radius-0">
                        <h4 className="modal-title text-white">Make An Appointment</h4>
                        <button type="button" className="close text-white" onClick={handleAppointmentClose}>x</button>
                    </Modal.Header>
                    <Modal.Body className="p-0 text-left">
                        <Makeappointment />
                    </Modal.Body>
                </Modal>
                {/* prescription */}
                <Modal show={state.showchangepassword} onHide={handlePasswordChangeClose} centered>
                    <Modal.Header className="ms-modal-header-radius-0">
                        <h4 className="modal-title text-white">Change Password</h4>
                        <button type="button" className="close text-white" onClick={handlePasswordChangeClose}>x</button>
                    </Modal.Header>
                    <Modal.Body className=" text-left">
                        <ChangePassword />
                    </Modal.Body>
                </Modal>
                {/* report */}
                <Modal show={state.showreport} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleReportClose} centered>
                    <Modal.Header className="ms-modal-header-radius-0">
                        <h4 className="modal-title text-white">Generate report</h4>
                        <button type="button" className="close text-white" onClick={handleReportClose}>x</button>
                    </Modal.Header>
                    <Modal.Body className="p-0 text-left">
                        <Generatereport />
                    </Modal.Body>
                </Modal>
            </Fragment>
            }
{/*            <button onClick={getUserLocation}>Get Location</button> */}
        </>
       
    );
}

export default Topbar