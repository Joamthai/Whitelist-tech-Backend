const express = require('express');
const profileController = require('../controllers/profile-controller');
const authenticateMW = require('../middlewares/authenticate');
const router = express.Router();

router.post('/address', authenticateMW, profileController.createAddress);
router.patch('/address', authenticateMW, profileController.updateAddress);
router.delete('/address/:id', authenticateMW, profileController.deleteAddress);
router.get('/address', authenticateMW, profileController.getAllAddress);

module.exports = router;
