import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux'
import { deleteApi, getApi, putApi } from '../../../../api/api'
import { residentActions } from '../../../../store/resident'
import { Modal, Form, InputGroup, Col, Row } from 'react-bootstrap';
import PatientEdit from '../../../modals/PatientEdit';
import PatientLeave from '../../../modals/PatientLeave';
import { selectedHome } from '../../../utils/expand'
import { homeActions } from '../../../../store/home'
import ProtectedRoute from '../../../protected/ProtectedRoute'
import { print } from '../../../utils/pdf-export'
import Swal from 'sweetalert2'
import '../../../../assets/css/DeletionsStyle.css';


const Patientlist = () => {

    const dispatch = useDispatch()
    const [showEdit, setshowEdit] = useState(false)
    const [showleave, setshowLeave] = useState(false)
    const [refresh, setRefresh] = useState("")
    const [showdelete, setshowdelete] = useState("")
    const token = useSelector((state) => state.auth.token).token
    const homes = useSelector((state) => state.home.homeList)
    const selected_home = useSelector((state) => state.home.selectedHome)
    const residents = useSelector(state => state.resident.residentList || []);
    const [residents_to_display, setResidents] = useState([]);
    const residentDischarges = useSelector((state) => state.resident.residentDischargeList);
 
    
    
    const [residentList, setResidentList] = useState([]);
    const [dischargedResidents, setDischargedResidents] = useState([]);

  
    
console.log({
  DataTable,
  ProtectedRoute,
  PatientEdit,
  PatientLeave
});


    const handleSelect = (national_id) => {
        const residents_list = [...residents]
        const selected = residents_list.find(item => item.national_id === national_id);
        dispatch(residentActions.setSelectedResident(selected))
    }

    const handleShowEdit = (national_id) => {
        const residents_list = [...residents]
        const selected = residents_list.find(item => item.national_id === national_id);
        dispatch(residentActions.setSelectedResident(selected))
        dispatch(residentActions.removeDischargedResident(selected.id));
        setshowEdit(true)
    }

    const removeDischargedResident = (national_id) => {
        const Residents = [...residents];
        const selected = Residents.find(item => item.national_id === national_id);
        
        setDischargedResidents([...dischargedResidents, selected]);
        setResidents(prevResidents => prevResidents.filter(resident => resident.national_id !== national_id));
        dispatch(residentActions.dischargedResident(national_id));
    }

    const handleShowLeave = (national_id) => {
        const residents_list = [...residents]
       
        const selected = residents_list.find(item => item.national_id === national_id);
        dispatch(residentActions.setSelectedResident(selected))
      
        setshowLeave(true)
    }

    const handleClose = () => {
        setshowLeave(false)
    }

    const handleCloseEdit = () => {
        setshowEdit(false)
    }
    const handleHomeChange = (event) => {
        const value = event.target.value;
        const home_list = [...homes];
        const selected = home_list.find(item => item.id === +value);
        dispatch(homeActions.setSelectedHome(selected));
    }
   
     
    

    const handleDelete = (email) => {
        const residents_list = [...residents]
        const selected = residents_list.find(item => item.email === email);
        Swal.fire({
            title: 'Are you sure you want to delete :?',
            //text: `Resident  : ${selected.first_name} ${selected.last_name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            if (result.value) {
                deleteApi(_ => {
                    Swal.fire('Deleted!', 'Resident has been deleted.', 'success');
                    setshowdelete(selected.national_id)
                }, token, '/api/resident/', selected.national_id)
            }
        });
    }
    const handleArchive = (national_id) => {
        const residents_list = [...residents]
        const selected = residents_list.find(item => item.national_id === national_id);
        if (selected.is_archived === true) {
            const temp_resident = { is_archived: false }
            Swal.fire({
                title: 'Are you sure you to Un-Archive :?',
                text: `Resident  : ${selected.first_name} ${selected.last_name}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, un-archive it!'
            }).then(function (result) {
                if (result.value) {
                    putApi(_ => {
                        Swal.fire('Un-Archived!', 'Resident has been un-archived.', 'success');
                    }, token, `/api/resident/`, temp_resident, selected.national_id);
                }
                setRefresh(selected.national_id);

            });
        } else {
            const temp_resident = { is_archived: true }
            Swal.fire({
                title: 'Are you sure you to Archive :?',
                text: `Resident  : ${selected.first_name} ${selected.last_name}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, archive it!'
            }).then(function (result) {
                if (result.value) {
                    putApi(_ => {
                        Swal.fire('Archived!', 'Resident has been archived.', 'success');
                    }, token, `/api/resident/`, temp_resident, selected.national_id);
                }
                setRefresh(selected.national_id);

            });
        }
    }

    const sweetalertautoclose = (title) => {
        var timerInterval = void 0;
        Swal.fire({
            title: title,
            html: '',
            timer: 1000,
            onBeforeOpen: function onBeforeOpen() {
                Swal.showLoading();
                timerInterval = setInterval(function () {
                }, 100);
            },
            onClose: function onClose() {
                clearInterval(timerInterval);
            }
        }).then(function (result) {
            if (
                result.dismiss === Swal.DismissReason.timer);
        });
    }

    const columns = [
  {
    name: "Name",
    cell: row => (
      <div
        data-tag="allowRowEvents"
        style={{ width: '70px', whiteSpace: 'nowrap' }}
        className={
          dischargedResidents.some(
            resident => resident.national_id === row.national_id
          )
            ? 'deleted-appointment'
            : ''
        }
      >
        <Link
          to="/resident/detail"
          onClick={() => handleSelect(row.national_id)}
        >
          <img
            src={row.profile_pic}
            style={{
              width: '30px',
              borderRadius: '50%',
              marginRight: '5px'
            }}
            alt="img"
          />
          {row.first_name} {row.last_name}
        </Link>
      </div>
    ),
    sortable: true
  },

  {
    name: "D.O.B",
    selector: row => row.date_of_birth,
    sortable: true
  },

  {
    name: "Gender",
    selector: row => row.gender,
    sortable: true
  },

  {
    name: "Admission date",
    selector: row => row.date_of_admission,
    sortable: true
  },

  {
      name: "Home",
      selector: row => row.home?.name || "",
      sortable: true
    },


  {
    name: "Address",
    selector: row => row.address,
    sortable: true
  },

  {
    name: "Action",
    cell: row => (
      <div data-tag="allowRowEvents">
        <ProtectedRoute perm="change_resident">
          <Link to="#" onClick={() => handleShowEdit(row.national_id)}>
            <i className="fas fa-pencil-alt ms-text-info mr-4" />
          </Link>
        </ProtectedRoute>

        <ProtectedRoute perm="change_resident">
          <Link to="#" onClick={() => handleDelete(row.email)}>
            <i className="fa fa-archive ms-text-danger mr-4" />
          </Link>
        </ProtectedRoute>
      </div>
    ),
    sortable: true
  }
];


    useEffect(() => {
        console.log('Fetching residents...');
        getApi(response => { console.log('Home data fetched:', response.data); dispatch(homeActions.setHome(response.data)); console.log('Imba:', response.data); }, token, "/api/home");
        getApi(response => { console.log('New data:', response.data); dispatch(residentActions.setResidents(response.data)); console.log('Residents List:', response.data); setResidentList(response.data);
        setDischargedResidents(response.data.filter(resident => resident.is_discharged_status !==false)); }, token, "/api/resident");
    }, [dispatch, showEdit, showdelete, showleave, refresh, token]);

   
    console.log("Discharged:", dischargedResidents)


    useEffect(() => {
      if (!selected_home || !selected_home.id) {
        setResidents(residents);
      } else {
        const selected_residents = residents.filter(
          (item) =>
            item?.home?.id?.toString() === selected_home.id.toString()
        );

        setResidents(selected_residents);
      }
    }, [selected_home, residents]);

    console.log("New residents:", residentList)


    const filteredResidents = residentList.filter((item) => item.is_discharged_status !==true);
    console.log("Filtered Residents", filteredResidents)
    
    return (
        <div className="ms-panel">
            
            <div className="ms-panel-header ms-panel-custome">
                <h6>Resident List</h6>
                <Link to="#" onClick={print}>
                    <i className='fa fa-print ms-text-info  mr-4' />
                </Link>
                <ProtectedRoute perm="add_resident">
                    <Link to="/resdient/add-resdient">Add Residents To House</Link>
                </ProtectedRoute>
            </div>
            <div className="ms-panel-header ms-panel-custome">
                <Form>
                  <Row>
                    <Form.Group as={Col} md="12" className="mb-12" controlId="validationCustom01">
                      <Form.Label>Home Filters</Form.Label>
                      <InputGroup>
                        <Form.Select
                          onChange={handleHomeChange}
                          name="home"
                          value={selected_home?.id || ""}
                        >
                          <option value="">Select Home</option>
                          {homes.map(home => (
                            <option key={home.id} value={home.id}>
                              {home.name}
                            </option>
                          ))}
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  </Row>
                </Form>


            </div>
            <div className="ms-panel-body">
                <div className="thead-primary datatables">
                    <DataTable
                        columns={columns}
                        data={residents_to_display}
                        pagination
                        responsive={true}
                        striped
                        noHeader
                    />
                </div>
            </div>
            
            <Modal show={showEdit} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEdit} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Edit Resident</h4>
                    <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <PatientEdit handleClose={handleCloseEdit} />
                </Modal.Body>
            </Modal>
            <Modal show={showleave} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleClose} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white"> Resident Leave</h4>
                    <button type="button" className="close text-white" onClick={handleClose}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <PatientLeave
                     
                     handleClose={handleClose}/>
                    
                    
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Patientlist;


