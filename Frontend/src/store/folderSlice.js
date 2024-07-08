import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import folderService from "../services/folder.service.js";

// Fetch folder data based on folderId
export const fetchFolder = createAsyncThunk(
    "folder/fetchFolder",
    async (folderId, thunkAPI) => {
        // console.log("Hello from fetchFolder"); // DEBUGGING
        try {
            const response = await folderService.fetchFolder(folderId);
            // console.log(response.data); // DEBUGGING
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const folderSlice = createSlice({
    name: "folder",
    initialState: {
        folder: null,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFolder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFolder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.folder = action.payload.data;
            })
            .addCase(fetchFolder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default folderSlice.reducer;
