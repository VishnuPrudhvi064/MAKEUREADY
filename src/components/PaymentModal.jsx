import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, X, CheckCircle, CreditCard, Smartphone } from 'lucide-react';

export const PaymentModal = ({ amount, title, onClose, onSuccess }) => {
  const [step, setStep] = useState(0); // 0: Form, 1: Processing, 2: Success
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD
  const [txnId, setTxnId] = useState('');
  
  // UPI State
  const [upiId, setUpiId] = useState('');
  
  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = (e) => {
    e.preventDefault();
    setStep(1);
  };

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setTxnId('TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase());
        setStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (step === 2) {
      const timer = setTimeout(() => {
        onSuccess(txnId, amount);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, onSuccess, amount, txnId]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ width: '90%', maxWidth: '450px', background: '#1A0E10', border: '1px solid var(--primary-color)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212, 175, 55, 0.05)' }}>
          <h3 style={{ margin: 0, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={20}/> Secure Payment</h3>
          {step === 0 && <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20}/></button>}
        </div>

        <div style={{ padding: '2rem' }}>
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{title}</p>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>₹{amount.toLocaleString()}</div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setPaymentMethod('UPI')} 
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, border: '1px solid', borderColor: paymentMethod === 'UPI' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)', background: paymentMethod === 'UPI' ? 'rgba(212,175,55,0.1)' : 'transparent', color: paymentMethod === 'UPI' ? 'var(--primary-color)' : 'var(--text-muted)', transition: 'all 0.2s', cursor: 'pointer' }}
                >
                  <Smartphone size={18}/> UPI
                </button>
                <button 
                  type="button" 
                  onClick={() => setPaymentMethod('CARD')} 
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, border: '1px solid', borderColor: paymentMethod === 'CARD' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)', background: paymentMethod === 'CARD' ? 'rgba(212,175,55,0.1)' : 'transparent', color: paymentMethod === 'CARD' ? 'var(--primary-color)' : 'var(--text-muted)', transition: 'all 0.2s', cursor: 'pointer' }}
                >
                  <CreditCard size={18}/> Card
                </button>
              </div>

              <form onSubmit={handlePay}>
                {paymentMethod === 'UPI' && (
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enter UPI ID</label>
                    <input type="text" placeholder="username@upi" required value={upiId} onChange={e => setUpiId(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='var(--primary-color)'} onBlur={e => e.target.style.borderColor='rgba(212,175,55,0.3)'} />
                  </div>
                )}
                
                {paymentMethod === 'CARD' && (
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Card Number</label>
                      <input type="text" placeholder="XXXX XXXX XXXX XXXX" required maxLength="19" value={cardNumber} onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        val = val.replace(/(.{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', letterSpacing: '2px' }} onFocus={e => e.target.style.borderColor='var(--primary-color)'} onBlur={e => e.target.style.borderColor='rgba(212,175,55,0.3)'} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Expiry</label>
                        <input type="text" placeholder="MM/YY" required maxLength="5" value={expiry} onChange={e => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
                          setExpiry(val);
                        }} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} onFocus={e => e.target.style.borderColor='var(--primary-color)'} onBlur={e => e.target.style.borderColor='rgba(212,175,55,0.3)'} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>CVV</label>
                        <input type="password" placeholder="•••" required maxLength="3" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', letterSpacing: '3px' }} onFocus={e => e.target.style.borderColor='var(--primary-color)'} onBlur={e => e.target.style.borderColor='rgba(212,175,55,0.3)'} />
                      </div>
                    </div>
                  </div>
                )}
                
                <button type="submit" style={{ width: '100%', padding: '1rem', borderRadius: '30px', background: 'var(--primary-color)', color: '#111', fontSize: '1.1rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.filter='brightness(1.1)'} onMouseLeave={e => e.target.style.filter='brightness(1)'}>
                  <ShieldCheck size={20}/> Pay ₹{amount.toLocaleString()} Now
                </button>
              </form>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid rgba(212,175,55,0.2)', borderTop: '4px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem auto' }}></div>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Processing Payment...</h3>
              <p style={{ color: 'var(--text-muted)' }}>Please do not close this window or press back.</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: '70px', height: '70px', background: 'rgba(74, 120, 86, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <CheckCircle size={40} color="#4ade80" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#4ade80' }}>Payment Successful!</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>₹{amount.toLocaleString()} paid successfully.</p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Transaction ID</div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--primary-color)', letterSpacing: '1px' }}>{txnId}</div>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
