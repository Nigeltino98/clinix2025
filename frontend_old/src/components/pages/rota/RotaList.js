import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap';
import EditRota from './EditRota'
import AddRota from './AddRota'
import { getApi, deleteApi } from '../../../api/api';
import { selectedStaff } from '../../utils/expand'
import ProtectedRoute from '../../protected/ProtectedRoute';
import { rotaActions } from '../../../store/rota'
import { staffActions } from '../../../store/staff'
import Swal from 'sweetalert2'

const Paymentlist = () => {
    const dispatch = useDispatch()
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const rota = useSelector((state) => state.rota.rotaList)
    const staff = useSelector((state) => state.staff.staffList)
    const token = useSelector((state) => state.auth.token).token
    const [editRota, setEditRota] = useState(false)
    const [addRota, setAddRota] = useState(false)
    const [showdelete, setshowdelete] = useState("")


    const handleEditRota = (id) => {
        const r = rota.find(i => i.id === id)
        dispatch(rotaActions.setSelectedRotas(r))
        setEditRota(true)
    }

    const handleCloseEdit = () => {
        setEditRota(false)
    }

    const handleAddRota = () => {
        setAddRota(true)
    }
    const handleCloseAdd = () => {
        setAddRota(false)
    }
    const handleDelete = (id) => {
        const selected = rota.find(item => item.id === id);
        Swal.fire({
            title: 'Are you sure you to delete :?',
            text: `Rota for : ${selectedStaff(selected.staff, staff)}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            if (result.value) {
                deleteApi(r => {
                    Swal.fire('Deleted!', 'Rota has been deleted.', 'success');
                    setshowdelete(id)
                }, token, '/api/rota/', selected.id)
            }
        });
    }

    const columns = [
        { name: "Shift", selector: "shift", sortable: true },
        { name: "Home", selector: "assigned_home", sortable: true },
        { name: "Start Time", selector: "start_date", sortable: true },
        { name: "End Time", selector: "end_date", sortable: true },
        {
            name: "Staff", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        },
        {
            name: "Created By", cell: row =>
                <div >
                    {selectedStaff(row.created_by, staff)}
                </div>, sortable: true
        },
        {
            name: "Action", cell: row =>
                <div data-tag="allowRowEvents" >
                    <ProtectedRoute perm="add_rota">
                        <Link to='#' onClick={() => handleEditRota(row.id)}>
                            <i className='fas fa-pencil-alt ms-text-info  mr-4' />
                        </Link>
                    </ProtectedRoute>
                    <ProtectedRoute perm="delete_rota">
                        <Link to='#' onClick={() => { handleDelete(row.id) }}>
                            <i className='far fa-trash-alt ms-text-danger  mr-4' />
                        </Link>
                    </ProtectedRoute>
                </div>, sortable: true
        },
    ];
    const tableData = {
        columns,
        data: rota,
    };
    useEffect(() => {
        getApi(response => { dispatch(rotaActions.setRota(response.data)) }, token, "/api/rota")
        getApi(response => { dispatch(staffActions.setStaff(response.data)) }, token, "/api/staff")
    }, [dispatch, token, showdelete, addRota])

    return (
        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <ProtectedRoute perm="add_finance">
                    <Link to="#" onClick={handleAddRota} >Add Rota</Link>
                </ProtectedRoute>
            </div>
            <div className="ms-panel-body">
                <div className="thead-primary datatables">
                    <DataTableExtensions {...tableData} print={false} export={false}>
                        <DataTable
                            columns={tableData.columns}
                            data={tableData.data}
                            pagination
                            responsive={true}
                            noHeader
                        />
                    </DataTableExtensions>
                </div>
                <Modal show={addRota} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseAdd} centered>
                    <Modal.Header className="ms-modal-header-radius-0">
                        <h4 className="modal-title text-white">Add Rota</h4>
                        <button type="button" className="close text-white" onClick={handleCloseAdd}>x</button>
                    </Modal.Header>
                    <Modal.Body className="p-0 text-left">
                        <AddRota handleClose={handleCloseAdd} />
                    </Modal.Body>
                </Modal>
                <Modal show={editRota} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEdit} centered>
                    <Modal.Header className="ms-modal-header-radius-0">
                        <h4 className="modal-title text-white">Edit Rota</h4>
                        <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
                    </Modal.Header>
                    <Modal.Body className="p-0 text-left">
                        <EditRota handleClose={handleCloseEdit} />
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default Paymentlist;