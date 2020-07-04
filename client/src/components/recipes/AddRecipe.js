import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addRecipe } from "../../actions/recipeActions";
import classnames from "classnames";
import dotenv from "dotenv";
import M from "materialize-css";
import axios from "axios";

dotenv.config();

class AddRecipe extends Component {
    constructor() {
        super();
        this.state = {
            image: null,
            name: "",
            servings: "",
            ingredients: ["","",""],
            steps: ["", "", ""],
            categories: [],
            notes: "",
            errors: {}
        };
    }

    componentDidMount = () => {
        const elems = document.querySelectorAll('.chips');
        M.Chips.init(elems, {
            placeholder: "Categories",
            secondaryPlaceholder: "",
            onChipAdd: (e, chip) => {
                let chipsData = e[0].M_Chips.chipsData.map(chip => chip.tag);
                this.setState({ categories: chipsData });
                let prevErrorState = {...this.state.errors};
                prevErrorState.categories = chipsData.length < 1 ? "Categories are required" : undefined;
                this.setState({errors: prevErrorState});
            },
            onChipDelete: (e, chip) => {
                let chipsData = e[0].M_Chips.chipsData.map(chip => chip.tag);
                this.setState({ categories: chipsData });
                let prevErrorState = {...this.state.errors};
                prevErrorState.categories = chipsData.length < 1 ? "Categories are required" : undefined;
                this.setState({errors: prevErrorState});
            },
            autocompleteOptions: {
                data: {
                    'soups': null, 'stews': null, 'braises': null,
                    'pasta': null, 'noodles': null,'sandwiches': null,'toasts':null,'bread':null,
                    'baking': null, 'roasting': null, 'frying': null, 'pan recipes':null, 'boiling':null, 'no cook': null,
                    'breakfast': null,'brunch': null,'lunch':null,'dinner':null,'desserts':null,
                    'east asian': null, 'mexican':null, 'indian': null, 'southern':null, 'french':null, 'italian':null,
                    'cookies':null,'cheesecakes':null,'cakes':null,'brownies':null,'pastries':null,'choux':null,
                    'fillings':null, 'custards':null, 'sauces':null,'ice cream':null,
                    'basics':null,'project recipes':null,'comfort food':null,'aesthetic':null,'gift ideas':null
                },
                minLength: 0
            }
        });
    }

    componentDidUpdate = prevProps => {
        if (this.props.errors !== prevProps.errors && this.props.errors) {
            this.setState({
              errors: this.props.errors
            });
        }
    }
    onChangeImage = e => {
        this.setState({ image: e.target.files[0] });
    }
    onDeleteImage = e => {
        this.setState({ image: null });
    }
    onChangeName = e => {
        this.setState({ name: e.target.value });
        let prevErrorState = {...this.state.errors};
        prevErrorState.name = e.target.value.trim() === "" ? "Recipe name is required" : undefined;
        this.setState({errors: prevErrorState});
    }
    onChangeIngredient = e => {
        let prevIngredients = [...this.state.ingredients];
        prevIngredients[e.target.id] = e.target.value;
        this.setState({ ingredients: prevIngredients });
    }
    onChangeStep = e => {
        let prevSteps = [...this.state.steps];
        prevSteps[e.target.id] = e.target.value;
        this.setState({ steps: prevSteps });
    }
    onChangeServingsNotes = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    addIngredient = e => {
        e.preventDefault();
        let prevIngredients = [...this.state.ingredients];
        prevIngredients.push("");
        this.setState({ ingredients: prevIngredients });
    }
    addStep = e => {
        e.preventDefault();
        let prevSteps = [...this.state.steps];
        prevSteps.push("");
        this.setState({ steps: prevSteps });
    }
    deleteIngredient = idx => {
        let prevIngredients = [...this.state.ingredients];
        prevIngredients.splice(idx, 1);
        this.setState({ ingredients: prevIngredients });
    }
    deleteStep = idx => {
        let prevSteps = [...this.state.steps];
        prevSteps.splice(idx, 1);
        this.setState({ steps: prevSteps });
    }
    onSubmit = e => {
        e.preventDefault();
        // Remove empty inputs
        let ingredients = this.state.ingredients.filter(ingredient => ingredient.trim() !== "");
        let steps = this.state.steps.filter(step => step.trim() !== "");
        let categories = this.state.categories.filter(category => category.trim() !== "");
        const recipeData = {
            name: this.state.name.trim(),
            ingredients: ingredients,
            steps: steps,
            categories: categories
        }
        if (this.state.servings.trim()) {
            recipeData.servings = this.state.servings.trim();
        }
        if (this.state.notes.trim()) {
            recipeData.notes = this.state.notes.trim();
        }
        if (this.state.image) {
            recipeData.image = this.state.image;
        }
        this.props.addRecipe(recipeData, this.props.history);
    }

    render() {
        const { errors } = this.state;
        return (
                <div className="container">
                <div style={{ marginTop: "4rem" }} className="row">
                <div className="col s12 l8 offset-l2">
                    <Link to="/recipes" className="btn-flat waves-effect">
                        <i className="material-icons left">keyboard_backspace</i> Back
                    </Link>
                    <div className="col s12" style={{ paddingLeft: "11.250px", paddingBottom:"1rem" }}>
                        <h4>
                            <b>Add Recipe</b>
                        </h4>
                    </div>
                    <form noValidate onSubmit={this.onSubmit}>
                    <div className="file-field input-field col s12">
                        <div className="btn yellow darken-4">
                            <span>Upload image</span>
                            <input type="file" accept=".jpg,.jpeg,.png" onChange={this.onChangeImage} />
                            <i className="material-icons prefix black-text" onClick={this.onDeleteImage} style={{right:0, fontSize:"24px"}}>delete</i>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" value={this.state.image ? this.state.image.name : ""} />
                        </div>
                    </div>
                    <div className="input-field col s12">
                        <input
                        onBlur={this.onChangeName}
                        onChange={this.onChangeName}
                        value={this.state.name}
                        id="name"
                        type="text"
                        className={classnames("", {
                            invalid: errors.name
                        })}
                        />
                        <label htmlFor="name">Recipe Name</label>
                        <span className="red-text">
                            {errors.name}
                        </span>
                    </div>
                    <div className="input-field col s12" style={{marginTop:0}}>
                        <input
                        onBlur={this.onChangeServingsNotes}
                        onChange={this.onChangeServingsNotes}
                        value={this.state.servings}
                        id="servings"
                        type="text"
                        />
                        <label htmlFor="servings">Yield</label>
                    </div>
                    <div className="col s12" style={{paddingLeft:"9px", paddingTop:"20px"}}>
                        <h5>
                            <b>Ingredients</b>
                        </h5>
                    </div>
                    {
                        this.state.ingredients.map((val, idx) => {
                            if (idx === 0) {
                                return (
                                <div className="input-field col s12" key={idx}>
                                    <input
                                    onBlur={this.onChangeIngredient}
                                    onChange={this.onChangeIngredient}
                                    value={this.state.ingredients[0]}
                                    id="0"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.ingredients
                                    })}
                                    />
                                    <label htmlFor="0">Ingredient</label>
                                    <span className="helper-text">Prefix text with 'category' to make ingredient category</span>
                                    <span className="red-text">
                                        {errors.ingredients}
                                    </span>
                                </div>
                                )
                            }
                            else return (
                                <div className="input-field col s12" key={idx}>
                                    <input
                                    onBlur={this.onChangeIngredient}
                                    onChange={this.onChangeIngredient}
                                    value={this.state.ingredients[idx]}
                                    id={idx.toString()}
                                    type="text"
                                    />
                                    <label htmlFor={idx.toString()}>Ingredient</label>
                                    <Link onClick={() => this.deleteIngredient(idx)}><i className="material-icons black-text prefix" style={{right:0, fontSize:"24px"}}>delete</i></Link>
                                </div>
                            )
                        })
                    }
                    <div className="col s12" style={{ paddingLeft: "11px", paddingBottom:"2rem" }}>
                        <button
                        style={{
                            width: "160px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem"
                        }}
                        type="button"
                        onClick={this.addIngredient}
                        className="btn btn-small waves-effect waves-light hoverable yellow darken-4"
                        >
                        Add ingredient
                        </button>
                    </div>
                    <div className="col s12" style={{paddingLeft:"9px", paddingTop:"10px"}}>
                        <h5>
                            <b>Directions</b>
                        </h5>
                    </div>
                    {
                        this.state.steps.map((val, idx) => {
                            if (idx === 0) {
                                return (<div className="input-field col s12" key={idx}>
                                            <textarea
                                            onBlur={this.onChangeStep}
                                            onChange={this.onChangeStep}
                                            value={this.state.steps[0]}
                                            id="0"
                                            type="text"
                                            className={classnames("materialize-textarea", {
                                                invalid: errors.steps
                                            })}
                                            />
                                            <label htmlFor="0">Step 1</label>
                                            <span className="red-text">
                                                {errors.steps}
                                            </span>
                                        </div>)
                            }
                            else return (
                                <div className="input-field col s12" key={idx}>
                                <textarea
                                onBlur={this.onChangeStep}
                                onChange={this.onChangeStep}
                                value={this.state.steps[idx]}
                                id={idx.toString()}
                                type="text"
                                className="materialize-textarea"
                                />
                                <label htmlFor={idx.toString()}>Step {idx+1}</label>
                                <Link onClick={() => this.deleteStep(idx)}><i className="material-icons black-text prefix" style={{right:0, fontSize:"24px"}}>delete</i></Link>
                            </div>)
                        })
                    }
                    <div className="col s12" style={{ paddingLeft: "11px", paddingBottom:"2rem" }}>
                        <button
                        style={{
                            width: "160px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem"
                        }}
                        type="button"
                        onClick={this.addStep}
                        className="btn btn-small waves-effect waves-light hoverable yellow darken-4"
                        >
                        Add Step
                        </button>
                    </div>
                    <div className="input-field col s12">
                        <div className="chips chips-autocomplete chips-placeholder"></div>
                        <span className="red-text">
                            {errors.categories}
                        </span>
                    </div>
                    <div className="input-field col s12">
                        <textarea
                        onBlur={this.onChangeServingsNotes}
                        onChange={this.onChangeServingsNotes}
                        className="materialize-textarea"
                        value={this.state.notes}
                        id="notes"
                        type="text"
                        />
                        <label htmlFor="notes">Notes</label>
                    </div>
                    <div className="col s12" style={{ paddingLeft: "11.250px", paddingTop:"2rem", paddingBottom:"5rem"}}>
                        <button
                        style={{
                            width: "170px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem"
                        }}
                        type="submit"
                        className="btn btn-large waves-effect waves-light hoverable yellow darken-4"
                        >
                        Add
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        );
    }
}
AddRecipe.propTypes = {
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    errors: state.errors
});

export default connect(
    mapStateToProps, 
    { addRecipe }
)(AddRecipe);