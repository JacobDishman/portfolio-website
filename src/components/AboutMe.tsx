import React from 'react';
import './AboutMe.scss';

const AboutMe: React.FC = () => {
  return (
    <div className="about-me">
      <div className="about-container">
        <h2 className="about-title">about me</h2>
        
        <div className="about-content">
          <div className="about-section">
            <h3 className="section-title">about me</h3>
            <p className="about-text">
              AI enthusiast | Leader | Programmer | Advertising Leader | Lifelong Learner
            </p>
            <p className="about-text">
              I'm an Information Systems student at Brigham Young University. I care deeply about getting 
              the right answers to the right questions, and that's why I have a passion for data analytics 
              and information.
            </p>
          </div>

          <div className="about-section">
            <h3 className="section-title">education</h3>
            <div className="education-item">
              <h4 className="edu-school">Brigham Young University</h4>
              <p className="edu-degree">Information Systems • 2022 - 2027</p>
              <p className="edu-location">Provo, Utah</p>
            </div>
            <div className="education-item">
              <h4 className="edu-school">Bingham High School</h4>
              <p className="edu-degree">Advanced High School Diploma • Valedictorian</p>
              <p className="edu-details">3.98 GPA • 35 ACT • Class President • Student Body Officer</p>
              <p className="edu-details">Advanced Diplomas: Business, Mathematics, Science, Social Studies, Language Arts</p>
            </div>
          </div>

          <div className="about-section">
            <h3 className="section-title">experience</h3>
            <div className="experience-item">
              <h4 className="exp-title">Missionary</h4>
              <p className="exp-company">The Church of Jesus Christ of Latter-day Saints</p>
              <p className="exp-duration">Dec 2022 - Jan 2025 • 2 yrs 2 mos</p>
              <p className="exp-location">Chicago, Illinois</p>
              <p className="about-text">
                Served 21 months in leadership roles, leading groups of missionaries between 6 and 30 in number. 
                Led team to cut cost-per-conversion in half through Direct Response Marketing optimization. 
                Developed interpersonal skills, problem-solving abilities, and team leadership experience.
              </p>
            </div>
          </div>

          <div className="about-section">
            <h3 className="section-title">skills & expertise</h3>
            <div className="skills-grid">
              <span className="skill-tag">Python</span>
              <span className="skill-tag">HTML</span>
              <span className="skill-tag">VBA</span>
              <span className="skill-tag">Excel</span>
              <span className="skill-tag">Tableau</span>
              <span className="skill-tag">Google Apps Script</span>
              <span className="skill-tag">Data Analytics</span>
              <span className="skill-tag">Team Leadership</span>
              <span className="skill-tag">Direct Response Marketing</span>
              <span className="skill-tag">Database Integration</span>
              <span className="skill-tag">Problem Solving</span>
              <span className="skill-tag">Communication</span>
            </div>
          </div>

          <div className="about-section">
            <h3 className="section-title">achievements</h3>
            <p className="about-text">
              • Graduated Valedictorian of Bingham High School (class of 700+)<br/>
              • DECA State Champion in Principles of Finance<br/>
              • National Honor Society member<br/>
              • Cut cost-per-conversion in half through marketing leadership<br/>
              • 21 months of leadership experience managing teams of 6-30 people
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