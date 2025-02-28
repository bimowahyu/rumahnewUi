import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const getApiBaseUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
   const baseUrl = process.env.REACT_APP_URL.replace(/^https?:\/\//, '');
    return `${protocol}://${baseUrl}`;
  };
  

// Initial state untuk auth admin
const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

// Axios instance dengan baseURL dan credentials
const api = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true
});

// Fungsi login admin
export const LoginAdmin = createAsyncThunk("admin/login", async (user, thunkAPI) => {
    try {
        const response = await api.post('/login', {
            username: user.username,
            password: user.password
        },{withCredentials: true});
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        return thunkAPI.rejectWithValue(error.response?.data?.msg || 'An error occurred');
    }
});


// getMeAdmin function to validate session
export const getMeAdmin = createAsyncThunk("admin/getMe", async (_, thunkAPI) => {
    try {
        const response = await api.get('/me');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to retrieve admin data');
    }
});

// Fungsi logout admin
export const LogOutAdmin = createAsyncThunk("admin/logout", async () => {
    await api.delete('/logout');
});

// Slice Redux untuk auth admin
export const authAdminSlice = createSlice({
    name: "authAdmin",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        // Login Admin
        builder.addCase(LoginAdmin.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(LoginAdmin.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // GetMe Admin (validasi sesi)
        builder.addCase(getMeAdmin.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMeAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(getMeAdmin.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // Logout Admin
        builder.addCase(LogOutAdmin.fulfilled, (state) => {
            state.user = null;
        });
    }
});

export const { reset } = authAdminSlice.actions;
export default authAdminSlice.reducer;
