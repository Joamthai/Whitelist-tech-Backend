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
        totalPrice: el.amount * el.product.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        paySlip: '',
        userId: req.user.id,
        addressId: +req.body.address,
        orderItems: { create: orderItemObj },
      },
      include: {
        user: true,
        address: true,
      },
    });
    console.log(foundCartItem);

    for (let i = 0; i < foundCartItem.length; i++) {
      await prisma.product.update({
        data: {
          stock: foundCartItem[i].product.stock - foundCartItem[i].amount,
        },
        where: {
          id: foundCartItem[i].product.id,
        },
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: req.user.id,
      },
    });
    console.log(order);
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order =
      req.user.role === 'ADMIN'
        ? await prisma.order.findMany({
            include: {
              user: true,
              address: true,
              orderItems: {
                include: {
                  product: true,
                },
              },
            },
          })
        : await prisma.order.findMany({
            where: {
              userId: req.user.id,
            },
            include: {
              user: true,
              address: true,
              orderItems: {
                include: {
                  product: true,
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
        orderItems: {
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

    await prisma.orderItem.deleteMany({
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

exports.uploadPaySlipOrder = async (req, res, next) => {
  try {
    const url = await upload(req.file.path);

    if (!req.file) {
      return next(createError('ORDER IMAGE IS REQUIRED'));
    }

    const foundOrder = await prisma.order.findFirst({
      where: {
        id: +req.body.id,
      },
    });
    if (!foundOrder) return next(createError('ORDER IS NOT EXISTED', 400));
    const order = await prisma.order.update({
      data: {
        paySlip: url,
      },
      where: {
        id: +foundOrder.id,
      },
    });
    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};

exports.confirmOrder = async (req, res, next) => {
  try {
    const foundOrder = await prisma.order.findFirst({
      where: {
        id: +req.body.id,
      },
    });
    if (!foundOrder) return next(createError('ORDER IS NOT EXISTED', 400));
    const order = await prisma.order.update({
      data: {
        status: 'PAID',
      },
      where: {
        id: foundOrder.id,
      },
    });
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

exports.rejectOrder = async (req, res, next) => {
  try {
    console.log(req.body);
    const foundOrder = await prisma.order.findFirst({
      where: {
        id: +req.body.id,
      },
    });

    const order = await prisma.order.update({
      data: {
        paySlip: '',
      },
      where: {
        id: foundOrder.id,
      },
    });
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

exports.shippedOrder = async (req, res, next) => {
  try {
    console.log(req.body);
    const foundOrder = await prisma.order.findFirst({
      where: {
        id: +req.body.id,
      },
    });

    const order = await prisma.order.update({
      data: {
        status: 'SHIPPED',
      },
      where: {
        id: foundOrder.id,
      },
    });
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

exports.receivedOrder = async (req, res, next) => {
  try {
    const foundOrder = await prisma.order.findFirst({
      where: {
        id: +req.body.id,
      },
    });

    const order = await prisma.order.update({
      data: {
        status: 'DELIVERED',
      },
      where: {
        id: foundOrder.id,
      },
    });
    console.log(order);
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};
