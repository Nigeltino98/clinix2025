// src/components/SelectedRiskModal.js
import React from 'react';
import { Modal } from 'react-bootstrap';
import PrintButton from "../../../utils/print";

const SelectedRiskModal = ({ selectedrisk, show, onClose }) => {
    if (!selectedrisk) {
        return null;
    }

    return (
        <Modal show={show} className="ms-modal-dialog-width ms-modal-content-width" onHide={onClose} centered>
            <Modal.Header className="ms-modal-header-radius-0">
                <div>
                    <h1 style={{ fontSize: '24px', marginBottom: '0' }}>Seacole Healthcare </h1>
                    <h4 className="modal-title text-white">RISK</h4>
                    <p>Date recorded: {selectedrisk.created_on}</p>
                </div>
                <button type="button" className="close text-red w-20 mr-2" onClick={onClose}>x</button>
                <PrintButton />
            </Modal.Header>
            <Modal.Body style={{ padding: '20px', fontSize: '16px', lineHeight: '1.5' }}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{
                        border: '1px solid black',
                        background: 'lightgreen',
                        padding: '5px',
                        marginBottom: '5px'
                    }}>
                        <p style={{margin: '0'}}>First Name: {selectedrisk.resident}</p>
                    </div>

                    <div style={{border: '1px solid black', background: 'white', padding: '5px', marginBottom: '5px'}}>
                        <p style={{margin: '0'}}>Last Name: {selectedrisk.information_sources_used}</p>
                    </div>
                    <p>Risk details: {selectedrisk.details}</p>
                    <p>Any triggers: {selectedrisk.triggers}</p>
                    <p>Support needed: {selectedrisk.support_needs}</p>
                    <p>Further info needed: {selectedrisk.is_further_information_needed}</p>
                    <p>Staff responsible: {selectedrisk.created_by}</p>

                    {/* Display other note details here */}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default SelectedRiskModal;
