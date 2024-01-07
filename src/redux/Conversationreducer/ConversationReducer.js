/* eslint-disable camelcase */
/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { ApiServices } from '../../Services/ApiServices';


export const conversationSlice = createSlice(
    {
        name: 'conversationSlice',
        initialState: {
            allUsers: [],
            historicalConversations: [],
            conversationId: '',
            receiverId: ''
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
            }
        }
    });

export const getAllHistoricalConversations = (email) => async (dispatch) => {
    await ApiServices.getHistoricalConversations({ email: email }).then((res) => {
            dispatch(setHistoricalConversation(res.data))
        })
    }




export const { setAllUsers, setHistoricalConversation, setConversationId, setReceiverId } = conversationSlice.actions;

// this is for configureStore
export default conversationSlice.reducer;
