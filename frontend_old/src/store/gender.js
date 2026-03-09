import { createSlice } from '@reduxjs/toolkit';

const initialGenderState = {
selectedGender: '',

};

const genderSlice = createSlice({
    name: 'gender',
    initialState: initialGenderState,
    reducers: {
       setSelectedGender(state, action) {
          state.selectedGender = action.payload;
         },
    },
});

export const genderActions = genderSlice.actions;

export default genderSlice.reducer