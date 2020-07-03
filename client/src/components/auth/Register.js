import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import validate from "./Validate";

class Register extends Component {
    constructor() {
        super();
        this.passwordInput = React.createRef();
        this.password2Input = React.createRef();
        this.state = {
            username: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.errors !== prevProps.errors && this.props.errors) {
            this.setState({
                errors: this.props.errors
            });
            this.setState({ password2: "" })
        }
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/");
        }
    }

    /*
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }
    */

    onChangeUsername = e => {
        this.setState({ username: e.target.value });
        const validated = validate({ username: e.target.value });
        let prevErrorState = {...this.state.errors};
        prevErrorState.username = validated.errors.username;
        this.setState({errors: prevErrorState});
    };

    onChangePassword = e => {
        this.setState({ password:this.passwordInput.current.value, password2: this.password2Input.current.value });
        const validated = validate({ password: this.passwordInput.current.value, password2: this.password2Input.current.value });
        let prevErrorState = {...this.state.errors};
        prevErrorState.password = validated.errors.password;
        prevErrorState.password2 = validated.errors.password2;
        this.setState({errors: prevErrorState});
    }

    onSubmit = e => {
        e.preventDefault();
        const newUser = {
            username: this.state.username,
            password: this.state.password,
            password2: this.state.password2
        };
        this.props.registerUser(newUser, this.props.history); 
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
                        <b>Register</b>
                    </h4>
                    <p className="grey-text text-darken-1">
                        Already have an account? <Link to="/login" className="yellow-text text-darken-4">Log in</Link>
                    </p>
                    </div>
                    <form noValidate onSubmit={this.onSubmit}>
                    <div className="input-field col s12">
                        <input
                        onBlur={this.onChangeUsername}
                        onChange={this.onChangeUsername}
                        value={this.state.username}
                        error={errors.username}
                        id="name"
                        type="text"
                        className={classnames("", {
                            invalid: errors.username
                        })}
                        />
                        <label htmlFor="name">Username</label>
                        <span className="red-text">{errors.username}</span>
                    </div>
                    <div className="input-field col s12">
                        <input
                        ref={this.passwordInput}
                        onBlur={this.onChangePassword}
                        onChange={this.onChangePassword}
                        value={this.state.password}
                        error={errors.password}
                        id="password"
                        type="password"
                        className={classnames("", {
                            invalid: errors.password
                        })}
                        />
                        <label htmlFor="password">Password</label>
                        <span className="red-text">{errors.password}</span>
                    </div>
                    <div className="input-field col s12">
                        <input
                        ref={this.password2Input}
                        onBlur={this.onChangePassword}
                        onChange={this.onChangePassword}
                        value={this.state.password2}
                        error={errors.password2}
                        id="password2"
                        type="password"
                        className={classnames("", {
                            invalid: errors.password2
                        })}
                        />
                        <label htmlFor="password2">Confirm Password</label>
                        <span className="red-text">{errors.password2}</span>
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
                        Sign up
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { registerUser }
  )(withRouter(Register));