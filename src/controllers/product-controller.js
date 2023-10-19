const fs = require('fs/promises');
const prisma = require('../models/prisma');
const createError = require('../utils/create-error');
const { upload } = require('../utils/cloudinary-service');
const {
  createProductSchema,
  updateProductSchema,
  selectProductSchema,
} = require('../validators/product-validator');

exports.createProduct = async (req, res, next) => {
  try {
    const url = await upload(req.file.path);
    const { value, error } = createProductSchema.validate(req.body);
    if (error) return next(error);
    if (!req.file) {
      return next(createError('PRODUCT IMAGE IS REQUIRED'));
    }
    value.image = url;

    const product = await prisma.product.create({
      data: value,
    });

    const category = await prisma.category.findFirst({
      where: {
        id: product.categoryId,
      },
    });

    product.category = category;
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  delete req.body.category;
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
    const { value, error } = selectProductSchema.validate(req.params);
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

exports.getAllProducts = async (req, res, next) => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      stock: true,
      price: true,
      categoryId: true,
      category: true,
    },
  });

  const category = await prisma.category.findMany();
  res.status(200).json({ products, category });
};

exports.getProductById = async (req, res, next) => {
  try {
    const { value, error } = selectProductSchema.validate(req.params);
    if (error) return next(error);

    const product = await prisma.product.findFirst({
      where: {
        id: value.id,
      },
      include: {
        category: true,
      },
    });

    if (!product) return next(createError('PRODUCT IS NOT EXISTED', 400));

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};
