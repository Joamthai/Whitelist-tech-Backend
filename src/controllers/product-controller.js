const prisma = require('../models/prisma');
const createError = require('../utils/create-error');
const {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
} = require('../validators/product-validator');

exports.createProduct = async (req, res, next) => {
  try {
    const { value, error } = createProductSchema.validate(req.body);
    if (error) return next(error);

    const product = await prisma.product.create({
      data: value,
    });
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  const { value, error } = updateProductSchema.validate(req.body);
  if (error) return next(error);

  const foundProduct = await prisma.product.findFirst({
    where: {
      id: value.id,
    },
  });

  if (!foundProduct) return next(createError('PRODUCT IS NOT EXISTS'));

  const product = await prisma.product.update({
    data: value,
    where: {
      id: value.id,
    },
  });
  res.status(200).json({ product });
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { value, error } = deleteProductSchema.validate(req.params);
    if (error) return next(error);

    const foundProduct = await prisma.product.findFirst({
      where: {
        id: value.id,
      },
    });

    if (!foundProduct) return next(createError('PRODUCT IS NOT EXISTED', 400));

    await prisma.product.delete({
      where: {
        id: value.id,
      },
    });

    res.status(200).json({ message: 'DELETED' });
  } catch (error) {
    next(error);
  }
};
