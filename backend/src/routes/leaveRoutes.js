const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifySession, requireRole } = require('../middlewares/authMiddleware');

router.use(verifySession);

// Employee & Manager can apply and view their own requests (HR cannot apply for leave)
router.post('/apply', requireRole(['EMPLOYEE', 'MANAGER']), leaveController.applyLeave);
router.get('/my-leaves', requireRole(['EMPLOYEE', 'MANAGER']), leaveController.getMyLeaves);

// Manager only: Review and act on reportees' leave requests
router.get('/pending', requireRole(['MANAGER']), leaveController.getPendingApprovals);
router.patch('/:id/action', requireRole(['MANAGER']), leaveController.actionLeaveRequest);

// HR only: View all organization-wide leave requests
router.get('/all', requireRole(['HR']), leaveController.getAllLeaves);

module.exports = router;