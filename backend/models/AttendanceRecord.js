'use strict';

module.exports = (sequelize, DataTypes) => {
  const AttendanceRecord = sequelize.define(
    'AttendanceRecord',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      check_in_time: { type: DataTypes.DATE, allowNull: false },
      check_out_time: { type: DataTypes.DATE, allowNull: true },
      total_hours: { type: DataTypes.DECIMAL(4, 2), allowNull: true }
    },
    {
      tableName: 'attendance_records',
      underscored: true,
      timestamps: true
    }
  );

  AttendanceRecord.associate = (models) => {
    AttendanceRecord.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
  };

  return AttendanceRecord;
};