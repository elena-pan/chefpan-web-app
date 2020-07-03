import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

class Login extends Component {
    constructor() {
        super();
        this.state = {
        username: "",
        password: "",
        errors: {}
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/"); // push user to homepage when they login
        }
        if (this.props.errors !== prevProps.errors && this.props.errors) {
            this.setState({
                errors: this.props.errors
            });
            this.setState({ password: "" })
        }
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/");
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    onSubmit = e => {
        e.preventDefault();
        const userData = {
            username: this.state.username,
            password: this.state.password
        };
        // Since we handle the redirect within our component, 
        // we don't need to pass in this.props.history as a parameter
        this.props.loginUser(userData); 
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="container">
                <div style={{ marginTop: "4rem", marginBottom:"5rem" }} className="row">
                <div className="col s8 offset-s2">
                    <Link to="/" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> Back to
                    home
                    </Link>
                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <h4>
                        <b>Login</b>
                    </h4>
                    <p className="grey-text text-darken-1">
                        Don't have an account? <Link to="/register" className="yellow-text text-darken-4">Register</Link>
                    </p>
                    </div>
                    <form noValidate onSubmit={this.onSubmit}>
                    <div className="input-field col s12">
                        <input
                        onChange={this.onChange}
                        value={this.state.username}
                        error={errors.username}
                        id="username"
                        type="text"
                        className={classnames("", {
                            invalid: errors.username
                        })}
                        />
                        <label htmlFor="username">Username</label>
                        <span className="red-text">
                            {errors.username}
                            {errors.usernamenotfound}
                        </span>
                    </div>
                    <div className="input-field col s12">
                        <input
                        onChange={this.onChange}
                        value={this.state.password}
                        error={errors.password}
                        id="password"
                        type="password"
                        className={classnames("", {
                            invalid: errors.password || errors.passwordincorrect
                        })}
                        />
                        <label htmlFor="password">Password</label>
                        <span className="red-text">
                            {errors.password}
                            {errors.passwordincorrect}
                        </span>
                    </div>
                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                        <button
                        style={{
                            width: "150px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem"
                        }}
                        type="submit"
                        className="btn btn-large waves-effect waves-light hoverable yellow darken-4"
                        >
                        Login
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);