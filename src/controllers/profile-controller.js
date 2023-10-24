const prisma = require('../models/prisma');
const createError = require('../utils/create-error');
const {
  addressSchema,
  updateAddressSchema,
  deleteAddressSchema,
} = require('../validators/address-validator');

exports.createAddress = async (req, res, next) => {
  try {
    const { value, error } = addressSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    value.userId = +req.user.id;

    const address = await prisma.address.create({
      data: value,
    });

    res.status(201).json({ address });
  } catch (error) {
    next(error);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { value, error } = updateAddressSchema.validate(req.body);
    if (error) return next(error);

    const foundAddress = await prisma.address.findFirst({
      where: {
        id: value.id,
      },
    });

    if (!foundAddress) return next(createError('ADDRESS IS NOT EXISTED', 400));

    const address = await prisma.address.update({
      data: value,
      where: {
        id: value.id,
      },
    });
    res.status(201).json({ address });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { value, error } = deleteAddressSchema.validate(req.params);
    if (error) return next(error);

    const foundAddress = await prisma.address.findFirst({
      where: {
        id: value.id,
      },
    });

    if (!foundAddress) return next(createError('ADDRESS IS NOT EXISTED', 400));

    await prisma.address.delete({
      where: {
        id: foundAddress.id,
      },
    });

    res.status(200).json({ message: 'DELETED' });
  } catch (error) {
    next(error);
  }
};

exports.getAllAddress = async (req, res, next) => {
  const addresses = await prisma.address.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      user: true,
    },
  });
  res.status(200).json({ addresses });
};
