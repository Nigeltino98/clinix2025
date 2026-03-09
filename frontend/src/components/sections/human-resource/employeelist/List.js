import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { useDispatch, useSelector } from 'react-redux'
import { deleteApi, getApi } from '../../../../api/api'
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2'
import AddAnswers from '../../../modals/AddAnswers';
import EditQuestion from '../../../modals/EditQuestion';
import EditAnswers from '../../../modals/EditAnswers';
import { questionAction } from '../../../../store/question'
import { answerActions } from '../../../../store/answer'



const Addform = () => {
    const [showEdit, setshowEdit] = useState(false)
    const [showAddPossibleAnswer, setshowAddPossibleAnswer] = useState(false)
    const [showEditPossibleAnswer, setshowEditPossibleAnswer] = useState(false)
    const selected_assement = useSelector((state) => state.assessment.selectedAssessment)

    const token = useSelector((state) => state.auth.token).token
    const dispatch = useDispatch()
    const question_list = useSelector((state) => state.question.questionList)
    const ans_list = useSelector((state) => state.answer.answerList)
    const questions = [...question_list]
    const qns = questions.filter(item => item.assement === selected_assement.id)

    const getAnsersForQn = (qn) => {
        return ans_list.filter(item => item.question === qn)
    }

    // const get_all_ans = (all_ids, item) => {
    //     if (item.id in qns_id) {
    //         if (item.id in qns_id) {
    //             return all_ids
    //         }
    //         return [...all_ids, item.id]
    //     }
    //     return all_ids
    // }

    // const ans = ans_l.reduce(get_all_ans, [])
    // console.log(ans)
    const handleShowAddPossibleAnswer = (id) => {
        const selected = qns.find(item => item.id === id);
        dispatch(questionAction.setSelectedQuestion(selected))
        setshowAddPossibleAnswer(true)
    }

    const handleCloseAddPossibleAnswer = () => {
        setshowAddPossibleAnswer(false)
    }

    const handleShowEditPossibleAnswer = (id) => {
        const selected = ans_list.find(item => item.id === id);
        dispatch(answerActions.setSelectedAnswer(selected))
        setshowEditPossibleAnswer(true)
    }

    const handleCloseEditPossibleAnswer = () => {
        setshowEditPossibleAnswer(false)
    }


    const columns = [


        {
            name: "Question", cell: row => <div >
                {row.question}
            </div>, sortable: true
        },
        {
            name: "Anwsers", cell: row => <ol >
                {getAnsersForQn(row.id).map(answser => <li key={answser.id}><Link to="#" onClick={_ => handleShowEditPossibleAnswer(answser.id)}>{answser.answear} ({answser.score})</Link></li>)}
            </ol>, sortable: true
        },
        {
            name: "Action", cell: row =>
                <div data-tag="allowRowEvents" >
                    <Link to='#' onClick={() => handleShowEdit(row.id)}>
                        <i className='fas fa-pencil-alt ms-text-info  mr-4' />
                    </Link>
                    <Link to='#' onClick={() => { handleDelete(row.id) }}>
                        <i className='far fa-trash-alt ms-text-danger  mr-4' />
                    </Link>
                    <Link to='#' onClick={() => { handleShowAddPossibleAnswer(row.id) }}>
                        Add Possible Answer
                    </Link>
                </div>, sortable: true

        },
    ];

    const data = []

    const tableData = {
        columns: columns,
        data: qns,
    };

    const handleShowEdit = (id) => {
        const selected = qns.find(item => item.id === id);
        dispatch(questionAction.setSelectedQuestion(selected))
        setshowEdit(true)
    }


    const handleCloseEdit = () => {
        setshowEdit(false)
    }


    const handleDelete = (id) => {
        const selected = qns.find(item => item.id === id);
        Swal.fire({
            title: 'Are you sure you to delete question: ',
            text: `${selected.qns}`,
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
        getApi(response => { dispatch(questionAction.setQuestion(response.data)); }, token, "/api/question")
        getApi(response => { dispatch(answerActions.setAnswers(response.data)); }, token, "/api/posible-answear/")
    }, [dispatch, token, showEdit, showEditPossibleAnswer, showAddPossibleAnswer])

    return (

        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Assesment ({selected_assement.title})</h6>
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
                    <h4 className="modal-title text-white">Edit Question</h4>
                    <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <EditQuestion handleClose={handleCloseEdit} />
                </Modal.Body>
            </Modal>
            <Modal show={showAddPossibleAnswer} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseAddPossibleAnswer} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Add Answer</h4>
                    <button type="button" className="close text-white" onClick={handleCloseAddPossibleAnswer}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddAnswers handleClose={handleCloseAddPossibleAnswer} />
                </Modal.Body>
            </Modal>

            <Modal show={showEditPossibleAnswer} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEditPossibleAnswer} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Edit Answer</h4>
                    <button type="button" className="close text-white" onClick={handleCloseEditPossibleAnswer}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <EditAnswers handleClose={handleCloseEditPossibleAnswer} />
                </Modal.Body>
            </Modal>
        </div>


    );
}


export default Addform;

