import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { data } from '../../../data/patientlist';
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap';
import AttachmentEdit from '../../../modals/AttachmentEdit';
import { attachmentActions } from '../../../../store/attachment'
import { homeActions } from '../../../../store/home'
import Swal from 'sweetalert2'
import dateToYMD from '../../../utils/dates'
import { selectedResident, selectedStaff } from '../../../utils/expand'
import { deleteApi, getApi } from '../../../../api/api'
import ProtectedRoute from '../../../protected/ProtectedRoute'

const List = () => {
    const [showEdit, setshowEdit] = useState(false)
    const [showDelete, setShowDelete] = useState("")
    const attachments = useSelector((state) => state.attachment.attachmentList)
    const selected_attachments = useSelector((state) => state.attachment.selectedAttachmentList)
    const patient_list = useSelector((state) => state.resident.residentList)
    const staff_list = useSelector((state) => state.staff.staffList)
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const residents = [...patient_list]
    const staff = [...staff_list]
    const token = useSelector((state) => state.auth.token).token
    const handleShowEdit = (id) => {
        const attachment_list = [...attachments]
        const selected = attachment_list.find(item => item.id === id);
        dispatch(attachmentActions.setSelectedAttachment(selected))
        setshowEdit(true)
    }
    const handleCloseEdit = () => {
        setshowEdit(false)
    }
    const handleDelete = (id) => {
        const attachment_list = [...attachments]
        const selected = attachment_list.find(item => item.id === id);
        Swal.fire({
            title: 'Are you sure you to delete :?',
            text: `Attachment  : ${selected.description}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            if (result.value) {
                deleteApi(_ => {
                    Swal.fire('Deleted!', 'Attachment has been deleted.', 'success');
                    setShowDelete(selected.id)
                }, token, '/api/attachment/', selected.id)
            }
        });
    }

    const columns = [
        {
            name: "Uploaded On", cell: row =>
                <div >
                    {dateToYMD(row.created_on)}
                </div>, sortable: true
        },
        { name: "Subject", selector: "subject", sortable: true },
        { name: "Category", selector: "category", sortable: true },
        {
            name: "Resident", cell: row =>
                <div >
                    {selectedResident(row.resident, residents)}
                </div>, sortable: true
        },
        {
            name: "Staff", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        }, {
            name: "File",
            cell: row =>
                <div>
                    <a target="_blank" href={row.attachment} rel="noreferrer"><i className='fas fa-download ms-text-info  mr-4' /></a>
                </div>
        },
        {
            name: "Action", cell: row =>
                <div data-tag="allowRowEvents" >
                    <ProtectedRoute perm="change_attachments">
                        <Link to='#' onClick={() => handleShowEdit(row.id)}>
                            <i className='fas fa-pencil-alt ms-text-info  mr-4' />
                        </Link>
                    </ProtectedRoute>
                    <ProtectedRoute perm="delete_attachments">
                        <Link to='#' onClick={() => { handleDelete(row.id) }}>
                            <i className='far fa-trash-alt ms-text-danger  mr-4' />
                        </Link>
                    </ProtectedRoute>
                </div>, sortable: true
        },
    ];

    const tableData = {
        columns,
        data: selected_attachments,
    };
    const dispatch = useDispatch()
    useEffect(() => {
        getApi(response => { dispatch(homeActions.setHome(response.data)) }, token, "/api/home")
        getApi(response => { dispatch(attachmentActions.setAttachments(response.data)) }, token, "/api/attachment")
    }, [dispatch, token, selected_resident, showDelete, showEdit])
    useEffect(() => {
        if (JSON.stringify(selected_resident) === '{}') {
            dispatch(attachmentActions.setSelectedAttachmentList(attachments))
        } else {
            const data = attachments.filter(item => item.resident === selected_resident.national_id)
            dispatch(attachmentActions.setSelectedAttachmentList(data))
        }
    }, [dispatch, token, attachments, selected_resident])
    return (
        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Attachment List  for : {JSON.stringify(selected_resident) === '{}' ? "All" : (selected_resident.first_name + " " + selected_resident.last_name)} </h6>
                <ProtectedRoute perm="add_attachments">
                    <Link to="/attacthment/upload">Upload </Link>
                </ProtectedRoute>
            </div>
            <div className="ms-panel-body">
                <div className="thead-primary datatables">
                    <DataTableExtensions {...tableData} print={false} export={false}>
                        <DataTable
                            columns={columns}
                            data={data}
                            pagination
                            responsive={true}
                            noHeader
                        />
                    </DataTableExtensions>
                </div>
            </div>
            <Modal show={showEdit} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEdit} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Edit Attachment</h4>
                    <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AttachmentEdit handleClose={handleCloseEdit} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default List;