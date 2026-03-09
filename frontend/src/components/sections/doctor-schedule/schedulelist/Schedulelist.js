import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Form, InputGroup, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { residentActions } from '../../../../store/resident'
import { bathActions } from '../../../../store/bath'
import { weightActions } from '../../../../store/weight'
import { fluidIntakeActions } from '../../../../store/fluidIntake'
import { moodActions } from '../../../../store/mood'
import { sleepActions } from '../../../../store/sleep'
import { careActions } from '../../../../store/care'
import { afternoonRoutineActions } from '../../../../store/afternoonRoutine'
import { morningRoutineActions } from '../../../../store/morningRoutine'
import { incidentActions } from '../../../../store/incident'
import { Modal } from 'react-bootstrap';
import { getApi } from '../../../../api/api'
import { selectedResident, selectedStaff, addEmojis } from '../../../utils/expand'
import dateToYMD from '../../../utils/dates'
import { homeActions } from '../../../../store/home'
import PrintButton from '../../../utils/print'



const Schedulelist = () => {

    const residents = useSelector((state) => state.resident.residentList)
    const showCare = useSelector((state) => state.care.care)
    const staff = useSelector((state) => state.staff.staffList)
    const fluids = useSelector((state) => state.fluidIntake.fluidIntakeList)
    const moods = useSelector((state) => state.mood.moodList)
    const sleep = useSelector((state) => state.sleep.sleepList)
    const weights = useSelector((state) => state.weight.weightList)
    const morningRoutine = useSelector((state) => state.morningRoutine.morningRoutineList)
    const afternoonRoutine = useSelector((state) => state.afternoonRoutine.afternoonRoutineList)
    const incident = useSelector((state) => state.incident.incidentList)
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const selectedBaths = useSelector((state) => state.resident.selectedBaths)
    const selectedWeights = useSelector((state) => state.resident.selectedWeights)
    const selectedFluids = useSelector((state) => state.resident.selectedFluids)
    const selectedMoods = useSelector((state) => state.resident.selectedMoods)
    const selectedSleeps = useSelector((state) => state.resident.selectedSleeps)
    const selectedMorningRoutines = useSelector((state) => state.resident.selectedMorningRoutine)
    const selectedAfternoonRoutines = useSelector((state) => state.resident.selectedAfternoonRoutine)
    const selectedIncident = useSelector((state) => state.resident.selectedIncident)
    const homes = useSelector((state) => state.home.homeList);

    const token = useSelector((state) => state.auth.token).token

    const dispatch = useDispatch();
    const [tableData, setTableData] = useState({ columns: [], data: [] });
    const [present_care, setPresentCare] = useState(null);
    const [fromdate, setFromDate] = useState(Date.now());
    const [todate, setToDate] = useState(Date.now());
    const [selectedHome, setSelectedHome] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setshowEdit] = useState(false)
    const handleCloseEdit = () => {
        setshowEdit(false)
    }

    const handleRowClick = (row) => {
        setSelectedRow(row);
        console.log("Selected Care", selectedRow);
        setShowModal(true);
    };

    const handleHomeChange = (event) => {
        const selectedHomeId = event.target.value;
        setSelectedHome(selectedHomeId);
        dispatch(residentActions.setSelectedResident({})); // Clear selected resident when home changes
        // Fetch residents based on the selected home ID and dispatch the action to update the resident list
        if (selectedHomeId) {
            getApi(response => { dispatch(residentActions.setResidents(response.data)); }, token, `/api/resident?home=${selectedHomeId}`);
        } else {
            // If no home is selected, fetch all residents
            getApi(response => { dispatch(residentActions.setResidents(response.data)); }, token, '/api/resident');
        }
    };

    const weight_columns = [
        {
            name: "Created On", cell: row =>
                <div >
                    {dateToYMD(row.created_on)}
                </div>, sortable: true
        },
        {
            name: "Resident", cell: row =>
                <div >
                    {selectedResident(row.resident, residents)}
                </div>, sortable: true
        },
        {
            name: "Recorded By", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        },

        { name: "Weight", selector: "weight", sortable: true },
        { name: "Additional Infomation", selector: "additional_info", sortable: true },
        {
            name: "Emotion", cell: row =>
                <div >
                    {addEmojis(row.emotion)}
                </div>, sortable: true
        },

    ];

    const mood_columns = [
        {
            name: "Created On", cell: row =>
                <div >
                    {dateToYMD(row.created_on)}
                </div>, sortable: true
        },
        {
            name: "Resident", cell: row =>
                <div >
                    {selectedResident(row.resident, residents)}
                </div>, sortable: true
        },
        {
            name: "Recorded By", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        },
        { name: "Additional Infomation", selector: "additional_info", sortable: true },
        {
            name: "Emotion", cell: row =>
                <div >
                    {addEmojis(row.emotion)}
                </div>, sortable: true
        },
    ];

    const sleep_columns = [
        {
            name: "Created On", cell: row =>
                <div >
                    {dateToYMD(row.created_on)}
                </div>, sortable: true
        },
        {
            name: "Resident", cell: row =>
                <div >
                    {selectedResident(row.resident, residents)}
                </div>, sortable: true
        },
        {
            name: "Recorded By", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        },

        { name: "Hours Slept", selector: "amount", sortable: true },
        { name: "Additional Infomation", selector: "additional_info", sortable: true },
        {
            name: "Emotion", cell: row =>
                <div >
                    {addEmojis(row.emotion)}
                </div>, sortable: true
        },
    ];


    const fluid_columns = [
        {
            name: "Created On", cell: row =>
                <div >
                    {dateToYMD(row.created_on)}
                </div>, sortable: true
        },
        {
            name: "Resident", cell: row =>
                <div >
                    {selectedResident(row.resident, residents)}
                </div>, sortable: true
        },
        {
            name: "Recorded By", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        },

        { name: "Amount Offered", selector: "amount_offered", sortable: true },
        { name: "Amount Taken", selector: "amount", sortable: true },
        { name: "Type Of Fluid", selector: "type_of_fluid", sortable: true },
        { name: "Additional Infomation", selector: "additional_info", sortable: true },
        { name: "Additional Infomation", selector: "additional_info", sortable: true },
        {
            name: "Emotion", cell: row =>
                <div >
                    {addEmojis(row.emotion)}
                </div>, sortable: true
        },];

    const morningRoutine_columns = [
        {
            name: "Created On", cell: row =>
                <div >
                    {dateToYMD(row.created_on)}
                </div>, sortable: true
        },
        {
            name: "Resident", cell: row =>
                <div >
                    {selectedResident(row.resident, residents)}
                </div>, sortable: true
        },
        {
            name: "Recorded By", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        },

        { name: "Washing", selector: "washing", sortable: true },
        { name: "Shaving ", selector: "shaving", sortable: true },
        { name: "Oral Care ", selector: "oral_care", sortable: true },
        { name: "Toilet Use", selector: "toilet_use", sortable: true },
        { name: "Getting Up ", selector: "getting_up", sortable: true },
        { name: "Getting Dressed ", selector: "getting_dressed", sortable: true },
        { name: "Additional Infomation", selector: "additional_info", sortable: true },
        {
            name: "Emotion", cell: row =>
                <div >
                    {addEmojis(row.emotion)}
                </div>, sortable: true
        },
    ];

    const afternoonRoutine_columns = [
        {
            name: "Created On", cell: row =>
                <div >
                    {dateToYMD(row.created_on)}
                </div>, sortable: true
        },
        {
            name: "Resident", cell: row =>
                <div >
                    {selectedResident(row.resident, residents)}
                </div>, sortable: true
        },
        {
            name: "Recorded By", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        },

        { name: "Washing", selector: "washing", sortable: true },
        { name: "Shaving ", selector: "shaving", sortable: true },
        { name: "Oral Care ", selector: "oral_care", sortable: true },
        { name: "Toilet Use", selector: "toilet_use", sortable: true },
        { name: "Getting Up ", selector: "getting_up", sortable: true },
        { name: "Getting Dressed ", selector: "getting_dressed", sortable: true },
        { name: "Additional Infomation", selector: "additional_info", sortable: true },
        {
            name: "Emotion", cell: row =>
                <div >
                    {addEmojis(row.emotion)}
                </div>, sortable: true
        },
    ];

    const incident_columns = [
        { name: "Ref  Number", selector: "id", sortable: true },
        {
            name: "Created On", cell: row =>
                <div>
                    {dateToYMD(row.created_on)}
                </div>, sortable: true
        },
        {
            name: "Resident", cell: row =>
                <div>
                    {selectedResident(row.resident, residents)}
                </div>, sortable: true
        },
        {
            name: "Recorded By", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        },

        { name: "Type", selector: "report_type", sortable: true },
        { name: "Subject ", selector: "subject", sortable: true },
        { name: "Notes  ", selector: "follow_up_notes", sortable: true },
        { name: "Action ", selector: "future_preventative_action", sortable: true },
        { name: "Action Taken ", selector: "action_taken", sortable: true },
        { name: "Details", selector: "inident_details", sortable: true },
        { name: "Location", selector: "location", sortable: true },
        { name: "Date Occured", selector: "date_occured", sortable: true },
        { name: "Review Date", selector: "next_assement_date", sortable: true },
        { name: "Status", selector: "status", sortable: true },

    ];



    useEffect(() => {
        getApi(response => { dispatch(residentActions.setResidents(response.data)) }, token, "/api/resident")
        getApi(response => { dispatch(bathActions.setBaths(response.data)) }, token, "/api/bath")
        getApi(response => { dispatch(weightActions.setWeight(response.data)) }, token, "/api/weight")
        getApi(response => { dispatch(fluidIntakeActions.setFluidIntake(response.data)) }, token, "/api/fluid-intake")
        getApi(response => { dispatch(moodActions.setMoods(response.data)); }, token, "/api/mood")
        getApi(response => { dispatch(sleepActions.setSleep(response.data)) }, token, "/api/sleep")
        getApi(response => { dispatch(morningRoutineActions.setMorningRoutine(response.data)) }, token, "/api/morning-routine")
        getApi(response => { dispatch(afternoonRoutineActions.setAfternoonRoutine(response.data)) }, token, "/api/afternoon-routine")
        getApi(response => { dispatch(incidentActions.setIncident(response.data)); }, token, "/api/suggestion")
        getApi(response => { dispatch(homeActions.setHomes(response.data)); }, token, "/api/home");
    }, [dispatch, token])



    useEffect(() => {
        if (showCare.fluidIntake === true) {
            setPresentCare("Fluid-Intake")
            setTableData({
                columns: fluid_columns,
                data: selectedFluids,
            })
        } if (showCare.weight === true) {
            setPresentCare("Weight")
            setTableData({
                columns: weight_columns,
                data: selectedWeights,
            })

        } if (showCare.mood === true) {
            setPresentCare("Mood")
            setTableData({
                columns: mood_columns,
                data: selectedMoods,

            })
        } if (showCare.sleep === true) {
            setPresentCare("Sleep")
            setTableData({
                columns: sleep_columns,
                data: selectedSleeps,
            })
        } if (showCare.morningRoutine === true) {
            setPresentCare("Morning-Routine")
            setTableData({
                columns: morningRoutine_columns,
                data: selectedMorningRoutines,
            })
        } if (showCare.afternoonRoutine === true) {
            setPresentCare("Afternoon-Routine")
            setTableData({
                columns: afternoonRoutine_columns,
                data: selectedAfternoonRoutines,
            })
        } if (showCare.incident === true) {
            setPresentCare("Incident")
            setTableData({
                columns: incident_columns,
                data: selectedIncident,

            })
        } if (selectedHome) {
            const filteredResidents = residents.filter(resident => resident.home === selectedHome);
            }

    }, [showCare, selectedWeights, selectedBaths, selectedFluids, selectedMoods, selectedSleeps, selected_resident,
        selectedMorningRoutines, selectedAfternoonRoutines, selectedIncident, selectedHome])

    useEffect(() => {
        if (JSON.stringify(selected_resident) === '{}') {
            dispatch(residentActions.setWeights(weights));
            dispatch(residentActions.setFluids(fluids));
            dispatch(residentActions.setMoods(moods))
            dispatch(residentActions.setSleeps(sleep))
            dispatch(residentActions.setMorningRoutine(morningRoutine));
            dispatch(residentActions.setAfternoonRoutine(afternoonRoutine));
            dispatch(residentActions.setIncident(incident))

        } else {
            const selected_weights = weights.filter(item => item.resident === selected_resident.national_id)
            const selected_fluid = fluids.filter(item => item.resident === selected_resident.national_id)
            const selected_moods = moods.filter(item => item.resident === selected_resident.national_id)
            const selected_sleep = sleep.filter(item => item.resident === selected_resident.national_id)
            const selected_morningRoutine = morningRoutine.filter(item => item.resident === selected_resident.national_id)
            const selected_afternoonRoutine = afternoonRoutine.filter(item => item.resident === selected_resident.national_id)
            const selected_incident = incident.filter(item => item.resident === selected_resident.national_id)

            dispatch(residentActions.setWeights(selected_weights));
            dispatch(residentActions.setFluids(selected_fluid));
            dispatch(residentActions.setMoods(selected_moods))
            dispatch(residentActions.setSleeps(selected_sleep))
            dispatch(residentActions.setMorningRoutine(selected_morningRoutine))
            dispatch(residentActions.setAfternoonRoutine(selected_afternoonRoutine));
            dispatch(residentActions.setIncident(selected_incident))
        }

    }, [selected_resident])



    const handleChange = (event) => {
        switch (event.target.name) {
            case 'resident':
                if (event.target.value === 'all') {
                    dispatch(residentActions.setSelectedResident({}))
                } else {
                    const resident_list = [...residents]
                    const resident = resident_list.find(item => item.national_id === event.target.value);
                    dispatch(residentActions.setSelectedResident(resident))
                }
                break;

            case 'fromdate':
                setFromDate(event.target.value)
                break;

            case 'todate':
                setToDate(event.target.value)
                break;

            case 'selectedHome':
               if (event.target.value === 'all') {
                  setSelectedHome(null);
               } else {
                   const selectedHome = homes.find(home => home.id === event.target.value);
                   setSelectedHome(selectedHome);
               }
               break;
            default:
        }
    }

    const handleCare = (event) => {
		const careType = event.target.value;
		setPresentCare(careType);
		setShowModal(true);

        switch (careType) {
            case 'Fluid-Intake':
                dispatch(careActions.setCare({
                    weight: false, bath: false,
                    mood: false, sleep: false,
                    fluidIntake: true, morningRoutine: false,
                    afternoonRoutine: false,
                    incident: false,
                }));
				setTableData({
                    columns: fluid_columns,
                    data: selectedFluids,
                });

                break;
            case 'Weight':
                dispatch(careActions.setCare({
                    bath: false,
                    mood: false, sleep: false,
                    fluidIntake: true,
                    weight: true, morningRoutine: false,
                    afternoonRoutine: false,
                    incident: false,
                }));
                setTableData({
                    columns: weight_columns,
                    data: selectedWeights,
                });
                break;
            case 'Mood':

                dispatch(careActions.setCare({
                    weight: false, bath: false,
                    mood: true, sleep: false,
                    fluidIntake: false, morningRoutine: false,
                    afternoonRoutine: false,
                    incident: false,
                }));
				setTableData({
                    columns: mood_columns,
                    data: selectedMoods,
                });
                break;
            case 'Sleep':
                dispatch(careActions.setCare({
                    weight: false, bath: false,
                    mood: false, sleep: true,
                    fluidIntake: false, morningRoutine: false,
                    afternoonRoutine: false,
                    incident: false,
                }));
				setTableData({
                    columns: sleep_columns,
                    data: selectedSleeps,
                });
                break;
            case 'Morning-Routine':

                dispatch(careActions.setCare({
                    weight: false, bath: false,
                    mood: false, sleep: false,
                    fluidIntake: false, morningRoutine: true,
                    afternoonRoutine: false,
                    incident: false,
                }));
				setTableData({
                    columns: morningRoutine_columns,
                    data: selectedMorningRoutines,
                });
                break;
            case 'Afternoon-Routine':
                dispatch(careActions.setCare({
                    weight: false, bath: false, mood: false,
                    sleep: false, fluidIntake: false,
                    morningRoutine: false,
                    afternoonRoutine: true,
                    incident: false,
                }));
				setTableData({
                    columns: afternoonRoutine_columns,
                    data: selectedAfternoonRoutines,
                });
                break;
            case 'Incident':
                dispatch(careActions.setCare({
                    weight: false,
                    mood: false, sleep: false,
                    fluidIntake: false,
                    bath: true, morningRoutine: false,
                    afternoonRoutine: false,
                    incident: true,
                }));
				setTableData({
                    columns: incident_columns,
                    data: selectedIncident,
                });
                break;
            default:
        }
    }


    //adding a test for displaying weight Modal
    const SelectedRowModal = () => {
		if (!selectedRow) {
		   return null;
		}

	const onClose = () => {
		setSelectedRow(null);
		setshowEdit(false);
	};

         return (
		    <Modal show={true} className="ms-modal-dialog-width ms-modal-content-width" onHide={onClose} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                 <div>
                    <h1 style={{ fontSize: '24px', marginBottom: '0' }}>Seacole Health</h1>
                    <h4 className="modal-title text-white">Selected Note</h4>
                    <p>Date recorded: {selectedWeights.created_on}</p>
                 </div>
                    <button type="button" className="close text-red w-20 mr-2" onClick={onClose}>x</button>
                    <PrintButton />
                </Modal.Header>
                <Modal.Body style={{ padding: '20px', fontSize: '16px', lineHeight: '1.5' }}>
                    <div>
                        <h5>Subject: {selectedWeights}</h5>
                        <p>Entry: {selectedWeights.resident_id}</p>
                        <p>Type of note: {selectedWeights.weight}</p>
                        <p>Staff responsible: {selectedWeights.staff_id}</p>
                        <p>Type of note: {selectedWeights.emotion}</p>
                        <p>Staff responsible: {selectedWeights.additional_info}</p>

                        {/* Display other note details here */}
                    </div>
                </Modal.Body>
            </Modal>
         );
    };


//the function for displaying the note ends here


    return (
        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Handover : {present_care}</h6>
            </div>
            <div className="ms-panel-header ms-panel-custome">

                <Form>
                    <Form.Row>
                        <Form.Group as={Col} md="3" className="mb-3" controlId="validationCustom01">
                            <Form.Label>Resident </Form.Label>
                            <InputGroup>
                                <Form.Control as="select" onChange={handleChange}
                                    name="resident" value={selected_resident.national_id ? selected_resident.national_id : 'all'} >
                                    <option key="2a" value="all" > All </option>
                                    {residents.map(resident => (
                                        <option key={resident.national_id} value={resident.national_id}>{resident.first_name} {resident.last_name}</option>
                                    ))}
                                </Form.Control>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="3" className="mb-3" controlId="validationCustom01">
                            <Form.Label>Selected Care</Form.Label>
                            <Form.Control as="select"
                                name="careType"
                                value={present_care}
                                onChange={handleCare}
                            >
                                <option>-- Select Care --</option>
                                <option value="Weight">Weight</option>
                                <option value="Sleep">Sleep</option>
                                <option value="Mood">Mood</option>
                                <option value="Morning-Routine">Morning Routine</option>
                                <option value="Afternoon-Routine">Afternoon Routine</option>
                                <option value="Incident">Incidents</option>
                                <option value="Fluid-Intake">Fluid Intake</option>
                                <option value="Bath">Bath</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md="3" className="mb-3" controlId="validationCustom10">
                            <Form.Label>From Date</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name="fromdate"
                                    required
                                    onChange={handleChange}
                                    value={fromdate}
                                    type="date"
                                    placeholder="From Date"
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="3" className="mb-3" controlId="validationCustom10">
                            <Form.Label>To Date</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name="todate"
                                    required
                                    onChange={handleChange}
                                    value={todate}
                                    type="date"
                                    placeholder="To Date"
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="3" className="mb-3" controlId="validationCustom01">
                            <Form.Label>Home</Form.Label>
                            <InputGroup>
                                <Form.Control as="select" onChange={handleHomeChange} value={selectedHome}>
                                   <option value="">All Homes</option>
                                   {homes.map(home => (
                                       <option key={home.id} value={home.id}>{home.name}</option>
                                   ))}
                                </Form.Control>
                            </InputGroup>
                       </Form.Group>
                    </Form.Row>
                </Form>
            </div>
            <div className="ms-panel-body">
                <div className="thead-primary datatables">
                    <DataTable
                        columns={tableData.columns}
                        data={tableData.data}
                        pagination
                        responsive={true}
                        noHeader
                        striped
						onRowClicked={handleRowClick}
                    />
                </div>
            </div>
        </div>
    );
}



export default Schedulelist;
