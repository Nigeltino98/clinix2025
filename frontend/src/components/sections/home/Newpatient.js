import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux'
import { getApi } from '../../../api/api'
import { residentActions } from '../../../store/resident'
import { selectedHome } from '../../utils/expand'


const Newpatient = () => {
    const patient_list = useSelector((state) => state.resident.residentList)
    const home_list = useSelector((state) => state.home.homeList)
    const token = useSelector((state) => state.auth.token).token
    const homes = [...home_list]

    const residents_list = [...patient_list].slice(0, 9)
    const dispatch = useDispatch()
    const handleSelect = (email) => {
        const selected = residents_list.find(item => item.email === email);
        dispatch(residentActions.setSelectedResident(selected))
    }
    useEffect(() => {
        getApi(response => { dispatch(residentActions.setResidents(response.data)) }, token, "/api/resident")
    }, [dispatch, token])

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel">
                <div className="ms-panel-header">
                    <h6> Latest Residents</h6>
                </div>
                <div className="ms-panel-body">
                    <div className="table-responsive">
                        <table className="table table-hover  thead-primary">
                            <thead>
                                <tr>
                                    <th scope="col">Resident</th>
                                    <th scope="col">E-mail</th>
                                    <th scope="col">Contact</th>
                                    <th scope="col">Room</th>
                                    <th scope="col">D.O.B</th>
                                    <th scope="col">Home</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">I.D</th>
                                </tr>
                            </thead>
                            <tbody>
                                {residents_list.map((item, i) => (
                                    <tr key={i}>
                                        <td className="ms-table-f-w"> <img src={item.profile_pic} alt={item.email} />
                                            <Link to='/resident/detail'
                                                onClick={() => { handleSelect(item.email) }}>
                                                {item.first_name} {item.last_name}
                                            </Link>
                                        </td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.room}</td>
                                        <td>{item.date_of_birth}</td>
                                        <td>{selectedHome(item.home, homes)}</td>
                                        <td>{item.gender}</td>
                                        <td>{item.national_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Link to='/resident'>
                            view more
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Newpatient;

