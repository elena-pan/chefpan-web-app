import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import validateContactForm from "../auth/validateContactForm";
import { submitContactForm } from "../../actions/contactActions";

class Contact extends Component {

  constructor() {
    super();
    this.state = {
        name: "",
        email: "",
        subject: "",
        message: "",
        errors: {}
    };
  }

  componentDidUpdate = prevProps => {
    if (this.props.errors !== prevProps.errors && this.props.errors) {
      this.setState({
        errors: this.props.errors
      });
    }
  }

  onChangeName = e => {
    this.setState({ name: e.target.value });
    const validated = validateContactForm({ name: e.target.value });
    let prevErrorState = {...this.state.errors};
    prevErrorState.name = validated.errors.name;
    this.setState({errors: prevErrorState});
  };

  onChangeEmail = e => {
      this.setState({ email: e.target.value });
      const validated = validateContactForm({ email: e.target.value });
      let prevErrorState = {...this.state.errors};
      prevErrorState.email = validated.errors.email;
      this.setState({errors: prevErrorState});
  }

  onChangeSubject = e => {
      if (e.target.value.length <= 50) {
        this.setState({ subject: e.target.value });
        const validated = validateContactForm({ subject: e.target.value });
        let prevErrorState = {...this.state.errors};
        prevErrorState.subject = validated.errors.subject;
        this.setState({errors: prevErrorState});
      }
  }

  onChangeMessage = e => {
      if (e.target.value.length <= 1000) {
        this.setState({ message: e.target.value });
        const validated = validateContactForm({ message: e.target.value });
        let prevErrorState = {...this.state.errors};
        prevErrorState.message = validated.errors.message;
        this.setState({errors: prevErrorState});
      }
  }

  onSubmit = e => {
      e.preventDefault();
      const newMessage = {
          name: this.state.name,
          email: this.state.email,
          subject: this.state.subject,
          message: this.state.message
      };
      this.props.submitContactForm(newMessage, this.props.history); 
  };

  render() {
    const { errors } = this.state;
    return (
        <div className="container" style={{marginTop:"3rem", marginBottom:"5rem"}}>
            <div className="row">
            <div className="col s8 offset-s2">
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4>
                    <b>Contact</b>
                </h4>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                    <input
                    onBlur={this.onChangeName}
                    onChange={this.onChangeName}
                    value={this.state.name}
                    error={errors.name}
                    id="name"
                    type="text"
                    className={classnames("", {
                        invalid: errors.name
                    })}
                    />
                    <label htmlFor="name">Name</label>
                    <span className="red-text">{errors.name}</span>
                </div>
                <div className="input-field col s12">
                    <input
                    onBlur={this.onChangeEmail}
                    onChange={this.onChangeEmail}
                    value={this.state.email}
                    error={errors.email}
                    id="email"
                    type="email"
                    className={classnames("", {
                        invalid: errors.email
                    })}
                    />
                    <label htmlFor="email">Email</label>
                    <span className="red-text">{errors.email}</span>
                </div>
                <div className="input-field col s12">
                    <input
                    onBlur={this.onChangeSubject}
                    onChange={this.onChangeSubject}
                    value={this.state.subject}
                    error={errors.subject}
                    id="subject"
                    type="text"
                    data-length="50"
                    className={classnames("", {
                        invalid: errors.subject
                    })}
                    />
                    <label htmlFor="subject">Subject</label>
                    <span className="red-text">{errors.subject}</span>
                </div>
                <div className="input-field col s12">
                    <textarea
                    onBlur={this.onChangeMessage}
                    onChange={this.onChangeMessage}
                    value={this.state.message}
                    error={errors.message}
                    id="message"
                    data-length="1000"
                    className={classnames("materialize-textarea", {
                        invalid: errors.message
                    })}
                    />
                    <label htmlFor="message">Message</label>
                    <span className="red-text">{errors.message}</span>
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
                    Submit
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
    );
  }
}

Contact.propTypes = {
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { submitContactForm }
)(Contact);