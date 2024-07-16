import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/user.service.js";

export const loginUser = createAsyncThunk(
    "user/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await userService.login(email, password);
            console.log(response.data); // DEBUGGING
            return response.data;
        } catch (error) {
            console.log(error.message); // DEBUGGING
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
    await userService.logout();
});

export const getUser = createAsyncThunk("user/getUser", async (_, thunkAPI) => {
    try {
        const response = await userService.getUser();
        // console.log(response.data); // DEBUGGING
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        rootFolderId: null,
        isLoading: true,
        error: null,
        storageUsed: null,
        maxStorage: null,
    },
    reducers: {
        updateStorageUsed: (state, action) => {
            state.storageUsed += action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data.user;
                state.rootFolderId = action.payload.data.user.rootFolder;
                state.storageUsed = action.payload.data.user.storageUsed;
                state.maxStorage = action.payload.data.user.maxStorage;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data;
                state.rootFolderId = action.payload.data.rootFolder;
                state.storageUsed = action.payload.data.storageUsed;
                state.maxStorage = action.payload.data.maxStorage;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isLoading = false;
                // state.error = action.payload;
            });
    },
});

export const { updateStorageUsed } = userSlice.actions;
export default userSlice.reducer;
