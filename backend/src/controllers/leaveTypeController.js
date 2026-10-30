const { LeaveType } = require('../../models');

// 1. Get active leave types (Accessible to all authenticated users for forms)
const getActiveLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.findAll({
      where: { is_active: true },
      order: [['id', 'ASC']]
    });
    return res.status(200).json({ leaveTypes });
  } catch (error) {
    console.error('Get Active Leave Types Error:', error);
    return res.status(500).json({ message: 'Internal server error fetching leave types.' });
  }
};

// 2. Get all leave types including inactive (HR only)
const getAllLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ leaveTypes });
  } catch (error) {
    console.error('Get All Leave Types Error:', error);
    return res.status(500).json({ message: 'Internal server error fetching leave types.' });
  }
};

// 3. Create a leave type (HR only)
const createLeaveType = async (req, res) => {
  try {
    const { name, annual_quota } = req.body;

    if (!name || annual_quota === undefined) {
      return res.status(400).json({ message: 'Name and annual_quota are required.' });
    }

    if (parseInt(annual_quota, 10) < 0) {
      return res.status(400).json({ message: 'Annual quota must be a non-negative number.' });
    }

    const existing = await LeaveType.findOne({ where: { name: name.trim() } });
    if (existing) {
      return res.status(400).json({ message: 'A leave type with this name already exists.' });
    }

    const newLeaveType = await LeaveType.create({
      name: name.trim(),
      annual_quota: parseInt(annual_quota, 10),
      is_active: true
    });

    return res.status(201).json({
      message: 'Leave type created successfully.',
      leaveType: newLeaveType
    });
  } catch (error) {
    console.error('Create Leave Type Error:', error);
    return res.status(500).json({ message: 'Internal server error creating leave type.' });
  }
};

// 4. Update leave type name, quota, or status (HR only)
const updateLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, annual_quota, is_active } = req.body;

    const leaveType = await LeaveType.findByPk(id);
    if (!leaveType) {
      return res.status(404).json({ message: 'Leave type not found.' });
    }

    if (name !== undefined) leaveType.name = name.trim();
    if (annual_quota !== undefined) {
      if (parseInt(annual_quota, 10) < 0) {
        return res.status(400).json({ message: 'Annual quota must be a non-negative number.' });
      }
      leaveType.annual_quota = parseInt(annual_quota, 10);
    }
    if (is_active !== undefined) leaveType.is_active = is_active;

    await leaveType.save();

    return res.status(200).json({
      message: 'Leave type updated successfully.',
      leaveType
    });
  } catch (error) {
    console.error('Update Leave Type Error:', error);
    return res.status(500).json({ message: 'Internal server error updating leave type.' });
  }
};

module.exports = {
  getActiveLeaveTypes,
  getAllLeaveTypes,
  createLeaveType,
  updateLeaveType
};