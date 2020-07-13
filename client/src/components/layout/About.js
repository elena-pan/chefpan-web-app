import React, { Component } from "react";
import profile from "../../profile.png";

class About extends Component {

  render() {
    return (
      <div className="container row" style={{paddingTop:"3rem", paddingBottom:"3rem", minHeight:"80vh"}}>
        <div className="col s12 l6">
          <img src={profile} alt="" style={{width:"100%"}} />
        </div>
        <div className="col s12 l6"><h4 style={{paddingBottom:"0.5rem", paddingTop:"2.5vw"}}><b>About Me</b></h4>
          <h6 style={{ lineHeight:"170%" }}>
            Hey there, Chef Pan here.
            This is the realization of my food dreams in a collection of best recipes and techniques, 
            with some documented as videos on my YouTube channel.
          </h6>
          <h6 style={{ lineHeight:"170%", marginTop:"1.5rem" }}>
            So grab a slice of cake (or two) and come along with me on my foodventures!
          </h6>
        </div>
      </div>
    );
  }
}

export default About;