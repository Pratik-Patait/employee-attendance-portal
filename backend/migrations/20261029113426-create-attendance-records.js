'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance_records', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      check_out_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      total_hours: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Hard constraint: One check-in per user per calendar day
    await queryInterface.addConstraint('attendance_records', {
      fields: ['user_id', 'date'],
      type: 'unique',
      name: 'unique_user_daily_attendance'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('attendance_records');
  }
};