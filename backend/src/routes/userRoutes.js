const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifySession, requireRole } = require('../middlewares/authMiddleware');

router.use(verifySession);
// User management is strictly accessible by HR
router.use(requireRole(['HR']));

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUser);

module.exports = router;