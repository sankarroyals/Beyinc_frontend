/* eslint-disable camelcase */
/* eslint-disable max-len */
import {createSlice} from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../Components/axiosInstance';
import { ApiServices } from '../../Services/ApiServices';

export const apiCallSlice = createSlice(
    {
      name: 'apiCall',
      initialState: {
        loginDetails: {},

        ToastDetails: {
            message: '',
            bgColor: '',
            visibile: 'no'
        }
      },
      reducers: {
        setLoginData: (state, action) => {
          state.loginDetails = action.payload;
        },
        setToast: (state, action) => {
            state.ToastDetails = action.payload;
          },
    }
    });


export  const apicallloginDetails = () => async(dispatch) => {
  if (localStorage.getItem('user')) {
    await ApiServices.verifyAccessToken({ accessToken: JSON.parse(localStorage.getItem('user')).accessToken }).then((res) => {
      localStorage.setItem('user', JSON.stringify(res.data))
      dispatch(setLoginData(jwtDecode(JSON.parse(localStorage.getItem('user')).accessToken)))
      axiosInstance.customFnAddTokenInHeader(JSON.parse(localStorage.getItem('user')).accessToken);
    }).catch(async (err) => {
      await ApiServices.refreshToken({ refreshToken: JSON.parse(localStorage.getItem('user')).refreshToken }).then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data))
        dispatch(setLoginData(jwtDecode(res.data.accessToken)))
        axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
      }).catch(err => {
        localStorage.removeItem('user')
        window.location.href = '/login'
      })
      
    })
    
  }
}

export const {setLoginData, setToast} = apiCallSlice.actions;

// this is for configureStore
export default apiCallSlice.reducer;
