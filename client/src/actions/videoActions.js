import axios from "axios";
import {
    GET_VIDEOS,
    VIDEOS_LOADING
} from "./types";

// Register User
export const getVideos = videoData => dispatch => {
    dispatch(setVideosLoading());
    axios.get(`https://www.googleapis.com/youtube/v3/search?key=${videoData.key}&channelId=${videoData.channelID}&part=${videoData.part}&order=date&maxResults=${videoData.maxResults}&type=video`)
        .then(res => 
            dispatch({
                type: GET_VIDEOS,
                payload: res.data
            })
        )
        .catch(err => {
            dispatch({
                type: GET_VIDEOS,
                payload: null
            })}
        );
};

// User loading
export const setVideosLoading = () => {
  return {
    type: VIDEOS_LOADING
  };
};