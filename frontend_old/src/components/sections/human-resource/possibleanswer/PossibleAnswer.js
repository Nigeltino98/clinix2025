import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2'
import AddAnswer from '../../../modals/AddAnswers';
import EditAnswer from '../../../modals/EditAnswers';
import { getApi, deleteApi } from '../../../../api/api'
import { questionAction } from '../../../../store/question'



const Addform = () => {
    const [showEdit, setshowEdit] = useState(false)
    const [showAdd, setshowAdd] = useState(false)
    const dispatch = useDispatch()
    const question_list = useSelector((state) => state.question.questionList)
    const token = useSelector((state) => state.auth.token).token

    const columns = [

        { name: "Question", selector: "question", sortable: true },
        {
            name: "Action", cell: row =>
                <div data-tag="allowRowEvents" >
                    <Link to='#' onClick={() => handleShowEdit(row.id)}>
                        <i className='fas fa-pencil-alt ms-text-info  mr-4' />
                    </Link>
                    <Link to='#' onClick={() => { handleDelete(row.id) }}>
                        <i className='far fa-trash-alt ms-text-danger  mr-4' />
                    </Link>
                </div>, sortable: true

        },
    ];

    const data = []

    const tableData = {
        columns: columns,
        data: question_list,
    };

    const handleShowEdit = (id) => {
        const question = [...question_list]
        const selected = question.find(item => item.id === id);
        dispatch(questionAction.setSelectedQuestion(selected))
        setshowEdit(true)
    }

    const handleShowAdd = () => {
        setshowAdd(true)
    }
    const handleCloseEdit = () => {
        setshowEdit(false)
    }

    const handleCloseAdd = () => {
        setshowAdd(false)
    }
    const handleDelete = (id) => {
        const question = [...question_list]
        const selected = question.find(item => item.id === id);
        Swal.fire({
            title: 'Are you sure you to delete question: ',
            text: `${selected.question}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            if (result.value) {
                deleteApi(_ => { Swal.fire('Deleted!', 'Question has been deleted.', 'success'); }, token, '/api/question/', selected.id)
            }
        });
    }

    useEffect(() => {
        getApi(response => { dispatch(questionAction.setAnswers(response.data)); }, token, "/api/question")
    }, [dispatch, token])

    return (

        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Possible Answer</h6>
                <Link to="#" onClick={handleShowAdd}>Add Answer</Link>
            </div>
            <div className="ms-panel-body">
                <div className="thead-primary datatables">
                    <DataTableExtensions {...tableData} print={false} export={false}>
                        <DataTable
                            columns={columns}
                            data={data}
                            pagination
                            responsive={true}
                            striped
                            noHeader
                        />
                    </DataTableExtensions>
                </div>
            </div>
            <Modal show={showEdit} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEdit} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Edit Possible Answer</h4>
                    <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <EditAnswer handleClose={handleCloseEdit} />
                </Modal.Body>
            </Modal>

            <Modal show={showAdd} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseAdd} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Add Possible Answer</h4>
                    <button type="button" className="close text-white" onClick={handleCloseAdd}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddAnswer handleClose={handleCloseAdd} />
                </Modal.Body>
            </Modal>
        </div>


    );
}


export default Addform;

