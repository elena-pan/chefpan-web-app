import axios from "axios";
import { addToast } from "./toastActions"

import {
    GET_ERRORS,
    ADD_RECIPE,
    UPDATE_RECIPE,
    DELETE_RECIPE,
    GET_RECIPE,
    RECIPE_LOADING,
    GET_RECIPES,
    RECIPES_LOADING
} from "./types";

// Add recipe 
export const addRecipe = (recipeData, history) => dispatch => {
    if (recipeData.image) {
        const imgName = new Date().getTime() + recipeData.image.name;
        axios.post('/api/recipes/add/generate-upload-signed-url-v4', {name: imgName, method:'PUT'})
            .then(res => {
                axios.put(res.data, recipeData.image)
                    .then(res => {
                        delete recipeData.image;
                        recipeData.img = `https://storage.googleapis.com/recipe-imgs/${imgName}`;
                        axios.post("/api/recipes/add", recipeData)
                            .then(res => 
                                dispatch({
                                    type: ADD_RECIPE,
                                    payload: res.data
                                })
                            )
                            .then(() => history.push("/recipes"))
                            .then(() => dispatch(addToast("Recipe added!", "success")))
                            .catch(err => {
                                if (err.response) {
                                    dispatch({
                                        type: GET_ERRORS,
                                        payload: err.response.data
                                    })
                                }
                                else {
                                    console.log(err)
                                }
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        dispatch(dispatch(addToast("Error uploading image", "error")));
                    })
            })
            .catch(err => {
                console.log(err);
                dispatch(dispatch(addToast("Error uploading image", "error")))
            })
    }
    else {
        axios.post("/api/recipes/add", recipeData)
            .then(res => 
                dispatch({
                    type: ADD_RECIPE,
                    payload: res.data
                })
            )
            .then(() => history.push("/recipes"))
            .then(() => dispatch(addToast("Recipe added!", "success")))
            .catch(err => {
                if (err.response) {
                    dispatch({
                        type: GET_ERRORS,
                        payload: err.response.data
                    })
                }
                else {
                    console.log(err)
                }
            })
    }
};

// Update recipe
export const updateRecipe = (id, recipeData, history) => dispatch => {
  axios.put(`/api/recipes/${id}`, recipeData)
    .then(res => {
        dispatch({
            type: UPDATE_RECIPE,
            payload: res.data
        })
    })
    .then(res => history.push(`/recipes/${id}`))
    .then(() => dispatch(addToast("Recipe updated!", "success")))
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
};

// Delete recipe
export const deleteRecipe = (id, history) => dispatch => {
  axios.delete(`/api/recipes/${id}`)
    .then(res => 
        dispatch({
            type: DELETE_RECIPE,
            payload: id
        })
    )
    .then(res => history.replace("/recipes"))
    .then(() => dispatch(addToast("Recipe deleted", "error")))
    .catch(err => console.log(err));
};

// Recipe loading
export const setRecipeLoading = () => {
    return {
      type: RECIPE_LOADING
    };
};

// Recipes loading
export const setRecipesLoading = () => {
    return {
        type: RECIPES_LOADING
    };
};

// Get recipe
export const getRecipe = id => dispatch => {
    dispatch(setRecipeLoading());
    axios.get(`/api/recipes/${id}`)
    .then(res => {
        dispatch({
            type: GET_RECIPE,
            payload: res.data
        })
    })
    .catch(err => 
        dispatch({
            type: GET_RECIPE,
            payload: null
      })
    );
};

// Get recipes
export const getRecipes = () => dispatch => {
    dispatch(setRecipesLoading());
    axios.get(`/api/recipes`)
    .then(res => {
        dispatch({
            type: GET_RECIPES,
            payload: res.data
        })
    })
    .catch(err => 
        dispatch({
            type: GET_RECIPES,
            payload: null
      })
    );
};

// Get recipes by category
export const getRecipesCategory = category => dispatch => {
    dispatch(setRecipesLoading());
    axios.get(`/api/recipes/category/${category}`)
    .then(res => 
        dispatch({
            type: GET_RECIPES,
            payload: res.data
        })
    )
    .catch(err =>
        dispatch({
            type: GET_RECIPES,
            payload: null
        })
    );
}
