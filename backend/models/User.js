'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      full_name: { type: DataTypes.STRING(100), allowNull: false },
      role: {
        type: DataTypes.ENUM('EMPLOYEE', 'MANAGER', 'HR'),
        allowNull: false,
        defaultValue: 'EMPLOYEE'
      },
      manager_id: { type: DataTypes.INTEGER, allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      last_active_at: { type: DataTypes.DATE, allowNull: true }
    },
    {
      tableName: 'users',
      underscored: true,
      timestamps: true
    }
  );

  User.associate = (models) => {
    // Self-referencing hierarchy: Reporting Manager & Reportees
    User.belongsTo(models.User, { as: 'Manager', foreignKey: 'manager_id' });
    User.hasMany(models.User, { as: 'Reportees', foreignKey: 'manager_id' });

    // Attendance & Leave relations
    User.hasMany(models.AttendanceRecord, { foreignKey: 'user_id', as: 'AttendanceRecords' });
    User.hasMany(models.LeaveRequest, { foreignKey: 'user_id', as: 'LeaveRequests' });
    User.hasMany(models.LeaveRequest, { foreignKey: 'actioned_by', as: 'ActionedLeaves' });
  };

  return User;
};