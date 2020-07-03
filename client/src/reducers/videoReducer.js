import {
    GET_VIDEOS,
    VIDEOS_LOADING
} from "../actions/types";

const initialState = {
    videos: [],
    videosLoading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
      case GET_VIDEOS:
        return {
          ...state,
          videos: action.payload,
          videosLoading: false
        };
      case VIDEOS_LOADING:
        return {
          ...state,
          videosLoading: true
        };
      default:
        return state;
    }
}