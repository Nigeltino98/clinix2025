import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, putApi, deleteApi } from '../../../../api/api';
import { staffActions } from '../../../../store/staff';
import { residentActions } from '../../../../store/resident';
import { Modal } from 'react-bootstrap';
import NoteEdit from '../../../modals/NoteEdit';
import Swal from 'sweetalert2';
import dateToYMD from '../../../utils/dates';
import { selectedStaff, selectedResident, addEmojis } from '../../../utils/expand';
import ProtectedRoute from '../../../protected/ProtectedRoute';
import DataTable from 'react-data-table-component';
import PrintButton from '../../../utils/print';
import { print } from '../../../utils/pdf-export';
import jsPDF from 'jspdf';

const Reportlist = () => {
  const token = useSelector((state) => state.auth.token).token;
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const residents = useSelector((state) => state.resident.residentList);
  const staff_list = useSelector((state) => state.staff.staffList);
  const selected_resident = useSelector((state) => state.resident.selectedResident);

  const [selectedNote, setSelectedNote] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 20;
  const ALLOWED_GROUPS = ["Senior Management", "Management", "Senior Support Workers"];

  const canExportPDF = () => {
  if (!user || !user.groups) return false;
  return user.groups.some(group => ALLOWED_GROUPS.includes(group.name));
};



  const getStaffName = (staffId) => {
      const staff = staff_list.find((s) => s.id === staffId);
      return staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown Staff';
  };

  const getResidentName = (residentId) => {
    const resident = residents.find((r) => r.national_id === residentId);
    return resident ? `${resident.name_first_name} ${resident.name_last_name}` : 'Unknown Resident';
  };


  const fetchNotes = () => {
    setLoading(true);
    let url = `/api/note/?page=${page}&page_size=${rowsPerPage}`;
    if (selected_resident?.national_id) {
      url += `&resident=${selected_resident.national_id}`;
    }

    getApi((res) => {
      setNotes(res.data.results);
      setCount(res.data.count);
      setLoading(false);
    }, token, url);
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
  };

  const handleArchive = (id) => {
    const selected = notes.find((item) => item.id === id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action might be permanent.',
      input: 'text',
      inputPlaceholder: 'Please provide a reason...',
      inputValidator: (value) => {
        if (!value) return 'You need to provide a reason!';
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = Swal.getInput().value;
        const temp_note = { is_deleted: true, deletion_reason: reason };
        putApi(() => {
          Swal.fire('Deleted', 'Note has been deleted.', 'success');
          fetchNotes();
        }, token, '/api/note/', { ...temp_note }, id);
      }
    });
  };

  const handleRowClick = (row) => {
    setSelectedNote(row);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
  };

  const columns = [
    { name: 'Number', selector: (row) => row.id, sortable: true },
    { name: 'Subject', selector: (row) => row.subject, sortable: true },
    { name: 'Entry', selector: (row) => row.entry, sortable: true },
    { name: 'Note Type', selector: (row) => row.type_of_note, sortable: true },
    {
      name: 'Resident',
      cell: (row) => <div>{selectedResident(row.resident, residents)}</div>,
      sortable: true,
    },
    {
      name: 'Emotion',
      cell: (row) => <span>{addEmojis(row.emotion)}</span>,
      sortable: true,
    },
    {
      name: 'Staff',
      cell: (row) => <div>{selectedStaff(row.staff, staff_list)}</div>,
      sortable: true,
    },
    {
      name: 'Date Entered',
      cell: (row) => <div>{dateToYMD(row.created_on)}</div>,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <ProtectedRoute perm="delete_note">
          <Link to="#" onClick={() => handleArchive(row.id)}>
            <i className="fas fa-trash-alt ms-text-info  mr-4" />
          </Link>
        </ProtectedRoute>
      ),
      sortable: false,
    },
  ];

  const SelectedNoteModal = () =>
    selectedNote && (
          <Modal show={true} onHide={() => setSelectedNote(null)} centered>
            <Modal.Header>
              <div>
                <h1 style={{fontSize: '24px', marginBottom: '0'}}>Seacole Healthcare</h1>

                <h2 style={{
                  fontSize: '20px',
                  marginBottom: '0'
                }}>Resident: {selectedNote.name_first_name} {selectedNote.name_last_name}</h2>

              </div>
              {canExportPDF() && (
                <button
                    onClick={() => {
                      const doc = new jsPDF();



                    // Header logo
                      const pageWidth = doc.internal.pageSize.getWidth();
                      const pageHeight = doc.internal.pageSize.getHeight();

                      const brandColor = [152, 220, 141]; // Seacole theme green
                      const headerTextColor = [255, 255, 255];




                      doc.setFillColor(...brandColor);
                      doc.rect(0, 20, pageWidth, 15, 'F');
                      doc.setFontSize(16);
                      doc.setTextColor(...headerTextColor);
                      doc.text("Seacole Healthcare", pageWidth / 2, 33, { align: 'center' });

                      doc.setFontSize(12);
                      doc.setTextColor(0, 0, 0);
                      doc.text('Note Details', pageWidth / 2, 43, { align: 'center' });




                      // Line Separator
                      doc.setLineWidth(0.5);
                      doc.setDrawColor(...brandColor);
                      doc.line(15, 50, pageWidth - 15, 50);

                      const boxTop = 58;
                      const boxHeight = 200;
                      doc.setDrawColor(...brandColor);
                      doc.rect(14, boxTop, pageWidth - 28, boxHeight);

                      let y = boxTop + 10;
                      const lineHeight = 10;
                      const marginLeft = 18;
                      const maxTextWidth = pageWidth - marginLeft * 2;

                      doc.setFontSize(11);
                      doc.setTextColor(40, 40, 40);

                      doc.text(`Resident Name: ${selectedNote.name_first_name} ${selectedNote.name_last_name}`, marginLeft, y); y += lineHeight;
                      doc.text(`Subject: ${selectedNote.subject}`, marginLeft, y); y += lineHeight;
                      doc.text(`Note Type: ${selectedNote.type_of_note}`, marginLeft, y); y += lineHeight;
                      doc.text(`Staff: ${getStaffName(selectedNote.staff)}`, marginLeft, y); y += lineHeight;

                      doc.setFont(undefined, 'bold');
                      doc.text("Entry:", marginLeft, y); y += lineHeight;
                      doc.setFont(undefined, 'normal');

                      const wrappedEntry = doc.splitTextToSize(selectedNote.entry || '', maxTextWidth);
                      doc.text(wrappedEntry, marginLeft, y);
                      y += wrappedEntry.length * (lineHeight - 2); // adjust Y based on number of lines
                      // Footer
                      const footerLine1 = "Seacole Healthcare • Gateway to Community Integration";
                      const footerLine2 = `Generated on: ${new Date().toLocaleString()}`;

                      doc.setFontSize(10);
                      doc.setTextColor(0, 0, 0);
                      doc.text(footerLine1, pageWidth / 2, pageHeight - 15, { align: 'center' });

                      doc.setFontSize(9);
                      doc.setTextColor(100, 100, 100);
                      doc.text(footerLine2, pageWidth / 2, pageHeight - 8, { align: 'center' });

                      doc.setFontSize(9);
                      doc.setTextColor(0, 0, 0);
                      doc.text("Page 1", pageWidth - 20, pageHeight - 10);

                      doc.save(`note_${selectedNote.name_first_name} ${selectedNote.name_last_name}.pdf`);
                    }}
                    className="btn btn-sm btn-info ml-2"
                >
                    Save as PDF
                 </button>

                )}
            </Modal.Header>
            <p> Subject: {selectedNote.subject}</p>
            <p>Entry: {selectedNote.entry}</p>
            <p>Date recorded: {selectedNote.created_on}</p>
            <p>Type of note: {selectedNote.type_of_note}</p>
              <p>Staff responsible: {getStaffName(selectedNote.staff)}</p>


              <button type="button" className="close text-red w-15 mr-3" onClick={() => setSelectedNote(null)}>
              Close page
            </button>
          </Modal>
      );

  useEffect(() => {
    dispatch(staffActions.setStaff([])); // Optional: reset before fetch
    dispatch(residentActions.setResidents([]));
    getApi((res) => dispatch(staffActions.setStaff(res.data)), token, '/api/staff');
    getApi((res) => dispatch(residentActions.setResidents(res.data)), token, '/api/resident');
  }, [dispatch, token]);

  useEffect(() => {
    fetchNotes();
  }, [token, selected_resident, page]);

  const pageCount = Math.ceil(count / rowsPerPage);

  return (
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-fh">
        <div className="ms-panel-header ms-panel-custome">
          <h6>Notes</h6>
          <Link to="#" onClick={print}>
            <i className="fa fa-print ms-text-info mr-4" />
          </Link>
          <ProtectedRoute perm="add_note">
            <Link to="/note/add-note">Write Note</Link>
          </ProtectedRoute>
        </div>

        <div className="ms-panel-body">
          <DataTable
            columns={columns}
            data={notes.filter((n) => !n.is_deleted)}
            pagination
            paginationServer
            paginationTotalRows={count}
            paginationPerPage={rowsPerPage}
            paginationDefaultPage={page}
            onChangePage={handlePageChange}
            onRowClicked={handleRowClick}
            progressPending={loading}
            responsive
            striped
            noHeader
          />
        </div>
        <SelectedNoteModal />
      </div>

      <Modal show={showEdit} onHide={handleCloseEdit} centered>
        <Modal.Header>
          <h4>Edit Note</h4>
          <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
        </Modal.Header>
        <Modal.Body className="p-0 text-left">
          <NoteEdit handleClose={handleCloseEdit} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reportlist;