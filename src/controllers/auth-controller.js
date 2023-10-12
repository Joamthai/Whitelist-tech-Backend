const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { signUpSchema, loginSchema } = require('../validators/auth-validator');
const prisma = require('../models/prisma');
const createError = require('../utils/create-error');

exports.signUp = async (req, res, next) => {
  try {
    const { value, error } = signUpSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    value.password = await bcrypt.hash(value.password, 14);

    const user = await prisma.user.create({
      data: value,
    });

    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || 'DoNotTellAnyone',
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: value.email,
      },
    });

    if (!user) {
      return next(createError('SOMETHING WRONG PLEASE TRY AGAIN', 400));
    }
    const match = await bcrypt.compare(value.password, user.password);
    if (!match) {
      return next(createError('SOMETHING WRONG PLEASE TRY AGAIN', 400));
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || 'DoNotTellAnyOne',
      { expiresIn: process.env.JWT_EXPIRE }
    );

    delete user.password;
    res.status(201).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

exports.getMe = (req, res, next) => {
  res.status(200).json({ user: req.user });
};
