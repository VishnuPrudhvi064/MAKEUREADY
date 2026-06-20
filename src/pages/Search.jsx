import { useState, useEffect } from 'react';
import { getFromStorage, createBooking, getCurrentUser } from '../storage';
import { Star, MapPin, Briefcase, ChevronRight, Search as SearchIcon, ShieldCheck, Lock, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentModal = ({ pkg, artist, onClose, onSuccess }) => {
  // Steps: 0 = Form, 1 = Generating, 2 = Locking, 3 = Success
  const [step, setStep] = useState(0);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventPlace, setEventPlace] = useState('');

  const handleStartEscrow = (e) => {
    e.preventDefault();
    setStep(1);
  };

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 2000);
      return () => clearTimeout(timer);
    } else if (step === 2) {
      const timer = setTimeout(() => setStep(3), 2500);
      return () => clearTimeout(timer);
    } else if (step === 3) {
      const timer = setTimeout(() => {
        onSuccess({ eventDate, eventTime, eventPlace });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, onSuccess, eventDate, eventTime, eventPlace]);

  const advanceAmount = pkg.price * 0.2;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ width: '450px', padding: '2.5rem', background: 'var(--card-bg)' }}>
        
        {step === 0 ? (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>Event Details</h3>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Please provide details for {artist.name}</p>
            
            <form onSubmit={handleStartEscrow}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}><Calendar size={16} style={{display:'inline', marginRight:'0.5rem'}}/>Event Date</label>
                <input type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}><Clock size={16} style={{display:'inline', marginRight:'0.5rem'}}/>Event Time</label>
                <input type="time" required value={eventTime} onChange={e => setEventTime(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}><MapPin size={16} style={{display:'inline', marginRight:'0.5rem'}}/>Venue / Place</label>
                <input type="text" placeholder="e.g. Taj Palace, Chanakyapuri" required value={eventPlace} onChange={e => setEventPlace(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18}/> Proceed to Pay</button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <ShieldCheck size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Enterprise Escrow Vault</h3>
            
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p style={{ color: 'var(--text-muted)' }}>Generating Secure Smart Contract for {artist.name}...</p>
                <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '1.5rem' }}>
                  <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2 }} style={{ height: '100%', background: 'var(--primary-color)' }} />
                </div>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Lock size={32} color="var(--warning-color)" style={{ margin: '0 auto 1rem auto' }} />
                <p style={{ color: 'var(--text-main)', fontWeight: 600 }}>Locking Advance: ₹{advanceAmount.toLocaleString()}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Funds are held securely in escrow until service completion.</p>
                <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '1.5rem' }}>
                  <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.5 }} style={{ height: '100%', background: 'var(--warning-color)' }} />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--success-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '2rem' }}>✓</div>
                <p style={{ color: 'var(--success-color)', fontWeight: 600, fontSize: '1.2rem' }}>Escrow Locked & Booked!</p>
              </motion.div>
            )}
          </div>
        )}

      </motion.div>
    </div>
  );
};

export const Search = () => {
  const [allArtists, setAllArtists] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentModal, setPaymentModal] = useState(null);
  
  // New Filter & Pagination State
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterSpecialty, setFilterSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState('Popularity');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const user = getCurrentUser();

  useEffect(() => {
    const allUsers = getFromStorage('users');
    setAllArtists(allUsers.filter(u => u.role === 'ARTIST'));
    setPackages(getFromStorage('packages'));
  }, []);

  // Standardize avatars to look premium instead of random colors
  const getPremiumAvatar = (url) => {
    if (url && url.includes('ui-avatars.com')) {
      return url.replace(/background=[a-zA-Z0-9]+/, 'background=1a1a1a').replace(/color=[a-zA-Z0-9]+/, 'color=d4af37');
    }
    return url;
  };

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
    setPaymentModal({ pkg, artist });
  };

  const handlePaymentSuccess = ({ eventDate, eventTime, eventPlace }) => {
    const { pkg } = paymentModal;
    createBooking({
      brideId: user.id,
      brideName: user.name,
      artistId: pkg.artistId,
      packageId: pkg.id,
      eventDate,
      eventTime,
      eventPlace,
      eventType: pkg.title,
      totalAmount: pkg.price,
      advancePaid: pkg.price * 0.2
    });
    setPaymentModal(null);
    alert(`Successfully requested booking for ${pkg.title}! You can track it in your dashboard.`);
    setSelectedArtist(null);
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      
      <AnimatePresence>
        {paymentModal && (
          <PaymentModal 
            pkg={paymentModal.pkg} 
            artist={paymentModal.artist}
            onClose={() => setPaymentModal(null)}
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
                onClick={() => setSelectedArtist(artist)}
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <motion.img 
                    src={getPremiumAvatar(artist.profileImage)} 
                    alt={artist.name} 
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.05 }
                    }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--accent-secondary)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, backdropFilter: 'blur(5px)', letterSpacing: '0.5px' }}>
                    {artist.specialty}
                  </div>
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
          <button onClick={() => setSelectedArtist(null)} style={{ marginBottom: '2rem', background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>
            ← Back to Search
          </button>
          
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <img src={getPremiumAvatar(selectedArtist.profileImage)} alt={selectedArtist.name} style={{ width: '100%', borderRadius: '24px', marginBottom: '2rem', maxHeight: '500px', objectFit: 'cover', boxShadow: 'var(--glass-shadow)' }} />
              <div style={{ display: 'inline-block', background: 'var(--accent-secondary)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600, marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
                {selectedArtist.specialty}
              </div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selectedArtist.name}</h2>
              <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '1.5rem', fontSize: '1.1rem' }}>⭐ {selectedArtist.average_rating} ({selectedArtist.reviews_count} Reviews)</p>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>{selectedArtist.bio}</p>
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
                    <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.05rem' }} onClick={() => handleInitiateBooking(pkg, selectedArtist)}>
                      <ShieldCheck size={20} /> Enter Details & Book
                    </button>
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

