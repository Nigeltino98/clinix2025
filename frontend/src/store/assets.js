// Creating a new slice for house assets
import { createSlice } from '@reduxjs/toolkit';
import { getApi, deleteApi, postApi } from '../api/api';

const initialAuthState = {
  houseAssetList: [],
  selectedHouseAsset: {},
};

const houseAssetSlice = createSlice({
  name: 'houseAsset',
  initialState: initialAuthState,
  reducers: {
    setHouseAssetList(state, action) {
      state.houseAssetList = action.payload.map(asset => ({
        ...asset,
        recorded_by: asset.recorded_by,
      }));
    },
    setSelectedHouseAsset(state, action) {
      state.selectedHouseAsset = action.payload;
    },
    // Add other reducers specific to house assets as needed
  },
});

export const houseAssetActions = houseAssetSlice.actions;

export default houseAssetSlice.reducer;
