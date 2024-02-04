/* eslint-disable camelcase */
/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { ApiServices } from '../../Services/ApiServices';
import { setToast } from '../AuthReducers/AuthReducer';


export const conversationSlice = createSlice(
    {
        name: 'conversationSlice',
        initialState: {
            allUsers: [],
            historicalConversations: [],
            conversationId: '',
            receiverId: '',
            notificationAlert: false,
            onlineUsers: [],
            liveMessage: {},
            lastMessageRead: false,
            notifications: []
        },
        reducers: {
            setAllUsers: (state, action) => {
                state.allUsers = action.payload
            },
            setHistoricalConversation: (state, action) => {
                state.historicalConversations = action.payload
            }
            ,
            setConversationId: (state, action) => {
                state.conversationId = action.payload
            },
            setReceiverId: (state, action) => {
                state.receiverId = action.payload
            },
            setOnlineUsers: (state, action) => {
                state.onlineUsers = action.payload
            }, setLiveMessage: (state, action) => {
                state.liveMessage = action.payload
            }, setLastMessageRead: (state, action) => {
                state.lastMessageRead = action.payload
            }, setNotification: (state, action) => {
                state.notificationAlert = action.payload
            },
            setNotificationData: (state, action) => {
                state.notifications = action.payload
            }
        }
    });

export const getAllHistoricalConversations = (email) => async (dispatch) => {
    await ApiServices.getHistoricalConversations({ email: email }).then((res) => {
            dispatch(setHistoricalConversation(res.data))
    }).catch(err => {
            dispatch(setToast({}))
        })
    }

export const getAllNotifications = (email) => async (dispatch) => {
    await ApiServices.getAllNotification({ email: email }).then((res) => {
        dispatch(setNotificationData(res.data))
    }).catch(err => {
        dispatch(setToast({}))
    })
}





export const { setAllUsers, setNotification, setHistoricalConversation, setNotificationData, setLiveMessage, setLastMessageRead, setConversationId, setReceiverId, setOnlineUsers } = conversationSlice.actions;

// this is for configureStore
export default conversationSlice.reducer;
