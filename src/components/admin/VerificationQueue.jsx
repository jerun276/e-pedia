import React from 'react';
import { Check, X, Eye } from 'lucide-react';

const mockQueue = [
  { id: 1, name: 'Kasun Perera', role: 'Teacher', document: 'NIC / ID', status: 'Pending', date: '2026-09-04' },
  { id: 2, name: 'Nimali Silva', role: 'Student', document: 'Student ID', status: 'Pending', date: '2026-09-03' },
];

const VerificationQueue = ({ onApprove, onReject }) => {
  return (
    <div className="admin-table-container glass-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Document</th>
            <th>Date Submitted</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockQueue.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td><span className={`role-badge ${item.role.toLowerCase()}`}>{item.role}</span></td>
              <td>
                <button className="btn-icon-text">
                  <Eye size={16} /> View Document
                </button>
              </td>
              <td>{item.date}</td>
              <td><span className="status-badge pending">{item.status}</span></td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => onApprove(item)} className="btn-icon success-text" title="Approve">
                    <Check size={18} />
                  </button>
                  <button onClick={() => onReject(item)} className="btn-icon danger-text" title="Reject">
                    <X size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {mockQueue.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center no-data">No pending verifications</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerificationQueue;
