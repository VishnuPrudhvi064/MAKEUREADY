import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Package, Image as ImageIcon, MessageSquare, DollarSign, Settings, Heart, Bell, Plus, Trash2, ShieldCheck, CheckCircle, X, Upload, MapPin } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';

export const ArtistDashboard = () => {
  const { 
    currentUser: user, bookings, packages, messages, users,
    addNewPackage: addPackage, updateBookingStatus, updateProfile, sendMessage, markMessagesAsRead
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Overview';
  const setActiveTab = (tab) => setSearchParams(prev => { prev.set('tab', tab); return prev; });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dateToBlock, setDateToBlock] = useState('');
  
  // Package Form State
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgFeatures, setPkgFeatures] = useState('');

  // Portfolio State
  const fileInputRef = useRef(null);

  // Settings State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    specialty: user?.specialty || '',
    location: user?.location || '',
    experience_years: user?.experience_years || 1,
    instagram: user?.instagram || ''
  });

  // Chat State
  const chatUser = searchParams.get('chat') || null;
  const setChatUser = (userId) => setSearchParams(prev => { if(userId) prev.set('chat', userId); else prev.delete('chat'); return prev; });
  const [msgText, setMsgText] = useState('');

  if (!user || user.role !== 'ARTIST') {
    return <div className="container" style={{paddingTop:'150px'}}>Access Denied. Please login as an Artist.</div>;
  }

  const myBookings = bookings.filter(b => b.artistId === user.id);
  const myPackages = packages.filter(p => p.artistId === user.id);
  const myPortfolio = user.portfolio || [];
  const myBlockedDates = user.blockedDates || [];
  const pendingCount = myBookings.filter(b => b.status === 'PENDING').length;

  const totalEarned = myBookings.filter(b => b.status === 'COMPLETED').reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const advanceHeld = myBookings.filter(b => b.status === 'CONFIRMED').reduce((acc, b) => acc + (b.advancePaid || 0), 0);
  const pendingPayouts = myBookings.filter(b => b.status === 'CONFIRMED').reduce((acc, b) => acc + ((b.totalAmount || 0) - (b.advancePaid || 0)), 0);

  const getPremiumAvatar = (url) => {
    if (url && url.includes('ui-avatars.com')) {
      return url.replace(/background=[a-zA-Z0-9]+/, 'background=1a1a1a').replace(/color=[a-zA-Z0-9]+/, 'color=d4af37');
    }
    return url || `https://ui-avatars.com/api/?name=${user.name}&background=1a1a1a&color=d4af37&size=150`;
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
    setPkgTitle(''); setPkgDesc(''); setPkgPrice(''); setPkgFeatures(''); setShowAddPackage(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(user.id, profileData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Compressor via Canvas to prevent localStorage crash
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        
        const newPortfolio = [...myPortfolio, { id: 'img_' + Date.now(), url: compressedBase64 }];
        updateProfile(user.id, { portfolio: newPortfolio });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removePortfolioImage = (id) => {
    const newPortfolio = myPortfolio.filter(img => img.id !== id);
    updateProfile(user.id, { portfolio: newPortfolio });
  };

  const toggleBlockedDate = (dateStr) => {
    if (!dateStr) return;
    let newBlocked = [...myBlockedDates];
    if (newBlocked.includes(dateStr)) {
      newBlocked = newBlocked.filter(d => d !== dateStr);
    } else {
      newBlocked.push(dateStr);
    }
    updateProfile(user.id, { blockedDates: newBlocked });
    setDateToBlock('');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    sendMessage(user.id, chatUser, msgText);
    setMsgText('');
  };

  const chatPartners = [...new Set(messages.filter(m => m.senderId === user.id || m.receiverId === user.id).map(m => m.senderId === user.id ? m.receiverId : m.senderId))];

  return (
    <>
      <AnimatePresence>
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{ position: 'fixed', top: '40px', left: '50%', zIndex: 9999, background: 'rgba(212, 175, 55, 0.85)', backdropFilter: 'blur(10px)', color: '#1A0E10', padding: '1rem 2rem', borderRadius: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.8rem' }}
          >
            Settings saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container" style={{ paddingTop: '110px', paddingBottom: '4rem', display: 'flex', gap: '2.5rem' }}>
        
        {/* SIDEBAR */}
        <aside style={{ width: '250px', flexShrink: 0 }}>
          <div className="glass" style={{ padding: '2rem 1.5rem', borderRadius: '24px', position: 'sticky', top: '110px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ position: 'relative' }}>
                <Avatar user={user} size={56} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name.split(' ')[0]}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Bridal Makeup Artist
                </div>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { name: 'Overview', icon: LayoutDashboard },
                { name: 'Requests', icon: Bell },
                { name: 'Packages', icon: Package },
                { name: 'Portfolio', icon: ImageIcon },
                { name: 'Availability', icon: Calendar },
                { name: 'Messages', icon: MessageSquare },
                { name: 'Earnings', icon: DollarSign },
                { name: 'Settings', icon: Settings }
              ].map((item, i) => {
                const isActive = activeTab === item.name;
                return (
                  <a key={i} href="#" onClick={(e) => { e.preventDefault(); setActiveTab(item.name); }} style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', 
                    borderRadius: '12px', color: isActive ? 'var(--primary-color)' : 'var(--text-main)', 
                    background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    fontWeight: isActive ? 600 : 500, transition: 'all 0.2s'
                  }}>
                    <item.icon size={18} />
                    {item.name}
                    {item.name === 'Requests' && pendingCount > 0 && (
                      <span style={{ marginLeft: 'auto', background: 'var(--error-color)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px' }}>{pendingCount}</span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Artist Dashboard</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your bridal business and portfolio.</p>
            </div>
            <Link to={`/search?artist=${user.id}`} className="btn-outline" style={{ borderRadius: '30px' }}>View Public Profile</Link>
          </div>

          {activeTab === 'Overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                  { title: 'Pending Requests', value: pendingCount, icon: Bell, color: 'var(--warning-color)' },
                  { title: 'Completed Bookings', value: myBookings.filter(b => b.status === 'COMPLETED').length, icon: CheckCircle, color: 'var(--success-color)' },
                  { title: 'Total Earnings', value: `₹${totalEarned.toLocaleString()}`, icon: DollarSign, color: 'var(--primary-color)' }
                ].map((stat, i) => (
                  <motion.div key={i} whileHover={{ y: -5 }} className="glass" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'var(--accent-secondary)', color: stat.color, padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.title}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Recent Activity</h3>
                {myBookings.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No bookings yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {myBookings.slice().reverse().slice(0, 4).map(b => (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{b.brideName} - {b.eventType}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{b.eventDate} • {b.eventPlace}</div>
                        </div>
                        <div style={{ color: b.status === 'PENDING' ? 'var(--warning-color)' : b.status === 'COMPLETED' ? 'var(--success-color)' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                          {b.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'Requests' && (
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Booking Requests</h2>
              {myBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
                  <Bell size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
                  <p>No booking requests yet. Make sure your portfolio is up to date to attract brides!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {myBookings.map((booking, idx) => {
                    const statusColor = booking.status === 'PENDING' ? 'var(--warning-color)' : booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'var(--success-color)' : 'var(--error-color)';
                    return (
                      <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'rgba(0,0,0,0.3)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{booking.eventType}</h3>
                            <div style={{ padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', background: 'var(--accent-secondary)', color: statusColor, border: `1px solid ${statusColor}` }}>{booking.status}</div>
                          </div>
                          <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '1rem' }}>Client: {booking.brideName}</p>
                          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {booking.eventDate || 'TBD'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {booking.eventPlace || 'TBD'}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Total: ₹{booking.totalAmount?.toLocaleString()}</p>
                            <p style={{ margin: 0, color: 'var(--success-color)', fontSize: '0.85rem' }}>Advance Escrow: ₹{booking.advancePaid?.toLocaleString()}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {booking.status === 'PENDING' && (
                              <>
                                <button className="btn-primary" onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Accept</button>
                                <button className="btn-outline" onClick={() => updateBookingStatus(booking.id, 'REJECTED')} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>Reject</button>
                              </>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <button className="btn-primary" onClick={() => updateBookingStatus(booking.id, 'COMPLETED')} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'var(--success-color)' }}>Mark Completed</button>
                            )}
                            <button className="btn-outline" onClick={() => { setActiveTab('Messages'); setChatUser(booking.brideId); }} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Message Client</button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Packages' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>My Packages</h2>
                <button className="btn-primary" onClick={() => setShowAddPackage(!showAddPackage)} style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px' }}>
                  {showAddPackage ? 'Cancel' : <><Plus size={18}/> Add Package</>}
                </button>
              </div>

              {showAddPackage && (
                <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass" onSubmit={handleAddPackage} style={{ padding: '2rem', borderRadius: '24px', marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Create New Package</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Package Title</label>
                      <input type="text" required value={pkgTitle} onChange={e => setPkgTitle(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Price (₹)</label>
                      <input type="number" required value={pkgPrice} onChange={e => setPkgPrice(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Description</label>
                    <textarea required value={pkgDesc} onChange={e => setPkgDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Features (Comma separated)</label>
                    <input type="text" placeholder="e.g. HD Makeup, Hairstyling, Draping" required value={pkgFeatures} onChange={e => setPkgFeatures(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px' }}>Publish Package</button>
                </motion.form>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {myPackages.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
                    <Package size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
                    <p>No packages added yet. Create packages so brides can book you!</p>
                  </div>
                ) : (
                  myPackages.map(pkg => (
                    <div key={pkg.id} className="glass" style={{ padding: '1.5rem', borderRadius: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-color)' }}>{pkg.title}</h4>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{pkg.price.toLocaleString()}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{pkg.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {pkg.features.map((f, i) => (
                          <span key={i} style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--primary-color)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem' }}>{f}</span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'Portfolio' && (
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Portfolio Gallery</h2>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                <button onClick={() => fileInputRef.current.click()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px' }}>
                  <Upload size={18} /> Upload Image
                </button>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>These images will appear on your public profile. High quality before/afters attract more brides!</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                <AnimatePresence>
                  {myPortfolio.map(img => (
                    <motion.div key={img.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} style={{ position: 'relative', paddingBottom: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                      <img src={img.url} alt="Portfolio" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => removePortfolioImage(img.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={16} color="var(--error-color)" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {myPortfolio.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
                    <ImageIcon size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
                    <p>No images uploaded yet. Add some to showcase your work!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Availability' && (
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px', maxWidth: '600px' }}>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Availability Calendar</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Block out dates when you are already booked or unavailable.</p>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input type="date" value={dateToBlock} onChange={e => setDateToBlock(e.target.value)} min={new Date().toISOString().split('T')[0]} className="gold-date-picker" style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
                <button onClick={() => toggleBlockedDate(dateToBlock)} className="btn-primary" style={{ borderRadius: '12px' }}>Block Date</button>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Currently Blocked Dates</h3>
              {myBlockedDates.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>You have no blocked dates. You are available every day!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {myBlockedDates.sort().map(d => (
                    <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(212,175,55,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                      <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} color="var(--primary-color)"/> {new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <button onClick={() => toggleBlockedDate(d)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}><Trash2 size={16}/> Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Messages' && (
            <div className="glass" style={{ display: 'flex', height: '600px', borderRadius: '24px', overflow: 'hidden' }}>
              {/* Contact List */}
              <div style={{ width: '300px', borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}><h3 style={{ margin: 0 }}>Conversations</h3></div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {chatPartners.length === 0 ? (
                    <p style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>No messages yet.</p>
                  ) : (
                    chatPartners.map(partnerId => {
                      const partner = users.find(u => u.id === partnerId);
                      if (!partner) return null;
                      return (
                        <div key={partnerId} onClick={() => { setChatUser(partnerId); markMessagesAsRead(user.id, partnerId); }} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer', background: chatUser === partnerId ? 'rgba(212,175,55,0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{partner.name.charAt(0)}</div>
                          <div style={{ flex: 1, fontWeight: 600 }}>{partner.name}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              
              {/* Chat Area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!chatUser ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <MessageSquare size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <p>Select a conversation to reply</p>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', fontWeight: 600, fontSize: '1.2rem' }}>
                      {users.find(u => u.id === chatUser)?.name}
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {messages.filter(m => (m.senderId === user.id && m.receiverId === chatUser) || (m.senderId === chatUser && m.receiverId === user.id)).map(msg => (
                        <div key={msg.id} style={{ alignSelf: msg.senderId === user.id ? 'flex-end' : 'flex-start', background: msg.senderId === user.id ? 'var(--primary-color)' : 'var(--accent-secondary)', color: msg.senderId === user.id ? '#111' : '#fff', padding: '0.8rem 1.2rem', borderRadius: '16px', maxWidth: '70%' }}>
                          {msg.text}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
                      <input type="text" value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type your reply..." style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
                      <button type="submit" className="btn-primary" style={{ borderRadius: '20px', padding: '0.8rem 1.5rem' }}>Send</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Earnings' && (
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Earnings Dashboard</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--primary-color)' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Released Earnings</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>₹{totalEarned.toLocaleString()}</div>
                </div>
                <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(74, 120, 86, 0.1)', border: '1px solid var(--success-color)' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Advances Held in Escrow</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success-color)' }}>₹{advanceHeld.toLocaleString()}</div>
                </div>
                <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(184, 134, 11, 0.1)', border: '1px solid var(--warning-color)' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pending Payouts (Post-event)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning-color)' }}>₹{pendingPayouts.toLocaleString()}</div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Transaction History</h3>
              {(() => {
                const payments = myBookings.filter(b => b.advancePaid > 0);
                if (payments.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
                      <DollarSign size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
                      <p>No transactions yet. Your earnings will appear here once you complete a booking.</p>
                    </div>
                  );
                }
                return (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                          <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Date</th>
                          <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Txn ID</th>
                          <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Client</th>
                          <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Event</th>
                          <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                          <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Advance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((b, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1rem 0' }}>{b.paymentDate ? new Date(b.paymentDate).toLocaleDateString() : 'N/A'}</td>
                            <td style={{ padding: '1rem 0', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{b.transactionId || 'N/A'}</td>
                            <td style={{ padding: '1rem 0', fontWeight: 600 }}>{b.brideName}</td>
                            <td style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>{b.eventType}</td>
                            <td style={{ padding: '1rem 0', color: b.status === 'REFUNDED' ? 'var(--error-color)' : (b.status === 'COMPLETED' ? 'var(--success-color)' : 'var(--warning-color)') }}>
                              {b.status === 'REFUNDED' ? 'Refunded' : b.status}
                            </td>
                            <td style={{ padding: '1rem 0', color: b.status === 'REFUNDED' ? 'var(--text-muted)' : 'var(--success-color)' }}>
                              <span style={{ textDecoration: b.status === 'REFUNDED' ? 'line-through' : 'none' }}>
                                ₹{b.advancePaid?.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px', maxWidth: '800px' }}>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Profile Settings</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>This information is shown to brides on your public profile.</p>
              
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Display Name / Studio Name</label>
                    <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Location / Service Area</label>
                    <input type="text" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Specialties (Comma separated tags)</label>
                  <input type="text" placeholder="e.g. HD Makeup, Airbrush, Muslim Bridal" value={profileData.specialty} onChange={e => setProfileData({...profileData, specialty: e.target.value})} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Bio / About Me</label>
                  <textarea value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} rows={4} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Years of Experience</label>
                    <input type="number" min="0" value={profileData.experience_years} onChange={e => setProfileData({...profileData, experience_years: parseInt(e.target.value, 10)})} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Instagram Link (Optional)</label>
                    <input type="url" placeholder="https://instagram.com/yourhandle" value={profileData.instagram} onChange={e => setProfileData({...profileData, instagram: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                  </div>
                </div>
                
                <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '30px', alignSelf: 'flex-start', marginTop: '1rem' }}>
                  Save Profile Settings
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </>
  );
};
