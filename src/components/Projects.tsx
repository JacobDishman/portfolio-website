import React from 'react';
import './Projects.scss';

const Projects: React.FC = () => {
  return (
    <div className="projects">
      <div className="projects-container">
        <h2 className="projects-title">projects</h2>
        
        <div className="construction-content">
          <div className="construction-icon">
            ⚠️
          </div>
          
          <h3 className="construction-title">under construction</h3>
          
          <p className="construction-text">
            This section is currently being built. Future projects and showcases will be displayed here soon.
          </p>
          
          <div className="coming-soon">
            <div className="pulse-dot"></div>
            <span>future projects to come</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;