import { createSlice} from "@reduxjs/toolkit";

const houseSlice = createSlice({
    name: 'house',
    initialState: {
        homes: [],
        selectedHome: null, // Adding selected house to state
        residents: [],
    },

    reducers: {
        setHouses(state, action) {
            state.homes = action.payload;
        },
        setSelectedHome(state, action) {
            state.selectedHome = action.payload;
        },
        setResidents(state, action) {
            state.resident = action.payload;
        }
    },
});

export const houseActions = houseSlice.actions;
export default houseSlice.reducer;

