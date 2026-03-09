// This is responsible for filtering inventory data based on category
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inventoryActions } from '../../store/inventory';

const InventoryCategoryFilter = () => {
    const dispatch = useDispatch();
    const selected_resident = useSelector((state) => state.resident.selectedResident);
    const token = useSelector((state) => state.auth.token).token;

    const [selectedCategory, setSelectedCategory] = useState('');

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);

        // Fetch inventory data filtered by category
        // You can implement this logic similarly to how you fetch the initial inventory data
    };

    return (
        <div>
            <label>Filter by Category:</label>
            <select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">All</option>
                <option value="Documents">Documents</option>
                <option value="Medication">Medication</option>
                <option value="Personal Items">Personal Items</option>
                <option value="Clothing">Clothing</option>
                <option value="Miscellaneous">Miscellaneous</option>

            </select>
        </div>
    );
};

export default InventoryCategoryFilter;
