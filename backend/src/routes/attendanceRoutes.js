const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifySession, requireRole } = require('../middlewares/authMiddleware');

// Every attendance route requires a valid session token (with 15-minute inactivity check)
router.use(verifySession);

// Check-in / Check-out: Employee and Manager permitted; HR is explicitly restricted (returns 403)
router.post('/check-in', requireRole(['EMPLOYEE', 'MANAGER']), attendanceController.checkIn);
router.patch('/check-out', requireRole(['EMPLOYEE', 'MANAGER']), attendanceController.checkOut);
router.get('/today-status', requireRole(['EMPLOYEE', 'MANAGER']), attendanceController.getTodayStatus);

// Timesheet views: Scoped per role
router.get('/my-timesheet', requireRole(['EMPLOYEE', 'MANAGER', 'HR']), attendanceController.getMyTimesheet);
router.get('/team', requireRole(['MANAGER']), attendanceController.getTeamAttendance);
router.get('/organization', requireRole(['HR']), attendanceController.getOrganizationAttendance);

module.exports = router;