import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteUser } from "../../actions/authActions";

class Account extends Component {

    onDeleteAccountClick = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            this.props.deleteUser(this.props.history);
        }
    }

    render() {
        return (
            <div style={{ minHeight:"75vh", marginTop:"20vh", marginBottom:"5rem" }} className="container">
                <div className="row">
                <div className="col s8 offset-s2">
                    <div className="col s12 center" style={{ paddingBottom:"1rem" }}>
                        <h4>
                            <b>My Account</b>
                        </h4>
                    </div>
                    <div className="col s12 center" style={{paddingLeft: "11.50px"}}>
                            <button
                            style={{
                                width: "220px",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem"
                            }}
                            onClick={this.onDeleteAccountClick}
                            className="btn btn-large waves-effect waves-light hoverable red accent-3"
                            >
                            Delete Account
                            </button>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

export default connect(
    mapStateToProps,
    { deleteUser }
)(Account);