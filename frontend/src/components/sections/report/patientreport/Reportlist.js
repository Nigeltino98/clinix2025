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

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


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
    return resident ? `${resident.first_name} ${resident.last_name}` : 'Unknown Resident';
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

  const filterNotesByDateRange = () => {
    return notes.filter(note => {
      const noteDate = new Date(note.created_on);
      return (
        !note.is_deleted &&
        noteDate >= new Date(startDate) &&
        noteDate <= new Date(endDate)
      );
    });
  };

   // ✅ EXPORT MULTIPLE NOTES PDF
  const handleExportRangePDF = () => {
  if (!startDate || !endDate) return;

  let url = `/api/note/export/?start_date=${startDate}&end_date=${endDate}`;

  // ✅ restore resident filtering
  if (selected_resident?.national_id) {
    url += `&resident=${selected_resident.national_id}`;
  }

  getApi(
    (res) => {
      if (!res || !res.data) {
        Swal.fire('Error', 'Could not fetch notes for export.', 'error');
        return;
      }

      if (!res.data.length) {
        Swal.fire('No Notes', 'No notes found for selected filters.', 'info');
        return;
      }

      generatePDF(res.data);
    },
    token,
    url
  );
};

//console.log("Notes fetched for export:", notesToExport.length, notesToExport);


const generatePDF = (notes) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginX = 15;
  const topMargin = 30;
  const bottomMargin = 20;
  const lineHeight = 7;

  let y = topMargin;

  const residentName =
  notes.length > 0
    ? getResidentName(notes[0].resident)
    : "Unknown Resident";

   // ---------------- PAGE BORDER ----------------
  const drawBorder = () => {
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.6);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  };

  // ---------------- HEADER ----------------
  const drawHeader = () => {
    drawBorder();

    doc.setFillColor(152, 220, 141);
    doc.rect(10, 10, pageWidth - 20, 14, 'F');

    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "Daily Notes Report",
      pageWidth / 2,
      18,
      { align: "center" }
    );

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    y = topMargin;
  };

  drawHeader();

   // ---------------- REPORT STATEMENT ----------------
  doc.setFont(undefined, 'bold');
  doc.text(
    `Daily notes report for ${residentName}, from ${startDate} to ${endDate}`,
    marginX,
    y
  );
  doc.setFont(undefined, 'normal');
  y += lineHeight + 4;

  // ---------------- RESIDENT DETAILS TABLE ----------------
  const drawResidentTable = () => {
    const tableTop = y;
    const rowHeight = 8;
    const col1Width = 50;
    const col2Width = pageWidth - marginX * 2 - col1Width;

    const tableData = [
      ['Resident Name', residentName],
      ['Report Period', `${startDate} → ${endDate}`],
      ['Total Notes', notes.length.toString()],
    ];

    doc.setFontSize(10);

    tableData.forEach((row, index) => {
      // Left cell
      doc.rect(marginX, tableTop + index * rowHeight, col1Width, rowHeight);
      doc.text(row[0], marginX + 2, tableTop + index * rowHeight + 6);

      // Right cell
      doc.rect(
        marginX + col1Width,
        tableTop + index * rowHeight,
        col2Width,
        rowHeight
      );
      doc.text(
        row[1],
        marginX + col1Width + 2,
        tableTop + index * rowHeight + 6
      );
    });

    y = tableTop + tableData.length * rowHeight + 10;
  };

  drawResidentTable();

  // ------------- SAFE TEXT RENDERER -------------
  const renderText = (text) => {
    const wrapped = doc.splitTextToSize(
      text,
      pageWidth - marginX * 2
    );

    wrapped.forEach(line => {
      if (y + lineHeight > pageHeight - bottomMargin) {
        doc.addPage();
        drawHeader();
      }
      doc.text(line, marginX, y);
      y += lineHeight;
    });
  };

  // ---------------- CONTENT ----------------
  notes.forEach((note, index) => {

    //renderText(`Resident: ${note.name_first_name} ${note.name_last_name}`, 15, y); y += 8;
    renderText(`Staff: ${getStaffName(note.staff)}`);
    renderText(`Type: ${note.type_of_note || ''}`);
    renderText(`Subject: ${note.subject || ''}`);
    renderText(`Date: ${dateToYMD(note.created_on)}`);

    if (y + lineHeight > pageHeight - bottomMargin) {
      doc.addPage();
      drawHeader();
    }

    doc.setFont(undefined, 'bold');
    renderText('Entry:');
    doc.setFont(undefined, 'normal');

    if (note.entry) {
      renderText(note.entry);
    }

    y += lineHeight; // space between notes
  });

  // ---------------- FOOTER ----------------
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(`Page ${i}`, pageWidth - 20, pageHeight - 10);
  }

  doc.save(`Daily_Notes_${residentName}_${startDate}_to_${endDate}.pdf`);
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
          {/* ✅ DATE RANGE EXPORT UI */}
          {canExportPDF() && (
            <div className="row mb-3">
              <div className="col-md-3">
                <label>Start Date</label>
                <input type="date" className="form-control" value={startDate}
                  onChange={e => setStartDate(e.target.value)} />
              </div>

              <div className="col-md-3">
                <label>End Date</label>
                <input type="date" className="form-control" value={endDate}
                  onChange={e => setEndDate(e.target.value)} />
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <button className="btn btn-info"
                  disabled={!startDate || !endDate}
                  onClick={handleExportRangePDF}>
                  Export Notes (PDF)
                </button>
              </div>
            </div>
          )}

          <DataTable
            columns={columns}
            data={notes.filter(n => !n.is_deleted)}
            pagination
            paginationServer
            paginationTotalRows={count}
            paginationPerPage={rowsPerPage}
            onChangePage={setPage}
            onRowClicked={handleRowClick}
            highlightOnHover
            progressPending={loading}
            striped
            responsive
            noHeader
          />
        </div>
        <SelectedNoteModal />
      </div>

      {showEdit && (
        <Modal show centered>
          <Modal.Header>
            <h4>Edit Note</h4>
            <button onClick={() => setShowEdit(false)}>x</button>
          </Modal.Header>
          <Modal.Body>
            <NoteEdit handleClose={() => setShowEdit(false)} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default Reportlist;