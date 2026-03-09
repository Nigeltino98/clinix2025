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
import EditEvaluation from '../../../modals/EditEvaluation';
import { assessmentActions } from '../../../../store/assessment'
import { selectedStaff, selectedResident } from '../../../utils/expand'
import { evaluationActions } from '../../../../store/evaluation';
import { residentActions } from '../../../../store/resident';
import ProtectedRoute from '../../../protected/ProtectedRoute'

const Addform = () => {
    const [showEdit, setshowEdit] = useState(false)
    const [showDelete, setshowDelete] = useState("")
    const [showAddAssessment, setshowAddAssessment] = useState(false)
    const [showAddQuestion, setshowAddQuestion] = useState(false)
    const token = useSelector((state) => state.auth.token).token
    const evaluation_list = useSelector((state) => state.evaluation.evaluationList)
    const assement_list = useSelector((state) => state.assessment.assessmentList)
    const staff_list = useSelector((state) => state.staff.staffList)
    const resident_list = useSelector((state) => state.resident.residentList)
    const staff = [...staff_list]
    const residents = [...resident_list]
    const evaluations = [...evaluation_list]
    const assessments = [...assement_list]
    const dispatch = useDispatch()

    const handleSelectAssemenet = (id) => {
        const assessment = assessments.find(item => item.id === id)
        dispatch(assessmentActions.setSelectedAssessments(assessment))
    }

    const handleSelect = (evaluation_id, assement_id) => {
        const evaluation = evaluations.find(item => item.id === evaluation_id)
        const resident = residents.find(item => item.national_id === evaluation.resident)
        const assessment = assessments.find(item => item.id === assement_id)
        dispatch(residentActions.setSelectedResident(resident))
        dispatch(evaluationActions.setSelectedEvaluation(evaluation))
        dispatch(assessmentActions.setSelectedAssessments(assessment))
    }

    const selectedAssessment = (assessment_id) => {
        const selected = assessments.find(item => item.id === assessment_id);

        if (selected) {
            return `${selected.title} `
        } else {
            return `..... `

        }
    }
    const columns = [

        {
            name: "Assessment", selector: "assessment", sortable: true
            , cell: row => <div >
                <Link to='/assessment/detail'
                    onClick={() => { handleSelectAssemenet(row.assessment) }}>
                    {selectedAssessment(row.assessment)}
                </Link>
            </div>
        },
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
        },
        {
            name: "Action", cell: row =>
                <div data-tag="allowRowEvents" >
                    <ProtectedRoute perm="view_evaluation">
                        <Link to='/evaluation/deatil' onClick={() => { handleSelect(row.id, row.assessment) }}>
                            <i className='fas fa-pencil-alt ms-text-info  mr-4' />
                        </Link>
                    </ProtectedRoute>
                    <ProtectedRoute perm="delete_evaluation">
                        <Link to='#' onClick={() => { handleDelete(row.id) }}>
                            <i className='far fa-trash-alt ms-text-danger  mr-4' />
                        </Link>
                    </ProtectedRoute>
                </div>, sortable: true

        },
    ];

    const data = []

    const tableData = {
        columns: columns,
        data: evaluation_list,
    };

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
        const assessment = [...evaluation_list]
        const selected = assessment.find(item => item.id === id);
        Swal.fire({
            title: 'Are you sure you to delete the evaluation: ',
            text: `${selected.id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            if (result.value) {
                deleteApi(_ => {
                    Swal.fire('Deleted!', 'Evaluation has been deleted.', 'success');
                    setshowDelete(selected.id)
                }, token, '/api/evaluation/', selected.id)
            }
        });
    }

    useEffect(() => {
        getApi(response => { dispatch(evaluationActions.setEvaluation(response.data)); }, token, "/api/evaluation")
        getApi(response => { dispatch(assessmentActions.setAssessment(response.data)); }, token, "/api/assessment")
    }, [dispatch, token, showDelete])


    return (

        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Evaluations List</h6>
                <ProtectedRoute perm="add_evaluation">
                <Link to="/evaluation/add-evaluation" onClick={handleShowAddAssessment}>Sart Evaluation</Link>
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
                    <EditEvaluation handleClose={handleCloseEdit} />
                </Modal.Body>
            </Modal>

            <Modal show={showAddAssessment} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseAddAssessment} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Add Evaluation</h4>
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

