import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    userWallet: null,
    someOtherInfo: {},
  },
  reducers: {
    setWallet(state, action) {
      console.log("setting Wallet in redux state");
      state.userWallet = action.payload;
    }
  },
});

export const commonActions = commonSlice.actions;
export default commonSlice;
