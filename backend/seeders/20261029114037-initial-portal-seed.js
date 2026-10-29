'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('Password@123', 10);
    const now = new Date();

    // 1. Seed Users across all 3 required roles
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'hr_admin',
        password_hash: passwordHash,
        full_name: 'Priya Sharma (HR)',
        role: 'HR',
        manager_id: null,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        username: 'manager_one',
        password_hash: passwordHash,
        full_name: 'Rajesh Verma (Senior Manager)',
        role: 'MANAGER',
        manager_id: null,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        username: 'manager_two',
        password_hash: passwordHash,
        full_name: 'Vikram Desai (Team Manager)',
        role: 'MANAGER',
        manager_id: 2, // Reports to Senior Manager (for Manager leave approval)
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 4,
        username: 'emp_one',
        password_hash: passwordHash,
        full_name: 'Aarav Patel (Employee)',
        role: 'EMPLOYEE',
        manager_id: 3, // Reports to Vikram Desai
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 5,
        username: 'emp_two',
        password_hash: passwordHash,
        full_name: 'Sneha Kulkarni (Employee)',
        role: 'EMPLOYEE',
        manager_id: 3, // Reports to Vikram Desai
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);

    // Reset Postgres auto-increment sequence after explicit ID insertion
    await queryInterface.sequelize.query(
      `SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;`
    );

    // 2. Seed initial Leave Types
    await queryInterface.bulkInsert('leave_types', [
      {
        name: 'Casual Leave',
        annual_quota: 12,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Sick Leave',
        annual_quota: 10,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Earned Leave',
        annual_quota: 15,
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('leave_requests', null, {});
    await queryInterface.bulkDelete('attendance_records', null, {});
    await queryInterface.bulkDelete('leave_types', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};