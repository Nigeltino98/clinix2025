import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, deleteApi, patchApi, putApi } from '../../../api/api';
import { repairActions } from '../../../store/repairs';
import BASE_URL, { API_ENDPOINTS } from '../../../api/api';
import '../../../assets/css/StockList.css';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const RepairList = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token).token;
  const user = useSelector((state) => state.auth.user);

  const [repairList, setRepairList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const history = useHistory();

  useEffect(() => {

    let apiUrl = '/api/repair-record';
    
    if (selectedCategory) {
      apiUrl += `?asset_type=${selectedCategory}`;
    }
  

    console.log('Fetching records..');

    getApi(
      (response) => {
        dispatch(repairActions.setRepairList(response.data));
        console.log('Repair list:', response.data);
        setRepairList(response.data);
      },
      token,
      apiUrl,
      (error) => {
        console.error('Error fetching repair data:', error);
      }
    );
  }, [dispatch, token, selectedCategory]);


//Adding the delete function, the handleaRCHIve function is used for deletion

  const handleArchive = (id) => {
    const selected = repairList.find((item) => item.id === id);
    
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
        const temp_repair = { is_deleted: true, deletion_reason: reason };
        const userId = user.id;
        putApi(
          () => {
            setRepairList((prevRepairList) => prevRepairList.filter((item) => item.id !== id));
            Swal.fire('Deleted', 'Item has been deleted.', 'success');
          
         },
         token,
         `/api/repair-record/`,
         {...temp_repair, },
         id
       );
      }
    });
  };

    const handleGoBack = () => {
     history.goBack();
   };

  const filteredRepairList = repairList.filter((item) => item.is_deleted !== true);

  return (
    <div className="row">
      <div className="col-xl-12 col-md-12">
        <div className="ms-panel ms-panel-fh">
          <div className="ms-panel-body">
            <h2 className="section-title">House Repair</h2>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Furniture">Furniture</option>
              <option value="Machinery">Machinery</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Cleaning Equipment">Cleaning Equipment</option>
            </select>
            <table className="table-container">
              <thead>
                <tr className="table-heading">
                  <th className="table-cell">Asset Name</th>
                  <th className="table-cell">Asset Type</th>
                  <th className="table-cell">Description</th>
                  <th className="table-cell">House</th>
                  <th className="table-cell">Reminder Date</th>
                  <th className="table-cell">Added On</th>
                  <th className="table-cell">Status</th>
                  <th className="table-cell">Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepairList && filteredRepairList.map((item) => (
                  <tr className="table-row" key={item.id}>
                    <td className="table-cell">{item.asset_name}</td>
                    <td className="table-cell">{item.asset_type}</td>
                    <td className="table-cell">{item.description}</td>
                    <td className="table-cell">{`${item.house_name}`}</td>
                    <td className="table-cell">{item.reminder_date}</td>
                    <td className="table-cell">{item.date_reported}</td>
                    <td className="table-cell">{item.status}</td>
                    <td className="table-cell">{`${item.recorded_by_first_name} ${item.recorded_by_last_name}`}</td>"
                       <button onClick={() => handleArchive(item.id)}>
                          Delete Item
                        </button>

                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleGoBack} className="btn btn-primary">Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairList;
