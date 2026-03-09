import React, { useEffect, useState } from 'react';
import Breadcrumb from './Breadcrumb';
import Withgap from './Withgap';
import { useSelector, useDispatch } from 'react-redux'
import { answerActions } from '../../../../store/answer'
import { questionAction } from '../../../../store/question'
import { getApi } from '../../../../api/api'
import { Button, Modal } from 'react-bootstrap';
import { choiceActions } from '../../../../store/choice'
import { Link } from 'react-router-dom';


const Content = () => {
    const [state, setState] = useState({ result: 0, showresult: false })
    const question_list = useSelector((state) => state.question.questionList)
    const answer_list = useSelector((state) => state.answer.answerList)
    const choice_list = useSelector((state) => state.choice.choiceList)
    const selected_evaluation = useSelector((state) => state.evaluation.selectedEvaluation)
    const token = useSelector((state) => state.auth.token).token
    const dispatch = useDispatch()
    const questions = [...question_list]
    const selected_assement = useSelector((state) => state.assessment.selectedAssessment)
    const selcted_resident = useSelector((state) => state.resident.selectedResident)
    const qns = questions.filter(item => item.assement === selected_assement.id)
    const [update, setUpdate] = useState(false);
    let x = []
    qns.forEach(qn => (
        x.push({ answers: answer_list.filter(item => item.question === qn.id), question: qn })
    ))
    const handleShowClose = () => {
        setState({
            ...state,
            showresult: false
        })
    }
    let choices = [...choice_list]

    const successHandler = () => {
        setUpdate(!update)
    }

    const totalScore = () => {
        const ansers = choices.map(choice => {
            return (answer_list.find(item => item.id === choice.answer))
        })
        const total = ansers.reduce((x, y) => {
            return x + y.score;
        }, 0);
        setState({
            // showresult: true,
            result: total
        })
    }

    const cleanChoices = (data) => {
        const tt = data.filter(item => +item.evaluation === selected_evaluation.id)
        dispatch(choiceActions.setChoices(tt))
    }

    useEffect(() => {
        totalScore()
    }, [choice_list])

    useEffect(() => {
        getApi(response => { dispatch(answerActions.setAnswers(response.data)); }, token, "/api/posible-answear")
        getApi(response => { dispatch(questionAction.setQuestion(response.data)); }, token, "/api/question")
        getApi(response => { cleanChoices(response.data) }, token, "/api/choice")
    }, [dispatch, token, update])

    return (
        <div className="ms-content-wrapper">
            <div className="row">
                <div className="col-md-12">
                    <Breadcrumb />
                    <h3>{selected_assement.title} for {selcted_resident.first_name} {selcted_resident.last_name} </h3>
                    <h3>Score <b>{state.result} </b>  </h3>
                    {x.map((ass, i) => ( //TODO: disabled dynamic
                        <Withgap assessment={ass} key={i} number={i} disabled={false} successHandler={successHandler} />
                    ))
                    }
                    <div className="invoice-buttons text-right">
                        <Button type="button" className="mr-2">
                            <Link to="/evaluation">
                                Submit and Close
                            </Link>
                        </Button>
                    </div>
                </div>
                <Modal show={state.showresult} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleShowClose} centered>
                    <Modal.Header className="ms-modal-header-radius-0">
                        <h4 className="modal-title text-white">Score : {state.result}</h4>
                        <button type="button" className="close text-white" onClick={handleShowClose}>x</button>
                    </Modal.Header>
                    <Modal.Body className="p-0 text-left">
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default Content;