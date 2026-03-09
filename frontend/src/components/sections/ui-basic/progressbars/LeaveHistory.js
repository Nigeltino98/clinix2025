import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { selectedStaff } from '../../../utils/expand'
import dateToYMD from '../../../utils/dates'
import ProtectedRoute from '../../../protected/ProtectedRoute'
import { dischargeActions } from '../../../../store/discharge'
import { getApi, deleteApi } from '../../../../api/api'
import Swal from 'sweetalert2'
import { Modal } from 'react-bootstrap';
import PatientLeave from '../../../modals/PatientLeave';

const Round = () => {
    const dispatch = useDispatch()
    const [showDelete, setshowDelete] = useState("false")
    const discharges = useSelector((state) => state.discharge.dischargeList)
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const staff = useSelector((state) => state.staff.staffList)
    const token = useSelector((state) => state.auth.token).token
    const [showEdit, setshowEdit] = useState(false)
    const [showleave, setshowLeave] = useState(false)
    const columns = [
        {
            name: "Check Date", cell: row =>
                <div >
                    {dateToYMD(row.check_date)}
                </div>, sortable: true
        },
        { name: "Reason", selector: "reason", sortable: true },
        { name: "Check In/Out", selector: "type", sortable: true },
        {
            name: "Staff", cell: row =>
                <div >
                    {selectedStaff(row.discharged_by, staff)}
                </div>, sortable: true
        },
        {
            name: "Action", cell: row =>
                <div data-tag="allowRowEvents" >
                    <ProtectedRoute perm="delete_family">
                        <Link to='#' onClick={() => { handleDelete(row.id) }}>
                            <i className='far fa-trash-alt ms-text-danger  mr-4' />
                        </Link>
                    </ProtectedRoute>
                </div>, sortable: true
        },
    ];
    const handleShowAdd = () => {
        setshowLeave(true)
    }
    const handleDelete = (id) => {
        const selected = discharges.find(item => item.id === id);
        Swal.fire({
            title: 'Are you sure you to delete :?',
            text: `Record  : ${selected.reason}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            if (result.value) {
                deleteApi(_ => {
                    Swal.fire('Deleted!', 'Record has been deleted.', 'success');
                    setshowDelete(selected.id)
                }, token, '/api/resident-discharge/', selected.id)
            }
        });
    }
    const handleClose = () => {
        setshowLeave(false)
    }

    useEffect(() => {
        getApi(response => { dispatch(dischargeActions.setDischarge(response.data)) }, token, "/api/resident-discharge")
    }, [dispatch, showDelete, showleave, token])
    return (

        <div className="ms-panel-body">
            <div className="ms-panel">
                <div className="ms-panel-header ms-panel-custome">
                    <ProtectedRoute perm="add_family">
                        <Link to='#' onClick={handleShowAdd}>
                            Record Leave
                        </Link>
                    </ProtectedRoute>
                </div>
            </div>
            <div className="thead-primary datatables">
                <DataTable
                    columns={columns}
                    data={discharges}
                    pagination
                    responsive={true}
                    striped
                    noHeader
                />
            </div>
            <Modal show={showleave} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleClose} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white"> Resident Leave</h4>
                    <button type="button" className="close text-white" onClick={handleClose}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <PatientLeave handleClose={handleClose} />
                </Modal.Body>
            </Modal>
        </div>

    );
}

export default Round;