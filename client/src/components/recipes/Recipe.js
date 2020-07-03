import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getRecipe, deleteRecipe } from "../../actions/recipeActions";

import LinearLoadingSymbol from "./loading/LinearLoadingSymbol";

class Recipe extends Component {
    constructor() {
        super();
        this.state = {
            init: false,
            user: {},
            recipe: "",
            start: new Date(),
            end: new Date(),
            errors: {}
        };
        
    }

    componentDidMount() {
        this.props.getRecipe(this.props.match.params.id);
    }

    onDeleteRecipe = id => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            this.props.deleteRecipe(id, this.props.history);
        }
    }

    render() {
        let btns;
        if (this.props.auth.isAuthenticated) {
            btns = (<>
            <div className="col s6" style={{ paddingLeft: "11.250px", paddingTop:"2rem", paddingBottom:"5rem"}}>
                <Link
                style={{
                    width: "170px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                }}
                to={`/recipes/edit/${this.props.match.params.id}`}
                className="btn btn-large waves-effect waves-light hoverable yellow darken-4"
                >
                Edit
                </Link>
            </div>
            <div className="col s6" style={{ paddingLeft: "11.250px", paddingTop:"2rem", paddingBottom:"5rem"}}>
                <Link
                style={{
                    width: "170px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                }}
                onClick={() => {this.onDeleteRecipe(this.props.match.params.id)}}
                className="btn btn-large waves-effect waves-light hoverable white black-text accent-3"
                >
                Delete
                </Link>
            </div></>)
        }
        else {
            btns = (<div></div>)
        }
        const { recipe, recipes, recipeLoading } = this.props.recipes;

        let content;

        if (recipe === null) {
            this.props.history.replace("/not-found");
        }

        else if (recipes === null || recipeLoading || recipe.length===0) {
            content = (<div style={{marginTop:"5rem"}}><LinearLoadingSymbol /></div>);
        }

        else {
            const ingredients = recipe.ingredients.map(ingredient => {
                if (ingredient.startsWith("category")) {
                    return (<li style={{marginTop:"1.25rem", marginBottom:"0.25rem"}}><em>{ingredient.slice(8).trim()}</em></li>)
                }
                else return (<li style={{marginBottom:"0.25rem"}}>{ingredient}</li>)
            });
            const steps = recipe.steps.map(step => (
                <li style={{marginTop:"0.5rem"}}>{step}</li>
            ));
            const categories = recipe.categories.map(category => (
                <div class="chip">{category}</div>
            ));

            let servings;
            let notes;
            let img;
            if (recipe.servings) {
                servings = (<div className="col s12" style={{marginBottom:"1rem"}}>
                                <b>Yield: </b>{recipe.servings}
                            </div>)
            }
            else servings = (<div></div>);
            if (recipe.notes) {
                notes = (<div className="col s12">
                            <h5>
                                <b>Notes</b>
                            </h5>
                            {recipe.notes}
                        </div>)
            }
            else notes = (<div></div>)
            if (recipe.img) {
                img = (<div className="col s12"><img src={recipe.img} alt="" style={{objectFit:"cover", height:"400px", width:"100%"}}></img></div>)
            }
            else img = (<div></div>)
            content = (
                <div style={{ marginTop: "2rem" }} className="row">
                        {img}
                        <div className="col s12">
                            <h4>
                                <b>{recipe.name}</b>
                            </h4>
                        </div>
                        <div className="col s12" style={{ borderBottom:"2px solid #f57f17", marginLeft:"0.75rem", marginBottom:"1rem" }}></div>
                        {servings}
                        <div className="col s12">
                            <h5><b>Ingredients</b></h5>
                            <ul>
                                {ingredients}
                            </ul>
                        </div>
                        <div className="col s12">
                            <h5><b>Directions</b></h5>
                            <ol style={{paddingLeft:"1rem"}}>
                                {steps}
                            </ol>
                        </div>
                        <div className="col s12">{categories}</div>
                        {notes}
                    { btns }
                </div>
            )
        }

        return (
            <div className="container" style={{minHeight:"75vh", marginBottom:"3rem"}}>
                { content }
            </div>
        );
    }
}

Recipe.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    recipe: state.recipes.recipe,
    recipes: state.recipes,
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps, 
    { getRecipe, deleteRecipe }
)(withRouter(Recipe));