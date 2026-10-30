const { AttendanceRecord, User } = require('../../models');

// Helper to get current date string in YYYY-MM-DD (local calendar day)
const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 1. Check-in (Employee & Manager only)
const checkIn = async (req, res) => {
  try {
    const today = getTodayDateString();

    // Check if attendance already exists for today
    const existingRecord = await AttendanceRecord.findOne({
      where: {
        user_id: req.user.id,
        date: today
      }
    });

    if (existingRecord) {
      return res.status(400).json({
        message: 'You have already checked in for today. Only one check-in per calendar day is allowed.'
      });
    }

    const newRecord = await AttendanceRecord.create({
      user_id: req.user.id,
      date: today,
      check_in_time: new Date()
    });

    return res.status(201).json({
      message: 'Check-in successful',
      attendance: newRecord
    });
  } catch (error) {
    console.error('Check-in Error:', error);
    return res.status(500).json({ message: 'Internal server error during check-in.' });
  }
};

// 2. Check-out (Employee & Manager only)
const checkOut = async (req, res) => {
  try {
    const today = getTodayDateString();

    const record = await AttendanceRecord.findOne({
      where: {
        user_id: req.user.id,
        date: today
      }
    });

    if (!record) {
      return res.status(400).json({
        message: 'No check-in record found for today. You must check in first.'
      });
    }

    if (record.check_out_time) {
      return res.status(400).json({
        message: 'You have already checked out for today.'
      });
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(record.check_in_time);

    // Calculate total hours worked as a decimal (e.g., 8.50)
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;

    await record.update({
      check_out_time: checkOutTime,
      total_hours: totalHours
    });

    return res.status(200).json({
      message: 'Check-out successful',
      attendance: record
    });
  } catch (error) {
    console.error('Check-out Error:', error);
    return res.status(500).json({ message: 'Internal server error during check-out.' });
  }
};

// 3. Get Today's Status (For rendering the Check-in / Check-out UI state)
const getTodayStatus = async (req, res) => {
  try {
    const today = getTodayDateString();
    const record = await AttendanceRecord.findOne({
      where: {
        user_id: req.user.id,
        date: today
      }
    });

    return res.status(200).json({
      date: today,
      record: record || null
    });
  } catch (error) {
    console.error('Today Status Error:', error);
    return res.status(500).json({ message: 'Internal server error retrieving status.' });
  }
};

// 4. View Own Timesheet (Employee, Manager, HR)
const getMyTimesheet = async (req, res) => {
  try {
    const records = await AttendanceRecord.findAll({
      where: { user_id: req.user.id },
      order: [['date', 'DESC']]
    });

    return res.status(200).json({ records });
  } catch (error) {
    console.error('My Timesheet Error:', error);
    return res.status(500).json({ message: 'Internal server error fetching timesheet.' });
  }
};

// 5. View Team Attendance (Manager only - records of employees reporting to this manager)
const getTeamAttendance = async (req, res) => {
  try {
    const records = await AttendanceRecord.findAll({
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'username', 'full_name', 'manager_id'],
          where: { manager_id: req.user.id }
        }
      ],
      order: [['date', 'DESC'], ['check_in_time', 'DESC']]
    });

    return res.status(200).json({ records });
  } catch (error) {
    console.error('Team Attendance Error:', error);
    return res.status(500).json({ message: 'Internal server error fetching team attendance.' });
  }
};

// 6. View Organization Attendance (HR only - all records across the company)
const getOrganizationAttendance = async (req, res) => {
  try {
    const records = await AttendanceRecord.findAll({
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'username', 'full_name', 'role']
        }
      ],
      order: [['date', 'DESC'], ['check_in_time', 'DESC']]
    });

    return res.status(200).json({ records });
  } catch (error) {
    console.error('Organization Attendance Error:', error);
    return res.status(500).json({ message: 'Internal server error fetching organization attendance.' });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyTimesheet,
  getTeamAttendance,
  getOrganizationAttendance
};