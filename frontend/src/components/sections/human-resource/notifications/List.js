import React, { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { useDispatch, useSelector } from 'react-redux'
import { getApi } from '../../../../api/api'
import { notificationActions } from '../../../../store/notification'
import { selectedStaff } from '../../../utils/expand'
import dateToYMD from '../../../utils/dates'


const Addform = () => {
    const notification_list = useSelector((state) => state.notification.notificationList)
    const dispatch = useDispatch()
    const staff = useSelector((state) => state.staff.staffList)
    const token = useSelector((state) => state.auth.token).token
    const notifications = [...notification_list]
    useEffect(() => {
        getApi(response => { dispatch(notificationActions.setNotification(response.data)) }, token, "/api/reminder")
    }, [dispatch, token])

    const columns = [
        { name: "Subject", selector: "subject", sortable: true },
        {
            name: "Created by", cell: row =>
                <div >
                    {selectedStaff(row.staff, staff)}
                </div>, sortable: true
        }, {
            name: "Assigned by", cell: row =>
                <div >
                    {selectedStaff(row.created_by, staff)}
                </div>, sortable: true
        },
        { name: "Notes", selector: "notes", sortable: true },
        {
            name: "Start Date", cell: row =>
                <div >
                    {dateToYMD(row.start_date)}
                </div>, sortable: true
        },
        {
            name: "Due Date", cell: row =>
                <div >
                    {dateToYMD(row.end_date)}
                </div>, sortable: true
        },

    ];

    const data = []

    const tableData = {
        columns: columns,
        data: notifications,
    };


    return (

        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                <h6>Notifications</h6>
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

        </div>


    );
}


export default Addform;

