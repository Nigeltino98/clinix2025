import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { data } from '../../../data/patientlist';
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap';
import HomeEdit from '../../../modals/HomeEdit';
import { homeActions } from '../../../../store/home'
import Swal from 'sweetalert2'
import { deleteApi, getApi } from '../../../../api/api'
import { occupancy } from '../../../utils/occupancy'
import ProtectedRoute from '../../../protected/ProtectedRoute'


const Departmentlist = () => {
    const [showEdit, setshowEdit] = useState(false)
    const [showdelete, setshowdelete] = useState("")
    const home = useSelector((state) => state.home.homeList)
    const token = useSelector((state) => state.auth.token).token
    const residents = useSelector((state) => state.resident.residentList)

    const handleShowEdit = (id) => {
        const home_list = [...home]
        const selected = home_list.find(item => item.id === id);
        dispatch(homeActions.setSelectedHome(selected))
        setshowEdit(true)
    }

    const handleCloseEdit = () => {
        setshowEdit(false)
    }
    const handleSelect = (id) => {
        const home_list = [...home]
        const selected = home_list.find(item => item.id === id);
        dispatch(homeActions.setSelectedHome(selected))
    }
    // const handleDelete = (id) => {
    //     const home_list = [...home]
    //     const selected = home_list.find(item => item.id === id);
    //     Swal.fire({
    //         title: 'Are you sure you to delete :?',
    //         text: `Home  : ${selected.name}`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //     }).then(function (result) {
    //         if (result.value) {
    //             deleteApi(r => {
    //                 Swal.fire('Deleted!', 'Home has been deleted.', 'success');
    //                 setshowdelete(id)
    //             }, token, '/api/home/', selected.id)
    //         }
    //     });
    // }

    // const handleArchive = (email) => {
    //     const home_list = [...home]
    //     const selected = home_list.find(item => item.email === email);
    //     if (selected.is_active === false) {
    //         sweetalertautoclose("Home is already Disabled")
    //     } else {
    //         Swal.fire({
    //             title: 'Are you sure you to Disable :?',
    //             text: `Home  : ${selected.first_name} ${selected.last_name}`,
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'Yes, disable it!'
    //         }).then(function (result) {
    //             if (result.value) {
    //                 //  implemenetion
    //             }
    //         });
    //     }
    // }

    // const sweetalertautoclose = (title) => {
    //     var timerInterval = void 0;
    //     Swal.fire({
    //         title: title,
    //         html: '',
    //         timer: 1000,
    //         onBeforeOpen: function onBeforeOpen() {
    //             Swal.showLoading();
    //             timerInterval = setInterval(function () {
    //             }, 100);
    //         },
    //         onClose: function onClose() {
    //             clearInterval(timerInterval);
    //         }
    //     }).then(function (result) {
    //         if (
    //             result.dismiss === Swal.DismissReason.timer);
    //     });
    // }

    const columns = [

        { name: "Name", selector: "name", sortable: true },
        { name: "Address", selector: "address", sortable: true },
        { name: "Capacity", selector: "capacity", sortable: true },
        {
            name: "Occupancy", cell: row =>
                <div>
                    {occupancy(row.id, residents)}
                </div>
            , sortable: true
        },
        {
            name: "Residents", cell: row => <div>
                <ProtectedRoute perm="view_resident">
                    <Link to='/resident'
                        onClick={() => { handleSelect(row.id) }}>
                        <i className="fa fa-users  mr-2" /> view residents
                    </Link>
                </ProtectedRoute>
            </div>, sortable: true
        },
        {
            name: "Action", cell: row =>
                <div data-tag="allowRowEvents" >
                    <ProtectedRoute perm="change_home">
                        <Link to='#' onClick={() => handleShowEdit(row.id)}>
                            <i className='fas fa-pencil-alt ms-text-info  mr-4' />
                        </Link>
                    </ProtectedRoute>
                    {/* <Link to='#' onClick={() => { handleDelete(row.id) }}>
                        <i className='far fa-trash-alt ms-text-danger  mr-4' />
                    </Link> */}
                    {/* <Link to='#' onClick={() => { handleArchive(row.id) }}>
                        <i className='fa fa-archive ms-text-danger  mr-4' />
                    </Link> */}
                </div>, sortable: true

        },


    ];
    const tableData = {
        columns,
        data: home,
    };
    const dispatch = useDispatch()
    useEffect(() => {
        getApi(response => { dispatch(homeActions.setHome(response.data)) }, token, "/api/home")
    }, [showdelete, showEdit])
    return (
        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Home List</h6>
                <Link to="/supportplan/add-supportplan">Add Home</Link>
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
            <Modal show={showEdit} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleCloseEdit} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                    <h4 className="modal-title text-white">Edit Home</h4>
                    <button type="button" className="close text-white" onClick={handleCloseEdit}>x</button>
                </Modal.Header>
                <Modal.Body className="p-0 text-left">
                    <HomeEdit handleClose={handleCloseEdit} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Departmentlist;


