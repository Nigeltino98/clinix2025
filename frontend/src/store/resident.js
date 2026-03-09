import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = {
    residentList: [], selectedResident: {},
    handoverResident: {}, selectedBaths: [], selectedWeights: [], selectedFluids: [],
    selectedMoods: [], selectedSleeps: [], selectedMentalStates: [], selectedMorningRoutine: [],
    selectedAfternoonRoutine: [], selectedIncident: [], selectedInventory: [], selectedinventoryList: [],
};
const residentSlice = createSlice({
    name: 'resident',
    initialState: initialAuthState,
    reducers: {
        setResidents(state, action) {
            state.residentList = action.payload
        },
        sethandoverResident(state, action) {
            state.handoverResident = action.payload
        },
        setSelectedResident(state, action) {
            state.selectedResident = action.payload
        },
        setBaths(state, action) {
            state.selectedBaths = action.payload
        },
        setWeights(state, action) {
            state.selectedWeights = action.payload
        },
        setFluids(state, action) {
            state.selectedFluids = action.payload
        },
        setMoods(state, action) {
            state.selectedMoods = action.payload
        },
        setSleeps(state, action) {
            state.selectedSleeps = action.payload
        },
        setMentalStates(state, action) {
            state.selectedMentalStates = action.payload
        },
        setMorningRoutine(state, action) {
            state.selectedMorningRoutine = action.payload
        },
        setAfternoonRoutine(state, action) {
            state.selectedAfternoonRoutine = action.payload
        },
        setIncident(state, action) {
            state.selectedIncident = action.payload
        },
        setInventory(state, action) {
            state.selectedInventory = action.payload
        },
        setinventoryList(state,action) {
            state.selectedinventoryList = action.payload
        },
        setDischargedResident(state, action) {
           const dischargedResidentId = action.payload;
           const updatedResidents = state.residentList.map((resident) => {
             if (resident.national_id === dischargedResidentId) {
               return {
                 ...resident,
                 is_discharged_status: true,
              };
            }
            return resident;
          });
          state.residentList = updatedResidents;
        },

    }
})
export const residentActions = residentSlice.actions

export default residentSlice.reducer