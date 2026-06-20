import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../storage';

export const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const executeLogout = () => {
    logoutUser();
    navigate('/');
    window.location.reload(); 
  };

  return (
    <>
    <nav className="navbar glass" style={{ 
      margin: '1rem auto', 
      maxWidth: '1200px', 
      left: '1rem', 
      right: '1rem', 
      borderRadius: '40px', 
      height: '80px', 
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      background: 'var(--bg-color)',
      borderColor: 'var(--glass-border)'
    }}>
      <div className="nav-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        
        {/* Left: Logo */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Link to="/" className="text-gradient" style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none',
            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '2px'
          }}>
            <Sparkles size={28} color="var(--primary-color)" />
            MAKE U READY
          </Link>
        </div>

        {/* Center: Links */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {user && user.role === 'BRIDE' && (
            <Link to="/search" style={{ fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none', transition: 'color 0.3s', fontSize: '1.05rem', letterSpacing: '0.5px' }}>
              Find Artists
            </Link>
          )}
        </div>

        {/* Right: User Actions */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
          {!user ? (
            <Link to="/login" className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontWeight: 600, borderRadius: '30px' }}>Login / Register</Link>
          ) : (
            <>
              {/* Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '42px', height: '42px', borderRadius: '50%', 
                  background: 'var(--accent-secondary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', 
                  fontWeight: 'bold', fontSize: '1.1rem', border: '1px solid var(--primary-color)' 
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)' }}>{user.name.split(' ')[0]}</span>
              </div>
              
              <div style={{ width: '1px', height: '30px', background: 'var(--glass-border)' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Dashboard Button */}
                <Link to={user.role === 'ARTIST' ? '/artist' : '/bride'} className="btn-outline" style={{ 
                  padding: '0 1.5rem', fontSize: '0.95rem', fontWeight: 600, height: '44px', 
                  display: 'flex', alignItems: 'center', borderRadius: '30px', letterSpacing: '0.5px'
                }}>
                  Dashboard
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={handleLogoutClick} 
                  style={{ 
                    height: '44px', width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    color: 'var(--error-color)', background: 'transparent', border: '1px solid var(--error-color)', borderRadius: '30px',
                    cursor: 'pointer', transition: 'all 0.3s ease'
                  }} 
                  title="Logout"
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--error-color)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--error-color)'; }}
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </nav>

    {/* CUSTOM LOGOUT MODAL */}
    {showLogoutConfirm && (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999
      }}>
        <div className="glass" style={{
          padding: '2.5rem', borderRadius: '24px', width: '90%', maxWidth: '400px', textAlign: 'center',
          border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', background: 'var(--bg-color)'
        }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--error-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' 
          }}>
            <LogOut size={30} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Sign Out</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>Are you sure you want to log out of your account?</p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setShowLogoutConfirm(false)} className="btn-outline" style={{ flex: 1, padding: '0.8rem', borderRadius: '30px', fontWeight: 600 }}>
              Cancel
            </button>
            <button onClick={executeLogout} style={{ 
              flex: 1, padding: '0.8rem', borderRadius: '30px', fontWeight: 600, 
              background: 'var(--error-color)', color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}>
              Yes, Log Out
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
