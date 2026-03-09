import { createSlice } from '@reduxjs/toolkit';
import { postApi } from '../api/api';

const initialAuthState = {
  confidentialList: [],
  selectedConfidential:{},

};

const confidentialSlice = createSlice({
  name: 'confidential',
  initialState: initialAuthState,
  reducers: {
    setConfidentialList(state, action) {
      state.confidentialInfo = action.payload;
    },
    setSelectedConfidential(state, action) {
      state.selectedConfidential = action.payload;
    },

  },
});

export const {
  setConfidentialList,
  setSelectedConfidential,

} = confidentialSlice.actions;

export const confidentialActions = confidentialSlice.actions;
export default confidentialSlice.reducer;
