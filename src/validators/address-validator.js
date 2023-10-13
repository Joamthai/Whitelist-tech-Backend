const Joi = require('joi');

const addressSchema = Joi.object({
  title: Joi.string().required(),
  address: Joi.string().required(),
  subDistrict: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string()
    .pattern(/^[0-9]{5}$/)
    .required(),
});
exports.addressSchema = addressSchema;

const updateAddressSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  title: Joi.string().required(),
  address: Joi.string().required(),
  subDistrict: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string()
    .pattern(/^[0-9]{5}$/)
    .required(),
});
exports.updateAddressSchema = updateAddressSchema;

const deleteAddressSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
exports.deleteAddressSchema = deleteAddressSchema;
