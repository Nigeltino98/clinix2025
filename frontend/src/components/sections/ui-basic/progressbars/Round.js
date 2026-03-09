import React, { useState } from 'react';
import Imagewithbutton from '../../../sections/ui-basic/cards/Imagewithbutton';
import { Modal } from 'react-bootstrap';
import AddWeight from '../../../modals/AddWeight';
import AddSleep from '../../../modals/AddSleep';
import AddMood from '../../../modals/AddMood';
import AddMorning from '../../../modals/AddMorning';
import AddAfternoon from '../../../modals/AddAfternoon';
import AddAccident from '../../../modals/AddAccident';
import AddFluid from '../../../modals/AddFluid';
import AddNote from '../../../modals/AddNote';
import AddDayNote from '../../../modals/AddDayNote';

const Round = () => {
    const [showWeight, setshowWeight] = useState(false)
    const [showSleep, setshowSleep] = useState(false)
    const [showMood, setshowMood] = useState(false)
    const [showMorning, setshowMorning] = useState(false)
    const [showAfternnon, setshowAfternoon] = useState(false)
    const [showAccident, setshowAccident] = useState(false)
    const [showDayNotes, setshowDayNotes] = useState(false)
    const [showNotes, setshowNotes] = useState(false)
    const [showFluid, setshowFluid] = useState(false)


    const handleClose = (care) => {
        switch (care) {
            case 'sleep':
                setshowSleep(false)
                break

            case 'weight':
                setshowWeight(false)
                break
            case 'mood':
                setshowMood(false)
                break
            case 'morning':
                setshowMorning(false)
                break
            case 'afternoon':
                setshowAfternoon(false)
                break

            case 'accident':
                setshowAccident(false)
                break
            case 'day_notes':
                setshowDayNotes(false)
                break
            case 'notes':
                setshowNotes(false)
                break
            case 'fluid':
                setshowFluid(false)
                break
            default:

        }
    }

    const handleOpen = (care) => {
        switch (care) {
            case 'sleep':
                setshowSleep(true)
                break

            case 'weight':
                setshowWeight(true)
                break
            case 'mood':
                setshowMood(true)
                break
            case 'morning':
                setshowMorning(true)
                break
            case 'afternoon':
                setshowAfternoon(true)
                break
            case 'accident':
                setshowAccident(true)
                break
            case 'day_notes':
                setshowDayNotes(true)
                break
            case 'notes':
                setshowNotes(true)
                break
            case 'fluid':
                setshowFluid(true)
                break

            default:

        }
    }
    return (
        <div className="row">
            <Imagewithbutton handleOpen={handleOpen} />

            {/* Modals */}
            <Modal show={showWeight} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => handleClose('weight')} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Record Weight</h4>
                    <button type="button" className="close text-white" onClick={() => handleClose('weight')}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddWeight handleClose={handleClose} />
                </Modal.Body>
            </Modal>

            <Modal show={showSleep} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => handleClose('sleep')} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Record Sleep</h4>
                    <button type="button" className="close text-white" onClick={() => handleClose('sleep')}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddSleep handleClose={handleClose} />
                </Modal.Body>
            </Modal>

            <Modal show={showMood} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => handleClose('mood')} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Record Mood</h4>
                    <button type="button" className="close text-white" onClick={() => handleClose('mood')}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddMood handleClose={handleClose} />
                </Modal.Body>
            </Modal>

            <Modal show={showMorning} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => handleClose('morning')} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Record Morning Routine</h4>
                    <button type="button" className="close text-white" onClick={() => handleClose('morning')}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddMorning handleClose={handleClose} />
                </Modal.Body>
            </Modal>
            <Modal show={showAfternnon} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => handleClose('afternoon')} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Record Afternoon Routine</h4>
                    <button type="button" className="close text-white" onClick={() => handleClose('afternoon')}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddAfternoon handleClose={handleClose} />
                </Modal.Body>
            </Modal>

            <Modal show={showAccident} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => handleClose('accident')} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Record Accident</h4>
                    <button type="button" className="close text-white" onClick={() => handleClose('accident')}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddAccident handleClose={handleClose} />
                </Modal.Body>
            </Modal>

            <Modal show={showDayNotes} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => handleClose('day_notes')} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Record Day Notes</h4>
                    <button type="button" className="close text-white" onClick={() => handleClose('day_notes')}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddDayNote handleClose={handleClose} />
                </Modal.Body>
            </Modal>

            <Modal show={showNotes} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => handleClose('notes')} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Record Notes</h4>
                    <button type="button" className="close text-white" onClick={() => handleClose('notes')}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddNote handleClose={handleClose} />
                </Modal.Body>
            </Modal>

            <Modal show={showFluid} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => handleClose('fluid')} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Record Fluid</h4>
                    <button type="button" className="close text-white" onClick={() => handleClose('fluid')}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AddFluid handleClose={handleClose} />
                </Modal.Body>
            </Modal>

        </div>
    );
}

export default Round;