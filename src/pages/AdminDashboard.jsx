import React, { useState } from 'react';
import VerificationQueue from '../components/admin/VerificationQueue';
import UserManagement from '../components/admin/UserManagement';
import AdminModal from '../components/admin/AdminModal';
import { Users, FileCheck, Shield, Database, Lock, LogIn, AlertCircle, LogOut } from 'lucide-react';
import { seedInitialMentors } from '../firebase/seedDb';
import { isFirebaseConfigured } from '../firebase/config';
import { useAuth } from '../firebase/AuthContext';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const { isLoggedIn, isAdmin, loading, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('verification');
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  // Admin login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setAuthError(res.error || 'Failed to login');
      }
    } catch (err) {
      setAuthError('Authentication failed');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container section" style={{ paddingTop: 'calc(var(--nav-height) + 40px)', display: 'flex', justifyContent: 'center' }}>
        <div className="auth-card glass-card" style={{ maxWidth: '450px', width: '100%', padding: '40px 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(255, 82, 82, 0.15)', color: '#FF5252', marginBottom: '16px' }}>
              <Shield size={36} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Admin Console</h2>
            <p className="text-secondary">Sign in with administrator credentials</p>
          </div>

          {authError && (
            <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(255,107,107,0.1)', color: '#ff6b6b', borderRadius: '8px', marginBottom: '20px' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.9rem' }}>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@e-pedia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px', background: 'linear-gradient(135deg, #FF5252, #FF7979)', border: 'none', color: '#fff' }}
            >
              {isSubmitting ? <span className="spinner" style={{ width: '20px', height: '20px' }}></span> : <><Lock size={18} /> Access Console</>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container section" style={{ paddingTop: 'calc(var(--nav-height) + 40px)', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '24px', borderRadius: '50%', background: 'rgba(255, 82, 82, 0.1)', color: '#FF5252', marginBottom: '24px' }}>
          <AlertCircle size={48} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Access Denied</h2>
        <p className="text-secondary" style={{ maxWidth: '400px', marginBottom: '30px' }}>
          Your account does not have administrator privileges. If you believe this is an error, please contact system support.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Home</button>
          <button className="btn btn-outline" onClick={() => logout()} style={{ color: '#FF5252', borderColor: 'rgba(255, 82, 82, 0.3)' }}><LogOut size={18} /> Sign Out</button>
        </div>
      </div>
    );
  }

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
