const express = require('express');
const authenticateMW = require('../middlewares/authenticate');
const productController = require('../controllers/product-controller');
const uploadMW = require('../middlewares/upload');

const router = express.Router();

router.post('/', uploadMW.single('image'), productController.createProduct);
router.patch('/', authenticateMW, productController.updateProduct);
router.delete('/:id', authenticateMW, productController.deleteProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
