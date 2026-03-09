import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getApi } from '../../api/api';
import { userHistoryActions } from '../../store/userHistory';
import '../../assets/css/historyList.css';

const UserHistoryList = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token).token;

  const [userHistoryList, setUserHistoryList] = useState([]);
  const navigate = useNavigate(); // React Router v6 replacement for useHistory

  useEffect(() => {
    getApi(
      (response) => {
        if (response && response.data) {
          dispatch(userHistoryActions.setUserHistoryList(response.data));
          setUserHistoryList(response.data);
        }
      },
      token,
      '/api/UserHistory/'
    );
  }, [dispatch, token]);

  console.log('Stored User History:', userHistoryList);

  const handleGoBack = () => {
    navigate(-1); // Go back one step
  };

  return (
    <div className="row">
      <div className="col-xl-12 col-md-12">
        <div className="ms-panel ms-panel-fh">
          <div className="ms-panel-body">
            <h1 className="section-title">User History Recorded</h1>
            <table className="table-container">
              <thead>
                <tr className="table-heading">
                  <th className="table-cell">Actions</th>
                  <th className="table-cell">Date and Time</th>
                  <th className="table-cell">Details</th>
                </tr>
              </thead>
              <tbody>
                {userHistoryList.map((historyItem) => (
                  <tr className="table-row" key={historyItem.id}>
                    <td className="table-cell">{historyItem.action}</td>
                    <td className="table-cell">
                      {new Date(historyItem.timestamp).toLocaleString()}
                    </td>
                    <td className="table-cell">{historyItem.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleGoBack} className="btn btn-primary">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHistoryList;
