import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../storage';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';

export const Login = () => {
  const [loginRole, setLoginRole] = useState(null); // 'BRIDE' or 'ARTIST'
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      const res = registerUser({ role: loginRole, name, email, phone, password });
      if (res.success) {
        if (loginRole === 'ARTIST') navigate('/artist');
        else if (loginRole === 'BRIDE') navigate('/bride');
        window.location.reload();
      } else {
        setError(res.message);
      }
    } else {
      const user = loginUser(email, password);
      if (user && user.role === loginRole) {
        if (user.role === 'ARTIST') navigate('/artist');
        else if (user.role === 'BRIDE') navigate('/bride');
        window.location.reload(); 
      } else {
        setError(`Invalid credentials for ${loginRole === 'BRIDE' ? 'Client' : 'Artist'}.`);
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '150px', display: 'flex', justifyContent: 'center', paddingBottom: '4rem' }}>
      <motion.div className="glass animate-fade-up" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
        
        {!loginRole ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>Welcome</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Select your account type to continue</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <button 
                className="btn-outline" 
                onClick={() => setLoginRole('BRIDE')}
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '1.2rem', borderColor: 'var(--primary-color)', color: 'var(--text-main)' }}
              >
                <User size={24} color="var(--primary-color)" />
                Continue as Client
              </button>
              
              <button 
                className="btn-outline" 
                onClick={() => setLoginRole('ARTIST')}
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '1.2rem' }}
              >
                <Sparkles size={24} />
                Continue as Artist
              </button>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button 
              onClick={() => { setLoginRole(null); setError(''); setIsRegistering(false); }} 
              style={{ background: 'transparent', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              ← Back
            </button>

            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>
              {isRegistering ? 'Create Account' : (loginRole === 'BRIDE' ? 'Client Login' : 'Artist Login')}
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
              {isRegistering ? 'Fill in your details below' : 'Enter your details to access your dashboard'}
            </p>
            
            {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {isRegistering && (
                <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                    <input 
                      type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Simran Kaur" 
                      style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-main)', fontSize: '1rem' }} required
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number</label>
                    <input 
                      type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" 
                      style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-main)', fontSize: '1rem' }} required
                    />
                  </div>
                </>
              )}
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" 
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-main)', fontSize: '1rem' }} required
                />
              </div>
              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                <input 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" 
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-main)', fontSize: '1rem' }} required
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                {isRegistering ? 'Register' : 'Sign In'}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button 
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }} 
                style={{ background: 'transparent', color: 'var(--primary-color)', fontWeight: 600 }}
              >
                {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
              </button>
            </div>

          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
