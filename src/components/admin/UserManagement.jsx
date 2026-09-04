import React from 'react';
import { ShieldAlert, ShieldCheck, Search } from 'lucide-react';

const mockUsers = [
  { id: 101, name: 'Amara Weerasinghe', email: 'amara@example.com', role: 'Teacher', status: 'Active' },
  { id: 102, name: 'Dinuka Rajapaksha', email: 'dinuka@example.com', role: 'Student', status: 'Banned' },
  { id: 103, name: 'Saman Kumara', email: 'saman@example.com', role: 'Student', status: 'Active' },
];

const UserManagement = ({ onBan, onUnban }) => {
  return (
    <div className="user-management">
      <div className="admin-toolbar">
        <div className="search-input-wrapper admin-search">
          <Search size={18} />
          <input type="text" className="search-input" placeholder="Search users by name or email..." />
        </div>
        <select className="filter-select">
          <option value="all">All Roles</option>
          <option value="teacher">Teachers</option>
          <option value="student">Students</option>
        </select>
      </div>
      
      <div className="admin-table-container glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  {user.status === 'Active' ? (
                    <button onClick={() => onBan(user)} className="btn-sm btn-danger-outline" title="Ban User">
                      <ShieldAlert size={14} /> Ban
                    </button>
                  ) : (
                    <button onClick={() => onUnban(user)} className="btn-sm btn-success-outline" title="Unban User">
                      <ShieldCheck size={14} /> Unban
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
