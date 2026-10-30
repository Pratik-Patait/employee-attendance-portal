const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ where: { username: username.trim() } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({
        message: 'Your account has been deactivated. Please contact HR.'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Set initial activity timestamp for the 15-minute sliding window
    await user.update({ last_active_at: new Date() });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' } // Sliding 15-min inactivity is enforced via DB last_active_at
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        manager_id: user.manager_id
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
};

const logout = async (req, res) => {
  try {
    await User.update(
      { last_active_at: null },
      { where: { id: req.user.id } }
    );
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({ message: 'Internal server error during logout.' });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = {
  login,
  logout,
  getMe
};