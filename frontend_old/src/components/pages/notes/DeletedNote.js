import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, putApi } from '../../../api/api';
import { noteActions } from '../../../store/note';
import '../../../assets/css/AssetList.css';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const DeletedNotes = () => {
    const token = useSelector((state) => state.auth.token).token;
    const dispatch = useDispatch();
    const selectedResident = useSelector((state) => state.resident.selectedResident);
    const [deletedNotes, setDeletedNotes] = useState([]);
    const history = useHistory();

    useEffect(() => {
  
      const api = '/api/note/';
      console.log('Fetching notes..');
      getApi(
        (response) => {
          dispatch(noteActions.setDeletedNotes(response.data));
          console.log('DeletedNotes:', response.data);
          setDeletedNotes(response.data);
          console.log('Fetched notes:', response.data);
        },
        token,
        api,
      );
    }, [dispatch, token]);

    console.log("Notes:", deletedNotes)

    const handleGoBack = () => {
     history.goBack();
    };

    const filteredDeletedNotes = deletedNotes.filter((item) => item.is_deleted ===true);
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
                  <th className="table-cell">Deleted by</th>
                  <th className="table-cell">Entry</th>
                  <th className="table-cell">Deletion Reason</th>
                  <th className="table-cell">Deleted on</th>
                  <th className="table-cell"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDeletedNotes.map((note) => (
                  <tr className="table-row" key={note.id}>
                    <td className="table-cell">{`${note.name_first_name} ${note.name_last_name}`}</td>
                    <td className="table-cell">{`${note.created_by_first_name} ${note.created_by_last_name}`}</td>
                    <td className="table-cell">{note.entry}</td>
                    <td className="table-cell">{note.deletion_reason}</td>
                    <td className="table-cell">{note.type}</td>
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

export default DeletedNotes;

