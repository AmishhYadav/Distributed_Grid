import { useEffect } from 'react';
import './LandingPage.css';

export default function LandingPage({ onLaunch }) {

  useEffect(() => {
    const mediaContainer = document.getElementById('hero-media-container');
    const heroInnerContent = document.getElementById('hero-inner-content');
    const titleLeft = document.getElementById('hero-title-left');
    const titleRight = document.getElementById('hero-title-right');
    const heroImg = document.getElementById('hero-img');

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const scrollRange = windowHeight * 1.5;

      let progress = Math.min(scrollPos / scrollRange, 1);

      if (mediaContainer) {
        const startSize = Math.min(windowWidth * 0.7, 900);
        const currentWidth = startSize + (progress * (windowWidth - startSize));
        const currentHeight = startSize + (progress * (windowHeight - startSize));
        const currentRadius = progress > 0.8 ? 0 : (1 - progress) * 50;

        mediaContainer.style.width = `${currentWidth}px`;
        mediaContainer.style.height = `${currentHeight}px`;
        mediaContainer.style.borderRadius = `${currentRadius}%`;
        mediaContainer.style.maxWidth = 'none';
        mediaContainer.style.maxHeight = 'none';
      }

      if (heroImg) {
        heroImg.style.transform = `scale(${1.1 - (progress * 0.1)})`;
      }

      const splitOffset = progress * 100;
      if (titleLeft) titleLeft.style.transform = `translateX(-${splitOffset}vw)`;
      if (titleRight) titleRight.style.transform = `translateX(${splitOffset}vw)`;

      if (heroInnerContent) {
        if (progress > 0.5) {
          const contentProgress = (progress - 0.5) * 2;
          heroInnerContent.style.opacity = contentProgress;
          heroInnerContent.style.pointerEvents = 'auto';
          heroInnerContent.style.transform = `translateY(${(1 - contentProgress) * 20}px)`;
        } else {
          heroInnerContent.style.opacity = 0;
          heroInnerContent.style.pointerEvents = 'none';
        }
      }

      if (titleLeft && titleLeft.parentElement) {
        if (progress > 0.95) {
          titleLeft.parentElement.style.opacity = 0;
        } else {
          titleLeft.parentElement.style.opacity = 1 - progress;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-section').forEach(section => {
      sectionObserver.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="aethergrid-landing text-[#191c1e]">

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-3xl shadow-sm">
        <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-zinc-900">AetherGrid</div>
          <div className="hidden md:flex gap-8 items-center">
            <a className="text-emerald-700 font-semibold border-b-2 border-emerald-500 pb-1 tracking-tight" href="#">Grid Intelligence</a>
            <a className="text-zinc-600 hover:text-emerald-600 transition-colors tracking-tight font-medium" href="#">Solar Yield</a>
            <a className="text-zinc-600 hover:text-emerald-600 transition-colors tracking-tight font-medium" href="#">Sustainability</a>
            <a className="text-zinc-600 hover:text-emerald-600 transition-colors tracking-tight font-medium" href="#">Architecture</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined p-2 hover:bg-zinc-100/50 rounded-full transition-all cursor-pointer">notifications</span>
            <span className="material-symbols-outlined p-2 hover:bg-zinc-100/50 rounded-full transition-all cursor-pointer">account_circle</span>
            <button onClick={onLaunch} className="bg-gradient-to-r from-[#006d36] to-[#4ade80] text-white px-8 py-3 rounded-full font-semibold shadow-md active:scale-95 transition-all">Get Started</button>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO EXPANSION SECTION */}
        <section className="hero-sticky-container relative z-0">
          <div className="sticky-wrapper">
            {/* Background Media that expands */}
            <div className="relative w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full overflow-hidden shadow-2xl z-10 bg-zinc-900 mx-auto flex-shrink-0" id="hero-media-container">
              <img className="w-full h-full object-cover scale-110" alt="Ultra-modern minimalist sustainable house with glass walls and rooftop solar panels" id="hero-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPB3DU7d4KYGx8oDPn3u81RFHUQZ6Kx1XAxMoOzAdylYLSLpjG9AeR5nQjhQBdashIp4WG1oDjJTYVZncbJt3MFbPgDuIg0SCP_oFktvJ9rVIooM1ZEIyW4lxgLEir14cO8BEYMSLhB7Ww4_Rud7gTQ9-9cJMcqZ8R6Prc96yXz3yS_phImjECs79gSWCyk2MLFxd1nIqxApf3701UqKnBeapd-NISne3IQoaWp6i5UKYH4rfYUrTcHCpkZuRsG6U_dmdeP025oGBt" />
              <div className="absolute inset-0 bg-black/20"></div>
              {/* Inner Content that appears as it expands */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 opacity-0 pointer-events-none" id="hero-inner-content">
                <p className="text-white/80 text-xl max-w-2xl font-medium leading-relaxed mb-8">
                  AetherGrid transforms your living space into a high-performance energy ecosystem, blending aesthetic intelligence with decentralized solar mastery.
                </p>
                <div className="flex gap-4">
                  <button onClick={onLaunch} className="bg-[#006d36] text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all">Launch Simulation</button>
                  <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all">Explore Tech</button>
                </div>
              </div>
            </div>
            {/* Title that splits */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center z-20 pointer-events-none overflow-hidden">
              <div className="flex items-center gap-4 text-6xl md:text-[10rem] font-extrabold tracking-tighter whitespace-nowrap">
                <span className="text-[#191c1e]" id="hero-title-left">THE ENERGY</span>
                <span className="text-gradient-primary" id="hero-title-right">CURATOR.</span>
              </div>
            </div>
            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-[#3d4a3e] gap-2 animate-bounce">
              <span className="text-xs font-bold uppercase tracking-widest">Scroll to Begin</span>
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </section>

        {/* Content sections that scroll OVER the expanded hero */}
        <div className="content-over-hero relative z-10 -mt-[100vh]">

          {/* Stage 2: Systemic Vulnerability */}
          <section className="reveal-section py-32 px-8 bg-[#f2f4f6] relative z-40" id="vulnerability-section">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                <div className="order-2 md:order-1">
                  <div className="relative rounded-lg overflow-hidden bg-zinc-900 aspect-square flex items-center justify-center p-12 shadow-2xl">
                    <div className="absolute inset-0 opacity-40">
                      <img className="w-full h-full object-cover grayscale" alt="Aerial drone view of a dark sprawling city during a massive blackout" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXz1fUdfT887T97S9wUjXos0Id6bOV7Yo1zqR0TMrXXi26dawF-C5GSCfZTXS4yKw0Mjkof6nmp1GesT70VxjOGeLzkjsBZB4TYtnHt40KN1Ug0-QuGp-kX6TjoQ7EdQxBdfl2H2KfxJv3ZM1DiLuQfZoRoBN_nmk5tfYMRN5rEnR__9ZoJjRzvjH6VXPukHQYXsa797gi6W4FhtajRlc2N7KtyIbSriqGvT1I9Kxu_gYmZ_xtay8GcIQnInsuwYmUzs6AOHXA0zK7" />
                    </div>
                    <div className="z-10 text-center">
                      <span className="material-symbols-outlined text-[#ba1a1a] text-7xl mb-6">broken_image</span>
                      <h3 className="text-white text-3xl font-bold mb-4">Systemic Vulnerability</h3>
                      <p className="text-zinc-400">Traditional grids are built on fragile, centralized nodes—one failure cascades into total darkness.</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <span className="text-[#ba1a1a] font-bold tracking-widest text-xs uppercase mb-4 block">The Problem</span>
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">The invisible <br /> fragility of legacy.</h2>
                  <p className="text-lg text-[#3d4a3e] mb-12">Yesterday&apos;s grid was designed for a different century. It&apos;s rigid, opaque, and increasingly unable to handle the volatility of the modern climate and the surge of renewable peaks.</p>
                  <div className="space-y-8">
                    <div className="flex gap-6 items-start">
                      <div className="bg-[#ffdad6] p-4 rounded-full">
                        <span className="material-symbols-outlined text-[#ba1a1a]">priority_high</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xl mb-1">Single Point of Failure</h4>
                        <p className="text-[#3d4a3e]">Central power plants leave communities exposed to weather-related outages.</p>
                      </div>
                    </div>
                    <div className="flex gap-6 items-start">
                      <div className="bg-[#ffdad6] p-4 rounded-full">
                        <span className="material-symbols-outlined text-[#ba1a1a]">trending_down</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xl mb-1">Efficiency Loss</h4>
                        <p className="text-[#3d4a3e]">Up to 15% of energy is lost during transmission before it reaches your home.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stage 3: Distributed Harmony */}
          <section className="reveal-section py-24 px-8 text-center bg-white relative z-40">
            <div className="max-w-4xl mx-auto">
              <span className="text-[#006d36] font-bold tracking-widest text-xs uppercase mb-6 block">The Paradigm Shift</span>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-12">From central command to <span className="text-gradient-primary">distributed harmony.</span></h2>
              <div className="relative h-px w-full bg-gradient-to-r from-transparent via-[#bccabb]/30 to-transparent my-16">
                <div className="absolute left-1/2 -translate-x-1/2 -top-4 bg-white px-4">
                  <span className="material-symbols-outlined text-[#006d36] text-4xl">swap_horiz</span>
                </div>
              </div>
              <p className="text-xl text-[#3d4a3e] italic font-medium">&quot;We are not just changing how we power our homes; we are changing how our homes empower the world.&quot;</p>
            </div>
          </section>

          {/* Solution Reveal */}
          <section className="reveal-section py-32 px-8 overflow-hidden bg-[#f2f4f6] relative z-40">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Autonomous <br /> Energy Resilience.</h2>
                  <p className="text-lg text-[#3d4a3e] mb-12">Your home becomes its own utility. AetherGrid microgrids store solar yield locally and share surpluses with the neighborhood—creating a self-healing, living network.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-full shadow-sm border border-[#bccabb]/10 text-center">
                      <span className="material-symbols-outlined text-[#006d36] text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>solar_power</span>
                      <h4 className="font-bold text-lg mb-2">Solar Harvesting</h4>
                      <p className="text-sm text-[#3d4a3e]">Intelligent tracking optimizes every ray of light.</p>
                    </div>
                    <div className="bg-white p-8 rounded-full shadow-sm border border-[#bccabb]/10 text-center">
                      <span className="material-symbols-outlined text-[#00668a] text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>battery_charging_full</span>
                      <h4 className="font-bold text-lg mb-2">Smart Storage</h4>
                      <p className="text-sm text-[#3d4a3e]">Solid-state reserves for 24/7 reliability.</p>
                    </div>
                    <div className="bg-white p-8 rounded-full shadow-sm border border-[#bccabb]/10 text-center">
                      <span className="material-symbols-outlined text-[#006d36] text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                      <h4 className="font-bold text-lg mb-2">Grid Sharing</h4>
                      <p className="text-sm text-[#3d4a3e]">Monetize your excess energy automatically.</p>
                    </div>
                    <div className="bg-white p-8 rounded-full shadow-sm border border-[#bccabb]/10 text-center">
                      <span className="material-symbols-outlined text-[#00668a] text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                      <h4 className="font-bold text-lg mb-2">Total Autonomy</h4>
                      <p className="text-sm text-[#3d4a3e]">Seamless island-mode during grid outages.</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-full border-2 border-dashed border-[#006d36]/20 absolute -inset-10 animate-[spin_20s_linear_infinite]"></div>
                  <div className="relative z-10 rounded-full overflow-hidden shadow-2xl">
                    <img className="w-full h-full object-cover" alt="Conceptual visualization of a futuristic city at sunset" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsqcRS5WifMRpACcqsHIFleApuVmLmVev3EmtooKA0_00t58lXjCwStZZ07mIHfGAsD9DFMCCd3dnkfLtYbQQNZ1pRCwjL-frQOuPo5nhhfgtgPvyqC_azs-FwWdyTV6hpkkPAko4c4G5_IKegggDbWIUPRMSsph8S_sB7M5tiqhwQ9fpOcpj-Ja1w5Y-IXobCJ3YVZxQDBk9DxrnfsAZAqfP_GI4S4Yiek68hH2yczdve_Hlhc1llFTycuVMwgyL4M2a2qE-1fDQf" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Layer */}
          <section className="reveal-section py-32 px-8 bg-[#191c1e] text-white relative overflow-hidden z-40">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#006d36]/20 to-transparent"></div>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="max-w-2xl mb-20">
                <span className="text-[#4ade80] font-bold tracking-widest text-xs uppercase mb-6 block">Intelligence Layer</span>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">The Mind inside <br /> the Machine.</h2>
                <p className="text-xl text-zinc-400">AetherGrid&apos;s AI doesn&apos;t just monitor—it predicts. Weather patterns, consumption habits, and grid pricing are processed in real-time to maximize impact.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-zinc-900/50 backdrop-blur-xl p-10 rounded-3xl border border-zinc-800">
                  <div className="text-5xl font-light text-[#4ade80] mb-6">98%</div>
                  <h4 className="text-xl font-bold mb-4">Predictive Accuracy</h4>
                  <p className="text-zinc-500">Neural networks forecast demand based on behavioral signals and historical climate data.</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-xl p-10 rounded-3xl border border-zinc-800">
                  <div className="text-5xl font-light text-[#7bd0ff] mb-6">0ms</div>
                  <h4 className="text-xl font-bold mb-4">Transfer Latency</h4>
                  <p className="text-zinc-500">Switching from grid to solar is instantaneous. Your electronics will never notice the transition.</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-xl p-10 rounded-3xl border border-zinc-800">
                  <div className="text-5xl font-light text-[#4ade80] mb-6">40%</div>
                  <h4 className="text-xl font-bold mb-4">Avg. Efficiency Gain</h4>
                  <p className="text-zinc-500">Machine learning optimizes battery discharge cycles to extend hardware life.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="reveal-section py-40 px-8 bg-white relative z-40">
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-12 inline-block">
                <span className="material-symbols-outlined text-[#006d36] text-7xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-10 leading-tight">Ready to curate your <br /> <span className="text-gradient-primary">energy future?</span></h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button onClick={onLaunch} className="bg-[#006d36] text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-transform">Get Started Today</button>
                <button className="bg-[#f2f4f6] text-[#191c1e] px-12 py-5 rounded-full font-bold text-xl hover:bg-[#e6e8ea] transition-colors">Request Consultation</button>
              </div>
              <p className="mt-12 text-[#3d4a3e]">Join 15,000+ homes powered by AetherGrid intelligence.</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-zinc-50 py-16 px-8 border-t border-zinc-100/10 relative z-40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-lg font-bold text-zinc-900 mb-4">AetherGrid</div>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-sm">
              © 2024 AetherGrid. Redefining the digital curation of sustainable energy. Built for the modern architect.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 md:justify-end">
            <a className="text-zinc-500 hover:text-emerald-500 transition-all duration-300 text-sm" href="#">Impact Report</a>
            <a className="text-zinc-500 hover:text-emerald-500 transition-all duration-300 text-sm" href="#">Privacy Policy</a>
            <a className="text-zinc-500 hover:text-emerald-500 transition-all duration-300 text-sm" href="#">Grid API</a>
            <a className="text-zinc-500 hover:text-emerald-500 transition-all duration-300 text-sm" href="#">Contact Us</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
