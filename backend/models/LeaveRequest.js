'use strict';

module.exports = (sequelize, DataTypes) => {
  const LeaveRequest = sequelize.define(
    'LeaveRequest',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      leave_type_id: { type: DataTypes.INTEGER, allowNull: false },
      start_date: { type: DataTypes.DATEONLY, allowNull: false },
      end_date: { type: DataTypes.DATEONLY, allowNull: false },
      reason: { type: DataTypes.TEXT, allowNull: false },
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING'
      },
      manager_remark: { type: DataTypes.TEXT, allowNull: true },
      actioned_by: { type: DataTypes.INTEGER, allowNull: true }
    },
    {
      tableName: 'leave_requests',
      underscored: true,
      timestamps: true
    }
  );

  LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.User, { foreignKey: 'user_id', as: 'Employee' });
    LeaveRequest.belongsTo(models.LeaveType, { foreignKey: 'leave_type_id', as: 'LeaveType' });
    LeaveRequest.belongsTo(models.User, { foreignKey: 'actioned_by', as: 'Approver' });
  };

  return LeaveRequest;
};