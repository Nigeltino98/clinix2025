import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, deleteApi, patchApi, putApi } from '../../../api/api';
import { confidentialActions } from '../../../store/confidential';
import { residentActions } from '../../../store/resident';
import BASE_URL, { API_ENDPOINTS } from '../../../api/api';
import { Link, useHistory } from 'react-router-dom';
import '../../../assets/css/AssetList.css';
import Swal from 'sweetalert2';

const ConfidentialList = () => {
  const dispatch = useDispatch();
  const selected_resident = useSelector((state) => state.resident.selectedResident);
  const token = useSelector((state) => state.auth.token).token;
  const user = useSelector((state) => state.auth.user);
  const [confidentialList, setConfidentialList] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch inventory data when the component mounts and when the selected resident changes

  if (selected_resident.national_id) {

    let apiUrl = `/api/confidential-info?resident=${selected_resident.national_id}`;

    getApi(
      (response) => {
        dispatch(confidentialActions.setConfidentialList(response.data));
        console.log('IConfidential List:', response.data);
        setConfidentialList(response.data); // Store the fetched inventory in the state
        console.log('Fetched Information:', response.data);
      },
      token, apiUrl
    );
   }
  }, [dispatch, token, selected_resident]);

  console.log("selected_resident:", selected_resident);
  console.log("Stored Information:", confidentialList);

  const handleArchive = (id) => {
    const selected = confidentialList.find((item) => item.id === id);

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
        const temp_info = { is_deleted: true, deletion_reason: reason };
        const userId = user.id;
        putApi(
          () => {
            setConfidentialList((prevConfidentialList) => prevConfidentialList.filter((item) => item.id !== id));
            Swal.fire('Deleted', 'Information has been deleted.', 'success');
        },
        token,
        `/api/confidential-info/`,
        {...temp_info, },
        id
      );
     }
   });
  };

  const handleGoBack = () => {
     history.goBack();
   };

  const filteredConfidentialList = confidentialList.filter((item) => item.is_deleted !== true);

  return (
    <div className="row">
      <div className="col-xl-12 col-md-12">
        <div className="ms-panel ms-panel-fh">
          <div className="ms-panel-body">
            <h2 className="section-title">Confidential Information</h2>

            <table className="table-container">
              <thead>
                <tr className="table-heading">
                  <th className="table-cell">Information</th>
                  <th className="table-cell">Resident</th>
                  <th className="table-cell">Added By</th>
                  <th className="table-cell">Added On</th>
                </tr>
              </thead>
              <tbody>
                {filteredConfidentialList && filteredConfidentialList.map((item) => (
                  <tr className="table-row" key={item.id}>
                    <td className="table-cell">{item.information}</td>
                    <td className="table-cell">{`${item.name_first_name} ${item.name_last_name}`}</td>
                    <td className="table-cell">{`${item.created_by_first_name} ${item.created_by_last_name}`}</td>
                    <td className="table-cell">{item.added_on}</td>
                    <td className="table-cell">
                      <button onClick={() => handleArchive(item.id)}>Delete</button>
                    </td>
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

export default ConfidentialList;


