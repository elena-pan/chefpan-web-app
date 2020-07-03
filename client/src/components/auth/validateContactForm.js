const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateContactForm(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.subject = !isEmpty(data.subject) ? data.subject : "";
  data.message = !isEmpty(data.message) ? data.message : "";

  // Name checks
  if (Validator.isEmpty(data.name.trim())) {
    errors.name = "Name is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.subject.trim())) {
    errors.subject = "Subject is required";
  }
  if (Validator.isEmpty(data.message.trim())) {
    errors.message = "Message cannot be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};