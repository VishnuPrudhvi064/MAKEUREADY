import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LogOut, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser: user, logout, notifications, markNotificationsAsRead } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const executeLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/');
  };

  const myNotifications = user ? notifications.filter(n => n.userId === user.id) : [];
  const unreadCount = myNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifs = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0) {
      markNotificationsAsRead(user.id);
    }
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
            <Link 
              to="/search" 
              className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
            >
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
                <Avatar user={user} size={42} />
                <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)' }}>{user.name ? user.name.split(' ')[0] : 'User'}</span>
              </div>
              
              <div style={{ width: '1px', height: '30px', background: 'var(--glass-border)' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Notifications Dropdown */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                  <button 
                    onClick={toggleNotifs}
                    style={{ 
                      background: 'transparent', border: 'none', color: 'var(--text-main)', 
                      cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' 
                    }}
                  >
                    <Bell size={24} />
                    {unreadCount > 0 && (
                      <div style={{
                        position: 'absolute', top: '-5px', right: '-5px',
                        background: 'var(--error-color)', color: '#fff',
                        fontSize: '0.7rem', fontWeight: 'bold',
                        width: '18px', height: '18px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {unreadCount}
                      </div>
                    )}
                  </button>

                  {showNotifs && (
                    <div className="glass" style={{
                      position: 'absolute', top: '100%', right: '0',
                      marginTop: '1rem', width: '320px', borderRadius: '16px',
                      padding: '1rem', zIndex: 9999, boxShadow: 'var(--glass-shadow)',
                      maxHeight: '400px', overflowY: 'auto'
                    }}>
                      <h4 style={{ margin: '0 0 1rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>Notifications</h4>
                      {myNotifications.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', margin: '2rem 0' }}>No notifications yet.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {myNotifications.map(n => (
                            <div key={n.id} style={{ 
                              padding: '0.8rem', borderRadius: '12px', 
                              background: n.read ? 'transparent' : 'rgba(212, 175, 55, 0.1)',
                              border: '1px solid var(--glass-border)'
                            }}>
                              <div style={{ fontSize: '0.9rem', marginBottom: '0.3rem', color: 'var(--text-main)' }}>{n.message}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.timestamp).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

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
