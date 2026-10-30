const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifySession } = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.post('/logout', verifySession, authController.logout);
router.get('/me', verifySession, authController.getMe);

module.exports = router;