import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, putApi } from '../../../api/api';
import { residentActions } from '../../../store/resident';
import '../../../assets/css/AssetList.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const DischargedResidentsList = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token).token;
  const [dischargedResidents, setDischargedResidents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getApi(
      (response) => {
        dispatch(residentActions.setDischargedResident(response.data));
        setDischargedResidents(response.data);
        console.log('Fetched Discharged Residents:', response.data);
      },
      token,
      '/api/resident-discharge'
    );
  }, [dispatch, token]);

  const handleArchive = (id) => {
    const selected = dischargedResidents.find((item) => item.id === id);

    Swal.fire({
      title: 'Are you sure you want to delete this discharged resident?',
      text: 'This action might be permanent.',
      input: 'text',
      inputPlaceholder: 'Please provide a reason for deletion...',
      inputValidator: (value) => {
        if (!value) return 'You need to provide a reason!';
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = Swal.getInput().value;
        const tempResident = { is_archived: true, deletion_reason: reason };

        putApi(
          () => {
            setDischargedResidents((prev) =>
              prev.filter((item) => item.id !== id)
            );
            Swal.fire('Deleted', 'Discharged resident has been deleted.', 'success');
          },
          token,
          `/api/resident-discharge/`,
          tempResident
        );
      }
    });
  };

  const handleGoBack = () => navigate(-1);

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
                  <th className="table-cell">Discharged By</th>
                  <th className="table-cell">Discharged On</th>
                  <th className="table-cell">Reason</th>
                  <th className="table-cell">Discharge Type</th>
                  <th className="table-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dischargedResidents.map((resident) => (
                  <tr className="table-row" key={resident.id}>
                    <td className="table-cell">{`${resident.name_first_name || ''} ${resident.name_last_name || ''}`}</td>
                    <td className="table-cell">{resident.discharged_by_name || resident.discharged_by_id}</td>
                    <td className="table-cell">{resident.created_on}</td>
                    <td className="table-cell">{resident.reason}</td>
                    <td className="table-cell">{resident.type}</td>
                    <td className="table-cell">
                      {/* Uncomment below to enable deletion */}
                      {/* <button onClick={() => handleArchive(resident.id)}>Delete</button> */}
                      -
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={handleGoBack} className="btn btn-primary mt-3">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargedResidentsList;
