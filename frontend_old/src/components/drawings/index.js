import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import CanvasDraw from "react-canvas-draw";
import { Form, InputGroup, Col, Modal } from 'react-bootstrap';
import { useIsMobileOrTablet } from "./isMobileOrTablet";
import "./styles.css";
import { postApi, getApi } from '../../api/api'
import bodymap from "../../../src/assets/img/504849373-vector_1_50.png"
import IonRangeSlider from 'react-ion-slider';
import { Link } from 'react-router-dom';
import AddAccident from '../modals/AddAccident';
import { suggestionActions } from '../../store/suggestion'


const combineDrawing = (canvasRef) => {
    const width = canvasRef.current.props.canvasWidth;
    const height = canvasRef.current.props.canvasHeight;
    const background = canvasRef.current.canvasContainer.children[0];
    const drawing = canvasRef.current.canvasContainer.children[1];
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // composite now
    canvas.getContext('2d').drawImage(background, 0, 0);
    canvas.getContext('2d').globalAlpha = 1.0;
    canvas.getContext('2d').drawImage(drawing, 0, 0);

    const dataUri = canvas.toDataURL('image/jpeg', 1.0);
    const data = dataUri.split(',')[1];
    const mimeType = dataUri.split(';')[0].slice(5);

    const bytes = window.atob(data);
    const buf = new ArrayBuffer(bytes.length);
    const arr = new Uint8Array(buf);

    for (let i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }

    const blob = new Blob([arr], { type: mimeType });
    return { blob: blob, dataUri: dataUri };
}



const DrawingApp = () => {
    const isMobOrTab = useIsMobileOrTablet();
    const saveableCanvas = useRef();
    const initialSatte = {
        color: "#34eb86",
        brushRadius: 10,
        lazyRadius: 2,
        height: 800,
        width: 739,
        comment: "",
        pain: "",
        treatment_plan: "",
        wound_lenght: "",
        wound_depth: "",
        wound_width: "",
        resident: "",
        staff: "",
        next_assement_date: "",
        colorValue: "Cut"
    }
    const [state, setState] = useState(initialSatte)
    const [validated, setValidated] = useState(false);

    const [showAccident, setshowAccident] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [errors, setErrors] = useState(false);
    const token = useSelector((state) => state.auth.token).token
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const suggestions = useSelector((state) => state.suggestion.suggestionList)
    const user = useSelector((state) => state.auth.user)
    const residents = useSelector((state) => state.resident.residentList)
    const dispatch = useDispatch()

    const handleReset = () => {
        setState(initialSatte)
    }
    const handleClose = () => {
        setshowAccident(false)
        setRefresh(prevState => (!prevState))
    }
    const handleOpen = () => {
        setshowAccident(true)
    }
    const handleChange = (event) => {
        switch (event.target.value) {
            case 'Bruise':
                setState({
                    ...state,
                    color: "#34eb86",
                    condition: "Bruise"

                })
                console.log(event.target.value)
                break;

            case 'Burns':
                setState({
                    ...state,
                    color: "#a87b32"
                })
                console.log(event.target.value)
                break;

            case 'Cut':
                setState({
                    ...state,
                    color: "#b8392e"
                })
                console.log(event.target.value)
                break;

            case 'Other':
                setState({
                    ...state,
                    color: "#ffffff"
                })
                break;

            case 'SkinTear':
                setState({
                    ...state,
                    color: "#09091c"
                })
                break;

            default:
        }
    }
    const handleChangeValue = (event) => {
        switch (event.target.name) {
            case 'comment':
                setState({
                    ...state,
                    comment: event.target.value
                })

                break;

            case 'pain':
                setState({
                    ...state,
                    pain: event.target.value
                })

                break;

            case 'wound_depth':
                setState({
                    ...state,
                    wound_depth: event.target.value
                })

                break;

            case 'wound_lenght':
                setState({
                    ...state,
                    wound_lenght: event.target.value
                })
                break;

            case 'wound_width':
                setState({
                    ...state,
                    wound_width: event.target.value
                })
                break;

            case 'next_assement_date':
                setState({
                    ...state,
                    next_assement_date: event.target.value
                })
                break;

            case 'treatment_plan':
                setState({
                    ...state,
                    treatment_plan: event.target.value
                })
                break;

            case 'accident':
                setState({
                    ...state,
                    accident: event.target.value
                })
                break;


            default:
        }
    }
    // const handleSubmit = (event) => {
    //     setValidated(true);
    //     event.preventDefault();
    //     const form = event.currentTarget;
    //     if (form.checkValidity() === false) {
    //         event.stopPropagation();
    //     } else {
    //         postApi(() => { handleReset() }, token, "/api/body-map/", state, errors_list => { setErrors(errors_list) })
    //     }
    // };
    const saveImage = (blob, filename, token) => {
        blob.filename = filename
        const fd = new FormData();
        fd.append('comment', state.comment);
        fd.append('pain', state.pain);
        fd.append('wound_depth', state.wound_depth);
        fd.append('attachment', blob, filename);
        fd.append('wound_lenght', state.wound_lenght);
        fd.append('wound_width', state.wound_width);
        fd.append('next_assement_date', state.next_assement_date);
        fd.append('treatment_plan', state.treatment_plan);
        fd.append('staff', state.staff);
        fd.append('resident', state.resident);
        fd.append('accident', state.accident);
        postApi(() => { handleReset() }, token, "/api/body-map/", fd, errors_list => { setErrors(errors_list) })
    }
    const handleSave = (saveableCanvas, token) => {
        const { blob, dataUri } = combineDrawing(saveableCanvas);
        saveImage(blob, 'test.jpg', token)
    }
    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            resident: selected_resident.national_id,
            staff: user.id,
        }))
    }, [dispatch, token])

    useEffect(() => {
        getApi(response => {
            dispatch(suggestionActions.setSuggestions(response.data));
        }, token, "/api/suggestion")
    }, [dispatch, token, refresh])

    return (
        <div className="App">
            <div className="col-12">
                <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-header">
                        <h6>Use your mouse to draw on image</h6>
                    </div>
                    <div className="ms-panel-body">

                        <div className='container'>
                            <div className='row'>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label htmlFor="exampleSelect">Condition</label>
                                        <select className="form-control" id="exampleSelect"
                                            onChange={e => handleChange(e)}>
                                            <option value="Bruise" className='btn-primary'>Bruise </option>
                                            <option value="Burns" className='btn-warning'>Burns</option>
                                            <option value="Cut" className='btn-danger'>Cut</option>
                                            <option value="Other" >Other</option>
                                            <option value="SkinTear" className='btn-dark'>Skin Tear</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4 ml-auto mr-auto">
                                    <div className="ms-range-slider my-4">
                                        <IonRangeSlider skin={'round'}
                                            onFinish={(e) => setState({
                                                ...state,
                                                brushRadius: parseInt(e.from)
                                            })} />
                                    </div>
                                </div>

                                <div className="col-md-3 ml-auto mr-auto">
                                    <button type="button" className="btn btn-danger btn-block has-icon"
                                        onClick={() => {
                                            localStorage.setItem(
                                                "savedDrawing",
                                                saveableCanvas.current.clear()
                                            );
                                        }}><i className="flaticon-alert-1" /> Clear</button>
                                </div>
                                <div className="col-md-3 ml-auto mr-auto">
                                    <button type="button" className="btn btn-warning btn-block has-icon ml-1"
                                        onClick={() => {
                                            localStorage.setItem(
                                                "savedDrawing",
                                                saveableCanvas.current.undo()
                                            );
                                        }}
                                    ><i className="flaticon-alert" /> Undo</button>
                                </div>
                            </div>
                        </div>
                        <div className='container'>
                            <div className='row'>
                                <div className="col-12">
                                    <center>
                                        <CanvasDraw
                                            brushColor={state.color}
                                            brushRadius={state.brushRadius}
                                            lazyRadius={state.lazyRadius}
                                            canvasWidth={state.width}
                                            canvasHeight={state.height}
                                            ref={saveableCanvas}
                                            imgSrc={bodymap}
                                        />
                                    </center>

                                </div>
                            </div>

                        </div>

                        <div className="form-group container pt-1">
                            <Form noValidate validated={validated}>
                                <Form.Row>
                                    <Form.Group as={Col} md="3" controlId="validationCustom07">
                                        <Form.Label>Comment</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text"
                                                onChange={(e) => handleChangeValue(e)}
                                                placeholder="Comment"
                                                name="comment"
                                                value={state.comment}
                                            >
                                            </Form.Control>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" controlId="validationCustom07">
                                        <Form.Label>Treatment Plan</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text"
                                                onChange={(e) => handleChangeValue(e)}
                                                placeholder="Treatment Plan"
                                                name="treatment_plan"
                                                value={state.treatment_plan}
                                            >
                                            </Form.Control>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" controlId="validationCustom07">
                                        <Form.Label>Length (mm)</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                name="wound_lenght"
                                                required
                                                min={0}
                                                max={10}
                                                step={1}
                                                onChange={handleChangeValue}
                                                value={state.wound_lenght}
                                                type="number"
                                                placeholder="Length"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" controlId="validationCustom07">
                                        <Form.Label>Width (mm)</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                name="wound_width"
                                                required
                                                min={0}
                                                max={10}
                                                step={1}
                                                onChange={handleChangeValue}
                                                value={state.wound_width}
                                                type="number"
                                                placeholder="Width"
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group as={Col} md="3" controlId="validationCustom07">
                                        <Form.Label>Depth (mm)</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                name="wound_depth"
                                                required
                                                min={0}
                                                max={10}
                                                step={1}
                                                onChange={handleChangeValue}
                                                value={state.wound_depth}
                                                type="number"
                                                placeholder="Depth"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" controlId="validationCustom07">
                                        <Form.Label>Pain</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                name="pain"
                                                required
                                                min={0}
                                                max={10}
                                                step={1}
                                                onChange={handleChangeValue}
                                                value={state.pain}
                                                type="number"
                                                placeholder="Pain"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" controlId="validationCustom01">
                                        <Form.Label>Review Date</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                name="next_assement_date"
                                                onChange={handleChangeValue}
                                                required
                                                value={state.next_assement_date}
                                                type="datetime-local"
                                                placeholder="Review Date"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    {JSON.stringify(selected_resident) === '{}' &&
                                        <Form.Group as={Col} md="3" controlId="validationCustom04">
                                            <Form.Label>Resident</Form.Label>
                                            {errors.resident && errors.resident.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                            <InputGroup>
                                                <Form.Control as="select" onChange={handleChangeValue}
                                                    name="resident"
                                                    required
                                                    value={state.resident}
                                                >
                                                    <option key="2a" > ------------- </option>
                                                    {residents.map(user => (
                                                        <option key={user.national_id} value={user.national_id}>{user.first_name} {user.last_name}</option>
                                                    ))}
                                                </Form.Control>
                                            </InputGroup>
                                        </Form.Group>
                                    }
                                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                                        <Form.Label>Accident/Incident</Form.Label>
                                        {errors.accident && errors.accident.map(err => { return (<p key={err} className='ms-text-danger'>{err}</p>) })}
                                        <InputGroup>
                                            <Form.Control as="select" onChange={handleChangeValue}
                                                name="accident"
                                                required
                                                value={state.accident}
                                            >
                                                <option key="2a" > ------------- </option>
                                                {suggestions.map(suggestion => (
                                                    <option key={suggestion.id} value={suggestion.id}>{suggestion.subject}</option>
                                                ))}
                                            </Form.Control>
                                            <Link to="#" onClick={handleOpen}><i className="fa fa-plus ml-2 fa-2x" />   </Link>

                                        </InputGroup>
                                    </Form.Group>
                                </Form.Row>
                                <button type="button" className="btn btn-success has-icon"
                                    onClick={() => {
                                        handleSave(saveableCanvas, token);
                                    }}><i className="flaticon-tick-inside-circle" /> Save</button>
                            </Form>
                            <Modal show={showAccident} className="ms-modal-dialog-width ms-modal-content-width" onHide={() => handleClose('accident')} centered>
                                <Modal.Header className="ms-modal-header-radius-0">
                                    <h4 className="modal-title text-white">Record Accident</h4>
                                    <button type="button" className="close text-white" onClick={() => handleClose('accident')}>x</button>
                                </Modal.Header>
                                <Modal.Body className="p-0 text-left">
                                    <AddAccident handleClose={handleClose} />
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}
export default DrawingApp