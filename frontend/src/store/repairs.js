import { createSlice } from '@reduxjs/toolkit';
import { getApi, deleteApi, postApi } from '../api/api';

const initialAuthState = {
  repairList: [], // To store the list of repair records
  selectedRepair: null, // To store the currently selected repair record (for update and detail views)
};

const repairSlice = createSlice({
  name: 'repair',
  initialState: initialAuthState,
  reducers: {
    setRepairList(state, action) {
      state.repairList = action.payload.map(item => ({
        ...item,
        recorded_by: item.recorded_by,
      }));
    },
    setSelectedRepair(state, action) {
      state.selectedRepair = action.payload;
    },
    addRepair(state, action) {
      state.repairList.push(action.payload);
    },
    updateRepair(state, action) {
      const updatedRepair = action.payload;
      const index = state.repairList.findIndex((r) => r.id === updatedRepair.id);
      if (index !== -1) {
        state.repairList[index] = updatedRepair;
      }
    },
    deleteRepair(state, action) {
      state.repairList = state.repairList.filter((r) => r.id !== action.payload);
    },
  },
});

export const {
  setRepairList,
  setSelectedRepair,
  addRepair,
  updateRepair,
  deleteRepair,
} = repairSlice.actions;

export const repairActions = repairSlice.actions;

export default repairSlice.reducer;
