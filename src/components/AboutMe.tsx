import React from 'react';
import './AboutMe.scss';

const AboutMe: React.FC = () => {
  return (
    <div className="about-me">
      <div className="about-container">
        <h2 className="about-title">about me</h2>
        
        <div className="about-content">
          <div className="about-section">
            <h3 className="section-title">professional background</h3>
            <p className="about-text">
              Software developer and technology enthusiast with experience in full-stack development, 
              cloud technologies, and modern web frameworks. Passionate about creating innovative 
              solutions and contributing to meaningful projects.
            </p>
          </div>

          <div className="about-section">
            <h3 className="section-title">skills & expertise</h3>
            <div className="skills-grid">
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">React</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">TypeScript</span>
              <span className="skill-tag">Python</span>
              <span className="skill-tag">PostgreSQL</span>
              <span className="skill-tag">Cloud Platforms</span>
              <span className="skill-tag">API Development</span>
            </div>
          </div>

          <div className="about-section">
            <h3 className="section-title">interests</h3>
            <p className="about-text">
              When I'm not coding, I enjoy exploring new technologies, contributing to open source projects, 
              and staying up-to-date with the latest developments in software engineering and design.
            </p>
          </div>

          <div className="contact-section">
            <h3 className="section-title">connect</h3>
            <div className="contact-links">
              <a href="https://www.linkedin.com/in/jacobdishman/" target="_blank" rel="noopener noreferrer" className="contact-link">
                LinkedIn
              </a>
              <a href="https://github.com/JacobDishman" target="_blank" rel="noopener noreferrer" className="contact-link">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;