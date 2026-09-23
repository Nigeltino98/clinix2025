import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getApi, putApi } from '../../../../api/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/css/PlanStyle.css';

const ArchivedSupportPlans = () => {
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token).token;

    const [archivedPlans, setArchivedPlans] = useState([]);

    /*
     * Fetch archived Support Plans
     */
    useEffect(() => {
        getApi(
            (response) => {
                console.log('Archived Support Plans:', response.data);

                setArchivedPlans(response.data);
            },
            token,
            `/api/plan/?archived=true&t=${Date.now()}`
        );
    }, [token]);

    /*
     * Restore Support Plan
     */
    const handleUnArchive = (id) => {
        const selected = archivedPlans.find(
            (plan) => plan.id === id
        );

        if (!selected) {
            console.error('Archived Support Plan not found:', id);
            return;
        }

        Swal.fire({
            title: 'Are you sure you want to restore this Support Plan?',
            text: `Resident: ${selected.firstname || ''} ${selected.lastname || ''}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, restore it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const tempPlan = {
                    is_deleted: false,
                };

                console.log('Restoring Support Plan:', id);
                console.log('Data being sent:', tempPlan);

                putApi(
                    (response) => {
                        console.log(
                            'Support Plan restore response:',
                            response
                        );

                        setArchivedPlans((prevPlans) =>
                            prevPlans.filter(
                                (plan) => plan.id !== id
                            )
                        );

                        Swal.fire(
                            'Restored!',
                            'Support Plan has been moved back to the active Support Plan list.',
                            'success'
                        );
                    },
                    token,
                    `/api/plan/`,
                    tempPlan,
                    id
                );
            }
        });
    };

    const handleGoBack = () => navigate(-1);

    return (
        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Archived Support Plans</h6>
            </div>

            <div className="ms-panel-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Resident</th>
                                <th>Last Evaluation</th>
                                <th>Archived By</th>
                                <th>Reason for Archiving</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {archivedPlans.length > 0 ? (
                                archivedPlans.map((plan) => (
                                    <tr key={plan.id}>
                                        <td>
                                            {plan.firstname || ''}{' '}
                                            {plan.lastname || ''}
                                        </td>

                                        <td>
                                            {plan.last_evaluated_date
                                                ? new Date(
                                                      plan.last_evaluated_date
                                                  ).toLocaleDateString()
                                                : ''}
                                        </td>

                                        <td>
                                            {plan.archived_by_name || ''}
                                        </td>

                                        <td>
                                            {plan.deletion_reason || ''}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary"
                                                onClick={() =>
                                                    handleUnArchive(plan.id)
                                                }
                                            >
                                                <i className="fa fa-undo mr-1" />{' '}
                                                Restore
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center"
                                    >
                                        No archived Support Plans found.
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

export default ArchivedSupportPlans;