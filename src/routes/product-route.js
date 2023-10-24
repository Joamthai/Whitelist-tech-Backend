const express = require('express');
const authenticateMW = require('../middlewares/authenticate');
const productController = require('../controllers/product-controller');
const uploadMW = require('../middlewares/upload');

const router = express.Router();

router.post('/', uploadMW.single('image'), productController.createProduct);
router.patch('/', uploadMW.single('image'), productController.updateProduct);
router.delete('/:id', authenticateMW, productController.deleteProduct);
router.patch('/:id', authenticateMW, productController.getProductBack);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
