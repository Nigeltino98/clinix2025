import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import DataTable from 'react-data-table-component';
import { familyAction } from '../../../../store/family'
import Swal from 'sweetalert2'
import { deleteApi, getApi } from '../../../../api/api'
import FamilyEdit from '../../../modals/FamilyEdit';
import FamilyAdd from '../../../modals/FamilyAdd';
import AddNextofKeen from '../../../modals/AddNextofKeen';
//import { selectedHome } from '../../../utils/expand'
import ProtectedRoute from '../../../protected/ProtectedRoute'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const About = () => {
    const dispatch = useDispatch()
    const selected_resident = useSelector((selected_resident) => selected_resident.resident.selectedResident)
    const token = useSelector((state) => state.auth.token).token
    const homes = useSelector((home) => home.home.homeList)
    const family = useSelector((state) => state.family.familyList)
    const [family_to_display, setFamily] = useState([...family])
    const [showEdit, setshowEdit] = useState(false)
    const [showAdd, setshowAdd] = useState(false)
    const [showKin, setshowKin] = useState(false)
    const [showdelete, setshowdelete] = useState("")
    const homeList = homes || [];

    const homeName = (() => {
        if (!selected_resident?.home) return '';

        if (typeof selected_resident.home === 'object') {
            return selected_resident.home.name || '';
        }

        const home = (homes || []).find(
            (item) =>
                item.id?.toString() ===
                selected_resident.home?.toString()
        );

        return home?.name || '';
    })();

    const handleShowEdit = (national_id) => {
        const family_list = [...family]
        const selected = family_list.find(item => item.national_id === national_id);
        dispatch(familyAction.setSelectedFamily(selected))
        setshowEdit(true)
    }

    const handleShowAdd = () => {
        setshowAdd(true)
    }
    const handleShowKin = () => {
        setshowKin(true)
    }

    const handleCloseKin = () => {
        setshowKin(false)
    }
    const handleCloseEdit = () => {
        setshowEdit(false)
    }
    const handleCloseAdd = () => {
        setshowAdd(false)
    }

    const handleDelete = (email) => {
        const family_list = [...family]
        const selected = family_list.find(item => item.email === email);
        Swal.fire({
            title: 'Are you sure you to delete :?',
            text: `Family Member  : ${selected.first_name} ${selected.last_name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
            if (result.value) {
                deleteApi(_ => {
                    Swal.fire('Deleted!', 'Family Member has been deleted.', 'success');
                    setshowdelete(selected.id)
                }, token, '/api/family/', selected.id)
            }
        });
    }
    const information = [
        {
            title: 'Full Name',
            text: `${selected_resident?.first_name || ''} ${selected_resident?.last_name || ''}`.trim()
        },
        {
            title: 'Date Of Birth',
            text: selected_resident?.date_of_birth || ''
        },
        {
            title: 'Date of admission',
            text: selected_resident?.date_of_admission || ''
        },
        {
            title: 'National insurance',
            text: selected_resident?.national_id || ''
        },
        {
            title: 'NHS Number',
            text: selected_resident?.NHS_number || ''
        },
        {
            title: 'Clinical Diagnosis',
            text: selected_resident?.clinical_diagnosis || ''
        },
        {
            title: 'Medical Condition',
            text: selected_resident?.medical_condition || ''
        },
        {
            title: 'Risk',
            text: selected_resident?.risk || ''
        },
        {
            title: 'Ethnicity',
            text: selected_resident?.ethnic_origin || ''
        },
        {
            title: 'Marital Status',
            text: selected_resident?.marital_status || ''
        },
        {
            title: 'Gender',
            text: selected_resident?.gender || ''
        },
        {
            title: 'Address',
            text: selected_resident?.address || ''
        },
        {
            title: 'Home',
            text: homeName
        },
        {
            title: 'Next of Kin',
            text: selected_resident?.next_of_kin || ''
        }
    ];

    const downloadResidentPDF = () => {
        if (!selected_resident?.national_id) {
            Swal.fire(
                'No Resident Selected',
                'Please select a resident before downloading the PDF.',
                'warning'
            );
            return;
        }

        try {
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text('Resident Basic Information', 14, 20);

            doc.setFontSize(11);

            const residentName =
                `${selected_resident?.first_name || ''} ${
                    selected_resident?.last_name || ''
                }`.trim();

            doc.text(
                `Resident: ${residentName}`,
                14,
                30
            );

            doc.setFontSize(9);

            doc.text(
                `Generated: ${new Date().toLocaleDateString()}`,
                14,
                37
            );

            const tableData = information.map((item) => [
                String(item.title || ''),
                String(item.text || '')
            ]);

            autoTable(doc, {
                startY: 45,

                head: [
                    ['Information', 'Details']
                ],

                body: tableData,

                styles: {
                    fontSize: 9,
                    cellPadding: 4,
                    overflow: 'linebreak'
                },

                headStyles: {
                    fontSize: 10,
                    fontStyle: 'bold'
                },

                columnStyles: {
                    0: {
                        cellWidth: 55,
                        fontStyle: 'bold'
                    },
                    1: {
                        cellWidth: 125
                    }
                }
            });

            const safeFirstName =
                selected_resident?.first_name || 'Resident';

            const safeLastName =
                selected_resident?.last_name || '';

            const fileName =
                `${safeFirstName}_${safeLastName}_Information.pdf`
                    .replace(/\s+/g, '_');

            doc.save(fileName);

        } catch (error) {
            console.error(
                'Error generating resident PDF:',
                error
            );

            Swal.fire(
                'PDF Error',
                'Unable to generate the resident PDF. Please try again.',
                'error'
            );
        }
    };

    const columns = [
     {
      name: "Name",
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true
     },

     {
       name: "Phone",
       selector: row => row.phone,
       sortable: true
     },

     {
       name: "Email",
       selector: row => row.email,
       sortable: true
     },

     {
       name: "Address",
       selector: row => row.address,
       sortable: true
     },

     {
       name: "Title",
       selector: row => row.title,
       sortable: true
     },

     {
       name: "Contact type",
       selector: row => row.type,
       sortable: true
     },

     {
       name: "Action",
       cell: row => (
         <div data-tag="allowRowEvents">

           <ProtectedRoute perm="add_family">
             <Link to="#" onClick={() => handleShowEdit(row.national_id)}>
               <i className="fas fa-pencil-alt ms-text-info mr-4" />
             </Link>
           </ProtectedRoute>

           <ProtectedRoute perm="delete_family">
             <Link to="#" onClick={() => handleDelete(row.national_id)}>
               <i className="far fa-trash-alt ms-text-danger mr-4" />
             </Link>
           </ProtectedRoute>

         </div>
       ),
       sortable: false
     }
    ];

    useEffect(() => {
        const selected = family.filter(item => item.resident === selected_resident.national_id);
        setFamily(selected)
    }, [selected_resident, family])


    useEffect(() => {
        getApi(response => { dispatch(familyAction.setFamily(response.data)) }, token, "/api/family")
    }, [dispatch, token, showdelete, showAdd, showEdit])

    return (
        <div className="row">
            <div className="col-xl-12 col-md-12">
                <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-body">

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="section-title mb-0">
                                Resident Basic Information
                            </h2>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={downloadResidentPDF}
                            >
                                <i className="fa fa-file-pdf-o mr-2"></i>
                                Download PDF
                            </button>
                        </div>

                        <table className="table ms-profile-information">
                            <tbody>
                                {information.map((item, i) => (
                                    <tr key={i}>
                                        <th scope="row">{item.title}</th>
                                        <td>{item.text}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default About;