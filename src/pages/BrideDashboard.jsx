import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Calendar, Heart, MessageSquare, Settings, LayoutDashboard, ShoppingBag, Bell, ChevronRight, Star, Plus, DollarSign, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { PaymentModal } from '../components/PaymentModal';

export const BrideDashboard = () => {
  const { 
    currentUser: user, users, bookings, shortlists, notifications, messages, 
    updateProfile, toggleShortlist, updateBookingStatus, processPayment, addNewReview, sendMessage, markMessagesAsRead 
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Overview';
  const setActiveTab = (tab) => setSearchParams(prev => { prev.set('tab', tab); return prev; });
  const [newWeddingDate, setNewWeddingDate] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [reviewModal, setReviewModal] = useState(null); // { booking }
  const [chatUser, setChatUser] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [activePaymentBooking, setActivePaymentBooking] = useState(null);

  // Form states for reviews
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const myBookings = bookings.filter(b => b.brideId === user?.id);
  const myShortlist = shortlists.filter(s => s.brideId === user?.id).map(s => users.find(u => u.id === s.artistId)).filter(Boolean);
  const myNotifs = notifications.filter(n => n.userId === user?.id);

  useEffect(() => {
    if (user?.weddingDate) setNewWeddingDate(user.weddingDate);
  }, [user?.weddingDate]);

  const handleUpdateSettings = (e) => {
    e.preventDefault();
    updateProfile(user.id, { weddingDate: newWeddingDate });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const submitReview = (e) => {
    e.preventDefault();
    addNewReview({
      bookingId: reviewModal.id,
      artistId: reviewModal.artistId,
      brideId: user.id,
      rating: reviewRating,
      text: reviewText
    });
    setReviewModal(null);
    setReviewText('');
    setReviewRating(5);
    alert('Thank you for your review!');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    sendMessage(user.id, chatUser, msgText);
    setMsgText('');
  };

  const chatPartners = [...new Set(messages.filter(m => m.senderId === user.id || m.receiverId === user.id).map(m => m.senderId === user.id ? m.receiverId : m.senderId))];

  const generateEventsTimeline = () => {
    if (!user || !user.weddingDate) return [];
    const mainDate = new Date(user.weddingDate);
    const preBridal = new Date(mainDate); preBridal.setDate(preBridal.getDate() - 30);
    const engagement = new Date(mainDate); engagement.setDate(engagement.getDate() - 15);
    const reception = new Date(mainDate); reception.setDate(reception.getDate() + 1);

    const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const checkBooked = (type) => myBookings.find(b => b.eventType?.toLowerCase().includes(type.toLowerCase()) && b.status !== 'CANCELLED');

    return [
      { name: 'Pre-Bridal Session', date: formatDate(preBridal), booked: !!checkBooked('Pre'), artist: checkBooked('Pre')?.artistName },
      { name: 'Engagement', date: formatDate(engagement), booked: myBookings.length > 0 && myBookings[0].status !== 'CANCELLED', artist: myBookings[0]?.artistName },
      { name: 'Wedding Day', date: formatDate(mainDate), booked: !!checkBooked('Wed'), artist: checkBooked('Wed')?.artistName },
      { name: 'Reception', date: formatDate(reception), booked: !!checkBooked('Reception'), artist: checkBooked('Reception')?.artistName }
    ];
  };

  if (!user || user.role !== 'BRIDE') {
    return <div className="container" style={{paddingTop:'150px'}}>Access Denied. Please login as a Client.</div>;
  }

  const upcomingCount = myBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const totalSpent = myBookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0);

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

      <AnimatePresence>
        {reviewModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass" style={{ padding: '2.5rem', width: '400px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Rate {reviewModal.artistName}</h3>
                <button onClick={() => setReviewModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X /></button>
              </div>
              <form onSubmit={submitReview}>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={32} cursor="pointer" onClick={() => setReviewRating(star)} fill={star <= reviewRating ? 'var(--primary-color)' : 'none'} color={star <= reviewRating ? 'var(--primary-color)' : 'var(--text-muted)'} />
                  ))}
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Write a review</label>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} required rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Review</button>
              </form>
            </motion.div>
          </div>
        )}
        {activePaymentBooking && (
          <PaymentModal
            amount={activePaymentBooking.totalAmount * 0.2}
            title={`Pay Advance for ${activePaymentBooking.artistName}`}
            onClose={() => setActivePaymentBooking(null)}
            onSuccess={(txnId) => {
              processPayment(activePaymentBooking.id, txnId, activePaymentBooking.totalAmount * 0.2);
              setActivePaymentBooking(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="container" style={{ paddingTop: '110px', paddingBottom: '4rem', display: 'flex', gap: '2.5rem' }}>
        
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div className="glass" style={{ padding: '2rem 1.5rem', borderRadius: '24px', position: 'sticky', top: '110px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
            <Avatar user={user} size={48} />
            <div>
              <div style={{ fontWeight: 700 }}>{user.name || 'User'}</div>
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

      <main style={{ flex: 1, minWidth: 0 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Hello, {user.name ? user.name.split(' ')[0] : 'User'}</h1>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {[
                { title: 'Total Bookings', value: myBookings.length, icon: ShoppingBag, color: 'var(--primary-color)' },
                { title: 'Upcoming Events', value: upcomingCount, icon: Calendar, color: 'var(--primary-color)' },
                { title: 'Shortlisted Artists', value: myShortlist.length, icon: Heart, color: 'var(--primary-color)' },
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

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>My Bookings</h2>
              <button onClick={() => setActiveTab('My Bookings')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>View All</button>
            </div>
            
            {myBookings.length === 0 ? (
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
                {myBookings.map((booking, idx) => {
                  const statusColor = booking.status === 'PENDING' ? 'var(--warning-color)' : booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'var(--success-color)' : 'var(--error-color)';
                  const artist = users.find(u => u.id === booking.artistId);
                  return (
                    <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <Avatar user={artist} size={90} style={{ borderRadius: '16px' }} />
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
                          <button onClick={() => { setActiveTab('Messages'); setChatUser(booking.artistId); }} className="btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', borderRadius: '20px', background: 'var(--text-main)', color: 'var(--bg-color)', boxShadow: 'none' }}>Message Artist</button>
                          {booking.status === 'PENDING' && <button onClick={() => updateBookingStatus(booking.id, 'CANCELLED')} className="btn-outline" style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', borderRadius: '20px', color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>Cancel</button>}
                          {booking.status === 'COMPLETED' && <button onClick={() => setReviewModal(booking)} className="btn-outline" style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', borderRadius: '20px', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>Write Review</button>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-heading)' }}>Shortlist</h3>
                <button onClick={() => setActiveTab('Shortlist')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>See All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {myShortlist.slice(0, 3).map((artist, i) => (
                  <div key={artist.id} className="glass" style={{ padding: '1rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Avatar user={artist} size={50} style={{ borderRadius: '12px' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{artist.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{artist.specialty} • <Star size={10} fill="var(--primary-color)" color="var(--primary-color)" style={{display:'inline', marginBottom:'-1px'}}/> {artist.average_rating}</div>
                      </div>
                    </div>
                    <Heart size={16} fill="var(--primary-color)" color="var(--primary-color)" onClick={() => toggleShortlist(user.id, artist.id)} style={{ cursor: 'pointer' }} />
                  </div>
                ))}
                {myShortlist.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No artists shortlisted.</p>}
              </div>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Notifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {myNotifs.slice(0, 4).map((notif, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ padding: '0.6rem', background: 'var(--accent-secondary)', color: notif.type === 'success' ? 'var(--success-color)' : notif.type === 'error' ? 'var(--error-color)' : 'var(--primary-color)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                      <Bell size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.2rem', lineHeight: 1.4 }}>{notif.message}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(notif.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
                {myNotifs.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No new notifications.</p>}
              </div>
            </div>
          </div>

        </div>
          </>
        )}

        {activeTab === 'My Bookings' && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>All Bookings</h2>
            {myBookings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You have no bookings yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {myBookings.map((booking, idx) => (
                  <div key={idx} style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '16px', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{booking.artistName} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>- {booking.eventType}</span></div>
                      <div style={{ fontWeight: 600 }}>
                        {booking.status === 'PENDING' && <span style={{ color: 'var(--warning-color)' }}>Awaiting Artist Confirmation</span>}
                        {booking.status === 'PENDING_PAYMENT' && <span style={{ color: 'var(--error-color)' }}>Payment Pending</span>}
                        {booking.status === 'CONFIRMED' && <span style={{ color: 'var(--success-color)' }}>Confirmed</span>}
                        {booking.status === 'COMPLETED' && <span style={{ color: 'var(--success-color)' }}>Completed</span>}
                        {booking.status === 'REJECTED' && <span style={{ color: 'var(--error-color)' }}>Declined</span>}
                        {booking.status === 'REFUNDED' && <span style={{ color: 'var(--error-color)' }}>Refunded</span>}
                        {booking.status === 'CANCELLED' && <span style={{ color: 'var(--error-color)' }}>Cancelled</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      <span>Date: {booking.eventDate || 'TBD'}</span>
                      <span>Total: ₹{booking.totalAmount?.toLocaleString()}</span>
                    </div>

                    {booking.status === 'PENDING_PAYMENT' && (
                      <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button 
                          className="btn-primary" 
                          onClick={() => setActivePaymentBooking(booking)}
                          style={{ padding: '0.6rem 1.5rem', borderRadius: '30px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <DollarSign size={16} /> Pay Advance (₹{(booking.totalAmount * 0.2).toLocaleString()})
                        </button>
                      </div>
                    )}

                    {booking.status === 'REFUNDED' && (
                      <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,50,50,0.1)', color: 'var(--error-color)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <X size={16} /> Booking declined by artist. Refund of ₹{booking.advancePaid?.toLocaleString()} processed.
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {booking.status === 'PENDING' && <button onClick={() => updateBookingStatus(booking.id, 'CANCELLED')} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Cancel</button>}
                      {booking.status === 'COMPLETED' && <button onClick={() => setReviewModal(booking)} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Write Review</button>}
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
            {myShortlist.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Your shortlist is empty. Heart artists to add them here.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {myShortlist.map((artist, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '16px', textAlign: 'center', position: 'relative' }}>
                    <button onClick={() => toggleShortlist(user.id, artist.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}><Heart fill="var(--primary-color)" color="var(--primary-color)" size={20}/></button>
                    <Avatar user={artist} size={80} style={{ borderRadius: '50%', marginBottom: '1rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{artist.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{artist.specialty}</div>
                    <Link to={`/search?artist=${artist.id}`} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '20px' }}>View Profile</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Messages' && (
          <div className="glass" style={{ display: 'flex', height: '600px', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ width: '300px', borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}><h3 style={{ margin: 0 }}>Conversations</h3></div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {chatPartners.length === 0 ? (
                  <p style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>No messages yet. Book an artist or start a chat from their profile.</p>
                ) : (
                  chatPartners.map(partnerId => {
                    const partner = users.find(u => u.id === partnerId);
                    if (!partner) return null;
                    return (
                      <div 
                        key={partnerId} 
                        onClick={() => { setChatUser(partnerId); markMessagesAsRead(user.id, partnerId); }}
                        style={{ 
                          padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer', 
                          background: chatUser === partnerId ? 'rgba(212,175,55,0.1)' : 'transparent',
                          display: 'flex', alignItems: 'center', gap: '1rem'
                        }}
                      >
                        <Avatar user={partner} size={40} />
                        <div style={{ flex: 1, fontWeight: 600 }}>{partner.name}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {!chatUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p>Select a conversation to view messages</p>
                </div>
              ) : (() => {
                  const artist = users.find(a => a.id === chatUser);
                  return (
                    <>
                      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Avatar user={artist} size={48} />
                        <h3 style={{ margin: 0 }}>{artist?.name}</h3>
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.filter(m => (m.senderId === user.id && m.receiverId === chatUser) || (m.senderId === chatUser && m.receiverId === user.id)).map(msg => (
                          <div key={msg.id} style={{ alignSelf: msg.senderId === user.id ? 'flex-end' : 'flex-start', background: msg.senderId === user.id ? 'var(--primary-color)' : 'var(--accent-secondary)', color: msg.senderId === user.id ? '#111' : '#fff', padding: '0.8rem 1.2rem', borderRadius: '16px', maxWidth: '70%' }}>
                            {msg.text}
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
                        <input type="text" value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type your message..." style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
                        <button type="submit" className="btn-primary" style={{ borderRadius: '20px', padding: '0.8rem 1.5rem' }}>Send</button>
                      </form>
                    </>
                  );
                })()}
            </div>
          </div>
        )}

        {activeTab === 'Payments' && (() => {
          const payments = myBookings.filter(b => b.advancePaid > 0);
          return (
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Payment History</h3>
              {payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <DollarSign size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p>No payments yet. Book an artist to get started.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '1rem' }}>Date</th>
                        <th style={{ padding: '1rem' }}>Txn ID</th>
                        <th style={{ padding: '1rem' }}>Artist</th>
                        <th style={{ padding: '1rem' }}>Event</th>
                        <th style={{ padding: '1rem' }}>Total</th>
                        <th style={{ padding: '1rem' }}>Advance Paid</th>
                        <th style={{ padding: '1rem' }}>Pending</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(payment => (
                        <tr key={payment.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '1rem' }}>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</td>
                          <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{payment.transactionId || 'N/A'}</td>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{payment.artistName}</td>
                          <td style={{ padding: '1rem' }}>{payment.eventType}</td>
                          <td style={{ padding: '1rem' }}>₹{payment.totalAmount?.toLocaleString()}</td>
                          <td style={{ padding: '1rem', color: payment.status === 'REFUNDED' ? 'var(--text-muted)' : 'var(--primary-color)' }}>
                            <span style={{ textDecoration: payment.status === 'REFUNDED' ? 'line-through' : 'none' }}>
                              ₹{payment.advancePaid?.toLocaleString()}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>₹{(payment.totalAmount - payment.advancePaid).toLocaleString()}</td>
                          <td style={{ padding: '1rem' }}>
                            {payment.status === 'REFUNDED' ? (
                              <span style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: 'rgba(255,50,50,0.1)', color: 'var(--error-color)', borderRadius: '20px', fontSize: '0.85rem' }}>Refunded</span>
                            ) : (
                              <span style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', borderRadius: '20px', fontSize: '0.85rem' }}>Advance Paid</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}

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
