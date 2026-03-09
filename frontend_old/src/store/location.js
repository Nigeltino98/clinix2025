import { createSlice } from '@reduxjs/toolkit';

const initialGeolocationState = {
  userLocation: { latitude: null, longitude: null },
  loading: false,
  error: null,
};

const geolocationSlice = createSlice({
  name: 'geolocation',
  initialState: initialGeolocationState,
  reducers: {
    setUserLocation(state, action) {
      state.userLocation = action.payload;
      state.loading = false;
      state.error = null;
    },
    requestUserLocation(state) {
      state.loading = true;
      state.error = null;
    },
    userLocationError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const geolocationActions = geolocationSlice.actions;

// Thunk Action: Get User Location
export const getUserLocation = () => (dispatch) => {
  dispatch(geolocationActions.requestUserLocation());

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(geolocationActions.setUserLocation({ latitude, longitude }));
      },
      (error) => {
        dispatch(geolocationActions.userLocationError(error));
      }
    );
  } else {
    dispatch(
      geolocationActions.userLocationError({
        message: 'Geolocation is not supported in this browser.',
      })
    );
  }
};

export default geolocationSlice.reducer;
