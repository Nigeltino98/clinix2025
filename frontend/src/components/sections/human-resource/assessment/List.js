import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2'
import { getApi, deleteApi } from '../../../../api/api'
import AddEvaluation from '../../../modals/AddEvaluation';
import AddQuestion from '../../../modals/AddQuestion';
import { questionAction } from '../../../../store/question'
import EditAsessment from '../../../modals/EditAsessment';
import { assessmentActions } from '../../../../store/assessment'
import { selectedStaff } from '../../../utils/expand'
import ProtectedRoute from '../../../protected/ProtectedRoute'

const Addform = () => {
    const [showEdit, setshowEdit] = useState(false)
    const [showDelete, setshowDelete] = useState('')
    const [showAddAssessment, setshowAddAssessment] = useState(false)
    const [showAddQuestion, setshowAddQuestion] = useState(false)
    const token = useSelector((state) => state.auth.token).token
    const question_list = useSelector((state) => state.question.questionList)
    const assessment_list = useSelector((state) => state.assessment.assessmentList)
    const staff_list = useSelector((state) => state.staff.staffList)
    const staff = [...staff_list]

    const dispatch = useDispatch()

    const handleSelect = (assement) => {
        const question = [...question_list]
        const all_questions = [];
        for (let x = 0; x <= question.length - 1; x++) {
            if (question[x].assement === assement.id) {
                all_questions.push(question[x])
            }
        }
        dispatch(assessmentActions.setSelectedAssessments(assement))
        dispatch(questionAction.setSelectedQuestion(all_questions));

    }


    const columns = [

        {
            name: "Title", selector: "title"
            , cell: row => <div >
                <Link to='/assessment/detail'
                    onClick={() => { handleSelect(row) }}>
                    {row.title}
                </Link>
            </div>, sortable: true
        },
        {
            name: "Staff", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        },
        {
            name: "Action", cell: row =>
                <div data-tag="allowRowEvents" >
                    <ProtectedRoute perm="change_assessment">
                        <Link to='#' onClick={() => handleShowEdit(row.id)}>
                            <i className='fas fa-pencil-alt ms-text-info  mr-4' />
                        </Link>
                    </ProtectedRoute>
                    <ProtectedRoute perm="delete_assessment">
                        <Link to='#' onClick={() => { handleDelete(row.id) }}>
                            <i className='far fa-trash-alt ms-text-danger  mr-4' />
                        </Link>
                    </ProtectedRoute>
                    <ProtectedRoute perm="add_question">
                        <Link to='#' onClick={() => { handleShowAddQuestion(row.id) }}>
                            Add Question
                        </Link>
                    </ProtectedRoute>
                </div>, sortable: true

        },
    ];

    const data = []

    const tableData = {
        columns: columns,
        data: assessment_list,
    };

    const handleShowEdit = (id) => {
        const assessment = [...assessment_list]
        const selected = assessment.find(item => item.id === id);
        dispatch(assessmentActions.setSelectedAssessments(selected))
        setshowEdit(true)
    }

    const handleShowAddQuestion = (id) => {
        const assessment = [...assessment_list]
        const selected = assessment.find(item => item.id === id);
        dispatch(assessmentActions.setSelectedAssessments(selected))
        setshowAddQuestion(true)
    }

    const handleCloseAddQuestion = () => {
        setshowAddQuestion(false)
    }

    const handleShowAddAssessment = () => {
        setshowAddAssessment(true)
    }
    const handleCloseEdit = () => {
        setshowEdit(false)
    }

    const handleCloseAddAssessment = () => {
        setshowAddAssessment(false)
    }
    const handleDelete = (id) => {
        const assessment = [...assessment_list]
        const selected = assessment.find(item => item.id === id);

        Swal.fire({
            title: 'Are you sure you to delete the evaluation: ',
            text: `${selected.title}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            if (result.value) {
                deleteApi(_ => {
                    Swal.fire('Deleted!', 'Evaluation has been deleted.', 'success');
                    setshowDelete(id)
                }, token, '/api/assessment/', selected.id)
            }
        });
    }

    useEffect(() => {
        getApi(response => { dispatch(assessmentActions.setAssessment(response.data)); }, token, "/api/assessment")
    }, [dispatch, token, showAddAssessment, showEdit, showDelete])


    return (

        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Assessment</h6>
                <ProtectedRoute perm="view_assessment">
                    <Link to="#" onClick={handleShowAddAssessment}>Add Assessment</Link>
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
                            striped
                            noHeader
                        />
                    </DataTableExtensions>
                </div>
            </div>
            <Modal show={showEdit} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEdit} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Edit Evaluation</h4>
                    <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <EditAsessment handleClose={handleCloseEdit} />
                </Modal.Body>
            </Modal>

            <Modal show={showAddAssessment} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseAddAssessment} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Add Assessment</h4>
                    <button type="button" className="close text-white" onClick={handleCloseAddAssessment}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddEvaluation handleClose={handleCloseAddAssessment} />
                </Modal.Body>
            </Modal>
            <Modal show={showAddQuestion} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseAddQuestion} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Add Question</h4>
                    <button type="button" className="close text-white" onClick={handleCloseAddQuestion}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddQuestion handleClose={handleCloseAddQuestion} />
                </Modal.Body>
            </Modal>
        </div>


    );
}


export default Addform;

