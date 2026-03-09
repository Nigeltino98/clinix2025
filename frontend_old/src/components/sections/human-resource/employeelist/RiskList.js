import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import EditRisk from '../../../modals/EditRisk';
import { riskActions } from '../../../../store/riskAssessment';
import { getApi, deleteApi } from '../../../../api/api';
import { selectedResident, selectedStaff } from '../../../utils/expand';
import Swal from 'sweetalert2';
import ProtectedRoute from '../../../protected/ProtectedRoute';
import PrintButton from '../../../utils/print';
import dateToYMD from '../../../utils/dates';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Addform = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState('');
  const token = useSelector((state) => state.auth.token).token;
  const risks = useSelector((state) => state.risk.riskList);
  const selected_resident = useSelector((state) => state.resident.selectedResident);
  const staff = useSelector((state) => state.staff.staffList);
  const residents = useSelector((state) => state.resident.residentList);
  const dispatch = useDispatch();
  const [selectedrisk, setSelectedrisk] = useState(null);
  const [atRiskOptions, setAtRiskOptions] = useState({});

  const handleRowClick = (row) => {
    setSelectedrisk(row);
  };

  const getAtRiskNames = (ids) => {
    return ids.map((id) => atRiskOptions[id - 1]?.name || `Unknown (${id})`).join(', ');
  };

  const handleShowDetails = (id) => {
    const selected_risk = risks.find((item) => item.id === id);
    dispatch(riskActions.setSelectedrisk(selected_risk));
    setSelectedrisk(selected_risk);
    setShowDetails(true);
  };

  const handleCloseDEtails = () => {
    setShowDetails(false);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
  };

  const handleShowEdit = (id) => {
    const selected_risk = risks.find((item) => item.id === id);
    dispatch(riskActions.setSelectedrisk(selected_risk));
    setSelectedrisk(selected_risk);
    setShowEdit(true);
  };

  const handleDelete = (id) => {
    const selected = risks.find((item) => item.id === id);
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: `Risk Assessment: ${selected.title}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(function (result) {
      if (result.value) {
        deleteApi(
          (_) => {
            Swal.fire('Deleted!', 'Risk Assessment has been deleted.', 'success');
            setShowDelete(selected.id);
          },
          token,
          '/api/risk/',
          selected.id
        );
      }
    });
  };

  const fetchRisks = () => {
    getApi((response) => {
      dispatch(riskActions.setRisk(response.data));
    }, token, '/api/risk');
  };

  useEffect(() => {
    fetchRisks();  // ⬅️ use function here
    getApi((response) => {
      setAtRiskOptions(response.data);
    }, token, '/api/risk-options');
  }, [dispatch, token]);

  const columns = [
    {
      name: 'Title',
      cell: (row) => <Link to="#" onClick={() => handleShowDetails(row.id)}>{row.title}</Link>,
      sortable: true,
    },
    {
      name: 'Staff',
      cell: (row) => <div>{selectedStaff(row.created_by, staff)}</div>,
      sortable: true,
    },
    {
      name: 'Resident',
      cell: (row) => <div>{selectedResident(row.resident, residents)}</div>,
      sortable: true,
    },
    { name: 'Identified Risk/s', selector: 'identified_risk', sortable: true },
    {
      name: 'People at risk',
      sortable: true,
      cell: (row) => <span>{getAtRiskNames(row.at_risk)}</span>,
    },
    //{ name: 'Category', selector: 'category', sortable: true },
    //{ name: 'Details', selector: 'details', sortable: true },
    { name: 'Support Needs', selector: 'support_needs', sortable: true },
    { name: 'Info Sources', selector: 'information_sources_used', sortable: true },
    {
      name: 'Action',
      cell: (row) => (
        <div data-tag="allowRowEvents">
          <ProtectedRoute perm="change_riskactionplan">
            <Link to="#" onClick={() => handleShowEdit(row.id)}>
              <i className="fas fa-pencil-alt ms-text-info mr-4" />
            </Link>
          </ProtectedRoute>
          <ProtectedRoute perm="delete_riskactionplan">
            <Link to="#" onClick={() => handleDelete(row.id)}>
              <i className="far fa-trash-alt ms-text-danger mr-4" />
            </Link>
          </ProtectedRoute>
        </div>
      ),
      sortable: true,
    },
  ];

  const tableData = {
    columns: columns,
    data: risks,
  };

  const SelectedRiskModal = ({ selectedrisk, onClose, getAtRiskNames }) => {
    if (!selectedrisk) return null;

    const fields = [
      { label: 'Resident', value: `${selectedrisk.firstname} ${selectedrisk.lastname}` },
      { label: 'Identified Risk', value: selectedrisk.identified_risk },
      { label: 'Personnel at Risk', value: getAtRiskNames(selectedrisk.at_risk) },
      { label: 'Title', value: selectedrisk.title },
      { label: 'Information Sources', value: selectedrisk.information_sources_used },
      { label: 'Risk Likelihood', value: selectedrisk.likelihood },
      { label: 'Risk Level', value: selectedrisk.risk_level },
      { label: 'Details', value: selectedrisk.details },
      { label: 'Support Needs', value: selectedrisk.support_needs },
      { label: 'Review Date', value: dateToYMD(selectedrisk.next_assement_date) },
    ];

    const saveAsPDF = () => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const boxTop = 58;
      const boxHeight = 200;
      const brandColor = [0, 51, 102];
      let y = 20;

      doc.setFontSize(18);
      doc.setTextColor(...brandColor);
      doc.text('Seacole Healthcare', margin, y);
      y += 10;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Selected Risk', margin, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(`Date recorded: ${dateToYMD(selectedrisk.created_on)}`, margin, y);
      y += 7;
      doc.text(`Created By: ${selectedrisk.name_first} ${selectedrisk.name_last}`, margin, y);
      y += 10;

      fields.forEach((field) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
          doc.setDrawColor(...brandColor);
          doc.rect(margin, boxTop, pageWidth - 2 * margin, boxHeight);
        }

        const highlightFields = [];
        if (highlightFields.includes(field.label)) {
          doc.setFillColor(...brandColor);
          doc.rect(margin, y - 5, pageWidth - 2 * margin, 10, 'F');
        }

        doc.setFont(undefined, 'bold');
        doc.text(`${field.label}:`, margin, y);
        doc.setFont(undefined, 'normal');
        doc.text(field.value || 'N/A', margin + 50, y);
        y += 10;
      });

      doc.setDrawColor(...brandColor);
      doc.rect(margin, boxTop, pageWidth - 2 * margin, boxHeight);

      doc.save(`Risk_Assessment_${selectedrisk.firstname}_${selectedrisk.lastname}.pdf`);
    };

    return (
      <Modal
        show={true}
        className="ms-modal-dialog-width ms-modal-content-width"
        onHide={onClose}
        centered
      >
        <Modal.Header className="ms-modal-header-radius-0">
          <div>
            <h1 style={{ fontSize: '24px', marginBottom: '0' }}>Seacole Healthcare </h1>
            <h4 className="modal-title text-white"></h4>
            <p>Date recorded: {dateToYMD(selectedrisk.created_on)}</p>
            <p>Created By: {selectedrisk.name_first} {selectedrisk.name_last}</p>
          </div>
          <button type="button" className="close text-red w-20 mr-2" onClick={onClose}>x</button>
          <button className="btn btn-primary" onClick={saveAsPDF}>Download as PDF</button>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px', fontSize: '16px', lineHeight: '1.5' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {fields.map((field, index) => {
              const highlightFields = ['Identified Risk', 'Details', 'Support Needs'];
              const isHighlighted = highlightFields.includes(field.label);
              return (
                <div
                  key={index}
                  style={{
                    border: '1px solid black',
                    background: isHighlighted ? '' : 'white',
                    padding: '5px',
                    marginBottom: '5px',
                  }}
                >
                  <p style={{ margin: '0' }}>
                    <strong>{field.label}:</strong> {field.value || 'N/A'}
                  </p>
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div className="ms-panel">
      <div className="ms-panel-header ms-panel-custome">
        <h6>
          Risk Assessment : {selected_resident.first_name} {selected_resident.last_name}
        </h6>
        <ProtectedRoute perm="add_riskactionplan">
          <Link to="/riskassessment/add-riskassessment">Start Risk Assessment</Link>
        </ProtectedRoute>
        <PrintButton />
      </div>

      <div className="ms-panel-body">
        <div className="thead-primary datatables">
          <DataTableExtensions {...tableData} print={false} export={false}>
            <DataTable
              columns={tableData.columns}
              data={tableData.data}
              pagination
              responsive={true}
              striped
              noHeader
              onRowClicked={handleRowClick}
            />
          </DataTableExtensions>
        </div>
        {showDetails && (
          <SelectedRiskModal
            selectedrisk={selectedrisk}
            onClose={() => setShowDetails(false)}
            getAtRiskNames={getAtRiskNames}
          />
        )}
      </div>

      <Modal show={showEdit} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEdit} centered>
        <Modal.Header className="ms-modal-header-radius-0">
          <h4 className="modal-title text-white">Edit Risk Assessment </h4>
          <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
        </Modal.Header>
        <Modal.Body className="p-0 text-left">
          <EditRisk handleClose={handleCloseEdit} refreshRisks={fetchRisks} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Addform;
