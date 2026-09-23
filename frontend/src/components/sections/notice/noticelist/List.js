import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { FaExclamationCircle, FaClock, FaCheckCircle } from "react-icons/fa";
import { Nav } from "react-bootstrap";
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
  const [filterStatus, setFilterStatus] = useState("ALL");

  const getReviewStatus = (dateString) => {
    if (!dateString) return "UNKNOWN";

    const today = new Date();
    const reviewDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    reviewDate.setHours(0, 0, 0, 0);

    if (reviewDate < today) return "PAST";
    if (reviewDate.getTime() === today.getTime()) return "TODAY";
    return "UPCOMING";
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case "PAST":
        return <FaExclamationCircle color="red" title="Overdue" />;
      case "TODAY":
        return <FaClock color="orange" title="Due Today" />;
      case "UPCOMING":
        return <FaCheckCircle color="green" title="Upcoming" />;
      default:
        return null;
    }
  };

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
        .filter(Boolean)
        .filter(
          (resident) =>
            resident.home?.id?.toString() === selectedHome.toString()
        )
        .filter(
          (resident, index, self) =>
            index ===
            self.findIndex(
              (r) => r.national_id === resident.national_id
            )
        )
    : [];

  // Apply the filters to suggestions for the table
  const filteredSuggestions = suggestions
    .filter((item) => {
      // HOUSE FILTER
      if (selectedHome) {
        return (
          item.resident?.home?.id?.toString() ===
          selectedHome.toString()
        );
      }

      return true;
    })
    .filter((item) => {
      // RESIDENT FILTER
      if (selectedResident) {
        return (
          item.resident?.national_id?.toString() ===
          selectedResident.toString()
        );
      }

      return true;
    })
    .filter((item) => {
      // REVIEW STATUS FILTER
      const status = getReviewStatus(item.next_assement_date);

      if (filterStatus === "PAST") return status === "PAST";
      if (filterStatus === "TODAY") return status === "TODAY";
      if (filterStatus === "UPCOMING") return status === "UPCOMING";

      return true;
    });

  const handleRowClick = (row) => setSelectedSuggestion(row.id);

  const columns = [

  {
    name: "",
    cell: row => {
      const status = getReviewStatus(row.next_assement_date);
      return <div>{renderStatusIcon(status)}</div>;
    },
    width: "60px"
  },
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
      <Modal
        show={true}
        onHide={onClose}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header
          className="ms-modal-header-radius-0"
          closeButton
        >
          <div>
            <h1 style={{ fontSize: '24px', marginBottom: '0' }}>
              Seacole Healthcare
            </h1>

            <h4 className="modal-title text-white">
              Selected Accident / Incident
            </h4>

            <p className="mb-0">
              Date recorded: {selectedSuggestionObject.created_on}
            </p>
          </div>

          <PrintButton />
        </Modal.Header>

        <Modal.Body
          style={{
            padding: '20px',
            fontSize: '16px',
            lineHeight: '1.5'
          }}
        >
          <h5>
            Resident:{' '}
            {selectedSuggestionObject.resident?.first_name}{' '}
            {selectedSuggestionObject.resident?.last_name}
          </h5>

          <p>
            <strong>Report type:</strong>{' '}
            {selectedSuggestionObject.report_type}
          </p>

          <p>
            <strong>Date of Occurrence:</strong>{' '}
            {selectedSuggestionObject.date_occured}
          </p>

          <p>
            <strong>Next Assessment:</strong>{' '}
            {selectedSuggestionObject.next_assement_date}
          </p>

          <p>
            <strong>Follow Up:</strong>{' '}
            {selectedSuggestionObject.follow_up_notes}
          </p>

          <p>
            <strong>Preventative Action:</strong>{' '}
            {selectedSuggestionObject.future_preventative_action}
          </p>

          <p>
            <strong>Action Taken:</strong>{' '}
            {selectedSuggestionObject.action_taken}
          </p>

          <p>
            <strong>Incident:</strong>{' '}
            {selectedSuggestionObject.incident_details}
          </p>

          <p>
            <strong>Status:</strong>{' '}
            {selectedSuggestionObject.status}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </Modal.Footer>
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
                setSelectedResident("");

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

        <div className="mb-3">
          <Nav variant="tabs" activeKey={filterStatus}>
            <Nav.Item>
              <Nav.Link eventKey="ALL" onClick={() => setFilterStatus("ALL")}>
                All
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="PAST" onClick={() => setFilterStatus("PAST")}>
                Overdue
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="TODAY" onClick={() => setFilterStatus("TODAY")}>
                Today
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="UPCOMING" onClick={() => setFilterStatus("UPCOMING")}>
                Upcoming
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <div className="thead-primary datatables">

            <DataTable
              pagination
              columns={columns}
              data={filteredSuggestions}
              responsive
              striped
              noHeader
              onRowClicked={handleRowClick}
            />

        </div>
        <SelectedSuggestionModal />
      </div>
      <Modal
        show={showEdit}
        onHide={handleCloseEdit}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header className="ms-modal-header-radius-0" closeButton>
          <Modal.Title className="text-white">
            Edit Accident / Incident
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0 text-left">
          <SuggestionEdit handleClose={handleCloseEdit} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SuggestionList;
