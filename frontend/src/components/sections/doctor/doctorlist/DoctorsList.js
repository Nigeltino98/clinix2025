import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, putApi, deleteApi } from '../../../../api/api';
import { staffActions } from '../../../../store/staff';
import { homeActions } from '../../../../store/home';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ProtectedRoute from '../../../protected/ProtectedRoute';
import html2pdf from 'html2pdf.js';
import { print } from '../../../utils/pdf-export';

const Doctorlist = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const staff = useSelector((state) => state.staff.staffList) || [];

    const [showEdit, setShowEdit] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedGender, setSelectedGender] = useState('');
    const [refresh, setRefresh] = useState('');
    const [showDelete, setShowDelete] = useState('');

    // =========================
    // Handlers
    // =========================
    const handleShowEdit = (id) => {
        const selected = staff.find(item => item.id === id);
        if (!selected) return;
        dispatch(staffActions.setSelectedStaff(selected));
        setSelectedStaff(selected);
        setShowEdit(true);
    };

    const handleRowClick = (row) => {
        if (!row) return;
        setSelectedStaff(row);
        setShowEdit(true);
    };

    const handleDelete = (id) => {
        const selected = staff.find(item => item.id === id);
        if (!selected) return;

        Swal.fire({
            title: 'Are you sure you want to delete?',
            text: `Staff: ${selected.first_name || ''} ${selected.last_name || ''}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteApi(() => {
                    Swal.fire('Deleted!', 'Staff has been deleted.', 'success');
                    setShowDelete(id);
                }, token, '/api/staff/', selected.id);
            }
        });
    };

    const handleArchive = (id) => {
        const selected = staff.find(item => item.id === id);
        if (!selected) return;

        const action = selected.is_active ? 'disable' : 'enable';
        Swal.fire({
            title: `Are you sure you want to ${action}?`,
            text: `Staff: ${selected.first_name || ''} ${selected.last_name || ''}`,
            input: 'text',
            inputPlaceholder: `Please provide a reason for ${action}...`,
            inputValidator: (value) => (!value && 'You need to provide a reason!'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${action} it!`
        }).then((result) => {
            if (result.isConfirmed) {
                const reason = result.value;
                const tempStaff = selected.is_active
                    ? { is_active: false, deletion_reason: reason }
                    : { is_active: true, enable_reason: reason };

                putApi(() => {
                    Swal.fire(
                        selected.is_active ? 'Disabled!' : 'Enabled!',
                        `Staff has been ${selected.is_active ? 'disabled' : 'enabled'}.`,
                        'success'
                    );
                    setRefresh(selected.national_id || '');
                }, token, '/api/staff/', tempStaff, selected.id);
            }
        });
    };

    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
    };

    const saveAsPDF = () => {
        const element = document.getElementById('SelectedStaffModal');
        if (!element) return;
        html2pdf().from(element).save();
    };

    // =========================
    // Fetch Data
    // =========================
    useEffect(() => {
        const staffUrl = selectedGender ? `/api/staff?gender=${selectedGender}` : '/api/staff';
        getApi((response) => { dispatch(staffActions.setStaff(response.data || [])) }, token, staffUrl);
        getApi((response) => { dispatch(homeActions.setHome(response.data || [])) }, token, '/api/home');
    }, [selectedGender, showDelete, showEdit, refresh, token, dispatch]);

    // =========================
    // Modal Component
    // =========================
    const SelectedStaffModal = () => {
        if (!selectedStaff) return null;

        const onClose = () => {
            setSelectedStaff(null);
            setShowEdit(false);
        };

        return (
            <Modal show={true} onHide={onClose} centered>
                <Modal.Header closeButton className="bg-white border-bottom">
                    <div>
                        <h5 className="modal-title fw-semibold mb-0">Seacole Healthcare</h5>
                        <small className="text-muted">Staff Details</small>
                    </div>
                    <button onClick={saveAsPDF} className="btn btn-outline-dark ms-3">📄 Save as PDF</button>
                </Modal.Header>
                <Modal.Body className="bg-light px-4 py-3" id="SelectedStaffModal">
                    <div className="d-flex flex-column gap-3">
                        {[
                            ['First Name', selectedStaff.first_name || ''],
                            ['Last Name', selectedStaff.last_name || ''],
                            ['Email', selectedStaff.email || ''],
                            ['Gender', selectedStaff.gender || ''],
                            ['Address', selectedStaff.address || ''],
                            ['Nationality', selectedStaff.nationality || ''],
                            ['Category', selectedStaff.category || ''],
                            ['NI Number', selectedStaff.NI_number || ''],
                            ['Mobile', selectedStaff.mobile || ''],
                            ['Start Date', selectedStaff.start_date || ''],
                            ['Location', selectedStaff.location || ''],
                            ['Ethnic Origin', selectedStaff.ethnic_origin || ''],
                            ['Marital Status', selectedStaff.marital_status || ''],
                        ].map(([label, value], index) => (
                            <div key={index} className="p-3 bg-white shadow-sm rounded border">
                                <strong className="text-muted">{label}:</strong> <span className="ms-2 text-dark">{value}</span>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        );
    };

    // =========================
    // Table Columns
    // =========================
    const columns = [
        {
            name: "Staff Name",
            cell: row => (
                <div data-tag="allowRowEvents">
                    <img
                        src={row.profile_pic || '/default-avatar.png'}
                        alt={row.email || 'staff'}
                        style={{ width: '30px', borderRadius: '50%', marginRight: '5px' }}
                    />
                    {row.first_name || ''} {row.last_name || ''}
                </div>
            ),
            sortable: true
        },
        { name: "Next of Kin", selector: row => row.next_of_kin || '', sortable: true },
        { name: "Gender", selector: row => row.gender || '', sortable: true },
        { name: "Mobile", selector: row => row.mobile || '', sortable: true },
        {
            name: "Email",
            cell: row => (
                <div data-tag="allowRowEvents">
                    <Link to={`mailto:${row.email || ''}`} rel="noopener noreferrer">
                        {row.email || ''}
                    </Link>
                </div>
            ),
            sortable: true
        },
        {
            name: "Groups",
            cell: row => (
                <div data-tag="allowRowEvents">
                    {row.groups?.map(item => (
                        <span key={item.id}>
                            <ProtectedRoute perm="view_group">
                                <Link to="/group">{item.name || ''} </Link>
                            </ProtectedRoute>
                        </span>
                    ))}
                </div>
            ),
            sortable: true
        },
        {
            name: "Active",
            cell: row => (
                <div>
                    <label className="ms-switch">
                        <input
                            type="checkbox"
                            id={row.id}
                            checked={row.is_active || false}
                            onChange={() => handleArchive(row.id)}
                        />
                        <span className="ms-switch-slider round" />
                    </label>
                </div>
            ),
            sortable: true
        },
        {
            name: "Action",
            cell: row => (
                <div data-tag="allowRowEvents">
                    <ProtectedRoute perm="change_user">
                        <Link to='#' onClick={() => handleShowEdit(row.id)}>
                            <i className='fa fa-pencil ms-text-dark mr-2' />
                        </Link>
                    </ProtectedRoute>
                    <ProtectedRoute perm="delete_user">
                        <Link to='#' onClick={() => handleDelete(row.id)}>
                            <i className='fa fa-trash ms-text-danger' />
                        </Link>
                    </ProtectedRoute>
                </div>
            )
        }
    ];

    const tableData = {
        columns,
        data: staff || []
    };

    return (
        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Staff List</h6>
                <Link to="#" onClick={print}>
                    <i className='fa fa-print ms-text-info mr-4' />
                </Link>
                <ProtectedRoute perm="add_user">
                    <Link to="/staff/add-staff">Add Staff</Link>
                </ProtectedRoute>
            </div>

            <div className="ms-panel-body">
                <div className="thead-primary datatables">
                    <DataTableExtensions {...tableData} print={false} export={false}>
                        <DataTable
                            columns={columns}
                            data={staff?.filter(item => !selectedGender || item.gender === selectedGender) || []}
                            pagination
                            responsive
                            striped
                            noHeader
                            onRowClicked={handleRowClick}
                        />
                    </DataTableExtensions>
                </div>
            </div>

            {showEdit && <SelectedStaffModal />}
        </div>
    );
};

export default Doctorlist;
