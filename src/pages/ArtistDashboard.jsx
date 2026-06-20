import { useState, useEffect } from 'react';
import { getBookingsForUser, getCurrentUser, updateBookingStatus, addPackage, getFromStorage } from '../storage';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Plus, Package } from 'lucide-react';

export const ArtistDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [myPackages, setMyPackages] = useState([]);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const user = getCurrentUser();

  // Package Form State
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgFeatures, setPkgFeatures] = useState('');

  useEffect(() => {
    if (user) {
      setBookings(getBookingsForUser(user.id, 'ARTIST'));
      refreshPackages();
    }
  }, [user]);

  const refreshPackages = () => {
    const allPackages = getFromStorage('packages');
    setMyPackages(allPackages.filter(p => p.artistId === user.id));
  };

  const handleStatusChange = (id, newStatus) => {
    updateBookingStatus(id, newStatus);
    setBookings(getBookingsForUser(user.id, 'ARTIST'));
  };

  const handleAddPackage = (e) => {
    e.preventDefault();
    const featuresList = pkgFeatures.split(',').map(f => f.trim()).filter(f => f.length > 0);
    addPackage({
      artistId: user.id,
      title: pkgTitle,
      description: pkgDesc,
      price: parseInt(pkgPrice, 10),
      features: featuresList
    });
    
    // Reset form
    setPkgTitle('');
    setPkgDesc('');
    setPkgPrice('');
    setPkgFeatures('');
    setShowAddPackage(false);
    refreshPackages();
    alert('Package added successfully! Clients can now see it.');
  };

  if (!user || user.role !== 'ARTIST') {
    return <div className="container" style={{paddingTop:'150px'}}>Access Denied. Please login as an Artist.</div>;
  }

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your bookings, packages, and profile.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{pendingCount}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Requests</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        
        {/* Left Column: Bookings */}
        <div style={{ flex: 2 }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Booking Requests</h2>
          {bookings.length === 0 ? (
            <p className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {bookings.map((booking, idx) => {
                const statusColor = booking.status === 'PENDING' ? 'var(--warning-color)' : booking.status === 'CONFIRMED' ? 'var(--success-color)' : 'var(--error-color)';
                return (
                <motion.div 
                  key={booking.id} 
                  className="glass"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
                >
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{booking.eventType}</h3>
                      <div style={{ padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'var(--accent-secondary)', color: statusColor, border: `1px solid ${statusColor}` }}>
                        {booking.status}
                      </div>
                    </div>
                    
                    <p style={{ color: 'var(--primary-color)', fontWeight: 500, marginBottom: '1rem', fontSize: '0.9rem' }}>Client: {booking.brideName || 'Client'}</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> Date: {booking.eventDate || 'TBD'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14} /> Time: {booking.eventTime || 'TBD'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> Venue: {booking.eventPlace || 'TBD'}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                      <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Total: ₹{booking.totalAmount?.toLocaleString()}</p>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Advance Escrow: ₹{booking.advancePaid?.toLocaleString()}</p>
                    </div>

                    {booking.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-primary" onClick={() => handleStatusChange(booking.id, 'CONFIRMED')} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Accept</button>
                        <button className="btn-outline" onClick={() => handleStatusChange(booking.id, 'REJECTED')} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>Reject</button>
                      </div>
                    )}
                  </div>
                </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Packages */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>My Packages</h2>
            <button className="btn-primary" onClick={() => setShowAddPackage(!showAddPackage)} style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
              {showAddPackage ? 'Cancel' : <><Plus size={16}/> Add New</>}
            </button>
          </div>

          {showAddPackage && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass" onSubmit={handleAddPackage} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Create Package</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Package Title (e.g., Groom Makeover)</label>
                <input type="text" required value={pkgTitle} onChange={e => setPkgTitle(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Cost (₹)</label>
                <input type="number" required value={pkgPrice} onChange={e => setPkgPrice(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Description</label>
                <textarea required value={pkgDesc} onChange={e => setPkgDesc(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', minHeight: '60px' }} />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Features (Comma separated)</label>
                <input type="text" placeholder="Spa, Facial, Makeup" required value={pkgFeatures} onChange={e => setPkgFeatures(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Package</button>
            </motion.form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myPackages.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>You haven't added any packages yet.</p>
            ) : (
              myPackages.map(pkg => (
                <div key={pkg.id} className="glass" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}><Package size={14} style={{display:'inline', marginRight:'0.25rem'}}/> {pkg.title}</h4>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>₹{pkg.price.toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{pkg.description}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{pkg.features.join(' • ')}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
