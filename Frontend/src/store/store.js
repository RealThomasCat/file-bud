import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import folderSlice from "./folderSlice";

// Create a store using the configureStore function
const store = configureStore({
    reducer: {
        user: userSlice, // Slice/Reducer for authentication
        folder: folderSlice,
        // file: fileSlice,
    },
});

export default store;
