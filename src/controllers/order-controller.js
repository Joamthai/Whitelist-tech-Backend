const prisma = require('../models/prisma');
const { upload } = require('../utils/cloudinary-service');
const createError = require('../utils/create-error');

exports.createOrder = async (req, res, next) => {
  try {
    const foundCartItem = await prisma.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });
    if (!foundCartItem)
      return next(createError('CART ITEM IS NOT EXISTED', 400));

    const orderItemObj = foundCartItem.map((el) => {
      return {
        productId: el.product.id,
        price: el.product.price,
        amount: el.amount,
        tatolPrice: el.amount * el.product.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        paySlip: '',
        status: 'PENDING',
        userId: req.user.id,
        orderitems: { create: orderItemObj },
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        orderitems: {
          include: {
            product: true,
          },
        },
        user: {
          include: {
            addresses: true,
          },
        },
      },
    });

    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
exports.getOrderItem = async (req, res, next) => {
  try {
    const order = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        orderitems: {
          include: {
            product: true,
          },
        },
      },
    });
    const orderItem = order.find((item) => item.id == req.params.orderId);

    res.status(200).json({ orderItem });
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const foundOrder = await prisma.order.findFirst({
      where: {
        userId: req.user.id,
        id: +req.params.id,
      },
    });
    if (!foundOrder) return next(createError('CART ITEM IS NOT EXISTED', 400));

    await prisma.orderitem.deleteMany({
      where: {
        orderId: foundOrder.id,
      },
    });
    await prisma.order.delete({
      where: {
        id: foundOrder.id,
      },
    });
    res.status(200).json({ message: 'DELETED' });
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    console.log(req.body);
    const url = await upload(req.file.path);

    if (!req.file) {
      return next(createError('ORDER IMAGE IS REQUIRED'));
    }

    const foundAddress = await prisma.address.findFirst({
      where: {
        id: +req.body.address,
      },
    });

    const foundOrder = await prisma.order.findFirst({
      where: {
        id: +req.body.id,
      },
    });
    if (!foundOrder) return next(createError('ORDER IS NOT EXISTED', 400));
    const order = await prisma.order.update({
      data: {
        paySlip: url,
        status: 'PAID',
      },
      where: {
        id: foundOrder.id,
      },
    });
    order.address = foundAddress;
    console.log(order);
    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
