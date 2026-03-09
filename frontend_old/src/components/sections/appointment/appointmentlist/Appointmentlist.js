import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import '../../../../assets/css/DeletionsStyle.css';
import DataTableExtensions from 'react-data-table-component-extensions';
import { data } from '../../../data/patientlist';
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap';
import AppointmentEdit from '../../../modals/AppointmentEdit';
import { appointmentActions } from '../../../../store/appointment'
import { homeActions } from '../../../../store/home'
import Swal from 'sweetalert2'
import { selectedResident, selectedStaff } from '../../../utils/expand'
import dateToYMD from '../../../utils/dates'
import { deleteApi, getApi, putApi } from '../../../../api/api'
import ProtectedRoute from '../../../protected/ProtectedRoute'

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Appointmentlist = () => {
    const [showEdit, setshowEdit] = useState(false)
    const [showDelete, setshowDelete] = useState("false")
    const appointments = useSelector((state) => state.appointment.appointmentList)
    const staff_list = useSelector((state) => state.staff.staffList)
    const resident_list = useSelector((state) => state.resident.residentList)
    const token = useSelector((state) => state.auth.token).token
    const residents = [...resident_list]
    const staff = [...staff_list]
    const user = useSelector((state) => state.auth.user);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const initialAppointments = appointments.map((appointment) => ({
      ...appointment,
      
    }));
    
    console.log("Initial appointments:", initialAppointments);

    const [appointmentList, setAppointmentList] = useState(initialAppointments);

    const generatePDF = () => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const brandColor = [152, 220, 141]; // Seacole theme green
      const headerTextColor = [255, 255, 255];

      // Header
      doc.setFillColor(...brandColor);
      doc.rect(0, 20, pageWidth, 20, 'F');
      doc.setFontSize(16);
      doc.setTextColor(...headerTextColor);
      doc.text("Seacole Healthcare", pageWidth / 2, 33, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(...brandColor);
      doc.text("Appointment Summary", pageWidth / 2, 45, { align: 'center' });

      // Line Separator
      doc.setLineWidth(0.5);
      doc.setDrawColor(...brandColor);
      doc.line(15, 50, pageWidth - 15, 50);

      // Content Box
      const boxTop = 58;
      const boxHeight = 200;
      doc.setDrawColor(...brandColor);
      doc.rect(14, boxTop, pageWidth - 28, boxHeight);

      let y = boxTop + 10;
      const lineHeight = 10;
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);

      if (selectedAppointment) {

        doc.text(`Resident: ${selectedResident(selectedAppointment.resident, residents)}`, 18, y); y += lineHeight;
        doc.text(`Staff: ${selectedStaff(selectedAppointment.staff, staff)}`, 18, y); y += lineHeight;
         doc.text(`Status: ${selectedAppointment.status}`, 18, y); y += lineHeight;
        doc.text(`Start Time: ${dateToYMD(selectedAppointment.start_time)}`, 18, y); y += lineHeight;
        doc.text(`End Time: ${dateToYMD(selectedAppointment.due_time)}`, 18, y); y += lineHeight;
        // Handle long description with word wrap
        const wrappedDescription = doc.splitTextToSize(
          `Description: ${selectedAppointment.description}`,
          pageWidth - 36 // padding from left and right
        );
        doc.text(wrappedDescription, 18, y);
        y += wrappedDescription.length * lineHeight;



      }

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text("Seacole Healthcare • Gateway to Community Integration", pageWidth / 2, pageHeight - 20, { align: 'center' });

      doc.setFontSize(9);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

      doc.text("Page 1", pageWidth - 20, pageHeight - 10);

      doc.save('appointment_details.pdf');
    };




    const handleShowEdit = (id) => {
        const appointment_list = [...appointments]
        const selected = appointment_list.find(item => item.id === id);
        dispatch(appointmentActions.setSelectedSelected(selected))
        setshowEdit(true)
    }
    const handleCloseEdit = () => {
        setshowEdit(false)
    }
    const handleDelete = (id) => {
        const appointment_list = [...appointments]
        const selected = appointment_list.find(item => item.id === id);
        Swal.fire({
            title: 'Are you sure you to delete :?',
            text: `Appointment  : ${selected.description}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            if (result.value) {
                deleteApi(_ => {
                    Swal.fire('Deleted!', 'Appointment has been deleted.', 'success');
                    setshowDelete(selected.id)
                }, token, '/api/appointment/', selected.id)
            }
        });
    }

//Adding the handleArchive function to handle deletion of appointments
   
    const handleArchive = (id) => { 
       
       const selected = appointmentList.find((item) => item.id === id);

       Swal.fire({
          title: 'Are you sure you want to delete this item?',
          text: 'This action might be permanent.',
          input: 'text',
          inputPlaceholder: 'Please provide a reason for deletion...',
          inputValidator: (value) => {
             if (!value) {
               return 'You need to provide a reason!';
             }
          },
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
          if (result.isConfirmed) {
            const reason = Swal.getInput().value;
            const temp_appointment = { is_deleted: true, deletion_reason: reason };
            const userId = user.id;
            putApi(
              () => {
                 
                 setAppointmentList((prevAppointmentList) => prevAppointmentList.filter((item) => item.id !== id));
                 Swal.fire('Deleted', 'Item has been deleted.', 'success');

             },
             token,
             `/api/appointment/`,
             {...temp_appointment, },
             selected.id
            );
           }
        });
      };

    console.log("Appointment List:", appointmentList);
    const columns = [
        
        { name: "ID", selector: "id", sortable: true },
        {
            name: "Resident", cell: row =>
                <div >
                    {selectedResident(row.resident, residents)}
                </div>, sortable: true
        },
       /* {
            name: "Staff", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        },*/
        { name: "Description", selector: "description", sortable: true,
          cell: (row) => (
            <div className={row.is_deleted ? 'deleted-appointment' : ''}>
              {row.description}
            </div>
          ),
        },
        /*{
            name: "Start Time", cell: row =>
                <div >
                    {dateToYMD(row.start_time)}
                </div>, sortable: true
        },
        {
            name: "End Time", cell: row =>
                <div >
                    {dateToYMD(row.due_time)}
                </div>, sortable: true
        },
        { name: "Status", selector: "status", sortable: true },*/
        {
            name: "Action", cell: (row) => 
                <div data-tag="allowRowEvents" >
                    <ProtectedRoute perm="change_appointment">
                        <Link to='#' onClick={() => handleShowEdit(row.id)}>
                            <i className='fas fa-pencil-alt ms-text-info  mr-4' />
                        </Link>
                    </ProtectedRoute>
{/*                 <ProtectedRoute perm="delete_appointment">
                        <Link to='#' onClick={() => { handleDelete(row.id) }}>
                            <i className='far fa-trash-alt ms-text-danger  mr-4' />
                        </Link>
                    </ProtectedRoute>    */}
                    <ProtectedRoute perm="delete_appointment">
                        <Link to='#' onClick={() => {handleArchive(row.id)}}>
                            <i className='far fa-trash-alt ms-text-danger  mr-4' />
                        </Link>
                    </ProtectedRoute>

                    <Link to="#" onClick={() => setSelectedAppointment(row)}>
                       <i className="fas fa-eye ms-text-info" /> View Details
                    </Link>

                </div>, sortable: true,
          
        },
    ];
 
    


    
    const dispatch = useDispatch()
    useEffect(() => {
        getApi(response => { dispatch(homeActions.setHome(response.data)) }, token, "/api/home")
        getApi(response => { dispatch(appointmentActions.setAppointmentList(response.data));
        setAppointmentList(response.data); console.log("Filtered:", appointmentList);
        }, token, "/api/appointment")
    }, [dispatch, showDelete, showEdit, token])
 
    const filteredAppointmentList = appointmentList.filter((item) => item.is_deleted !==true);
    console.log("Filtered Data:", filteredAppointmentList);

    const tableData = {
        columns,
        data: filteredAppointmentList,
    };
    return (
        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Appointment List</h6>
                <ProtectedRoute perm="add_appointment">
                    <Link to="/appointment/add-appointment">Add Appointment</Link>
                </ProtectedRoute>
            </div>
            <div className="ms-panel-body">
                <div className="thead-primary datatables">
                    <DataTableExtensions {...tableData} print={false} export={false}>
                        <DataTable
                            columns={columns}
                            data={data}
                            pagination
                            responsive={true}
                            striped
                            noHeader
                        />
                    </DataTableExtensions>
                </div>
            </div>

            <Modal show={selectedAppointment !== null} onHide={() => setSelectedAppointment(null)} centered>
                <Modal.Header>
                    <div>
                        <h4 className="modal-title text-white">Appointment Details</h4>
                        <p>Date of appointment: {selectedAppointment && dateToYMD(selectedAppointment.start_time)}</p>
                    </div>
                    <button type="button" className="close text-white" onClick={() => setSelectedAppointment(null)}>
                        x
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {selectedAppointment && (
                        <>
                            <p><strong>Description:</strong> {selectedAppointment.description}</p>
                            <p><strong>Resident:</strong> {selectedResident(selectedAppointment.resident, residents)}
                            </p>
                            <p><strong>Staff:</strong> {selectedStaff(selectedAppointment.staff, staff)}</p>
                            <p><strong>Status:</strong> {selectedAppointment.status}</p>
                            <p><strong>Start:</strong> {dateToYMD(selectedAppointment.start_time)}</p>
                            <p><strong>End:</strong> {dateToYMD(selectedAppointment.due_time)}</p>

                            {user?.groups?.some(group =>
                              ["Senior Management", "Management", "Senior Support Worker"].includes(group.name)
                            ) && (
                              <div className="text-right mt-3">
                                <button className="btn btn-outline-secondary mt-3"
                                        style={{ float: 'right' }}
                                        onClick={generatePDF}>
                                  📄 Save as PDF
                                </button>
                              </div>
                            )}
                        </>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showEdit}  onHide={handleCloseEdit}  size="lg" scrollable
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <AppointmentEdit handleClose={handleCloseEdit} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Appointmentlist;


