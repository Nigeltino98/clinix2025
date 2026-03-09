import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { genderActions } from '../../store/gender';

const GenderFilter = () => {
    const dispatch = useDispatch();

    const [selectedGender, setSelectedGender] = useState('');

    const handleGenderChange = (event) => {
        const gender = event.target.value;
        setSelectedGender(gender);

        // Dispatch an action to update the selected gender in the Redux store
        dispatch(genderActions.setSelectedGender(gender));
    };

    return (
        <div>
            <label>Filter by Gender:</label>
            <select value={selectedGender} onChange={handleGenderChange}>
                <option value="">All Staff</option>
                <option value="male">Male Staff</option>
                <option value="female">Female Staff</option>
                <option value="other">Other</option>
            </select>
        </div>
    );
};

export default GenderFilter;
