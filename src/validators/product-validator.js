const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  stock: Joi.number().integer().positive().required(),
  price: Joi.number().precision(2).positive().required(),
  categoryId: Joi.number().integer().positive().required(),
});
exports.createProductSchema = createProductSchema;

const updateProductSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  stock: Joi.number().integer().positive().required(),
  price: Joi.number().precision(2).positive().required(),
  categoryId: Joi.number().integer().positive().required(),
});
exports.updateProductSchema = updateProductSchema;

const selectProductSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
exports.selectProductSchema = selectProductSchema;
