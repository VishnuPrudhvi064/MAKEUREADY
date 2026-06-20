import { useState, useEffect } from 'react';
import { getBookingsForUser, getCurrentUser, getFromStorage, updateUser } from '../storage';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Calendar, Heart, MessageSquare, Settings, LayoutDashboard, ShoppingBag, Bell, ChevronRight, Star, Plus, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BrideDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [user, setUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState('Overview');
  const [newWeddingDate, setNewWeddingDate] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const userBookings = getBookingsForUser(user.id, 'BRIDE');
      setBookings(userBookings);
      
      const allUsers = getFromStorage('users') || [];
      const artists = allUsers.filter(u => u.role === 'ARTIST');
      // Mock shortlist based on some top artists
      setShortlist(artists.slice(0, 3));
      
      if (user.weddingDate) setNewWeddingDate(user.weddingDate);
    }
  }, [user?.id]);

  const handleUpdateSettings = (e) => {
    e.preventDefault();
    updateUser(user.id, { weddingDate: newWeddingDate });
    setUser(getCurrentUser());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const generateEventsTimeline = () => {
    if (!user || !user.weddingDate) return [];
    const mainDate = new Date(user.weddingDate);
    const preBridal = new Date(mainDate); preBridal.setDate(preBridal.getDate() - 30);
    const engagement = new Date(mainDate); engagement.setDate(engagement.getDate() - 15);
    const reception = new Date(mainDate); reception.setDate(reception.getDate() + 1);

    const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const checkBooked = (type) => bookings.find(b => b.eventType?.toLowerCase().includes(type.toLowerCase()));

    return [
      { name: 'Pre-Bridal Session', date: formatDate(preBridal), booked: !!checkBooked('Pre'), artist: checkBooked('Pre')?.artistName },
      { name: 'Engagement', date: formatDate(engagement), booked: bookings.length > 0, artist: bookings[0]?.artistName },
      { name: 'Wedding Day', date: formatDate(mainDate), booked: !!checkBooked('Wed'), artist: checkBooked('Wed')?.artistName },
      { name: 'Reception', date: formatDate(reception), booked: !!checkBooked('Reception'), artist: checkBooked('Reception')?.artistName }
    ];
  };

  const getPremiumAvatar = (url) => {
    if (url && url.includes('ui-avatars.com')) {
      return url.replace(/background=[a-zA-Z0-9]+/, 'background=1a1a1a').replace(/color=[a-zA-Z0-9]+/, 'color=d4af37');
    }
    return url || `https://ui-avatars.com/api/?name=Artist&background=1a1a1a&color=d4af37&size=150`;
  };

  if (!user || user.role !== 'BRIDE') {
    return <div className="container" style={{paddingTop:'150px'}}>Access Denied. Please login as a Bride.</div>;
  }

  const upcomingCount = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const totalSpent = bookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0);

  return (
    <>
      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, x: '-50%' }} 
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{ 
              position: 'fixed', 
              top: '40px', 
              left: '50%', 
              zIndex: 9999, 
              background: 'rgba(212, 175, 55, 0.85)', 
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#1A0E10', 
              padding: '1rem 2rem', 
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
            }}
          >
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#1A0E10', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
            Settings saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container" style={{ paddingTop: '110px', paddingBottom: '4rem', display: 'flex', gap: '2.5rem' }}>
        
        {/* SIDEBAR */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div className="glass" style={{ padding: '2rem 1.5rem', borderRadius: '24px', position: 'sticky', top: '110px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-secondary)', border: '1px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bride-to-be</div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { name: 'Overview', icon: LayoutDashboard },
              { name: 'My Bookings', icon: ShoppingBag },
              { name: 'Shortlist', icon: Heart },
              { name: 'Messages', icon: MessageSquare },
              { name: 'Payments', icon: DollarSign },
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
                </a>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, minWidth: 0 }}>
        
        {/* HEADER AREA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Hello, {user.name.split(' ')[0]}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Welcome to your bridal planning hub.</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {user.weddingDate ? (
              <div className="glass" style={{ padding: '0.75rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.2)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary-color)' }}><Calendar size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Wedding Countdown</div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.2rem' }}>
                    {Math.max(0, Math.ceil((new Date(user.weddingDate) - new Date()) / (1000 * 60 * 60 * 24)))} Days to Go
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => setActiveTab('Settings')} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '16px', padding: '0.75rem 1.5rem', border: '1px dashed var(--primary-color)' }}>
                <Calendar size={20} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Set Your Wedding Date</span>
              </button>
            )}
            <Link to="/search" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px' }}><Plus size={18} /> Book New Artist</Link>
          </div>
        </div>

        {activeTab === 'Overview' && (
          <>
            {/* STATS OVERVIEW ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {[
                { title: 'Total Bookings', value: bookings.length, icon: ShoppingBag, color: 'var(--primary-color)' },
                { title: 'Upcoming Events', value: upcomingCount, icon: Calendar, color: 'var(--primary-color)' },
                { title: 'Shortlisted Artists', value: shortlist.length, icon: Heart, color: 'var(--primary-color)' },
                { title: 'Advance Paid', value: `₹${totalSpent.toLocaleString()}`, icon: DollarSign, color: 'var(--primary-color)' }
              ].map((stat, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="glass" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
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

            {/* MY EVENTS TIMELINE */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>My Events Timeline</h2>
              </div>
              {!user.weddingDate ? (
                 <div className="glass" style={{ padding: '3rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
                   <Calendar size={48} color="var(--primary-color)" style={{ opacity: 0.5, margin: '0 auto 1rem auto' }} />
                   <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Set your wedding date to generate your timeline</h3>
                   <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>We'll automatically create a timeline for your pre-bridal, engagement, and main events.</p>
                   <button onClick={() => setActiveTab('Settings')} className="btn-primary" style={{ borderRadius: '30px', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>Set Wedding Date</button>
                 </div>
              ) : (
                <div className="hide-scrollbar" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                  {generateEventsTimeline().map((ev, i) => (
                    <div key={i} className="glass" style={{ minWidth: '240px', padding: '1.5rem', borderRadius: '20px', borderTop: `4px solid ${ev.booked ? 'var(--success-color)' : 'var(--warning-color)'}` }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{ev.date}</div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{ev.name}</h3>
                      {ev.booked && ev.artist ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                          <div style={{ width: '24px', height: '24px', background: 'var(--primary-color)', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{ev.artist.charAt(0)}</div>
                          <span style={{ fontWeight: 600 }}>{ev.artist}</span>
                        </div>
                      ) : (
                        <Link to="/search" className="btn-outline" style={{ display: 'inline-block', padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '12px' }}>Book Artist</Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>



        {/* TWO COLUMN GRID FOR BOOKINGS & PANELS */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* LEFT COL: MY BOOKINGS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>My Bookings</h2>
              <Link to="/search" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 600 }}>View All</Link>
            </div>
            
            {bookings.length === 0 ? (
              <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--primary-color)' }}>
                  <ShoppingBag size={40} />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Artists Booked Yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '350px', margin: '0 auto 2rem auto' }}>You haven't booked any artists for your upcoming events. Start exploring our curated list of professionals.</p>
                <Link to="/search" className="btn-primary" style={{ borderRadius: '30px' }}>Browse Artists</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {bookings.map((booking, idx) => {
                  // For the mock, we don't have artistId easily populated with photo in storage by default, so we'll pass a default UI avatar if needed.
                  const statusColor = booking.status === 'PENDING' ? 'var(--warning-color)' : booking.status === 'CONFIRMED' ? 'var(--success-color)' : 'var(--error-color)';
                  const artistInitials = booking.artistName ? booking.artistName.charAt(0) : 'A';

                  return (
                    <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <div style={{ width: '90px', height: '90px', borderRadius: '16px', background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '2rem', fontWeight: 'bold' }}>
                        {artistInitials}
                      </div>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', marginBottom: '0.2rem' }}>{booking.artistName || 'Professional Artist'}</h3>
                            <div style={{ color: 'var(--primary-color)', fontSize: '0.95rem', fontWeight: 600 }}>{booking.eventType}</div>
                          </div>
                          <div style={{ padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'var(--accent-secondary)', color: statusColor, border: `1px solid ${statusColor}` }}>
                            {booking.status}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {booking.eventDate || 'TBD'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {booking.eventPlace || 'TBD'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-main)' }}><DollarSign size={14} /> Total: ₹{booking.totalAmount?.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <button className="btn-outline" style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', borderRadius: '20px' }}>View Details</button>
                          <button className="btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', borderRadius: '20px', background: 'var(--text-main)', color: 'var(--bg-color)', boxShadow: 'none' }}>Message Artist</button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COL: PANELS */}
          <div>
            {/* Shortlisted Artists */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-heading)' }}>Shortlist</h3>
                <Link to="/search" style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600 }}>See All</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {shortlist.map((artist, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                    <img src={getPremiumAvatar(artist.profileImage)} style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }} alt={artist.name} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{artist.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{artist.specialty} • <Star size={10} fill="var(--primary-color)" color="var(--primary-color)" style={{display:'inline', marginBottom:'-1px'}}/> {artist.average_rating}</div>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Notifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {[
                  { text: 'Priya Sharma confirmed your booking for Engagement.', time: '2 hours ago', icon: Bell, color: 'var(--success-color)' },
                  { text: 'New message from Zoya Khan regarding venue details.', time: '5 hours ago', icon: MessageSquare, color: 'var(--primary-color)' },
                  { text: 'Reminder: Advance payment due for Nail Art session.', time: '1 day ago', icon: Clock, color: 'var(--warning-color)' }
                ].map((notif, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ padding: '0.6rem', background: 'var(--accent-secondary)', color: notif.color, borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                      <notif.icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.2rem', lineHeight: 1.4 }}>{notif.text}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notif.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
          </>
        )}

        {/* OTHER TABS */}
        {activeTab === 'My Bookings' && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>All Bookings</h2>
            {bookings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You have no bookings yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {bookings.map((booking, idx) => (
                  <div key={idx} style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '16px', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{booking.artistName} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>- {booking.eventType}</span></div>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <span>Date: {booking.eventDate || 'TBD'}</span>
                      <span>Total: ₹{booking.totalAmount?.toLocaleString()}</span>
                      <span style={{ color: 'var(--primary-color)' }}>Status: {booking.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Shortlist' && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>My Shortlist</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {shortlist.map((artist, idx) => (
                <div key={idx} style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '16px', textAlign: 'center' }}>
                  <img src={artist.profileImage} alt={artist.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{artist.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{artist.specialty}</div>
                  <button className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '20px' }}>View Profile</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Messages' && (
          <div className="glass" style={{ padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center' }}>
            <MessageSquare size={48} color="var(--primary-color)" style={{ opacity: 0.5, margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Your Inbox</h2>
            <p style={{ color: 'var(--text-muted)' }}>You have no new messages. Reach out to an artist to start planning!</p>
            <Link to="/search" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem', borderRadius: '30px' }}>Browse Artists</Link>
          </div>
        )}

        {activeTab === 'Payments' && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Payment History</h2>
            {bookings.length === 0 ? (
               <p style={{ color: 'var(--text-muted)' }}>No payment history available.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Artist</th>
                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Event</th>
                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Total</th>
                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Advance Paid</th>
                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem 0', fontWeight: 600 }}>{b.artistName}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>{b.eventType}</td>
                      <td style={{ padding: '1rem 0' }}>₹{b.totalAmount?.toLocaleString()}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--success-color)' }}>₹{b.advancePaid?.toLocaleString()}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--warning-color)' }}>₹{(b.totalAmount - (b.advancePaid || 0)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Profile Settings</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Update your personal details and wedding information.</p>
            
            <form onSubmit={handleUpdateSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input type="text" value={user.name} disabled style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                <input type="email" value={user.email} disabled style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Wedding Date</label>
                <input 
                  type="date" 
                  value={newWeddingDate} 
                  onChange={(e) => setNewWeddingDate(e.target.value)} 
                  min={new Date().toISOString().split("T")[0]}
                  className="gold-date-picker"
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--primary-color)', color: 'var(--text-main)', outline: 'none' }} 
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--primary-color)', marginTop: '0.5rem' }}>Setting your date unlocks the countdown and timeline planner.</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '30px' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
    </>
  );
};
