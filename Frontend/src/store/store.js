import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

// Create a store using the configureStore function
const store = configureStore({
    reducer: {
        user: userSlice, // Slice/Reducer for authentication
        // file: fileSlice,
        // folder: folderSlice,
    },
});

export default store;
