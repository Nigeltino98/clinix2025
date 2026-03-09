import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, deleteApi, patchApi, putApi } from '../../../api/api';
import { houseAssetActions } from '../../../store/assets';
import BASE_URL, { API_ENDPOINTS } from '../../../api/api';
import { Link, useHistory } from 'react-router-dom';
import '../../../assets/css/AssetList.css';
import Swal from 'sweetalert2';



const HouseAssetList = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token).token;
  const user = useSelector((state) => state.auth.user);

  const [houseAssetList, setHouseAssetList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Fetch asset data when the component mounts or when the selected category changes

    let apiUrl = '/api/house-asset/';

    if (selectedCategory) {
      apiUrl += `?category=${selectedCategory}`;
    }
  
    console.log('Fetching assets..');
    
    getApi(
      (response) => {
        dispatch(houseAssetActions.setHouseAssetList(response.data));
        console.log('Asset List:', response.data);
        setHouseAssetList(response.data);
        console.log('Fetched Assets:', response.data);
      },
      token,
      apiUrl,
      (error) => {
         console.error('Error fetching assets', error);
      }
    );
  
  }, [dispatch, token, selectedCategory]);

    console.log("Stored Asset:", houseAssetList);

//The handlearchive is used for the deletion purpose
  const handleArchive = (id) => {
    const selected = houseAssetList.find((item) => item.id === id);

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
        const temp_asset = { is_deleted: true, deletion_reason: reason };
        const userId = user.id;
        putApi(
          () => {
            setHouseAssetList((prevHouseAssetList) => prevHouseAssetList.filter((item) => item.id !== id));
            Swal.fire('Deleted', 'Asset item has been deleted.', 'success');  
        },
        token,
        `/api/house-asset/`, 
        {...temp_asset, }, 
        id
      );
     }
   });
  };

  
  const handleGoBack = () => {
     history.goBack();
   };
 
  const filteredHouseAssetList = houseAssetList.filter((item) => item.is_deleted !== true);

  return (
    <div className="row">
      <div className="col-xl-12 col-md-12">
        <div className="ms-panel ms-panel-fh">
          <div className="ms-panel-body">
            <h2 className="section-title">House Assets</h2>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Furniture">Furniture</option>
              <option value="Machinery">Machinery</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Electrical Gadgets">Electrical Gadgets</option>
              <option value="Other">Other</option>

              {/* Add more categories as needed */}
            </select>
            <table className="table-container">
              <thead>
                <tr className="table-heading">
                  <th className="table-cell">Asset Name</th>
                  <th className="table-cell">Serial Number</th>
                  <th className="table-cell">Value</th>
                  <th className="table-cell">House</th>
                  <th className="table-cell">Condition</th>
                  <th className="table-cell">Category</th>
                  <th className="table-cell">Added On</th>
                  <th className="table-cell">Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {filteredHouseAssetList && filteredHouseAssetList.map((asset) => (
                  <tr className="table-row" key={asset.id}>
                    <td className="table-cell">{asset.name}</td>              
                    <td className="table-cell">{asset.serial_number}</td>
                    <td className="table-cell">{asset.value}</td>
                    <td className="table-cell">{`${asset.house_name}`}</td>   
                    <td className="table-cell">{asset.condition}</td>
                    <td className="table-cell">{asset.category}</td>
                    <td className="table-cell">{asset.recorded_on}</td>
                    <td className="table-cell">{`${asset.recorded_by_first_name} ${asset.recorded_by_last_name}`}</td>"
                    <td className="table-cell">
                      <button onClick={() => handleArchive(asset.id)}>Delete</button>              
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

export default HouseAssetList;
