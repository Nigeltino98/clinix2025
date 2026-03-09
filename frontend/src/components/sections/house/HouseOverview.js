import React from 'react';
import { Link } from 'react-router-dom';
import '../../../assets/css/HouseOverview.css';

const HouseOverview = () => {

  const handleGoBack = () => {
    window.history.back(); // replaces useHistory
  };

  return (
    <div>
      <h1>Welcome to House Overview</h1>
      <p>Access information to the Homes.</p>
      <ul>
        <li>
          <Link to="/asset-list">House Assets</Link>
        </li>
        <li>
          <Link to="/stock-list">House Stock</Link>
        </li>
        <li>
          <Link to="/repair-list">House Repairs</Link>
        </li>
      </ul>
      <button onClick={handleGoBack} className="btn btn-primary">Back</button>
    </div>
  );
};

export default HouseOverview;
