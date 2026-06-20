import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Heart, Calendar, Sparkles, ChevronDown, Star } from 'lucide-react';
import { getFromStorage } from '../storage';

const CATEGORIES = [
  { id: 1, title: 'Bridal HD Makeup & Saree', image: '/bride.jpg' },
  { id: 2, title: 'Mehendi Art', image: '/mehendi.jpg' },
  { id: 3, title: 'Premium Hair Styling', image: '/hair.jpg' },
  { id: 4, title: 'Nail Art & Polishing', image: '/nails.jpg' },
  { id: 5, title: 'Pre-Bridal & Salon Services', image: '/salon.jpg' },
  { id: 6, title: 'Bridal Jewelry Ornaments', image: '/jewelry.jpg' }
];

export const Home = () => {
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const allUsers = getFromStorage('users') || [];
    setTopArtists(allUsers.filter(u => u.role === 'ARTIST').slice(0, 4));
  }, []);

  const getPremiumAvatar = (url) => {
    if (url && url.includes('ui-avatars.com')) {
      return url.replace(/background=[a-zA-Z0-9]+/, 'background=1a1a1a').replace(/color=[a-zA-Z0-9]+/, 'color=d4af37');
    }
    return url;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. HERO SECTION */}
      <div style={{ 
        minHeight: 'calc(100vh - 80px)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingTop: '80px', 
        position: 'relative',
        marginBottom: '120px'
      }}>
        <motion.div className="container animate-fade-up" style={{ textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Your Perfect Look,<br/> <span className="text-gradient">Just a Click Away</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Join the exclusive bridal beauty platform in Delhi NCR. Explore a curated selection of elite artists and premium salon services tailored for your big day.
          </p>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
          style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <ChevronDown size={36} color="var(--primary-color)" style={{ opacity: 0.7 }} />
        </motion.div>
      </div>

      {/* 2. HOW IT WORKS */}
      <div className="container" style={{ marginBottom: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>How It Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Four simple steps to your dream bridal look.</p>
        </div>
        <div className="how-it-works-grid">
          {[
            { icon: Search, title: 'Search Artists', desc: 'Browse our curated list of elite professionals by specialty or location.' },
            { icon: Heart, title: 'Compare & Shortlist', desc: 'Review their portfolios, pricing, and authentic client testimonials.' },
            { icon: Calendar, title: 'Book Your Date', desc: 'Secure your date instantly with our enterprise escrow protection.' },
            { icon: Sparkles, title: 'Get Ready', desc: 'Relax and let the experts make you shine on your big day.' }
          ].map((step, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="glass" style={{ padding: '2.5rem 1.5rem', borderRadius: '24px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--primary-color)' }}>
                <step.icon size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. PREMIUM SERVICES (Existing) */}
      <div className="container" style={{ marginBottom: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Our Premium Services</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>From head to toe, everything a bride and groom needs to shine.</p>
        </div>

        <div className="services-grid">
          {CATEGORIES.map((cat) => (
            <motion.div 
              key={cat.id}
              initial="rest"
              whileInView="rest"
              whileHover="hover"
              viewport={{ once: true }}
              variants={{
                rest: { opacity: 1, y: 0, scale: 1, boxShadow: 'var(--glass-shadow)', borderColor: 'var(--glass-border)' },
                hover: { scale: 1.02, boxShadow: '0 10px 30px rgba(212, 175, 55, 0.25)', borderColor: 'var(--primary-color)', zIndex: 20 }
              }}
              transition={{ duration: 0.4 }}
              className="glass"
              style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', height: '340px', minWidth: '280px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              <motion.div variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }} transition={{ duration: 0.6, ease: "easeOut" }} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                <img src={cat.image} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', boxSizing: 'border-box', padding: '3rem 1.5rem 1.5rem 1.5rem', background: 'linear-gradient(to top, rgba(26,14,16,0.95) 0%, rgba(26,14,16,0.6) 40%, transparent 100%)', color: 'var(--text-main)', display: 'flex', alignItems: 'flex-end', zIndex: 10 }}>
                <h3 style={{ margin: 0, fontSize: '18px', lineHeight: 1.3, fontWeight: 600, letterSpacing: '0.5px', wordBreak: 'normal', overflowWrap: 'normal', whiteSpace: 'normal', hyphens: 'none', maxWidth: '100%' }}>{cat.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. TOP RATED ARTISTS */}
      <div className="container" style={{ marginBottom: '8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Top Rated Artists</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>The most requested professionals in Delhi NCR.</p>
          </div>
          <Link to="/search" className="btn-outline" style={{ borderRadius: '30px', padding: '0.75rem 2rem' }}>View All Artists</Link>
        </div>
        <div className="artist-grid">
          {topArtists.map(artist => (
            <motion.div key={artist.id} whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="glass" style={{ padding: '1.25rem', borderRadius: '24px' }}>
              <img src={getPremiumAvatar(artist.profileImage)} alt={artist.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1.2rem' }} />
              <div style={{ display: 'inline-block', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary-color)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                {artist.specialty}
              </div>
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>{artist.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Star size={14} fill="var(--primary-color)" color="var(--primary-color)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{artist.average_rating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.2rem' }}>({artist.reviews_count} reviews)</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. TRUST BADGES */}
      <div className="container" style={{ marginBottom: '8rem' }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: '40px', padding: '4rem 2rem', border: '1px solid var(--accent-secondary)', boxShadow: 'var(--glass-shadow)' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Why Choose Make U Ready</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            {[
              { title: '500+', desc: 'Verified Artists' },
              { title: '10k+', desc: 'Happy Brides' },
              { title: '100%', desc: 'Secure Escrow' },
              { title: '24/7', desc: 'Dedicated Support' }
            ].map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '0.5rem', fontFamily: 'var(--font-body)' }}>{stat.title}</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-main)', letterSpacing: '0.5px' }}>{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. TESTIMONIALS */}
      <div className="container" style={{ marginBottom: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>What Brides Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { name: 'Aisha Gupta', text: 'Absolutely seamless experience. Found my dream makeup artist in minutes and the escrow payment gave me total peace of mind.' },
            { name: 'Simran Kaur', text: 'The artists here are top-tier. My Mehendi artist was punctual, professional, and her work was stunning.' },
            { name: 'Priya Sharma', text: 'Loved being able to compare portfolios and reviews all in one place. Highly recommend Make U Ready to every bride!' }
          ].map((review, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="var(--primary-color)" color="var(--primary-color)" />)}
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '1.05rem' }}>
                <span style={{ fontFamily: 'var(--font-accent)', fontSize: '1.5rem', color: 'var(--primary-color)', marginRight: '4px' }}>"</span>
                {review.text}
                <span style={{ fontFamily: 'var(--font-accent)', fontSize: '1.5rem', color: 'var(--primary-color)', marginLeft: '4px' }}>"</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-secondary)', border: '1px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', fontWeight: 'bold' }}>
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{review.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>Verified Bride</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 7. FINAL CTA */}
      <div className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ background: 'var(--accent-secondary)', borderRadius: '40px', padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-main)', boxShadow: '0 20px 40px rgba(201, 162, 39, 0.15)', position: 'relative', overflow: 'hidden', border: '1px solid var(--primary-color)' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Ready to Book Your Perfect Look?</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', opacity: 0.95 }}>Join thousands of brides who found their dream artist on Make U Ready.</p>
            <Link to="/search" style={{ background: 'var(--primary-color)', color: 'var(--bg-color)', fontSize: '1.15rem', padding: '1.2rem 3rem', borderRadius: '30px', fontWeight: 700, display: 'inline-block', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              Find Your Artist Now
            </Link>
          </div>
        </div>
      </div>

      {/* 8. FOOTER */}
      <footer style={{ background: 'var(--card-bg)', color: 'var(--text-muted)', padding: '5rem 2rem 2rem 2rem', marginTop: 'auto', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '3rem', marginBottom: '4rem' }}>
          <div style={{ maxWidth: '350px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', letterSpacing: '1px' }}>
              <Sparkles size={24} /> MAKE U READY
            </div>
            <p style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>The exclusive bridal beauty platform in Delhi NCR. Discover elite artists and premium salon services tailored for your big day.</p>
          </div>
          <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.1rem', letterSpacing: '0.5px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li><Link to="/search" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Find Artists</Link></li>
                <li><Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Login / Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.1rem', letterSpacing: '0.5px' }}>Contact Us</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li>support@makeuready.com</li>
                <li>+91 98765 43210</li>
                <li>New Delhi, India</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} Make U Ready. All rights reserved.
        </div>
      </footer>

    </div>
  );
};
