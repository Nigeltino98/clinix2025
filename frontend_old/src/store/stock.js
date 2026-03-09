import { createSlice } from '@reduxjs/toolkit';
import { getApi, postApi } from '../api/api';

const initialAuthState = {
  stockList: [], 
  selectedStock: {},

};

const stockSlice = createSlice({
  name: 'stock',
  initialState: initialAuthState,
  reducers: {
    setStockList(state, action) {
      state.stockList = action.payload.map(item => ({
        ...item,
        recorded_by: item.recorded_by,
      }));
         
    },
    setSelectedStock(state, action) {
        state.selectedStock = action.payload
    
  },

 handleDelete(state, action) {
    
    state.stockList = state.stockList.map((item) =>
      item.id === action.payload
        ? {
           ...item, 
           is_deleted: true,
          }
         : item
     );
    },
   },
});

export const stockActions = stockSlice.actions;

export default stockSlice.reducer;
