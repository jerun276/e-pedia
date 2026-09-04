import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManagement = ({ users = [], onBan, onUnban }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const navigate = useNavigate();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="user-management">
      <div className="admin-toolbar">
        <div className="search-input-wrapper admin-search">
          <Search size={18} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search users by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="filter-select" 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="teacher">Teachers</option>
          <option value="learner">Learners</option>
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
            {filteredUsers.map((user) => (
              <tr key={user.uid || user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`role-badge ${user.role?.toLowerCase() || 'learner'}`}>{user.role || 'Learner'}</span></td>
                <td>
                  <span className={`status-badge ${(user.status || 'Active').toLowerCase()}`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => navigate(`/profile/${user.uid || user.id}`)} className="btn-sm btn-secondary" title="View Profile">
                      <User size={14} /> Profile
                    </button>
                    {(user.status || 'Active') !== 'Banned' ? (
                      <button onClick={() => onBan(user)} className="btn-sm btn-danger-outline" title="Ban User">
                        <ShieldAlert size={14} /> Ban
                      </button>
                    ) : (
                      <button onClick={() => onUnban(user)} className="btn-sm btn-success-outline" title="Unban User">
                        <ShieldCheck size={14} /> Unban
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center no-data">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
