const prisma = require('../models/prisma');

exports.addToCart = async (req, res, next) => {
  try {
    const cartItem = await prisma.cartItem.create({
      data: req.body,
      include: {
        product: true,
      },
    });
    res.status(201).json({ cartItem });
  } catch (error) {
    next(error);
  }
};

exports.updateAmount = async (req, res, next) => {
  try {
    const foundCartItem = await prisma.cartItem.findFirst({
      where: {
        productId: req.body.productId,
      },
    });
    if (!foundCartItem)
      return next(createError('CART ITEM IS NOT EXISTED', 400));

    await prisma.cartItem.update({
      data: {
        amount: req.body.amount,
      },
      where: {
        id: foundCartItem.id,
      },
    });

    res.status(200).json({ msg: 'UPDATED' });
  } catch (error) {
    next(error);
  }
};
exports.getCartItem = async (req, res, next) => {
  try {
    const cartItem = await prisma.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        id: true,
        productId: true,
        amount: true,
        product: true,
      },
    });

    res.status(200).json({ cartItem });
  } catch (error) {
    next(error);
  }
};

exports.deleteFromCart = async (req, res, next) => {
  try {
    const foundCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        productId: +req.params.id,
      },
    });
    if (!foundCartItem)
      return next(createError('CART ITEM IS NOT EXISTED', 400));

    await prisma.cartItem.delete({
      where: {
        id: foundCartItem.id,
      },
    });
    res.status(200).json({ message: 'DELETED' });
  } catch (error) {
    next(error);
  }
};
