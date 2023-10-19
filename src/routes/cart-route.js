const express = require('express');
const cartController = require('../controllers/cart-controller');
const authenticateMW = require('../middlewares/authenticate');

const router = express.Router();

router.post('/', authenticateMW, cartController.addToCart);
router.patch('/', authenticateMW, cartController.updateAmount);

router.get('/', authenticateMW, cartController.getCartItem);
router.delete('/:id', authenticateMW, cartController.deleteFromCart);

module.exports = router;
