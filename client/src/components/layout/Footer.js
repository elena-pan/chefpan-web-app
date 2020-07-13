import React, { Component } from "react";
import { Link } from "react-router-dom";
import logoWhite from "../../logo-white.svg";

class Footer extends Component {
  
  openYoutube = e => {
    e.preventDefault();
    window.open("https://www.youtube.com/channel/UCExJR98eGcdssIRf9FlcGfQ");
  } 
  
  render() {
    return (
        <footer className="page-footer" style={{backgroundColor:"#f57f17"}}>
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                    <div><Link to="/">
                        <img src={logoWhite} alt="Chef Pan" style={{height:"60px"}} />
                    </Link></div>
              </div>
              <div className="col l4 offset-l2 s12">
                <ul>
                  <li><Link className="grey-text text-lighten-3" to="/about">About</Link></li>
                  <li><Link className="grey-text text-lighten-3" to="/contact">Contact</Link></li>
                  <li style={{paddingTop:"5px"}}><Link to="#" onClick={this.openYoutube} className="grey-text text-lighten-3">
                      <i style={{verticalAlign:"middle", marginLeft:"-3px"}} className="material-icons grey-text text-lighten-3 prefix">slideshow</i>YouTube
                    </Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright"></div>
        </footer>
    );
  }
}

export default Footer;