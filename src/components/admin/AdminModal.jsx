import React from 'react';
import { X } from 'lucide-react';

const AdminModal = ({ isOpen, onClose, title, description, confirmText, onConfirm, type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal glass-card">
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="admin-modal-close"><X size={20} /></button>
        </div>
        <div className="admin-modal-body">
          <p>{description}</p>
        </div>
        <div className="admin-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-success'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
