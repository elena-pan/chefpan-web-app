import React, { Component } from "react";
import { Link } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
        <footer className="page-footer" style={{backgroundColor:"#f57f17"}}>
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text" style={{ fontFamily: "monospace" }}>Elemations</h5>
              </div>
              <div className="col l4 offset-l2 s12">
                <ul>
                  <li><Link className="grey-text text-lighten-3" to="/about">About</Link></li>
                  <li><Link className="grey-text text-lighten-3" to="/contact">Contact</Link></li>
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