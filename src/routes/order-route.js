const express = require('express');
const authenticateMW = require('../middlewares/authenticate');
const orderController = require('../controllers/order-controller');
const uploadMW = require('../middlewares/upload');

const router = express.Router();

router.post(
  '/order',

  authenticateMW,
  orderController.createOrder
);
router.get('/order', authenticateMW, orderController.getOrder);
router.get('/getOrder/:orderId', authenticateMW, orderController.getOrderItem);
router.delete('/order/:id', authenticateMW, orderController.deleteOrder);
router.patch(
  '/order/uploadPaySlipOrder',
  uploadMW.single('paySlip'),
  orderController.uploadPaySlipOrder
);
router.patch(
  '/order/confirmOrder',
  authenticateMW,
  orderController.confirmOrder
);
router.patch('/order/rejectOrder', authenticateMW, orderController.rejectOrder);
router.patch(
  '/order/shippedOrder',
  authenticateMW,
  orderController.shippedOrder
);
router.patch(
  '/order/receivedOrder',
  authenticateMW,
  orderController.receivedOrder
);

module.exports = router;
