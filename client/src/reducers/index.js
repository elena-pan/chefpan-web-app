import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import recipeReducer from "./recipeReducer";
import videoReducer from "./videoReducer";
import toastReducer from "./toastReducer";

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    recipes: recipeReducer,
    videos: videoReducer,
    toasts: toastReducer
});