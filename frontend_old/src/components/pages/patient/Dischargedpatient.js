import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, putApi } from '../../../api/api';
import { residentActions } from '../../../store/resident';
import '../../../assets/css/AssetList.css';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const DischargedResidentsList = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token).token;

  const [dischargedResident, setDischargedResident] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch discharged residents when the component mounts
    getApi(
      (response) => {
        dispatch(residentActions.setDischargedResident(response.data));
        console.log('DischargedResident:', response.data);
        setDischargedResident(response.data);
        console.log('Fetched residents:', response.data);
      },
      token,
      '/api/resident-discharge'
    );
  }, [dispatch, token]);
  
    console.log("Discharged residents:", dischargedResident);

  // Handle archiving (deleting) a discharged resident
  const handleArchive = (id) => {
    const selected = dischargedResident.find((item) => item.id === id);

    Swal.fire({
      title: 'Are you sure you want to delete this discharged resident?',
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
        const temp_resident = { is_archived: true, deletion_reason: reason };

        putApi(
          () => {
            setDischargedResident((prevDischargedResidents) =>
              prevDischargedResidents.filter((item) => item.id !== id)
            );
            Swal.fire('Deleted', 'Discharged resident has been deleted.', 'success');
          },
          token,
          `/api/resident-discharge/`,
          temp_resident
        );
      }
    });
  };
  
  const handleGoBack = () => {
     history.goBack();
   };

  return (
    <div className="row">
      <div className="col-xl-12 col-md-12">
        <div className="ms-panel ms-panel-fh">
          <div className="ms-panel-body">
            <h1 className="section-title">Discharged Residents</h1>
            <table className="table-container">
              <thead>
                <tr className="table-heading">
                  <th className="table-cell">Name</th>
                  <th className="table-cell">Discharged by</th>
                  <th className="table-cell">Discharged on</th>
                  <th className="table-cell">Reason</th>
                  <th className="table-cell">Discharge Type</th>
                  <th className="table-cell"></th>
                </tr>
              </thead>
              <tbody>
                {dischargedResident.map((resident) => (
                  <tr className="table-row" key={resident.id}>
                    <td className="table-cell">{`${resident.name_first_name} ${resident.name_last_name}`}</td>
                    <td className="table-cell">{resident.discharged_by_id}</td>
                    <td className="table-cell">{resident.created_on}</td>
                    <td className="table-cell">{resident.reason}</td>
                    <td className="table-cell">{resident.type}</td>
                    {/*<td className="table-cell">
                      <button onClick={() => handleArchive(resident.id)}>Delete</button>
                    </td> */}
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

export default DischargedResidentsList;
