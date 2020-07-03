import React, { Component } from "react";
import M from "materialize-css";
import image from "../../header.png"
import RecipesList from "../recipes/RecipesList";

class Landing extends Component {

  componentDidMount = () => {
    const elems = document.querySelectorAll('.parallax');
    M.Parallax.init(elems);
  }

  render() {
    let marginRightSize;
    if (window.innerWidth >= 900) {
      marginRightSize = "45%";
    }
    else if (window.innerWidth >= 650) {
      marginRightSize = "50%";
    }
    else {
      marginRightSize = 0;
    }
    return (
        <div style={{ minHeight: "90vh" }}>
          <div className="parallax-container">
            <div className="center white-text" style={{marginTop:"10rem", marginRight: marginRightSize}}>
              <h1 style={{marginBottom:0}}><b>Cook. Bake</b></h1>
              <h1 style={{fontSize:"7em", marginTop:0}}><b>E A T</b></h1>
            </div>
            <div className="parallax"><img src={image} alt="" /></div>
          </div>
          <div style={{margin:"5rem 2rem"}}>
            <RecipesList />
          </div>
        </div>
    );
  }
}

export default Landing;