import React from 'react';
import { Modal } from 'react-bootstrap';
import dateToYMD from '../../../utils/dates';

const EvaluationsModal = ({ show, handleClose, plan, evaluations }) => {
    if (!plan) {
        return null;
    }

    console.log("Plan:", plan);
    console.log("Evaluations here:", evaluations);



    const evaluationsForPlan = evaluations.filter(evaluation => evaluation.support_plan === plan.id);

    return (
        <Modal show={show} onHide={handleClose}  centered
               backdrop={false}
               style={{ zIndex: 2000, opacity: 1}}
               backdropStyle={{ zIndex: 1999, opacity: 0.3}}
        >

            <Modal.Header closeButton>
                <Modal.Title>Evaluations for {plan.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Evaluated By</th>
                            <th>Comments</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {evaluations.length > 0 ? (
                            evaluationsForPlan.map((evaluation) => (
                                <tr key={evaluation.id}>

                                    <td>{evaluation.name_first} {evaluation.name_last}</td>
                                    <td>{evaluation.text}</td>
                                    <td>{new Date(evaluation.date).toLocaleDateString('en-CA')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No evaluations found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
            </Modal.Footer>
        </Modal>
    );
};

export default EvaluationsModal;
