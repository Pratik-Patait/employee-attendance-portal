'use strict';

module.exports = (sequelize, DataTypes) => {
  const LeaveType = sequelize.define(
    'LeaveType',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      annual_quota: { type: DataTypes.INTEGER, allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {
      tableName: 'leave_types',
      underscored: true,
      timestamps: true
    }
  );

  LeaveType.associate = (models) => {
    LeaveType.hasMany(models.LeaveRequest, { foreignKey: 'leave_type_id', as: 'LeaveRequests' });
  };

  return LeaveType;
};