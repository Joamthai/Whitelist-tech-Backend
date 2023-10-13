const express = require('express');
const authenticateMW = require('../middlewares/authenticate');
const productController = require('../controllers/product-controller');

const router = express.Router();

router.post('/', authenticateMW, productController.createProduct);
router.patch('/', authenticateMW, productController.updateProduct);
router.delete('/:id', authenticateMW, productController.deleteProduct);

module.exports = router;
