import React, { useState } from 'react';
import './App.scss';
import Guestbook from './components/Guestbook';
import AboutMe from './components/AboutMe';
import Projects from './components/Projects';

type TabType = 'about' | 'projects' | 'guestbook';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('about');

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutMe />;
      case 'projects':
        return <Projects />;
      case 'guestbook':
        return <Guestbook />;
      default:
        return <AboutMe />;
    }
  };

  return (
    <div className="App">
      {/* Geometric shapes */}
      <div className="geometric-shape-1"></div>
      <div className="geometric-shape-2"></div>
      <div className="geometric-shape-3"></div>
      <div className="geometric-shape-4"></div>
      <div className="geometric-shape-5"></div>
      
      <div className="header-section">
        <div className="header-content">
          <h1 className="site-title">jacob dishman</h1>
          <nav className="navigation">
            <button 
              className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              about me
            </button>
            <button 
              className={`nav-tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              projects
            </button>
            <button 
              className={`nav-tab ${activeTab === 'guestbook' ? 'active' : ''}`}
              onClick={() => setActiveTab('guestbook')}
            >
              guestbook
            </button>
          </nav>
        </div>
      </div>
      
      <div className="content-section">
        <div className="wurtz-container">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
