const { LeaveRequest, LeaveType, User } = require('../../models');

// 1. Apply for Leave (Employee & Manager)
const applyLeave = async (req, res) => {
  try {
    const { leave_type_id, start_date, end_date, reason } = req.body;

    if (!leave_type_id || !start_date || !end_date || !reason) {
      return res.status(400).json({ message: 'All fields (leave_type_id, start_date, end_date, reason) are required.' });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ message: 'Start date cannot be after end date.' });
    }

    const leaveType = await LeaveType.findByPk(leave_type_id);
    if (!leaveType || !leaveType.is_active) {
      return res.status(400).json({ message: 'Selected leave type is invalid or inactive.' });
    }

    const leaveRequest = await LeaveRequest.create({
      user_id: req.user.id,
      leave_type_id,
      start_date,
      end_date,
      reason,
      status: 'PENDING'
    });

    return res.status(201).json({
      message: 'Leave application submitted successfully.',
      leaveRequest
    });
  } catch (error) {
    console.error('Apply Leave Error:', error);
    return res.status(500).json({ message: 'Internal server error while applying for leave.' });
  }
};

// 2. View Own Leave Requests (Employee & Manager)
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: LeaveType, as: 'LeaveType', attributes: ['id', 'name'] },
        { model: User, as: 'Approver', attributes: ['id', 'full_name', 'username'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ leaves });
  } catch (error) {
    console.error('Get My Leaves Error:', error);
    return res.status(500).json({ message: 'Internal server error fetching your leaves.' });
  }
};

// 3. View Pending Approvals for Reportees (Manager only)
const getPendingApprovals = async (req, res) => {
  try {
    const pendingLeaves = await LeaveRequest.findAll({
      where: { status: 'PENDING' },
      include: [
        {
          model: User,
          as: 'Employee',
          attributes: ['id', 'username', 'full_name', 'manager_id'],
          where: { manager_id: req.user.id } // Only fetch reportees assigned to this manager
        },
        { model: LeaveType, as: 'LeaveType', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'ASC']]
    });

    // Enforce constraint: Exclude the manager's own requests if any reportee relation loops
    const filteredLeaves = pendingLeaves.filter((leave) => leave.user_id !== req.user.id);

    return res.status(200).json({ pendingLeaves: filteredLeaves });
  } catch (error) {
    console.error('Get Pending Approvals Error:', error);
    return res.status(500).json({ message: 'Internal server error fetching pending approvals.' });
  }
};

// 4. Approve or Reject Leave Request (Manager only)
const actionLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid action. Status must be either APPROVED or REJECTED.' });
    }

    if (!remark || !remark.trim()) {
      return res.status(400).json({ message: 'Remark is mandatory when approving or rejecting a leave request.' });
    }

    const leaveRequest = await LeaveRequest.findByPk(id, {
      include: [{ model: User, as: 'Employee', attributes: ['id', 'manager_id', 'full_name'] }]
    });

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    // Constraint: Once acted upon, request cannot be modified or re-processed
    if (leaveRequest.status !== 'PENDING') {
      return res.status(400).json({ message: 'This leave request has already been acted upon and cannot be modified.' });
    }

    // Constraint: A manager cannot approve or reject their own leave requests
    if (leaveRequest.user_id === req.user.id) {
      return res.status(403).json({ message: 'You cannot approve or reject your own leave request.' });
    }

    // Constraint: Manager can only act on leaves of their assigned reportees
    if (leaveRequest.Employee.manager_id !== req.user.id) {
      return res.status(403).json({ message: 'You are only authorized to act on leave requests of your assigned team members.' });
    }

    await leaveRequest.update({
      status,
      manager_remark: remark.trim(),
      actioned_by: req.user.id
    });

    return res.status(200).json({
      message: `Leave request has been ${status.toLowerCase()} successfully.`,
      leaveRequest
    });
  } catch (error) {
    console.error('Action Leave Error:', error);
    return res.status(500).json({ message: 'Internal server error acting on leave request.' });
  }
};

// 5. View All Leave Requests Across the Organization (HR only)
const getAllLeaves = async (req, res) => {
  try {
    const allLeaves = await LeaveRequest.findAll({
      include: [
        { model: User, as: 'Employee', attributes: ['id', 'username', 'full_name'] },
        { model: LeaveType, as: 'LeaveType', attributes: ['id', 'name'] },
        { model: User, as: 'Approver', attributes: ['id', 'username', 'full_name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ leaves: allLeaves });
  } catch (error) {
    console.error('Get All Leaves Error:', error);
    return res.status(500).json({ message: 'Internal server error fetching all leave requests.' });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getPendingApprovals,
  actionLeaveRequest,
  getAllLeaves
};