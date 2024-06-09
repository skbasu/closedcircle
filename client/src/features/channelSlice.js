import { createSlice } from '@reduxjs/toolkit';

export const channelSlice = createSlice({
    name: 'channel',
    initialState: {
        channelId: null,
        channelName: null,
        channelPhoto: null,
        channelIsGroup: false,
    },
    reducers: {
        setChannel: (state, action) => {
            state.channelId = action.payload.channelId;
            state.channelName = action.payload.channelName;
            state.channelPhoto = action.payload.channelPhoto;
            state.channelIsGroup = action.payload.channelIsGroup;
        },
    },
});

export const { setChannel } = channelSlice.actions;

export const selectChannelId = (state) => state.channel.channelId;
export const selectChannelName = (state) => state.channel.channelName;
export const selectChannelPhoto = (state) => state.channel.channelPhoto;
export const selectChannelIsGroup = (state) => state.channel.channelIsGroup;

export default channelSlice.reducer;