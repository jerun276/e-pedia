import React, { useState } from 'react';
import VerificationQueue from '../components/admin/VerificationQueue';
import UserManagement from '../components/admin/UserManagement';
import AdminModal from '../components/admin/AdminModal';
import { Users, FileCheck, Shield, Database } from 'lucide-react';
import { seedInitialMentors } from '../firebase/seedDb';
import { isFirebaseConfigured } from '../firebase/config';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('verification');
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  // Verification actions
  const handleApprove = (user) => {
    setModalConfig({
      isOpen: true,
      title: 'Approve Verification',
      description: `Are you sure you want to approve the ID verification for ${user.name}? They will receive a VERIFIED badge.`,
      confirmText: 'Approve',
      type: 'success',
      onConfirm: () => {
        console.log('Approved', user.id);
        setModalConfig({ isOpen: false });
      }
    });
  };

  const handleReject = (user) => {
    setModalConfig({
      isOpen: true,
      title: 'Reject Verification',
      description: `Are you sure you want to reject the ID verification for ${user.name}? This action cannot be undone.`,
      confirmText: 'Reject',
      type: 'danger',
      onConfirm: () => {
        console.log('Rejected', user.id);
        setModalConfig({ isOpen: false });
      }
    });
  };

  // User management actions
  const handleBan = (user) => {
    setModalConfig({
      isOpen: true,
      title: 'Ban User',
      description: `Are you sure you want to ban ${user.name}? They will lose access to the platform immediately.`,
      confirmText: 'Ban User',
      type: 'danger',
      onConfirm: () => {
        console.log('Banned', user.id);
        setModalConfig({ isOpen: false });
      }
    });
  };

  const handleUnban = (user) => {
    setModalConfig({
      isOpen: true,
      title: 'Unban User',
      description: `Are you sure you want to restore access for ${user.name}?`,
      confirmText: 'Unban User',
      type: 'success',
      onConfirm: () => {
        console.log('Unbanned', user.id);
        setModalConfig({ isOpen: false });
      }
    });
  };

  return (
    <div className="admin-dashboard container section" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <div className="admin-header">
        <h1 className="section-title">Admin <span className="gradient-text">Control Panel</span></h1>
        <p className="section-subtitle">Manage user verifications and platform security</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card glass-card">
          <FileCheck size={28} className="stat-icon primary-text" />
          <div className="stat-info">
            <h3>2</h3>
            <p>Pending Verifications</p>
          </div>
        </div>
        <div className="stat-card glass-card">
          <Users size={28} className="stat-icon secondary-text" />
          <div className="stat-info">
            <h3>1,248</h3>
            <p>Total Active Users</p>
          </div>
        </div>
        <div className="stat-card glass-card">
          <Shield size={28} className="stat-icon warning-text" />
          <div className="stat-info">
            <h3>12</h3>
            <p>Banned Accounts</p>
          </div>
        </div>
        <div className="stat-card glass-card" style={{ cursor: 'pointer' }} onClick={async () => {
          if (!isFirebaseConfigured) {
            alert('Please configure your Firebase credentials in .env first!')
            return
          }
          const res = await seedInitialMentors()
          if (res.success) {
            alert(res.seeded ? `Success! Seeded ${res.count} mentors to Firestore!` : `Firestore already contains ${res.count} mentors.`)
          } else {
            alert('Error seeding database: ' + res.error)
          }
        }}>
          <Database size={28} className="stat-icon primary-text" />
          <div className="stat-info">
            <h3 style={{ fontSize: '1rem', color: 'var(--primary-light)' }}>Sync Database</h3>
            <p>Seed Firestore DB</p>
          </div>
        </div>
      </div>


      <div className="admin-content">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            Verification Queue
          </button>
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </div>

        <div className="admin-tab-content">
          {activeTab === 'verification' && (
            <VerificationQueue onApprove={handleApprove} onReject={handleReject} />
          )}
          {activeTab === 'users' && (
            <UserManagement onBan={handleBan} onUnban={handleUnban} />
          )}
        </div>
      </div>

      <AdminModal 
        {...modalConfig} 
        onClose={() => setModalConfig({ isOpen: false })} 
      />
    </div>
  );
};

export default AdminDashboard;
