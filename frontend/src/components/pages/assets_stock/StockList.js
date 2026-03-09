import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, putApi } from '../../../api/api';
import { stockActions } from '../../../store/stock';
import '../../../assets/css/StockList.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const StockList = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token).token;
  const user = useSelector((state) => state.auth.user);

  const [stockList, setStockList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let api = '/api/house-stock/';
    if (selectedCategory) {
      api += `?category=${selectedCategory}`;
    }

    console.log('Fetching stock..');
    getApi(
      (response) => {
        dispatch(stockActions.setStockList(response.data));
        setStockList(response.data);
      },
      token,
      api,
      (error) => {
        console.error('Error fetching stock', error);
      }
    );
  }, [dispatch, token, selectedCategory]);

  const handleArchive = (id) => {
    Swal.fire({
      title: 'Are you sure you want to delete this item?',
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
        const temp_stock = { is_deleted: true, deletion_reason: reason };
        putApi(
          () => {
            setStockList((prev) => prev.filter((item) => item.id !== id));
            Swal.fire('Deleted', 'Stock item has been deleted.', 'success');
          },
          token,
          `/api/house-stock/`,
          { ...temp_stock },
          id
        );
      }
    });
  };

  const handleGoBack = () => navigate(-1);

  const filteredStockList = stockList.filter((item) => !item.is_deleted);

  return (
    <div className="row">
      <div className="col-xl-12 col-md-12">
        <div className="ms-panel ms-panel-fh">
          <div className="ms-panel-body">
            <h2 className="section-title">House Stock</h2>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Furniture">Furniture</option>
              <option value="Machinery">Machinery</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Cleaning Equipment">Cleaning Equipment</option>
            </select>

            <table className="table-container">
              <thead>
                <tr className="table-heading">
                  <th className="table-cell">Name</th>
                  <th className="table-cell">Quantity</th>
                  <th className="table-cell">House</th>
                  <th className="table-cell">Description</th>
                  <th className="table-cell">Added On</th>
                  <th className="table-cell">Recorded By</th>
                  <th className="table-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStockList.map((item) => (
                  <tr className="table-row" key={item.id}>
                    <td className="table-cell">{item.name}</td>
                    <td className="table-cell">{item.quantity}</td>
                    <td className="table-cell">{item.house_name}</td>
                    <td className="table-cell">{item.description}</td>
                    <td className="table-cell">{item.created_on}</td>
                    <td className="table-cell">
                      {item.recorded_by_first_name} {item.recorded_by_last_name}
                    </td>
                    <td className="table-cell">
                      <button onClick={() => handleArchive(item.id)}>Delete Item</button>
                    </td>
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

export default StockList;
