import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userService from "../services/user.service.js";

// DOUBT: What should be the first argument of createAsyncThunk?
export const loginUser = createAsyncThunk("???", async (userData) => {
    const response = await userService.login(userData);
    console.log(response);
    return response;
});

// Initial state
const initialState = {
    status: false, // User is not authenticated by default
    userData: null, // No user data by default
    error: null, // No error by default
};

// To track the authentication state of the user, we can create a slice called userSlice.
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Logout action
        logout: (state) => {
            state.status = false; // Set the status to false
            state.userData = null; // Clear the user data
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = "succeeded";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = "failed";
            });
        // .addCase(registerUser.pending, (state) => {
        //     state.status = "loading";
        // })
        // .addCase(registerUser.fulfilled, (state, action) => {
        //     state.user = action.payload;
        //     state.status = "succeeded";
        // })
        // .addCase(registerUser.rejected, (state, action) => {
        //     state.error = action.error.message;
        //     state.status = "failed";
        // });
    },
});

// Export the actions
export const { login, logout } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
