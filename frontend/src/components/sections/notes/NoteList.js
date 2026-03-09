import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, deleteApi } from '../../../../api/api';
import { noteActions } from '../../../../store/note';
import { Modal, Button } from 'react-bootstrap';
//import NoteEdit from '../../../modals/NoteEdit';
import Swal from 'sweetalert2';

const NotesList = () => {
    const dispatch = useDispatch();
    const [showEdit, setShowEdit] = useState(false);
    const [refresh, setRefresh] = useState("");
    const [showDelete, setShowDelete] = useState("");
    const token = useSelector((state) => state.auth.token).token;
    const notes = useSelector((state) => state.note.noteList);

    const handleShowEdit = (id) => {
        const notesList = [...notes];
        const selected = notesList.find(item => item.id === id);
        dispatch(noteActions.setSelectedNote(selected));
        setShowEdit(true);
    };

    const handleCloseEdit = () => {
        setShowEdit(false);
    };

    const handleDelete = (id) => {
        const notesList = [...notes];
        const selected = notesList.find(item => item.id === id);
        Swal.fire({
            title: 'Are you sure you want to delete this note?',
            text: `Note: ${selected.subject}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            if (result.value) {
                deleteApi(_ => {
                    Swal.fire('Deleted!', 'Note has been deleted.', 'success');
                    setShowDelete(id);
                }, token, '/api/note/', selected.id);
            }
        });
    };

    const columns = [
        {
            name: 'Subject',
            selector: 'subject',
            sortable: true
        },
        {
            name: 'Description',
            selector: 'description',
            sortable: true
        },
        {
            name: 'Action',
            cell: row => (
                <div data-tag="allowRowEvents">
                    <Link to='#' onClick={() => handleShowEdit(row.id)}>
                        <i className='fas fa-pencil-alt ms-text-info mr-4' />
                    </Link>
                    <Link to='#' onClick={() => handleDelete(row.id)}>
                        <i className='far fa-trash-alt ms-text-danger' />
                    </Link>
                </div>
            ),
            sortable: false
        },
    ];

    useEffect(() => {
        getApi(response => {
            dispatch(noteActions.setNotes(response.data));
        }, token, '/api/note');
    }, [dispatch, showEdit, showDelete, refresh, token]);

    return (
        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Notes List</h6>
                <Link to="/note/add-note">Add Note</Link>
            </div>
            <div className="ms-panel-body">
                <div className="thead-primary datatables">
                    <DataTable
                        columns={columns}
                        data={notes}
                        pagination
                        responsive={true}
                        striped
                        noHeader
                    />
                </div>
            </div>
            <Modal show={showEdit} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEdit} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Edit Note</h4>
                    <Button type="button" className="close text-white" onClick={handleCloseEdit}>
                        <span aria-hidden="true">×</span>
                    </Button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <NoteEdit handleClose={handleCloseEdit} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default NotesList;
