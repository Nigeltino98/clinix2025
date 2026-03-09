import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApi } from '../../../api/api';
import { noteActions } from '../../../store/note';
import '../../../assets/css/AssetList.css';
import { useNavigate } from 'react-router-dom';

const DeletedNotes = () => {
  const token = useSelector((state) => state.auth.token).token;
  const dispatch = useDispatch();
  const [deletedNotes, setDeletedNotes] = useState([]);
  const navigate = useNavigate();
  const selectedResident = useSelector((state) => state.resident.selectedResident);

  useEffect(() => {
    const apiUrl = '/api/note/';
    console.log('Fetching notes...');
    getApi(
      (response) => {
        dispatch(noteActions.setDeletedNotes(response.data));
        setDeletedNotes(response.data);
        console.log('Fetched Deleted Notes:', response.data);
      },
      token,
      apiUrl
    );
  }, [dispatch, token]);

  const handleGoBack = () => navigate(-1);

  const filteredDeletedNotes = deletedNotes.filter((item) => item.is_deleted === true);

  return (
    <div className="row">
      <div className="col-xl-12 col-md-12">
        <div className="ms-panel ms-panel-fh">
          <div className="ms-panel-body">
            <h1 className="section-title">Deleted Daily Notes</h1>

            <table className="table-container">
              <thead>
                <tr className="table-heading">
                  <th className="table-cell">Resident</th>
                  <th className="table-cell">Deleted By</th>
                  <th className="table-cell">Entry</th>
                  <th className="table-cell">Deletion Reason</th>
                  <th className="table-cell">Deleted On</th>
                  <th className="table-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeletedNotes.map((note) => (
                  <tr className="table-row" key={note.id}>
                    <td className="table-cell">{`${note.name_first_name || ''} ${note.name_last_name || ''}`}</td>
                    <td className="table-cell">{`${note.created_by_first_name || ''} ${note.created_by_last_name || ''}`}</td>
                    <td className="table-cell">{note.entry}</td>
                    <td className="table-cell">{note.deletion_reason}</td>
                    <td className="table-cell">{note.deleted_on || 'N/A'}</td>
                    <td className="table-cell">
                      {/* Placeholder for future actions, e.g., restore */}
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

export default DeletedNotes;
