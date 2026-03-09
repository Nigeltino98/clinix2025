import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getApi } from '../../../api/api'
import { appointmentActions } from '../../../store/appointment'
import dateToYMD from '../../utils/dates'
import { selectedResident, selectedHome, selectedStaff } from '../../utils/expand'

const Upcomingappoinment = () => {
    const appointment_list = useSelector((state) => state.appointment.appointmentList)
    const patient_list = useSelector((state) => state.resident.residentList)
    const staff_list = useSelector((state) => state.staff.staffList)
    const token = useSelector((state) => state.auth.token).token
    const home_list = useSelector((state) => state.home.homeList)
    const residents = [...patient_list]
    const homes = [...home_list]
    const staff = [...staff_list]

    const dispatch = useDispatch()

    useEffect(() => {
        getApi(response => { dispatch(appointmentActions.setAppointments(response.data)) }, token, "/api/appointment")
    }, [dispatch, token])

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel">
                <div className="ms-panel-header">
                    <h6>Upcoming Appointments</h6>
                </div>
                <div className="ms-panel-body">
                    <div className="table-responsive">
                        <table className="table table-hover thead-primary">
                            <thead>
                                <tr>
                                    <th scope="col">Description</th>
                                    <th scope="col">Start time</th>
                                    <th scope="col">Time Due</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Staff</th>
                                    <th scope="col">Home</th>
                                    <th scope="col">Resident</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointment_list.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.description}</td>
                                        <td>{dateToYMD(item.start_time)}</td>
                                        <td>{dateToYMD(item.due_time)}</td>
                                        <td>
                                            {
                                                item.status === "pending" ?
                                                    <label className="ms-switch">
                                                        <input type="checkbox" defaultChecked />
                                                        <span className="ms-switch-slider ms-switch-success round" />
                                                    </label> :
                                                    <label className="ms-switch">
                                                        <input type="checkbox" />
                                                        <span className="ms-switch-slider ms-switch-success round" />
                                                    </label>
                                            }
                                        </td>
                                        <td>{selectedStaff(item.staff, staff)}</td>
                                        <td>{selectedHome(item.home, homes)}</td>

                                        <td>{selectedResident(item.resident, residents)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Link to='/appointment'>
                            view more
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Upcomingappoinment;