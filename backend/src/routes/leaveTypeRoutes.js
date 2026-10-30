const express = require('express');
const router = express.Router();
const leaveTypeController = require('../controllers/leaveTypeController');
const { verifySession, requireRole } = require('../middlewares/authMiddleware');

router.use(verifySession);

// All authenticated roles can fetch active leave types to populate selection dropdowns
router.get('/active', leaveTypeController.getActiveLeaveTypes);

// HR only: Configure and manage leave types
router.get('/', requireRole(['HR']), leaveTypeController.getAllLeaveTypes);
router.post('/', requireRole(['HR']), leaveTypeController.createLeaveType);
router.put('/:id', requireRole(['HR']), leaveTypeController.updateLeaveType);

module.exports = router;