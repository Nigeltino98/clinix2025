import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, deleteApi, deleteInventoryItem, patchApi, putApi } from '../../../api/api';
import { inventoryActions } from '../../../store/inventory';
import { residentActions } from '../../../store/resident';
//import { deleteInventoryItem } from '../../../store/inventory';
import BASE_URL, { API_ENDPOINTS } from '../../../api/api';
import { Link, useHistory } from 'react-router-dom';
import '../../../assets/css/InventoryList.css';
import InventoryCategoryFilter from '../../modals/InventoryCategory';
import Swal from 'sweetalert2';


const InventoryList = () => {
  const dispatch = useDispatch();
  const selected_resident = useSelector((state) => state.resident.selectedResident);
  const token = useSelector((state) => state.auth.token).token;

  const [inventoryList, setInventoryList] = useState([]); // State to store the fetched inventory
  const [selectedCategory, setSelectedCategory] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Fetch inventory data when the component mounts and when the selected resident changes
   
  if (selected_resident.national_id) {

    let apiUrl = `/api/inventory?resident=${selected_resident.national_id}`;

    if (selectedCategory) {
        apiUrl += `&category=${selectedCategory}`;
      }

    getApi(
      (response) => {
        dispatch(inventoryActions.setInventoryList(response.data));
        console.log('Inventory List:', response.data);
        setInventoryList(response.data); // Store the fetched inventory in the state
        console.log('Fetched Inventory:', response.data);
      },
      token, apiUrl
    );
   }
  }, [dispatch, token, selected_resident, selectedCategory]);

  console.log("selected_resident:", selected_resident);
  console.log("Stored Inventory:", inventoryList);

  const handleDeleteItem = (itemId) => {
  // Display a confirmation dialog
  Swal.fire({
    title: 'Are you sure you want to soft-delete this item?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(function (result) {
    if (result.value) {
      // User confirmed, send a DELETE request
     console.log('Attempting to delete item with ID:', itemId);
     deleteApi(
        (response) => {
          console.log('Patch API response:', response);
          // Handle success, e.g., update the UI or state
          Swal.fire('Deleted!', 'The item has been deleted.', 'success');
          // Perform any additional UI updates if needed
          const updatedList = inventoryList.map((item) =>
            item.id === itemId ? { ...item, is_deleted: true } : item
          );
          setInventoryList(updatedList);
          dispatch(inventoryActions.deleteInventoryItem(itemId));
        },
        token, // Your authentication token
        `/api/inventory/${itemId}/`, // Correct API endpoint for deleting inventory items
        { is_deleted: true }
      );
    }
  });
 };

//Adding the function below to effect the deletion of an item, deletinh using putApi

  const handleArchive = (id) => {
    const selected = inventoryList.find((item) => item.id === id);
    const temp_inventory = { is_deleted: true };
    putApi(
      () => {
        
        setInventoryList((prevInventoryList) => prevInventoryList.filter((item) => item.id !== id));
        Swal.fire('Deleted!', 'Inventory item has been deleted.', 'success');
      },
      token,
      `/api/inventory/`, 
      temp_inventory,
      id
    );
    
  };

  const handleGoBack = () => {
     history.goBack();
   };
  
  const filteredInventoryList = inventoryList.filter((item) => item.is_deleted !== true);

  return (
    <div className="row">
      <div className="col-xl-12 col-md-12">
        <div className="ms-panel ms-panel-fh">
          <div className="ms-panel-body">
            <h2 className="section-title">Inventory Items for {selected_resident.first_name} {selected_resident.last_name} </h2>
            
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Documents">Documents</option>
              <option value="Medication">Medication</option>
              <option value="Personal Items">Personal Items</option>
              <option value="Clothing">Clothing</option>
              <option value="Miscellaneous">Miscellaneous</option>
             
            </select>
            <table className=" table-container">
              <thead>
                <tr className="table-heading">
                  <th className="table-cell">Item Name</th>
                  <th className="table-cell">Description</th>
                  <th className="table-cell">Category</th>
                  <th className="table-cell">Quantity</th>
                  <th className="table-cell">Added by</th>
                  <th className="table-cell">Date Added</th>
                </tr>
              </thead>
              <tbody>
                { filteredInventoryList && filteredInventoryList.map((item) => ( !item.deleted && (
                  <tr className="table-row" key={item.id}>
                    <td className="table-cell">{item.item_name}</td>
                    <td className="table-cell">{item.description}</td>
                    <td className="table-cell">{item.category}</td>
                    <td className="table-cell">{item.quantity}</td>
                    <td className="table-cell">{`${item.created_by_first_name} ${item.created_by_last_name}`}</td>
                    <td className="table-cell">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="table-cell">
                      {item.id && (

                       <button onClick={() => {console.log(item.id); handleDeleteItem(item.id);}}>Delete</button> )}
                       <button onClick={() => handleArchive(item.id)}>
                          Delete Item
                        </button>
                    </td>
                  </tr> )
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

export default InventoryList;
