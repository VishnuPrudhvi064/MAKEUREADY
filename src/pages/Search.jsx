import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, MapPin, Briefcase, ChevronRight, Search as SearchIcon, ShieldCheck, Lock, Calendar, Clock, Heart, Edit, Image as ImageIcon, Plus, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../components/Avatar';
import { PaymentModal } from '../components/PaymentModal';

const CustomDatePicker = ({ selectedDate, onChange, blockedDates }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay, year, month };
  };

  const { days, firstDay, year, month } = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0,0,0,0);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button type="button" onClick={prevMonth} className="btn-outline" style={{ padding: '0.2rem 0.5rem' }}>&lt;</button>
        <span style={{ fontWeight: 600 }}>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button type="button" onClick={nextMonth} className="btn-outline" style={{ padding: '0.2rem 0.5rem' }}>&gt;</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.2rem', textAlign: 'center' }}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d}</div>)}
        {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
        {[...Array(days)].map((_, i) => {
          const date = new Date(year, month, i + 1);
          const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i+1).padStart(2,'0')}`;
          const isPast = date < today;
          const isBlocked = blockedDates.includes(dateStr);
          const isSelected = selectedDate === dateStr;
          const disabled = isPast || isBlocked;
          
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(dateStr)}
              style={{
                padding: '0.5rem 0',
                border: 'none',
                background: isSelected ? 'var(--primary-color)' : 'transparent',
                color: isSelected ? '#111' : disabled ? 'rgba(255,255,255,0.2)' : 'var(--text-main)',
                borderRadius: '8px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontWeight: isSelected ? 700 : 400,
                textDecoration: isBlocked ? 'line-through' : 'none'
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const BookingDetailsModal = ({ pkg, artist, onClose, onSuccess }) => {
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventPlace, setEventPlace] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess({ eventDate, eventTime, eventPlace });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ width: '450px', padding: '2.5rem', background: 'var(--card-bg)', borderRadius: '24px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>Event Details</h3>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Please provide details for {artist.name}</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}><Calendar size={16} style={{display:'inline', marginRight:'0.5rem'}}/>Event Date</label>
            <CustomDatePicker 
              selectedDate={eventDate}
              onChange={setEventDate}
              blockedDates={artist.blockedDates || []}
            />
            {eventDate && <p style={{ color: 'var(--primary-color)', marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Selected: {eventDate}</p>}
            {!eventDate && <p style={{ color: 'var(--error-color)', marginTop: '0.5rem', fontSize: '0.8rem' }}>Please select a valid date</p>}
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}><Clock size={16} style={{display:'inline', marginRight:'0.5rem'}}/>Event Time</label>
            <input type="time" required value={eventTime} onChange={e => setEventTime(e.target.value)} className="gold-date-picker" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}><MapPin size={16} style={{display:'inline', marginRight:'0.5rem'}}/>Venue / Place</label>
            <input type="text" placeholder="e.g. Taj Palace, Chanakyapuri" required value={eventPlace} onChange={e => setEventPlace(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1, padding: '0.8rem', borderRadius: '30px' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.8rem', borderRadius: '30px' }}>Continue</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const Search = () => {
  const { currentUser: user, users, packages, shortlists, toggleShortlist, addBooking, processPayment, reviews } = useApp();
  const allArtists = users.filter(u => u.role === 'ARTIST');
  
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingModal, setBookingModal] = useState(null);
  const [activePaymentBooking, setActivePaymentBooking] = useState(null); // { booking, pkg }
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isOwnerView = user && selectedArtist && user.id === selectedArtist.id;

  useEffect(() => {
    const artistId = searchParams.get('artist');
    if (artistId && users.length > 0) {
      const artist = allArtists.find(a => a.id === artistId);
      if (artist) setSelectedArtist(artist);
    }
  }, [searchParams, users]);

  const handleArtistClick = (artist) => {
    if (!user) {
      navigate('/login');
    } else {
      setSelectedArtist(artist);
    }
  };
  
  // Filter & Pagination State
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterSpecialty, setFilterSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState('Popularity');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const locations = ['All', ...new Set(allArtists.map(a => a.location))];
  const specialties = ['All', ...new Set(allArtists.map(a => a.specialty))];

  let filteredArtists = allArtists.filter(a => 
    (a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
     a.specialty.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterLocation === 'All' || a.location === filterLocation) &&
    (filterSpecialty === 'All' || a.specialty === filterSpecialty)
  );

  filteredArtists.sort((a, b) => {
    if (sortBy === 'Rating') return b.average_rating - a.average_rating;
    if (sortBy === 'Experience') return b.experience_years - a.experience_years;
    if (sortBy === 'Popularity') return b.reviews_count - a.reviews_count;
    return 0;
  });

  const paginatedArtists = filteredArtists.slice(0, page * perPage);

  const handleInitiateBooking = (pkg, artist) => {
    if (!user || user.role !== 'BRIDE') {
      alert("Please login as a Client to book this package.");
      return;
    }
    setBookingModal({ pkg, artist });
  };

  const handleBookingDetailsSuccess = ({ eventDate, eventTime, eventPlace }) => {
    const { pkg } = bookingModal;
    const newBooking = addBooking({
      brideId: user.id,
      brideName: user.name,
      artistId: pkg.artistId,
      artistName: selectedArtist.name,
      packageId: pkg.id,
      eventDate,
      eventTime,
      eventPlace,
      eventType: pkg.title,
      totalAmount: pkg.price,
      status: 'PENDING_PAYMENT'
    });
    setBookingModal(null);
    setActivePaymentBooking({ booking: newBooking, pkg });
  };

  const handlePaymentSuccess = (txnId) => {
    const { booking, pkg } = activePaymentBooking;
    processPayment(booking.id, txnId, pkg.price * 0.2);
    setActivePaymentBooking(null);
    alert(`Payment successful! Booking request for ${pkg.title} sent to the artist.`);
    setSelectedArtist(null);
  };

  const isShortlisted = (artistId) => {
    return user && shortlists.find(s => s.brideId === user.id && s.artistId === artistId);
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      
      <AnimatePresence>
        {bookingModal && (
          <BookingDetailsModal 
            pkg={bookingModal.pkg} 
            artist={bookingModal.artist}
            onClose={() => setBookingModal(null)}
            onSuccess={handleBookingDetailsSuccess}
          />
        )}
        {activePaymentBooking && (
          <PaymentModal
            amount={activePaymentBooking.pkg.price * 0.2}
            title={`Pay Advance for ${selectedArtist.name}`}
            onClose={() => {
              setActivePaymentBooking(null);
              alert('Payment cancelled. Your booking is saved in your dashboard under "Pending Payment".');
            }}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>

      {!selectedArtist ? (
        <>
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Discover <span className="text-gradient">Artists</span></h1>
            
            <div style={{ position: 'relative', width: '100%', marginBottom: '1.5rem' }}>
              <SearchIcon size={22} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search by name, location, or specialty..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                style={{ 
                  width: '100%', padding: '1.2rem 1.2rem 1.2rem 4rem', borderRadius: '30px', 
                  border: '1px solid var(--glass-border)', background: 'var(--card-bg)', 
                  color: 'var(--text-main)', fontSize: '1.1rem', outline: 'none',
                  boxShadow: 'var(--glass-shadow)', transition: 'all 0.3s'
                }} 
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select 
                  value={filterLocation} onChange={e => { setFilterLocation(e.target.value); setPage(1); }}
                  className="glass" style={{ padding: '0.6rem 1.2rem', borderRadius: '20px', border: '1px solid var(--glass-border)', color: 'var(--text-main)', background: 'var(--card-bg)', cursor: 'pointer', outline: 'none', fontWeight: 500 }}>
                  <option value="All">All Locations</option>
                  {locations.filter(l => l !== 'All').map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select 
                  value={filterSpecialty} onChange={e => { setFilterSpecialty(e.target.value); setPage(1); }}
                  className="glass" style={{ padding: '0.6rem 1.2rem', borderRadius: '20px', border: '1px solid var(--glass-border)', color: 'var(--text-main)', background: 'var(--card-bg)', cursor: 'pointer', outline: 'none', fontWeight: 500 }}>
                  <option value="All">All Specialties</option>
                  {specialties.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1rem' }}>
                  {filteredArtists.length} Artists Found
                </span>
                <select 
                  value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="glass" style={{ padding: '0.6rem 1.2rem', borderRadius: '20px', border: '1px solid var(--glass-border)', color: 'var(--text-main)', background: 'var(--card-bg)', cursor: 'pointer', outline: 'none', fontWeight: 500 }}>
                  <option value="Popularity">Sort by Popularity</option>
                  <option value="Rating">Sort by Rating</option>
                  <option value="Experience">Sort by Experience</option>
                </select>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {paginatedArtists.map((artist, idx) => (
              <motion.div 
                key={artist.id} 
                className="glass" 
                initial="rest"
                animate="rest"
                whileHover="hover"
                variants={{
                  rest: { y: 0, scale: 1, boxShadow: 'var(--glass-shadow)', borderColor: 'var(--glass-border)' },
                  hover: { y: -5, scale: 1.02, boxShadow: '0 15px 35px rgba(212, 175, 55, 0.2)', borderColor: 'var(--primary-color)' }
                }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '24px' }}
                onClick={() => handleArtistClick(artist)}
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-secondary)' }}>
                    <Avatar user={artist} size={150} style={{ border: 'none' }} />
                  </div>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--accent-secondary)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, backdropFilter: 'blur(5px)', letterSpacing: '0.5px' }}>
                    {(artist.specialty || '').split(',')[0].trim()}
                  </div>
                  {user && user.role === 'BRIDE' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleShortlist(user.id, artist.id); }}
                      style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--card-bg)', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                    >
                      <Heart size={20} fill={isShortlisted(artist.id) ? 'var(--primary-color)' : 'none'} color={isShortlisted(artist.id) ? 'var(--primary-color)' : 'var(--text-main)'} />
                    </button>
                  )}
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{artist.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', background: 'rgba(212, 175, 55, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                      <Star size={14} fill="var(--primary-color)" />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{artist.average_rating}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14}/> {artist.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={14}/> {artist.experience_years} Years</span>
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <button className="btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', borderRadius: '30px' }}>
                      View Profile <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredArtists.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                No artists found matching your search.
              </div>
            )}
          </div>
          
          {filteredArtists.length > paginatedArtists.length && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="btn-primary" onClick={() => setPage(p => p + 1)} style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}>
                Load More Artists
              </button>
            </div>
          )}
        </>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <button onClick={() => setSelectedArtist(null)} style={{ background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>
              ← Back to Search
            </button>
            {isOwnerView && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--warning-color)', fontSize: '0.9rem', fontWeight: 600 }}>Previewing as Bride</span>
                <Link to="/artist?tab=Settings" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                  <Edit size={16} /> Edit Profile
                </Link>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              {selectedArtist.portfolio && selectedArtist.portfolio.length > 0 ? (
                <img src={selectedArtist.portfolio[0].url} alt="Hero Portfolio" style={{ width: '100%', borderRadius: '24px', marginBottom: '2rem', maxHeight: '500px', objectFit: 'cover', boxShadow: 'var(--glass-shadow)' }} />
              ) : (
                <div style={{ width: '100%', height: '300px', borderRadius: '24px', marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p>No portfolio images yet</p>
                  {isOwnerView && (
                    <Link to="/artist?tab=Portfolio" className="btn-outline" style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Plus size={16} /> Upload Photos
                    </Link>
                  )}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {(selectedArtist.specialty || '').split(',').map((spec, i) => (
                  <span key={i} style={{ display: 'inline-block', background: 'var(--accent-secondary)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600, border: '1px solid var(--glass-border)' }}>
                    {spec.trim()}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {/* Left Side: Avatar + Name & Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                  <Avatar user={selectedArtist} size={64} style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ 
                      fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
                      margin: 0, 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      lineHeight: '1.2'
                    }} title={selectedArtist.name}>
                      {selectedArtist.name}
                    </h2>
                    <div style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                      {selectedArtist.reviews_count > 0 ? `⭐ ${selectedArtist.average_rating} (${selectedArtist.reviews_count} Reviews)` : 'No ratings yet (New Artist)'}
                    </div>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexShrink: 0, flexWrap: 'wrap' }}>
                  {selectedArtist.instagram && (
                    <a href={selectedArtist.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '20px' }}>Instagram</a>
                  )}
                  {!isOwnerView && user && user.role === 'BRIDE' && (
                    <>
                      <button
                        onClick={() => toggleShortlist(user.id, selectedArtist.id)}
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        title="Shortlist Artist"
                        className="glass"
                      >
                        <Heart size={20} fill={isShortlisted(selectedArtist.id) ? 'var(--primary-color)' : 'none'} color={isShortlisted(selectedArtist.id) ? 'var(--primary-color)' : 'var(--text-main)'} />
                      </button>
                      <Link
                        to={`/bride?tab=Messages&chat=${selectedArtist.id}`}
                        className="btn-primary"
                        style={{ padding: '0.6rem 1.2rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.9rem' }}
                      >
                        <MessageSquare size={18} /> Message Artist
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>{selectedArtist.bio}</p>
              
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Client Reviews</h3>
                {reviews.filter(r => r.artistId === selectedArtist.id).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {reviews.filter(r => r.artistId === selectedArtist.id).map(review => {
                      const reviewer = users.find(u => u.id === review.brideId);
                      return (
                        <div key={review.id} className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600 }}>{reviewer?.name || 'Verified Bride'}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(review.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? 'var(--primary-color)' : 'none'} color="var(--primary-color)" />
                            ))}
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.5 }}>{review.text}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Portfolio Gallery</h3>
                {(!selectedArtist.portfolio || selectedArtist.portfolio.length === 0) ? (
                  <p style={{ color: 'var(--text-muted)' }}>No portfolio images uploaded yet.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                    {selectedArtist.portfolio.map(img => (
                      <div key={img.id} style={{ position: 'relative', paddingBottom: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                        <img src={img.url} alt="Portfolio work" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ flex: '1 1 500px' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Service Packages</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {packages.filter(p => p.artistId === selectedArtist.id).map(pkg => (
                  <div key={pkg.id} className="glass" style={{ padding: '2rem', borderRadius: '24px', transition: 'all 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1.5rem', margin: 0 }}>{pkg.title}</h4>
                      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>₹{pkg.price.toLocaleString()}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>{pkg.description}</p>
                    <ul style={{ marginBottom: '2rem', paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                      {pkg.features.map((feat, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{feat}</li>)}
                    </ul>
                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem 1.5rem', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontWeight: 500 }}>Advance Required (20%):</span>
                      <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>₹{(pkg.price * 0.2).toLocaleString()}</span>
                    </div>
                    {isOwnerView ? (
                      <Link to="/artist?tab=Packages" className="btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.05rem', borderRadius: '30px' }}>
                        <Edit size={20} /> Edit Package
                      </Link>
                    ) : (
                      <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.05rem' }} onClick={() => handleInitiateBooking(pkg, selectedArtist)}>
                        <ShieldCheck size={20} /> Enter Details & Book
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

