import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getRecipes, getRecipesCategory } from "../../actions/recipeActions";
import image from "../../empty-plate.jpg";

import LinearLoadingSymbol from "./loading/LinearLoadingSymbol";

class RecipesList extends Component {

    componentDidMount = () => {
        if (this.props.match.path === "/recipes/category/:category") {
            this.props.getRecipesCategory(this.props.match.params.category)
        }
        else {
            this.props.getRecipes();
        }
    }

    componentDidUpdate = prevProps => {
        if (this.props.match.url !== prevProps.match.url) {
            if (this.props.match.path === "/recipes/category/:category") {
                this.props.getRecipesCategory(this.props.match.params.category)
            }
            else {
                this.props.getRecipes();
            }
        }
    }

    onRecipeClick = id => {
        this.props.history.push(`/recipes/${id}`)
    }

    render() {
        let content;

        const { recipes, recipesLoading } = this.props.recipes;

        if (recipes === null || recipesLoading) {
            content = (<div className="col s12"><LinearLoadingSymbol /></div>);
        }
        else {
            if (recipes.length > 0) {
                content = recipes.reverse().map(recipe => (
                    <div className="col s12 m6 l3">
                        <div className="card waves-effect waves-light hoverable hoverable" style={{height:"300px"}} onClick={() => this.onRecipeClick(recipe._id.$oid)}>
                            <div className="card-image">
                                <img src={recipe.img ? recipe.img : image} alt="" style={{objectFit:"cover", height:"200px"}} />
                            </div>
                            <div className="card-content">
                                <span className="card-title" style={{fontSize:"20px", lineHeight:"130%"}}><b>{recipe.name}</b></span>
                            </div>
                        </div>
                    </div>
                    )
                );
            }
            else {
                content = (<h4 className="grey-text center" style={{marginTop:0}}>No recipes found</h4>)
            }
        }
        return (
            <div className="row" style={{marginTop:"30px"}}>
                { content }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    recipes: state.recipes
});
export default connect(
  mapStateToProps,
  { getRecipes, getRecipesCategory }
)(withRouter(RecipesList));