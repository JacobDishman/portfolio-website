import React from 'react';
import './App.scss';
import Guestbook from './components/Guestbook';

function App() {
  return (
    <div className="App">
      <div className="header-section">
        <h1 className="wurtz-title">hello world</h1>
        <div className="wurtz-subtitle">i'm jacob dishman</div>
        <div className="floating-text">portfolio coming soon...</div>
      </div>
      
      <div className="content-section">
        <div className="wurtz-container">
          <Guestbook />
        </div>
      </div>
    </div>
  );
}

export default App;
