import {
    ADD_RECIPE,
    UPDATE_RECIPE,
    DELETE_RECIPE,
    GET_RECIPE,
    RECIPE_LOADING,
    GET_RECIPES,
    RECIPES_LOADING
} from "../actions/types";

const initialState = {
    recipes: [],
    recipe: [],
    recipeLoading: false,
    recipesLoading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
      case ADD_RECIPE:
        return {
          ...state,
          recipes: [action.payload, ...state.recipes]
        };
      case UPDATE_RECIPE:
        let index = state.recipes.findIndex(
          recipe => recipe._id === action.payload._id
        );
  
        state.recipes.splice(index, 1);
  
        return {
          ...state,
          recipes: [action.payload, ...state.recipes]
        };
      case DELETE_RECIPE:
        return {
            ...state,
            recipes: state.recipes.filter(
                recipe => recipe._id !== action.payload
            )
        };
      case GET_RECIPE:
        return {
          ...state,
          recipe: action.payload,
          recipeLoading: false
        };
      case GET_RECIPES:
        return {
          ...state,
          recipes: action.payload,
          recipesLoading: false
        };
      case RECIPE_LOADING:
        return {
          ...state,
          recipeLoading: true
        };
      case RECIPES_LOADING:
        return {
          ...state,
          recipesLoading: true
        };
      default:
        return state;
    }
}