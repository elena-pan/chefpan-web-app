import axios from "axios";
import { addToast } from "./toastActions"

import {
    GET_ERRORS
} from "./types";

// Add exercise 
export const submitContactForm = (formData, history) => dispatch => {
  axios.post("/api/contact/send-email", formData)
    .then(res => history.push("/")) // re-direct to home on success
    .then(() => dispatch(addToast("Message sent!", "success")))
    .catch(err =>{
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })}
    )
};
