import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
//import DataTableExtensions from 'react-data-table-component-extensions';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, deleteApi } from '../../../../api/api';
import { Modal } from 'react-bootstrap';
import SuggestionEdit from '../../../modals/SuggestionEdit';
import { suggestionActions } from '../../../../store/suggestion';
import Swal from 'sweetalert2';
import { selectedStaff } from '../../../utils/expand'; // only import what you use
import dateToYMD from '../../../utils/dates';
import ProtectedRoute from '../../../protected/ProtectedRoute';
import PrintButton from '../../../utils/print';

//console.log("selectedStaff:", selectedStaff, typeof selectedStaff);
const SuggestionList = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const [selectedResident, setSelectedResident] = useState("");
  const [selectedHome, setSelectedHome] = useState("");

  const dispatch = useDispatch();
  const suggestions = useSelector((state) => state.suggestion.suggestionList) || [];
  const staffList = useSelector((state) => state.staff.staffList) || [];
  const staff = [...staffList];
  const token = useSelector((state) => state.auth.token)?.token || "";
  const residents = useSelector(state => state.resident.residentList) || [];
  const homes = useSelector(state => state.home.homeList) || [];

  // Fetch suggestions
  useEffect(() => {
    let url = "/api/suggestion/";
    const params = new URLSearchParams();

    if (selectedHome) params.append("home", selectedHome);
    if (selectedResident) params.append("resident", selectedResident);

    if (params.toString()) url += `?${params.toString()}`;

    getApi((response) => {
      dispatch(suggestionActions.setSuggestions(response.data || []));
    }, token, url);
  }, [dispatch, token, selectedHome, selectedResident, showDelete]);

  // Edit modal
  const handleShowEdit = (id) => {
    const selected = suggestions.find((item) => item.id === id);
    if (selected) {
      dispatch(suggestionActions.setSelectedSuggestion(selected));
      setShowEdit(true);
    }
  };
  const handleCloseEdit = () => setShowEdit(false);

  // Delete
  const handleDelete = (id) => {
    const selected = suggestions.find((item) => item.id === id);
    if (!selected) return;
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: `Suggestion: ${selected.subject}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteApi(() => {
          Swal.fire('Deleted!', 'Suggestion has been deleted.', 'success');
          setShowDelete(id);
        }, token, `/api/suggestion/${selected.id}/`);
      }
    });
  };

  // Derive the list of homes from your residents
  //const homes = Array.from(
    //new Set(staffList.map((res) => res.home).filter(Boolean))
  //);

  // Derive residents for the selected home
  const filteredResidents = selectedHome
    ? suggestions
        .map((s) => s.resident)
        .filter((r) => r.home === selectedHome)
        .filter((value, index, self) => self.indexOf(value) === index) // unique
    : suggestions.map((s) => s.resident);

  // Apply the filters to suggestions for the table
  const filteredSuggestions = suggestions.filter((incident) => {
    if (!selectedHome) return true;

    return incident.resident?.home?.id?.toString() === selectedHome.toString();
  });

  const handleRowClick = (row) => setSelectedSuggestion(row.id);

  const columns = [
  {
    name: "Created On",
    cell: row => <div>{dateToYMD(row.created_on)}</div>,
    sortable: true
  },
  {
    name: "Subject",
    selector: row => row.subject,
    sortable: true
  },
  {
    name: "Review Date",
    selector: row => row.next_assement_date,
    sortable: true
  },
  {
    name: "Staff",
    cell: row => (
      <div>
        {selectedStaff ? selectedStaff(row.staff, staff) : "Unknown"}
      </div>
    ),
    sortable: true
  },
  {
    name: "Action",
    cell: row => (
      <div data-tag="allowRowEvents">
        <ProtectedRoute perm="change_suggestioncomplains">
          <Link to="#" onClick={() => handleShowEdit(row.id)}>
            <i className="fas fa-pencil-alt ms-text-info mr-4" />
          </Link>
        </ProtectedRoute>
        <ProtectedRoute perm="delete_suggestioncomplains">
          <Link to="#" onClick={() => handleDelete(row.id)}>
            <i className="far fa-trash-alt ms-text-danger mr-4" />
          </Link>
        </ProtectedRoute>
      </div>
    ),
    sortable: false
  }
];

  const tableData = { columns, data: suggestions };

  const selectedSuggestionObject = suggestions.find(
    (s) => s.id === selectedSuggestion
  );
  const SelectedSuggestionModal = () => {
    if (!selectedSuggestionObject) return null;
    const onClose = () => {
      setSelectedSuggestion(null);
      setShowEdit(false);
    };

    return (
      <Modal show={true} className="ms-modal-dialog-width ms-modal-content-width" onHide={onClose} centered>
        <Modal.Header className="ms-modal-header-radius-0">
          <div>
            <h1 style={{ fontSize: '24px', marginBottom: '0' }}>Seacole Healthcare</h1>
            <h4 className="modal-title text-white">Selected Accident</h4>
            <p>Date recorded: {selectedSuggestionObject.created_on}</p>
          </div>
          <button type="button" className="close text-red w-20 mr-2" onClick={onClose}>x</button>
          <PrintButton />
        </Modal.Header>
        <Modal.Body style={{ padding: '20px', fontSize: '16px', lineHeight: '1.5' }}>
          <h5>Resident:{" "}
            {selectedSuggestionObject.resident?.first_name}{" "}

          </h5>
          <p>Report type: {selectedSuggestionObject.report_type}</p>
          <p>Date of Occurrence: {selectedSuggestionObject.date_occured}</p>
          <p>Next Assessment: {selectedSuggestionObject.next_assement_date}</p>
          <p>Follow Up: {selectedSuggestionObject.follow_up_notes}</p>
          <p>Preventative Action: {selectedSuggestionObject.future_preventative_action}</p>
          <p>Action Taken: {selectedSuggestionObject.action_taken}</p>
          <p>Incident: {selectedSuggestionObject.incident_details}</p>
          <p>Status: {selectedSuggestionObject.status}</p>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div className="ms-panel">
      <div className="ms-panel-header ms-panel-custome">
        <h6>Accident/Incident</h6>
        <ProtectedRoute perm="add_suggestioncomplains">
          <Link to="/suggesion/add-suggestion">Add Accident & Incident</Link>
        </ProtectedRoute>
      </div>
      <div className="ms-panel-body">
        {/* FILTER UI */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label>House</label>
            <select
              className="form-control"
              value={selectedHome}
              onChange={(e) => {
                setSelectedHome(e.target.value);

              }}
            >
              <option value="">All Houses</option>
              {homes.map((home) => (
                <option key={home.id} value={home.id}>
                  {home.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label>Resident</label>
            <select
              className="form-control"
              value={selectedResident}
              onChange={(e) => setSelectedResident(e.target.value)}
              disabled={!selectedHome} // optional: enable only when house is selected
            >
              <option value="">All Residents</option>
              {filteredResidents.map((res) => (
                <option key={res.national_id} value={res.national_id}>
                  {res.first_name} {res.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div className="thead-primary datatables">

            <DataTable
              pagination
              columns={columns}
              data={suggestions}
              responsive
              striped
              noHeader
              onRowClicked={handleRowClick}
            />

        </div>
        <SelectedSuggestionModal />
      </div>
      <Modal show={showEdit} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEdit} centered>
        <Modal.Header className="ms-modal-header-radius-0">
          <h4 className="modal-title text-white">Edit Suggestion</h4>
          <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
        </Modal.Header>
        <Modal.Body className="p-0 text-left">
          <SuggestionEdit handleClose={handleCloseEdit} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SuggestionList;
