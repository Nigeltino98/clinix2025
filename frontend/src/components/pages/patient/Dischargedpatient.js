
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, putApi } from '../../../api/api';
import { residentActions } from '../../../store/resident';
import '../../../assets/css/AssetList.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const DischargedResidentsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token).token;
    const residents = useSelector(
        (state) => state.resident.residentList || []
    );

    const [dischargedResidents, setDischargedResidents] = useState([]);

    /*
     * Fetch residents and select only archived residents.
     */
    useEffect(() => {
        getApi(
            (response) => {
                console.log('All residents from API:', response.data);

                const archived = response.data.filter(
                    (resident) => resident.is_discharged_status === true
                );

                console.log('Archived residents:', archived);

                setDischargedResidents(archived);

                // Keep Redux resident list synchronized
                dispatch(residentActions.setResidents(response.data));
            },
            token,
            `/api/resident/?t=${Date.now()}`
        );
    }, [dispatch, token]);

    /*
     * Keep the archived list synchronized with Redux.
     *
     * This means when a resident is archived/un-archived elsewhere,
     * this page can reflect the change without needing a restart.
     */
    useEffect(() => {
        const archived = residents.filter(
            (resident) => resident.is_discharged_status === true
        );

        setDischargedResidents(archived);
    }, [residents]);

    /*
     * Un-archive resident
     */
    const handleUnArchive = (national_id) => {
        const selected = dischargedResidents.find(
            (resident) => resident.national_id === national_id
        );

        if (!selected) {
            return;
        }

        Swal.fire({
            title: 'Are you sure you want to un-archive this resident?',
            text: `Resident: ${selected.first_name} ${selected.last_name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, un-archive it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const tempResident = {
                    is_discharged_status: false,
                    date_of_discharge: null
                };

                putApi(
                    () => {
                        /*
                         * Update Redux immediately.
                         *
                         * The resident remains in residentList,
                         * but is_discharged_status becomes false.
                         */
                        const updatedResidents = residents.map((resident) =>
                            resident.national_id === national_id
                                ? {
                                      ...resident,
                                      is_discharged_status: false,
                                  }
                                : resident
                        );

                        dispatch(
                            residentActions.setResidents(updatedResidents)
                        );

                        Swal.fire(
                            'Un-Archived!',
                            'Resident has been moved back to the active Resident List.',
                            'success'
                        );
                    },
                    token,
                    `/api/resident/`,
                    tempResident,
                    national_id
                );
            }
        });
    };

    const handleGoBack = () => navigate(-1);

    return (
        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Archived Residents</h6>
            </div>

            <div className="ms-panel-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date of Birth</th>
                                <th>Gender</th>
                                <th>Admission Date</th>
                                <th>Home</th>
                                <th>Address</th>
                                <th>Date of Discharge</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dischargedResidents.length > 0 ? (
                                dischargedResidents.map((resident) => (
                                    <tr key={resident.national_id}>
                                        <td>
                                            {resident.first_name}{' '}
                                            {resident.last_name}
                                        </td>

                                        <td>
                                            {resident.date_of_birth || ''}
                                        </td>

                                        <td>
                                            {resident.gender || ''}
                                        </td>

                                        <td>
                                            {resident.date_of_admission || ''}
                                        </td>

                                        <td>
                                            {resident.home?.name || ''}
                                        </td>

                                        <td>
                                            {resident.address || ''}
                                        </td>

                                        <td>
                                            {resident.date_of_discharge
                                                ? new Date(resident.date_of_discharge).toLocaleDateString()
                                                : ''}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary"
                                                onClick={() =>
                                                    handleUnArchive(
                                                        resident.national_id
                                                    )
                                                }
                                            >
                                                <i className="fa fa-undo mr-1" />{' '}
                                                Un-Archive
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        No archived residents found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <button
                    onClick={handleGoBack}
                    className="btn btn-primary mt-3"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default DischargedResidentsList;

