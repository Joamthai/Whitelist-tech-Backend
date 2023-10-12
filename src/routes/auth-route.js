const express = require('express');
const authController = require('../controllers/auth-controller');
const authenticateMW = require('../middlewares/authenticate');

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/login', authController.login);
router.get('/me', authenticateMW, authController.getMe);
module.exports = router;
