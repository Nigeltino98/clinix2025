import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { getApi } from '../../api/api';
import { userHistoryActions } from '../../store/userHistory'; // Import your user history actions
import '../../assets/css/historyList.css';

const UserHistoryList = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token).token;
  //const user = useSelector((state) => state.user.user);

  const [userHistoryList, setUserHistoryList] = useState([]);
  const history = useHistory(); //This enables the back button effect

  useEffect(() => {
    // Fetch user history data when the component mounts
    getApi(
      (response) => {
        dispatch(userHistoryActions.setUserHistoryList(response.data)); // Assuming setUserHistoryList is an action
        setUserHistoryList(response.data); // Store the fetched user history in the state
      },
      token,
      '/api/UserHistory/' 
    );
  }, [dispatch, token]);

  console.log('Stored User History:', userHistoryList);
  
  const handleGoBack = () => {
     history.goBack();
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
                  {/* Add more columns as needed */}
                </tr>
              </thead>
              <tbody>
                {userHistoryList.map((historyItem) => (
                  <tr className="table-row" key={historyItem.id}>
                    <td className="table-cell">{historyItem.action}</td>
                    <td className="table-cell">{new Date(historyItem.timestamp).toLocaleString()}</td>
                    <td className="table-cell">{historyItem.details}</td>
                    {/* Add more columns as needed */}
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

export default UserHistoryList;
