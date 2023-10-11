const Joi = require('joi');

const signUpSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,16}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .trim()
    .required()
    .strip(),
  role: Joi.string().trim().strip(),
});

exports.signUpSchema = signUpSchema;

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});

exports.loginSchema = loginSchema;
