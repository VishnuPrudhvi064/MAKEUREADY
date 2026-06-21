import { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '2rem' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ maxWidth: '500px', width: '100%', padding: '3rem', borderRadius: '24px', textAlign: 'center' }}>
            <AlertCircle size={64} color="var(--error-color)" style={{ margin: '0 auto 1.5rem auto' }} />
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: 'var(--text-main)' }}>Something went wrong.</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We're sorry, but the page you were trying to view encountered an unexpected error.</p>
            <button 
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }} 
              className="btn-primary" 
              style={{ padding: '0.8rem 2rem', borderRadius: '30px', fontSize: '1.1rem' }}
            >
              Go to Homepage
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', textAlign: 'left', overflowX: 'auto', fontSize: '0.8rem', color: 'var(--error-color)' }}>
                {this.state.error.toString()}
              </pre>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
