import { useEffect } from 'react';
import './LandingPage.css';

export default function LandingPage({ onLaunch }) {
  // Reveal animation on scroll could be added if needed, but snap scroll handles most layout
  
  return (
    <div className="landing-cinematic">
      {/* TopNavBar */}
      <nav className="cinematic-nav">
        <div className="nav-container">
          <div className="nav-logo">GridMind</div>
          <div className="nav-links">
            <a href="#problem">Problem</a>
            <a href="#solution">Solution</a>
            <a href="#intelligence">Intelligence</a>
          </div>
          <button className="nav-btn-start" onClick={onLaunch}>
            Get Started
          </button>
        </div>
      </nav>

      <main className="stage-container">
        {/* HERO (INTRO) SECTION */}
        <section id="hero" className="stage-hero">
          <div className="hero-hex-bg"></div>
          <div className="hero-grad-bg"></div>
          
          {/* Energy Grid Background SVG */}
          <div className="hero-svg-bg">
            <svg className="hero-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'var(--primary)', stopOpacity: 0.2}} />
                  <stop offset="100%" style={{stopColor: 'var(--secondary)', stopOpacity: 0}} />
                </linearGradient>
              </defs>
              <circle cx="500" cy="500" r="400" fill="none" stroke="url(#grad1)" strokeWidth="1" />
              <circle cx="500" cy="500" r="300" fill="none" stroke="url(#grad1)" strokeWidth="0.5" />
              <circle cx="500" cy="500" r="200" fill="none" stroke="url(#grad1)" strokeWidth="0.2" />
            </svg>
          </div>

          <div className="hero-content">
            <div className="hero-badge">Autonomous Energy Evolution</div>
            <h1 className="hero-title">
              Powering the <br />
              <span className="text-gradient">Autonomous Grid</span>
            </h1>
            <p className="hero-subtitle">
              The centralized era is over. Welcome to a self-healing, peer-to-peer energy network driven by kinetic intelligence.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={onLaunch}>Initialize Core</button>
              <button className="btn-outline">View System Specs</button>
            </div>
          </div>

          <div className="scroll-arrow">
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
          </div>
        </section>

        {/* PROBLEM SECTION: CENTRALIZED GRID */}
        <section id="problem" className="stage-problem">
          <div className="problem-container">
            <div className="problem-text">
              <h2 className="section-title">The Legacy <br /><span className="text-error">Fragility</span></h2>
              <p className="section-desc">
                Yesterday's grid relies on a single point of failure. Rigid, inefficient, and prone to systemic collapse. When the center fades, everyone goes dark.
              </p>
              <div className="problem-bullets">
                <div className="problem-bullet">
                  <span className="material-symbols-outlined">warning</span>
                  <span>High Transmission Loss</span>
                </div>
                <div className="problem-bullet">
                  <span className="material-symbols-outlined">bolt</span>
                  <span>Critical Node Vulnerability</span>
                </div>
              </div>
            </div>
            
            <div className="problem-visual">
              <div className="central-node-wrapper">
                <div className="central-node">
                  <span className="material-symbols-outlined flicker">account_tree</span>
                </div>
                {/* Rigid connection lines */}
                <svg className="central-lines">
                  <g className="flicker">
                    <line x1="200" y1="200" x2="20" y2="20" stroke="#ff716c" strokeWidth="1" strokeDasharray="4" opacity="0.3"/>
                    <line x1="200" y1="200" x2="380" y2="20" stroke="#ff716c" strokeWidth="1" strokeDasharray="4" opacity="0.3"/>
                    <line x1="200" y1="200" x2="20" y2="380" stroke="#ff716c" strokeWidth="1" strokeDasharray="4" opacity="0.3"/>
                    <line x1="200" y1="200" x2="380" y2="380" stroke="#ff716c" strokeWidth="1" strokeDasharray="4" opacity="0.3"/>
                  </g>
                </svg>
                {/* Peripheral Houses */}
                <div className="peripheral-house tl"><span className="material-symbols-outlined">home</span></div>
                <div className="peripheral-house tr"><span className="material-symbols-outlined">home</span></div>
                <div className="peripheral-house bl"><span className="material-symbols-outlined">home</span></div>
                <div className="peripheral-house br"><span className="material-symbols-outlined">home</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* TRANSITION SECTION */}
        <section className="stage-transition">
          <div className="transition-bg"></div>
          <div className="transition-content">
            <h3 className="transition-quote">
              "The future of energy isn't built on towers. It's built on <span className="text-primary italic">connections</span>."
            </h3>
            <div className="transition-line"></div>
            <div className="transition-label">Decentralizing System Controls...</div>
          </div>
        </section>

        {/* SOLUTION SECTION: MICROGRID P2P */}
        <section id="solution" className="stage-solution">
          <div className="solution-container">
            <div className="solution-visual">
              <div className="p2p-wrapper">
                <svg className="p2p-svg" viewBox="0 0 400 400">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Lines */}
                  <path d="M50 50 L350 50 L350 350 L50 350 Z" className="energy-line" stroke="#6dddff" strokeWidth="1.5" strokeDasharray="5,10" fill="none" filter="url(#glow)"/>
                  <path d="M50 50 L350 350" className="energy-line-slow" stroke="#c180ff" strokeWidth="1" strokeDasharray="10,5" fill="none" filter="url(#glow)"/>
                  <path d="M350 50 L50 350" className="energy-line-slow" stroke="#c180ff" strokeWidth="1" strokeDasharray="10,5" fill="none" filter="url(#glow)"/>
                  {/* Nodes */}
                  <circle cx="50" cy="50" r="12" className="pulse-ring" fill="#080e1a" stroke="#6dddff" strokeWidth="2"/>
                  <circle cx="350" cy="50" r="12" className="pulse-ring" fill="#080e1a" stroke="#6dddff" strokeWidth="2"/>
                  <circle cx="350" cy="350" r="12" className="pulse-ring" fill="#080e1a" stroke="#6dddff" strokeWidth="2"/>
                  <circle cx="50" cy="350" r="12" className="pulse-ring" fill="#080e1a" stroke="#6dddff" strokeWidth="2"/>
                  {/* Central Node representing AI Core */}
                  <circle cx="200" cy="200" r="16" className="pulse-ring-purple" fill="#080e1a" stroke="#c180ff" strokeWidth="2"/>
                </svg>
                <div className="float-label top-label glass-panel">
                  <div className="lbl-title cyan">Node 04-A</div>
                  <div className="lbl-val">+1.4 kW Shared</div>
                </div>
                <div className="float-label bottom-label glass-panel">
                  <div className="lbl-title purple">Node 09-B</div>
                  <div className="lbl-val">Storage Active</div>
                </div>
              </div>
            </div>
            
            <div className="solution-text">
              <h2 className="section-title">Peer-to-Peer <br /><span className="text-primary">Sovereignty</span></h2>
              <p className="section-desc">
                GridMind connects assets directly. Solar generates, batteries store, and homes trade energy in real-time without middle-man interference.
              </p>
              <div className="solution-stats">
                <div className="stat-box br-cyan">
                  <div className="stat-val cyan">99.9%</div>
                  <div className="stat-lbl">Uptime Resilience</div>
                </div>
                <div className="stat-box br-purple">
                  <div className="stat-val purple">40%</div>
                  <div className="stat-lbl">Cost Reduction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI INTELLIGENCE LAYER */}
        <section id="intelligence" className="stage-intel">
          <div className="intel-bg">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
          </div>
          
          <div className="intel-container">
            <div className="intel-header">
              <h2 className="section-title">The Kinetic Intelligence</h2>
              <p className="section-desc centered">
                AI doesn't just manage the grid; it predicts the future of energy demand and optimizes flow before a single watt is wasted.
              </p>
            </div>
            
            <div className="intel-cards">
              <div className="glass-panel intel-card group hover-cyan">
                <div className="card-icon cyan"><span className="material-symbols-outlined">psychology</span></div>
                <h4 className="card-title">Predictive Load</h4>
                <p className="card-desc">Analyzing weather patterns and historical usage to preemptively balance microgrid reserves.</p>
                <div className="progress-bar">
                  <div className="progress-fill cyan-fill" style={{width: '66%'}}></div>
                </div>
              </div>
              
              <div className="glass-panel intel-card group hover-purple bg-elevated">
                <div className="card-icon purple"><span className="material-symbols-outlined">auto_graph</span></div>
                <h4 className="card-title">Autonomous Arbitrage</h4>
                <p className="card-desc">Selling surplus energy to the main grid during peak pricing windows automatically.</p>
                <div className="dots-indicator">
                  <div className="dot purple blink"></div>
                  <div className="dot purple dim1"></div>
                  <div className="dot purple dim2"></div>
                </div>
              </div>
              
              <div className="glass-panel intel-card group hover-blue">
                <div className="card-icon blue"><span className="material-symbols-outlined">verified_user</span></div>
                <h4 className="card-title">Self-Healing Mesh</h4>
                <p className="card-desc">Instant rerouting of energy if a node goes offline, maintaining 100% systemic integrity.</p>
                <div className="card-badge blue-badge">Active Protection</div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="stage-cta">
          <div className="cta-overlay-bottom"></div>
          <div className="cta-bg">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz4eXpyP17-bxXqYYp2rY1qoP9KLg1qwOE8p9M6tZTPDmcH0pYL0qTJVUBG3i9p7wuM8j64xmU5RiVH4DlTaLIu3es748i2nI-7BOb3VhnnkheYlF7BumPqZ5scyhILs-9M67NWzCtpbDsEwKkJZbNGKgkwXMO1NWgtsJXLTjPaQgxlCZfBFfXh1Zjq-KIigAD_sRbTwo0llP-jnxJMZAVa9OYeX_zUTtgRrRhJnONnEocGI-cY7li2sSG1uGxIg6ExbfaBdBdFYkE"
              alt="Global network glow"
            />
          </div>
          
          <div className="cta-content">
            <h2 className="cta-title">ENTER THE <span className="text-primary not-italic">GRID</span></h2>
            <p className="cta-subtitle">
              The infrastructure is ready. Your autonomy starts here. Join the kinetic evolution of global power.
            </p>
            <div className="cta-actions">
              <button className="btn-primary large" onClick={onLaunch}>Launch Dashboard</button>
              <button className="btn-outline large">Contact Solutions</button>
            </div>
            
            <div className="cta-features">
              <div>SECURE ACCESS</div>
              <div>AES-256 SYNC</div>
              <div>REAL-TIME SYNC</div>
              <div>GLOBAL READY</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="cinematic-footer">
          <div className="footer-wrap">
            <div className="footer-brand">GridMind</div>
            <div className="footer-copyright">© 2024 GridMind. All systems autonomous.</div>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">System Health</a>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
