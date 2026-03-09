import { createSlice } from '@reduxjs/toolkit';
import { getApi, postApi, deleteApi} from '../api/api';

const initialAuthState = {
  inventoryList: [],
  selectedInventory: {},
  item_name: '',
  quantity: 0,
  description: '',
  category: '',
  resident: '',
  staff: '',
  created_by: '',
  errors: {},
  deleted: false,
};



export const deleteInventoryItem = (itemId, token) => {
  const apiUrl = `/api/inventory-delete/${itemId}/`; // Construct the DELETE API URL correctly
  return deleteApi(apiUrl, token);
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: initialAuthState,
  reducers: {
    setInventoryList(state, action) {
      state.inventoryList = action.payload.map(item => ({
        ...item,
        created_by: item.created_by,
        deleted: item.deleted,
      }));
         
    },
    setSelectedInventory(state, action) {
      state.selectedInventory = action.payload;
    },
    deleteInventoryItem(state, action) {
      const id = action.payload;
      state.inventoryList = state.inventoryList.map((item) => item.id ===id ? { ...item, deleted: true} : item );
    },
  },
});



export const inventoryActions = { ...inventorySlice.actions, deleteInventoryItem };
export default inventorySlice.reducer;
