import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getApi } from '../../../../api/api'
import { staffActions } from '../../../../store/staff'
import { transactionActions } from '../../../../store/transaction'
import { attachmentActions } from '../../../../store/attachment'
import { paymentshandoverActions } from '../../../../store/paymentshandover'
import HandoverPayment from '../../../modals/HandoverPayment'
import { selectedResident, selectedStaff } from '../../../utils/expand'
import dateToYMD from '../../../utils/dates'
import { Modal } from 'react-bootstrap';
import ProtectedRoute from '../../../protected/ProtectedRoute'
import PrintButton from '../../../utils/print'


const Paymentlist = () => {
    const dispatch = useDispatch()
    const selected_resident = useSelector((state) => state.resident.selectedResident)
    const staff = useSelector((state) => state.staff.staffList)
    const transactions = useSelector((state) => state.transaction.transactionList)
    const [transaction_list, setTransactions] = useState([])
    const handovers = useSelector((state) => state.paymentshandover.paymentshandoverList)
    const selected_transaction_list = useSelector((state) => state.transaction.selectedTransactionList)
    const data = selected_transaction_list
    const resident_list = useSelector((state) => state.resident.residentList)
    const token = useSelector((state) => state.auth.token).token
    const residents = [...resident_list]
    const attachments = useSelector((state) => state.attachment.attachmentList)
    const [showHandover, setshowHandover] = useState(false)
    const [total, setTotal] = useState(0)
    const [total_value, setTotalValue] = useState(0)
    const [selectedPaymentsHandover, setSelectedPaymentsHandover] = useState(null);
    const [showEdit, setshowEdit] = useState(false)


    const handleSetHandoverPayment = () => {
        setshowHandover(true)
    }

    const handleClose = (id) => {
        setshowHandover(false)
    }
   
    const handleRowClick = (row) => {
        setSelectedPaymentsHandover(row);
    };

    const getReceiptLink = (id) => {
        return [...attachments].find(item => item.id === id)
    }
    const transType = (row) => {
        if (row.state === "cr") {
            return " Deposit"
        } else if (row.state === "cr") {
            return "Withdrawal"
        } else {
            return "Balance Check"
        }
    }
    const columns = [
        // { name: "#", selector: "id", sortable: true },
        {
            name: "Resident", cell: row =>
                <div >
                    {selectedResident(row.resident, residents)}
                </div>, sortable: true
        },
        { name: "Description", selector: "description", sortable: true },
        {
            name: "Money In/Out", cell: row =>
                <div >
                    {transType(row)}
                </div>, sortable: true
        },

        {
            name: "Transaction Date", cell: row =>
                <div >
                    {dateToYMD(row.created_on)}
                </div>, sortable: true
        },
        { name: "Receipt Number", selector: "receipt_number", sortable: true },
        {
            name: "Receipt", cell: row =>
                <div >
                    {row.attachment && <a href={row.attachment}>click to download</a>}
                </div>, sortable: true
        },
        {
            name: "Staff", cell: row =>
                <div >
                    {row.staff ? selectedStaff(row.staff, staff) : selectedStaff(row.incoming, staff)}
                </div>, sortable: true
        },
        { name: "Amount", selector: "amount", sortable: true },
    ];
    const tableData = {
        columns,
        data,
    };
    useEffect(() => {
        getApi(response => { dispatch(transactionActions.setTransactions(response.data)) }, token, "/api/transaction")
        getApi(response => { dispatch(attachmentActions.setAttachments(response.data)) }, token, "/api/attachment")
        getApi(response => { dispatch(staffActions.setStaff(response.data)) }, token, "/api/staff")
        getApi(response => { dispatch(paymentshandoverActions.setPaymentsHandover(response.data)) }, token, "/api/handoverpayment")
    }, [dispatch, token, selected_resident])

    useEffect(() => {
        const data = [...handovers, ...transactions]
        data.sort((a, b) => a.created_on - b.created_on);
        setTransactions(data)

    }, [dispatch, token, transactions, handovers])

    useEffect(() => {
        if (JSON.stringify(selected_resident) === '{}') {
            dispatch(transactionActions.setSelectedTransactions(transaction_list))
        } else {
            const data = transaction_list.filter(item => item.resident === selected_resident.national_id)
            dispatch(transactionActions.setSelectedTransactions(data))
        }
    }, [dispatch, token, transaction_list, selected_resident])

    const findTotal = () => {
        const cr = [...selected_transaction_list].filter(item => item.state === 'cr')
        const dr = [...selected_transaction_list].filter(item => item.state === 'dr')
        const cr_total = cr.reduce(function (accumulator, currentValue) {
            return accumulator + parseFloat(currentValue.amount)
        }, 0)
        const dr_total = dr.reduce(function (accumulator, currentValue) {
            return accumulator + parseFloat(currentValue.amount)
        }, 0)
        return [`Balance £ ${cr_total - dr_total}`, cr_total - dr_total]
    }


    useEffect(() => {
        setTotal(findTotal()[0])
        setTotalValue(findTotal()[1])
    }, [selected_transaction_list])

 
    //The function below allows for the selection of a certain note to see in detail
    const SelectedTransactionModal = () => {
        if (!selectedPaymentsHandover) {
            return null;
        }

    const onClose = () => {
        setSelectedPaymentsHandover(null);
        setshowEdit(false);
    };

        return (
            <Modal show={true} className="ms-modal-dialog-width ms-modal-content-width" onHide={onClose} centered>
                <Modal.Header className="ms-modal-header-radius-0">
                 <div>
                    <h1>Seacole Health</h1>
                    <h2 className="modal-title text-white">Selected Transaction</h2>
                    <p>Date recorded: {selectedPaymentsHandover.created_on}</p>
                 </div>
                    <button type="button" className="close text-red w-20 mr-2" onClick={onClose}>x</button>
                    <PrintButton/>
                </Modal.Header>
                <Modal.Body style={{ padding: '20px', fontSize: '16px', lineHeight: '1.5' }}>
                    <div>
                        <h2>Transaction Statement for: {selectedPaymentsHandover.resident}</h2>
                        <p>Description: {selectedPaymentsHandover.description}</p>
                        <p>Receipt Number: {selectedPaymentsHandover.receipt_number}</p>
                        <p>Type of note: {selectedPaymentsHandover.state}</p>
                        <p>Staff responsible: {selectedPaymentsHandover.staff_id}</p>
                        <p>Type of transaction: {selectedPaymentsHandover.transaction_type}</p>
                        <p>Staff responsible: {selectedPaymentsHandover.staff}</p>
                        
                        {/* Display other note details here */}
                    </div>
                </Modal.Body>
            </Modal>
        );
    };

    return (
        <div className="ms-panel">
            <div className="ms-panel-header ms-panel-custome">
                {JSON.stringify(selected_resident) !== '{}' &&
                    <h6>  {total}</h6>
                }
                {JSON.stringify(selected_resident) !== '{}' &&
                    <div>
                        <ProtectedRoute perm="add_handoverpayment">
                            <Link to="#" onClick={() => handleSetHandoverPayment()}>Confirm Balance </Link>
                        </ProtectedRoute>
                    </div>
                }
                <ProtectedRoute perm="add_finance">
                    <Link to="/payment/add-payment">Add Transaction</Link>
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
                            noHeader
                            onRowClicked={handleRowClick}
                        />
                    </DataTableExtensions>
                </div>
                <Modal show={showHandover && JSON.stringify(selected_resident) !== '{}'} className="ms-modal-dialog-width ms-modal-content-width" onHide={handleClose} centered>
                    <Modal.Header className="ms-modal-header-radius-0">
                        <h4 className="modal-title text-white">{total} for {selected_resident.first_name}  {selected_resident.last_name}</h4>
                        <button type="button" className="close text-white" onClick={handleClose}>x</button>
                    </Modal.Header>
                    <Modal.Body className="p-0 text-left">
                        <HandoverPayment handleClose={handleClose} total={total_value} />
                    </Modal.Body>
                </Modal>
            </div>
             <SelectedTransactionModal onClose={() => setshowEdit(false)} />
        </div>
    );
}

export default Paymentlist;