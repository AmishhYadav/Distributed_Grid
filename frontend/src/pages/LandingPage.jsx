import { useEffect, useRef } from 'react';
import './LandingPage.css';

export default function LandingPage({ onLaunch }) {
  const expandSectionRef = useRef(null);
  const mediaScalerRef = useRef(null);
  const titleLeftRef = useRef(null);
  const titleRightRef = useRef(null);
  const initialMediaRef = useRef(null);
  const expandedMediaRef = useRef(null);
  const finalTitleRef = useRef(null);
  const solutionContentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!expandSectionRef.current) return;
      const expandSection = expandSectionRef.current;
      const mediaScaler = mediaScalerRef.current;
      const titleLeft = titleLeftRef.current;
      const titleRight = titleRightRef.current;
      const initialMedia = initialMediaRef.current;
      const expandedMedia = expandedMediaRef.current;
      const finalTitle = finalTitleRef.current;
      const solutionContent = solutionContentRef.current;

      const rect = expandSection.getBoundingClientRect();
      const scrollPercent = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight), 0), 1);

      // 1. Expand Media Scale (0.0 to 1.0 scroll range)
      const expansionProgress = Math.min(scrollPercent / 0.7, 1);
      const scaleWidth = 400 + (window.innerWidth - 400) * expansionProgress;
      const scaleHeight = 250 + (window.innerHeight - 250) * expansionProgress;
      const borderRadius = 16 * (1 - expansionProgress);

      if (mediaScaler) {
        mediaScaler.style.width = `${scaleWidth}px`;
        mediaScaler.style.height = `${scaleHeight}px`;
        mediaScaler.style.borderRadius = `${borderRadius}px`;
      }

      // 2. Title Morphing (Split)
      const moveX = expansionProgress * 150; 
      if (titleLeft) {
        titleLeft.style.transform = `translateY(-50%) translateX(-${moveX}%)`;
        titleLeft.style.opacity = 1 - expansionProgress;
      }
      if (titleRight) {
        titleRight.style.transform = `translateY(-50%) translateX(${moveX}%)`;
        titleRight.style.opacity = 1 - expansionProgress;
      }

      // 3. Media Cross-fade
      if (initialMedia) initialMedia.style.opacity = 1 - expansionProgress;
      if (expandedMedia) expandedMedia.style.opacity = expansionProgress;

      // 4. Content Reveal (Final 30% of scroll)
      const contentProgress = Math.max((scrollPercent - 0.7) / 0.3, 0);
      if (finalTitle) {
        finalTitle.style.opacity = contentProgress;
        finalTitle.style.pointerEvents = contentProgress > 0.5 ? 'auto' : 'none';
      }
      
      if (solutionContent && contentProgress > 0) {
        solutionContent.style.transform = `translateY(${(1 - contentProgress) * 50}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    // trigger once on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-cinematic refined-cinematic">
      {/* TopNavBar */}
      <nav className="cinematic-nav">
        <div className="nav-container">
          <div className="nav-logo text-cyan">GridMind</div>
          <div className="nav-links">
            <a href="#hero">Intro</a>
            <a href="#expand-section">Evolution</a>
            <a href="#intelligence">Intelligence</a>
          </div>
          <button className="nav-btn-start shadow-glow" onClick={onLaunch}>
            Get Started
          </button>
        </div>
      </nav>

      <main>
        {/* HERO (INTRO) SECTION */}
        <section id="hero" className="stage-hero">
          <div className="absolute-bg">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOLK8cul8Iw5Fot0uX5HvZrRmzbOk85NN9287gq7RXSOVtY_LjENYOn3x-UMfvKkJf9aiwaguZHfTgVIUvBLuhasGnvw2WQ_LNyT2zUwFpCahJ6m2yfDdwpqno3ffWyJNL5nYON2L4556qfg3PNu60LKVxjoaV7BRNea8PkCqxJwnd1uDiDEjGThDpDOUKyd03RJWK2yqUuz6GKm7qMppqEg7bpJIOuvsRTB5lIdpqUKQSjYi2Qn45tqj590-uqhKx6uKRx4osPqQj" 
              alt="Neural Energy Grid" 
              className="zoom-fade-img"
            />
            <div className="gradient-overlay"></div>
          </div>
          
          <div className="hero-content">
            <div className="hero-badge">Autonomous Energy Evolution</div>
            <h1 className="hero-title">
              Powering the <br/>
              <span className="text-gradient">Autonomous Grid</span>
            </h1>
            <p className="hero-subtitle">
              The centralized era is over. Welcome to a self-healing, peer-to-peer energy network driven by kinetic intelligence.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={onLaunch}>
                Initialize Core
              </button>
              <button className="btn-outline">
                View System Specs
              </button>
            </div>
          </div>
          <div className="scroll-arrow z-top">
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
          </div>
        </section>

        {/* CINEMATIC TRANSITION (ScrollExpandMedia) */}
        <section id="expand-section" className="bg-black" ref={expandSectionRef}>
          <div className="sticky-viewport">
            
            {/* Split Title Behind Media */}
            <div className="split-title-container">
              <h2 className="scroll-title-part left split-text text-error" ref={titleLeftRef}>Fragile</h2>
              <h2 className="scroll-title-part right split-text text-cyan" ref={titleRightRef}>Evolution</h2>
            </div>
            
            {/* Central Title (Visible when expanded) */}
            <div className="final-title-container" ref={finalTitleRef}>
              <h2 className="final-main-title">DECENTRALIZED POWER</h2>
              
              <div className="solution-content-grid" ref={solutionContentRef}>
                <div className="glass-panel solution-card cyan-border">
                  <h3 className="card-title cyan">Microgrid Sovereignty</h3>
                  <p className="card-desc">
                    Assets connect directly. Solar, batteries, and homes trade energy in real-time without middle-man interference.
                  </p>
                  <div className="card-metric">99.9% <span className="metric-lbl cyan-muted">Uptime</span></div>
                </div>
                
                <div className="glass-panel solution-card purple-border">
                  <h3 className="card-title purple">Peer-to-Peer Trade</h3>
                  <p className="card-desc">
                    Distributed Ledger Technology ensures every watt is accounted for and every trade is settled instantly.
                  </p>
                  <div className="card-metric">40% <span className="metric-lbl purple-muted">Cost Save</span></div>
                </div>
              </div>
            </div>

            {/* The Expanding Media */}
            <div className="media-scaler" ref={mediaScalerRef}>
              
              {/* Initial State: Fragile Central Node */}
              <div className="initial-media" ref={initialMediaRef}>
                <div className="central-node-wrapper">
                  <div className="central-node">
                    <span className="material-symbols-outlined flicker text-error-ico">account_tree</span>
                  </div>
                  <svg className="central-lines">
                    <g className="flicker">
                      <line x1="100" y1="100" x2="10" y2="10" stroke="#ff716c" strokeWidth="1" strokeDasharray="4" opacity="0.3"/>
                      <line x1="100" y1="100" x2="190" y2="10" stroke="#ff716c" strokeWidth="1" strokeDasharray="4" opacity="0.3"/>
                      <line x1="100" y1="100" x2="10" y2="190" stroke="#ff716c" strokeWidth="1" strokeDasharray="4" opacity="0.3"/>
                      <line x1="100" y1="100" x2="190" y2="190" stroke="#ff716c" strokeWidth="1" strokeDasharray="4" opacity="0.3"/>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Expanded State: Vibrant Energy Mesh */}
              <div className="expanded-media" ref={expandedMediaRef}>
                <img 
                  alt="Decentralized Network" 
                  className="expanded-bg-img opacity-dim" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz4eXpyP17-bxXqYYp2rY1qoP9KLg1qwOE8p9M6tZTPDmcH0pYL0qTJVUBG3i9p7wuM8j64xmU5RiVH4DlTaLIu3es748i2nI-7BOb3VhnnkheYlF7BumPqZ5scyhILs-9M67NWzCtpbDsEwKkJZbNGKgkwXMO1NWgtsJXLTjPaQgxlCZfBFfXh1Zjq-KIigAD_sRbTwo0llP-jnxJMZAVa9OYeX_zUTtgRrRhJnONnEocGI-cY7li2sSG1uGxIg6ExbfaBdBdFYkE"
                />
                
                {/* Solution Grid SVG Layer (Animated) */}
                <div className="expanded-svg-overlay">
                  <svg className="expanded-svg" viewBox="0 0 1000 1000">
                    <path d="M100 100 L900 100 L900 900 L100 900 Z" className="energy-line" stroke="#6dddff" strokeWidth="2" strokeDasharray="10,20" fill="none"/>
                    <path d="M100 100 L900 900 M900 100 L100 900" className="energy-line" stroke="#c180ff" strokeWidth="1.5" strokeDasharray="20,10" fill="none"/>
                    
                    <circle cx="100" cy="100" r="20" className="pulse-ring" fill="#080e1a" stroke="#6dddff" strokeWidth="4"/>
                    <circle cx="900" cy="100" r="20" className="pulse-ring" fill="#080e1a" stroke="#6dddff" strokeWidth="4"/>
                    <circle cx="900" cy="900" r="20" className="pulse-ring" fill="#080e1a" stroke="#6dddff" strokeWidth="4"/>
                    <circle cx="100" cy="900" r="20" className="pulse-ring" fill="#080e1a" stroke="#6dddff" strokeWidth="4"/>
                    <circle cx="500" cy="500" r="30" className="pulse-ring-purple" fill="#080e1a" stroke="#c180ff" strokeWidth="4"/>
                  </svg>
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
        <section className="stage-cta-tall">
          <div className="cta-overlay-bottom"></div>
          
          <div className="cta-content">
            <h2 className="cta-title">ENTER THE <span className="text-primary not-italic">GRID</span></h2>
            <p className="cta-subtitle">
              The infrastructure is ready. Your autonomy starts here. Join the kinetic evolution of global power.
            </p>
            <div className="cta-actions">
              <button className="btn-primary large shadow-glow" onClick={onLaunch}>Launch Dashboard</button>
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
