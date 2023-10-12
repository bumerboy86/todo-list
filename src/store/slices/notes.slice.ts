import { createSlice } from "@reduxjs/toolkit";
import { INote } from "../../interfaces/INote.ts";

interface IUSerState {
  notes: INote | null;
}

const initialState: IUSerState = {
  notes: null,
};

const userSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: {},
});

export default userSlice.reducer;
