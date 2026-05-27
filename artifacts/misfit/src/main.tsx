import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';

class ErrorBoundary extends Component<{children: any}, {error: any}> {
  state = { error: null };

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#1a1a1a',
          color: '#ff4444',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>
            <h1 style={{color: '#ff6666', marginBottom: '20px'}}>⚠️ Application Error</h1>
            <pre style={{backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '4px', overflow: 'auto'}}>
              {String(this.state.error?.message || this.state.error)}
              {this.state.error?.stack && `\n\n${this.state.error.stack}`}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
