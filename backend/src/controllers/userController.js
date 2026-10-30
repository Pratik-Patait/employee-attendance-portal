const bcrypt = require('bcryptjs');
const { User } = require('../../models');

// 1. Get all users (HR only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'full_name', 'role', 'manager_id', 'is_active', 'created_at'],
      include: [
        { model: User, as: 'Manager', attributes: ['id', 'full_name', 'username'] }
      ],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Get All Users Error:', error);
    return res.status(500).json({ message: 'Internal server error fetching users.' });
  }
};

// 2. Create a new user (HR only)
const createUser = async (req, res) => {
  try {
    const { username, password, full_name, role, manager_id } = req.body;

    if (!username || !password || !full_name || !role) {
      return res.status(400).json({ message: 'Username, password, full_name, and role are required.' });
    }

    if (!['EMPLOYEE', 'MANAGER'].includes(role)) {
      return res.status(400).json({ message: 'HR can only create accounts with role EMPLOYEE or MANAGER.' });
    }

    const existingUser = await User.findOne({ where: { username: username.trim() } });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this username already exists.' });
    }

    if (manager_id) {
      const manager = await User.findByPk(manager_id);
      if (!manager || manager.role !== 'MANAGER') {
        return res.status(400).json({ message: 'Assigned manager_id must belong to an existing MANAGER.' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username.trim(),
      password_hash: passwordHash,
      full_name: full_name.trim(),
      role,
      manager_id: manager_id || null,
      is_active: true
    });

    return res.status(201).json({
      message: 'User created successfully.',
      user: {
        id: newUser.id,
        username: newUser.username,
        full_name: newUser.full_name,
        role: newUser.role,
        manager_id: newUser.manager_id,
        is_active: newUser.is_active
      }
    });
  } catch (error) {
    console.error('Create User Error:', error);
    return res.status(500).json({ message: 'Internal server error creating user.' });
  }
};

// 3. Update user role, manager assignment, or toggle active status (HR only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, manager_id, is_active } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (role && !['EMPLOYEE', 'MANAGER'].includes(role)) {
      return res.status(400).json({ message: 'Role can only be set to EMPLOYEE or MANAGER.' });
    }

    if (manager_id !== undefined && manager_id !== null) {
      if (parseInt(manager_id, 10) === user.id) {
        return res.status(400).json({ message: 'A user cannot be their own reporting manager.' });
      }
      const manager = await User.findByPk(manager_id);
      if (!manager || manager.role !== 'MANAGER') {
        return res.status(400).json({ message: 'Assigned reporting manager must have the MANAGER role.' });
      }
    }

    // Update fields
    if (role !== undefined) user.role = role;
    if (manager_id !== undefined) user.manager_id = manager_id;
    if (is_active !== undefined) {
      user.is_active = is_active;
      // If deactivating, revoke active session timestamp immediately
      if (!is_active) user.last_active_at = null;
    }

    await user.save();

    return res.status(200).json({
      message: 'User updated successfully.',
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        manager_id: user.manager_id,
        is_active: user.is_active
      }
    });
  } catch (error) {
    console.error('Update User Error:', error);
    return res.status(500).json({ message: 'Internal server error updating user.' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser
};