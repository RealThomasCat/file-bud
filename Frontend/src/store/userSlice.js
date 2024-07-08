import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/user.service.js";

export const registerUser = createAsyncThunk(
    "user/register",
    async ({ fullname, email, password }, thunkAPI) => {
        try {
            const response = await userService.register(
                fullname,
                email,
                password
            );
            console.log(response.data); // Check what to return
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "user/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await userService.login(email, password);
            console.log(response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
    await userService.logout();
});

export const getUser = createAsyncThunk("user/getUser", async () => {
    await userService.getUser();
});

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        rootFolderId: null,
        isLoading: false,
        error: null,
        folder: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.rootFolderId = action.payload.data.user.rootFolder;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getUser.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export default userSlice.reducer;
