import { useEffect } from "react";
import "./LandingPage.css";

export default function LandingPage({ onLaunch }) {

  useEffect(() => {
        const handleScroll = () => {
            const expandSection = document.getElementById("expand-section");
            const mediaScaler = document.getElementById("media-scaler");
            const titleLeft = document.getElementById("title-left");
            const titleRight = document.getElementById("title-right");
            const initialMedia = document.getElementById("initial-media");
            const expandedMedia = document.getElementById("expanded-media");
            const finalTitle = document.getElementById("final-title");
            const solutionContent = document.getElementById("solution-content");

            if (!expandSection) return;

            const rect = expandSection.getBoundingClientRect();
            const scrollPercent = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight), 0), 1);

            const expansionProgress = Math.min(scrollPercent / 0.7, 1);
            const scaleWidth = 400 + (window.innerWidth - 400) * expansionProgress;
            const scaleHeight = 250 + (window.innerHeight - 250) * expansionProgress;
            const borderRadius = 16 * (1 - expansionProgress);

            if(mediaScaler) {
                mediaScaler.style.width = `${scaleWidth}px`;
                mediaScaler.style.height = `${scaleHeight}px`;
                mediaScaler.style.borderRadius = `${borderRadius}px`;
            }

            const moveX = expansionProgress * 150;
            if(titleLeft) {
                titleLeft.style.transform = `translateY(-50%) translateX(-${moveX}%)`;
                titleLeft.style.opacity = 1 - expansionProgress;
            }
            if(titleRight) {
                titleRight.style.transform = `translateY(-50%) translateX(${moveX}%)`;
                titleRight.style.opacity = 1 - expansionProgress;
            }

            if(initialMedia) initialMedia.style.opacity = 1 - expansionProgress;
            if(expandedMedia) expandedMedia.style.opacity = expansionProgress;

            const contentProgress = Math.max((scrollPercent - 0.7) / 0.3, 0);
            if(finalTitle) {
                finalTitle.style.opacity = contentProgress;
                finalTitle.style.pointerEvents = contentProgress > 0.5 ? "auto" : "none";
            }
            
            if (solutionContent && contentProgress > 0) {
                solutionContent.style.transform = `translateY(${(1 - contentProgress) * 50}px)`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Initial call
        handleScroll();
        
        return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
<div className="dark">
<nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md">
<div className="flex justify-between items-center px-8 py-6 w-full max-w-screen-2xl mx-auto">
<div className="text-2xl font-bold tracking-tighter text-cyan-400 font-headline">GridMind</div>
<div className="hidden md:flex items-center space-x-12">
<a className="font-headline uppercase tracking-widest text-xs text-slate-400 hover:text-cyan-200 transition-colors" href="#hero">Intro</a>
<a className="font-headline uppercase tracking-widest text-xs text-slate-400 hover:text-cyan-200 transition-colors" href="#expand-section">Evolution</a>
<a className="font-headline uppercase tracking-widest text-xs text-slate-400 hover:text-cyan-200 transition-colors" href="#intelligence">Intelligence</a>
</div>
<button onClick={onLaunch} className="bg-primary hover:bg-primary-dim text-on-primary font-headline uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-95 shadow-[0_0_15px_rgba(109,221,255,0.3)]">
                Get Started
            </button>
</div>
</nav>
<main>
{/*  HERO (INTRO) SECTION  */}
<section className="relative min-h-[1024px] flex items-center justify-center overflow-hidden bg-surface" data-stitch-vh="min-h-[1024px]===min-h-screen" id="hero">
<div className="absolute inset-0 overflow-hidden">
<img alt="Neural Energy Grid" className="absolute inset-0 w-full h-full object-cover opacity-60 animate-zoom-fade" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOLK8cul8Iw5Fot0uX5HvZrRmzbOk85NN9287gq7RXSOVtY_LjENYOn3x-UMfvKkJf9aiwaguZHfTgVIUvBLuhasGnvw2WQ_LNyT2zUwFpCahJ6m2yfDdwpqno3ffWyJNL5nYON2L4556qfg3PNu60LKVxjoaV7BRNea8PkCqxJwnd1uDiDEjGThDpDOUKyd03RJWK2yqUuz6GKm7qMppqEg7bpJIOuvsRTB5lIdpqUKQSjYi2Qn45tqj590-uqhKx6uKRx4osPqQj"/>
<div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-background-dark/40 to-background-dark"></div>
</div>
<div className="relative z-10 text-center px-4 max-w-4xl">
<div className="inline-block px-3 py-1 mb-6 border border-primary/30 rounded-full bg-primary/5">
<span className="font-headline text-[10px] uppercase tracking-[0.2em] text-primary">Autonomous Energy Evolution</span>
</div>
<h1 className="font-headline text-5xl md:text-8xl font-bold tracking-tight text-on-surface mb-8 leading-[1.1]">
        Powering the <br/>
<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-white">Autonomous Grid</span>
</h1>
<p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
        The centralized era is over. Welcome to a self-healing, peer-to-peer energy network driven by kinetic intelligence.
    </p>
<div className="flex flex-col md:flex-row gap-4 justify-center items-center">
<button onClick={onLaunch} className="w-full md:w-auto px-8 py-4 bg-primary text-on-primary font-headline font-bold uppercase tracking-widest text-xs rounded-lg hover:scale-105 transition-transform">
            Initialize Core
        </button>
<button className="w-full md:w-auto px-8 py-4 border border-outline-variant text-on-surface font-headline font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-surface-bright transition-colors">
            View System Specs
        </button>
</div>
</div>
<div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
<span className="material-symbols-outlined text-primary/40 text-4xl">keyboard_arrow_down</span>
</div>
</section>
{/*  CINEMATIC TRANSITION (ScrollExpandMedia)  */}
<section className="relative bg-black" id="expand-section">
<div className="sticky-viewport">
{/*  Split Title Behind Media  */}
<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden" id="split-title-container">
<h2 className="scroll-title-part left-[10%] md:left-[20%] font-headline text-6xl md:text-9xl font-black text-error/30 uppercase italic" id="title-left" style={{transform: "translateY(-50%) translateX(0%)", opacity: "1"}}>Fragile</h2>
<h2 className="scroll-title-part right-[10%] md:right-[20%] font-headline text-6xl md:text-9xl font-black text-primary/30 uppercase italic" id="title-right" style={{transform: "translateY(-50%) translateX(0%)", opacity: "1"}}>Evolution</h2>
</div>
{/*  Central Title (Visible when expanded)  */}
<div className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-0 pointer-events-none px-6" id="final-title" style={{opacity: "0", pointerEvents: "none"}}>
<h2 className="font-headline text-4xl md:text-7xl font-bold text-white text-center mb-8">DECENTRALIZED POWER</h2>
{/*  Content (Solution details)  */}
<div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 translate-y-10 transition-all duration-700" id="solution-content" style={{transform: "translateY(47.119141px)"}}>
<div className="glass-panel p-8 rounded-2xl border-l-4 border-primary">
<h3 className="font-headline text-2xl font-bold text-primary mb-4">Microgrid Sovereignty</h3>
<p className="text-on-surface-variant text-sm leading-relaxed">
                                Assets connect directly. Solar, batteries, and homes trade energy in real-time without middle-man interference.
                            </p>
<div className="mt-4 text-4xl font-headline font-bold text-white">99.9% <span className="text-xs uppercase text-primary/60 tracking-widest">Uptime</span></div>
</div>
<div className="glass-panel p-8 rounded-2xl border-l-4 border-secondary">
<h3 className="font-headline text-2xl font-bold text-secondary mb-4">Peer-to-Peer Trade</h3>
<p className="text-on-surface-variant text-sm leading-relaxed">
                                Distributed Ledger Technology ensures every watt is accounted for and every trade is settled instantly.
                            </p>
<div className="mt-4 text-4xl font-headline font-bold text-white">40% <span className="text-xs uppercase text-secondary/60 tracking-widest">Cost Save</span></div>
</div>
</div>
</div>
{/*  The Expanding Media  */}
<div className="media-container flex items-center justify-center bg-surface-container-highest border border-white/10" id="media-scaler" style={{width: "400px", height: "250px", borderRadius: "16px"}}>
{/*  Initial State: Fragile Central Node Visualization  */}
<div className="absolute inset-0 z-10 flex items-center justify-center" id="initial-media" style={{opacity: "1"}}>
<div className="relative">
<div className="w-16 h-16 bg-surface-container-highest border-2 border-error/20 rounded-full flex items-center justify-center z-10 relative">
<span className="material-symbols-outlined text-error text-2xl flicker">account_tree</span>
</div>
<svg className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] pointer-events-none" style={{top: "50%", left: "50%"}}>
<g className="flicker">
<line opacity="0.3" stroke="#ff716c" strokeDasharray="4" strokeWidth="1" x1="100" x2="10" y1="100" y2="10"></line>
<line opacity="0.3" stroke="#ff716c" strokeDasharray="4" strokeWidth="1" x1="100" x2="190" y1="100" y2="10"></line>
<line opacity="0.3" stroke="#ff716c" strokeDasharray="4" strokeWidth="1" x1="100" x2="10" y1="100" y2="190"></line>
<line opacity="0.3" stroke="#ff716c" strokeDasharray="4" strokeWidth="1" x1="100" x2="190" y1="100" y2="190"></line>
</g>
</svg>
</div>
</div>
{/*  Expanded State: Vibrant Energy Mesh  */}
<div className="absolute inset-0 opacity-0 bg-black" id="expanded-media" style={{opacity: "0"}}>
<img alt="Decentralized Network" className="w-full h-full object-cover opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz4eXpyP17-bxXqYYp2rY1qoP9KLg1qwOE8p9M6tZTPDmcH0pYL0qTJVUBG3i9p7wuM8j64xmU5RiVH4DlTaLIu3es748i2nI-7BOb3VhnnkheYlF7BumPqZ5scyhILs-9M67NWzCtpbDsEwKkJZbNGKgkwXMO1NWgtsJXLTjPaQgxlCZfBFfXh1Zjq-KIigAD_sRbTwo0llP-jnxJMZAVa9OYeX_zUTtgRrRhJnONnEocGI-cY7li2sSG1uGxIg6ExbfaBdBdFYkE"/>
{/*  Solution Grid SVG Layer (Animated)  */}
<div className="absolute inset-0 flex items-center justify-center">
<svg className="w-full h-full opacity-60" viewBox="0 0 1000 1000">
<path className="energy-line" d="M100 100 L900 100 L900 900 L100 900 Z" fill="none" stroke="#6dddff" strokeDasharray="10,20" strokeWidth="2"></path>
<path className="energy-line" d="M100 100 L900 900 M900 100 L100 900" fill="none" stroke="#c180ff" strokeDasharray="20,10" strokeWidth="1.5"></path>
<circle className="pulse-ring" cx="100" cy="100" fill="#080e1a" r="20" stroke="#6dddff" strokeWidth="4"></circle>
<circle className="pulse-ring" cx="900" cy="100" fill="#080e1a" r="20" stroke="#6dddff" strokeWidth="4"></circle>
<circle className="pulse-ring" cx="900" cy="900" fill="#080e1a" r="20" stroke="#6dddff" strokeWidth="4"></circle>
<circle className="pulse-ring" cx="100" cy="900" fill="#080e1a" r="20" stroke="#6dddff" strokeWidth="4"></circle>
<circle className="pulse-ring" cx="500" cy="500" fill="#080e1a" r="30" stroke="#c180ff" strokeWidth="4"></circle>
</svg>
</div>
</div>
</div>
</div>
</section>
{/*  AI INTELLIGENCE LAYER  */}
<section className="relative min-h-[1024px] flex items-center justify-center bg-surface px-8 overflow-hidden" data-stitch-vh="min-h-[1024px]===min-h-screen" id="intelligence">
<div className="absolute inset-0 overflow-hidden">
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full animate-ping opacity-20"></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-secondary/10 rounded-full animate-ping opacity-30" style={{animationDelay: "1s"}}></div>
</div>
<div className="relative z-10 max-w-screen-2xl w-full">
<div className="text-center mb-16">
<h2 className="font-headline text-4xl md:text-6xl font-bold text-on-surface mb-6">The Kinetic Intelligence</h2>
<p className="text-on-surface-variant max-w-2xl mx-auto">AI doesn't just manage the grid; it predicts the future of energy demand and optimizes flow before a single watt is wasted.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/*  Feature Card 1  */}
<div className="glass-panel p-8 rounded-2xl group hover:border-primary/50 transition-all duration-500">
<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
<span className="material-symbols-outlined">psychology</span>
</div>
<h4 className="font-headline text-xl font-bold text-on-surface mb-4">Predictive Load</h4>
<p className="text-on-surface-variant text-sm leading-relaxed mb-6">Analyzing weather patterns and historical usage to preemptively balance microgrid reserves.</p>
<div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary w-2/3"></div>
</div>
</div>
{/*  Feature Card 2  */}
<div className="glass-panel p-8 rounded-2xl group hover:border-secondary/50 transition-all duration-500 bg-surface-container-high">
<div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 text-secondary">
<span className="material-symbols-outlined">auto_graph</span>
</div>
<h4 className="font-headline text-xl font-bold text-on-surface mb-4">Autonomous Arbitrage</h4>
<p className="text-on-surface-variant text-sm leading-relaxed mb-6">Selling surplus energy to the main grid during peak pricing windows automatically.</p>
<div className="flex gap-2">
<div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
<div className="w-2 h-2 rounded-full bg-secondary/50"></div>
<div className="w-2 h-2 rounded-full bg-secondary/30"></div>
</div>
</div>
{/*  Feature Card 3  */}
<div className="glass-panel p-8 rounded-2xl group hover:border-tertiary/50 transition-all duration-500">
<div className="w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center mb-6 text-tertiary">
<span className="material-symbols-outlined">verified_user</span>
</div>
<h4 className="font-headline text-xl font-bold text-on-surface mb-4">Self-Healing Mesh</h4>
<p className="text-on-surface-variant text-sm leading-relaxed mb-6">Instant rerouting of energy if a node goes offline, maintaining 100% systemic integrity.</p>
<div className="text-[10px] font-headline text-tertiary/60 uppercase tracking-[0.2em]">Active Protection</div>
</div>
</div>
</div>
</section>
{/*  FINAL CTA SECTION  */}
<section className="min-h-[1024px] flex items-center justify-center bg-surface-container-low relative px-6 overflow-hidden" data-stitch-vh="min-h-[1024px]===min-h-screen">
<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
<div className="relative z-10 text-center max-w-4xl">
<h2 className="font-headline text-6xl md:text-9xl font-black text-on-surface mb-12 tracking-tighter italic">ENTER THE <span className="text-primary not-italic">GRID</span></h2>
<p className="text-on-surface-variant text-xl mb-12 max-w-xl mx-auto leading-relaxed">
                    The infrastructure is ready. Your autonomy starts here. Join the kinetic evolution of global power.
                </p>
<div className="flex flex-col sm:flex-row gap-6 justify-center">
<button onClick={onLaunch} className="px-12 py-5 bg-primary text-on-primary font-headline font-bold uppercase tracking-widest text-sm rounded-lg hover:shadow-[0_0_30px_rgba(109,221,255,0.4)] transition-all">
                        Launch Dashboard
                    </button>
<button className="px-12 py-5 border border-primary/20 text-primary font-headline font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-primary/5 transition-all">
                        Contact Solutions
                    </button>
</div>
<div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
<div className="font-headline text-[10px] uppercase tracking-[0.3em]">SECURE ACCESS</div>
<div className="font-headline text-[10px] uppercase tracking-[0.3em]">AES-256 SYNC</div>
<div className="font-headline text-[10px] uppercase tracking-[0.3em]">REAL-TIME SYNC</div>
<div className="font-headline text-[10px] uppercase tracking-[0.3em]">GLOBAL READY</div>
</div>
</div>
</section>
{/*  Footer  */}
<footer className="bg-[#080e1a] w-full py-12 px-8 border-t border-cyan-900/20">
<div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-screen-2xl mx-auto">
<div className="text-lg font-black text-slate-300 font-headline">GridMind</div>
<div className="font-body text-sm text-slate-500">© 2024 GridMind. All systems autonomous.</div>
<div className="flex gap-8">
<a className="font-body text-sm text-slate-600 hover:text-cyan-400 transition-colors" href="#">Privacy</a>
<a className="font-body text-sm text-slate-600 hover:text-cyan-400 transition-colors" href="#">Terms</a>
<a className="font-body text-sm text-slate-600 hover:text-cyan-400 transition-colors" href="#">System Health</a>
</div>
</div>
</footer>
</main>
</div>
  );
}
