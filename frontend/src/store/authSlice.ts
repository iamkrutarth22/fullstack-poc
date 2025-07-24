import { createSlice } from "@reduxjs/toolkit";
import type { IAuthentication } from "../models/IStore";

const initialState:IAuthentication={
    isAuthenticated:false,
    accessToken:null,
    refreshToken:null ,
    user:null
}

const authSlice = createSlice({
    name:'authSlice',
    initialState:initialState,
    reducers:{
        setAuthLogin(state,action){
            state.isAuthenticated = true;
            state.accessToken = action.payload.accessToken;
            state.refreshToken= action.payload.refreshToken;
            if (state.user) {
                state.user.id = action.payload.user.id;
                state.user.username = action.payload.user.username
                state.user.email =action.payload.user.email
            }
        },
        logout(state){
            state.isAuthenticated = false;
            state.accessToken = null;
            state.refreshToken = null;
            state.user=null
        }
    }
})

const authReducer=authSlice.reducer

export const authLoginActions=authSlice.actions
export default authReducer