import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import RecipesList from "./RecipesList";

class Recipes extends Component {

    onAddRecipeClick = e => {
        e.preventDefault();
        this.props.history.push("/add-recipe")
    }
    render() {
        let btn;
        if (this.props.auth.isAuthenticated) {
            btn = (<div className="row">
                        <div className="col s12 left-align">
                            <button
                                style={{
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px",
                                    marginTop: "2rem"
                                }}
                                onClick={this.onAddRecipeClick}
                                className="btn btn-large waves-effect waves-light hoverable yellow darken-4"
                                >
                                Add Recipe
                            </button>
                        </div>
                    </div>)
        }
        else {
            btn = (<div></div>)
        }

        let header = "";
        if (this.props.match.params.category) {
            let splitstring = this.props.match.params.category.split("-");
            splitstring = splitstring.map(word => word.charAt(0).toUpperCase() + word.slice(1));
            for (let i = 0; i < splitstring.length; i++) {
                if (i === 0) {
                    header += splitstring[i];
                }
                else if (i === splitstring.length - 1) {
                    header += " and " + splitstring[i];
                }
                else {
                    header += ", " + splitstring[i]; 
                }
            }
        }
        else {
            header = "Recipes"
        }
        return (
            <div style={{ minHeight: "75vh", paddingBottom:"5rem" }}>
                <div className="yellow darken-4 center white-text" style={{paddingTop:"2rem", paddingBottom:"2rem"}}>
                    <h4><b>{header}</b></h4>
                </div>
                <div style={{paddingLeft:"2rem", paddingRight:"2rem"}}>
                    { btn }
                    <RecipesList />
                </div>
            </div>
        );
    }
}

Recipes.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Recipes);