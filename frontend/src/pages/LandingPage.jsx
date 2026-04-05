import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/* ═══════════════════════════════════════════════════════════
   AetherGrid Landing Page — Pixel-perfect Stitch recreation
   Scroll-expanding hero + storytelling reveal sections
   ═══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const navigate = useNavigate()

  // Refs for the scroll-expansion hero
  const mediaRef = useRef(null)
  const innerContentRef = useRef(null)
  const titleLeftRef = useRef(null)
  const titleRightRef = useRef(null)
  const heroImgRef = useRef(null)

  useEffect(() => {
    // ── 1. Hero scroll-expansion logic ────────────────────
    const handleScroll = () => {
      const scrollPos = window.scrollY
      const windowHeight = window.innerHeight
      const scrollRange = windowHeight * 1.5

      let progress = Math.min(scrollPos / scrollRange, 1)

      const media = mediaRef.current
      const inner = innerContentRef.current
      const left = titleLeftRef.current
      const right = titleRightRef.current
      const img = heroImgRef.current

      if (!media || !inner || !left || !right || !img) return

      // Container expansion
      const currentWidth = 40 + progress * 60
      const currentHeight = 60 + progress * 40
      const currentRadius = progress > 0.8 ? 0 : (1 - progress) * 100

      media.style.width = `${currentWidth}vw`
      media.style.height = `${currentHeight}vh`
      media.style.borderRadius = `${currentRadius}%`

      // Image parallax
      img.style.transform = `scale(${1.1 - progress * 0.1})`

      // Text split
      const splitOffset = progress * 100
      left.style.transform = `translateX(-${splitOffset}vw)`
      right.style.transform = `translateX(${splitOffset}vw)`

      // Inner content fade
      if (progress > 0.5) {
        const cp = (progress - 0.5) * 2
        inner.style.opacity = cp
        inner.style.pointerEvents = 'auto'
        inner.style.transform = `translateY(${(1 - cp) * 20}px)`
      } else {
        inner.style.opacity = 0
        inner.style.pointerEvents = 'none'
      }

      // Hide title when fully split
      const titleWrap = left.parentElement
      if (titleWrap) {
        titleWrap.style.opacity = progress > 0.95 ? 0 : 1 - progress
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // init

    // ── 2. Intersection observer for reveal sections ──────
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.reveal-section').forEach((s) => observer.observe(s))

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* ── Top Navigation ──────────────────────────────────── */}
      <nav
        style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 100,
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(48px)',
          WebkitBackdropFilter: 'blur(48px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 2rem', maxWidth: '1536px', margin: '0 auto',
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.05em', color: '#18181b' }}>
            AetherGrid
          </div>
          <div className="hide-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#" style={{ color: '#047857', fontWeight: 600, borderBottom: '2px solid #10b981', paddingBottom: '4px', textDecoration: 'none', fontSize: '0.875rem' }}>Grid Intelligence</a>
            <a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Solar Yield</a>
            <a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Sustainability</a>
            <a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Architecture</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="material-symbols-outlined" style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%', fontSize: '24px' }}>notifications</span>
            <span className="material-symbols-outlined" style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%', fontSize: '24px' }}>account_circle</span>
            <button
              onClick={() => navigate('/simulation')}
              style={{
                background: 'linear-gradient(to right, #006d36, #4ade80)',
                color: '#fff', padding: '0.75rem 2rem', borderRadius: '9999px',
                fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.875rem',
                boxShadow: '0 4px 14px rgba(0,109,54,0.25)',
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO EXPANSION SECTION ───────────────────────── */}
        <section className="hero-sticky-container" style={{ position: 'relative' }}>
          <div className="sticky-wrapper">
            {/* Background media container */}
            <div
              ref={mediaRef}
              id="hero-media-container"
              style={{
                position: 'relative', width: '40vw', height: '60vh',
                borderRadius: '9999px', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                zIndex: 10, background: '#18181b',
              }}
            >
              <img
                ref={heroImgRef}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPB3DU7d4KYGx8oDPn3u81RFHUQZ6Kx1XAxMoOzAdylYLSLpjG9AeR5nQjhQBdashIp4WG1oDjJTYVZncbJt3MFbPgDuIg0SCP_oFktvJ9rVIooM1ZEIyW4lxgLEir14cO8BEYMSLhB7Ww4_Rud7gTQ9-9cJMcqZ8R6Prc96yXz3yS_phImjECs79gSWCyk2MLFxd1nIqxApf3701UqKnBeapd-NISne3IQoaWp6i5UKYH4rfYUrTcHCpkZuRsG6U_dmdeP025oGBt"
                alt="Ultra-modern sustainable house with solar panels"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.1)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />

              {/* Inner content (fades in on scroll) */}
              <div
                ref={innerContentRef}
                style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                  padding: '2rem', opacity: 0, pointerEvents: 'none',
                }}
              >
                <p style={{
                  color: 'rgba(255,255,255,0.85)', fontSize: '1.25rem',
                  maxWidth: '42rem', fontWeight: 500, lineHeight: 1.7, marginBottom: '2rem',
                }}>
                  AetherGrid transforms your living space into a high-performance energy ecosystem,
                  blending aesthetic intelligence with decentralized solar mastery.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => navigate('/simulation')}
                    style={{
                      background: '#006d36', color: '#fff', padding: '1rem 2.5rem',
                      borderRadius: '9999px', fontWeight: 700, fontSize: '1.125rem',
                      border: 'none', cursor: 'pointer',
                      boxShadow: '0 20px 40px rgba(0,109,54,0.3)',
                    }}
                  >
                    Launch Simulation
                  </button>
                  <button style={{
                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)',
                    color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                    padding: '1rem 2.5rem', borderRadius: '9999px',
                    fontWeight: 700, fontSize: '1.125rem', cursor: 'pointer',
                  }}>
                    Explore Tech
                  </button>
                </div>
              </div>
            </div>

            {/* Title that splits */}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 20, pointerEvents: 'none', overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                fontSize: 'clamp(3rem, 10vw, 10rem)',
                fontWeight: 800, letterSpacing: '-0.05em', whiteSpace: 'nowrap',
              }}>
                <span ref={titleLeftRef} id="hero-title-left" style={{ color: 'var(--on-surface)' }}>
                  THE ENERGY
                </span>
                <span ref={titleRightRef} id="hero-title-right" className="text-gradient-primary">
                  CURATOR.
                </span>
              </div>
            </div>

            {/* Scroll indicator */}
            <div style={{
              position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
              zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center',
              color: 'var(--on-surface-variant)', gap: '0.5rem',
              animation: 'bounce 1.5s infinite',
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Scroll to Begin
              </span>
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </section>

        {/* ── Section 2: Systemic Vulnerability ────────────── */}
        <section className="reveal-section" style={{
          padding: '8rem 2rem', background: 'var(--surface-container-low)',
          position: 'relative', zIndex: 40,
        }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '6rem', alignItems: 'center',
            }}>
              {/* Image card */}
              <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', background: '#18181b', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXz1fUdfT887T97S9wUjXos0Id6bOV7Yo1zqR0TMrXXi26dawF-C5GSCfZTXS4yKw0Mjkof6nmp1GesT70VxjOGeLzkjsBZB4TYtnHt40KN1Ug0-QuGp-kX6TjoQ7EdQxBdfl2H2KfxJv3ZM1DiLuQfZoRoBN_nmk5tfYMRN5rEnR__9ZoJjRzvjH6VXPukHQYXsa797gi6W4FhtajRlc2N7KtyIbSriqGvT1I9Kxu_gYmZ_xtay8GcIQnInsuwYmUzs6AOHXA0zK7"
                    alt="City blackout aerial view"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' }}
                  />
                </div>
                <div style={{ zIndex: 10, textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '4.5rem', color: 'var(--error)', marginBottom: '1.5rem', display: 'block' }}>broken_image</span>
                  <h3 style={{ color: '#fff', fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem' }}>Systemic Vulnerability</h3>
                  <p style={{ color: '#a1a1aa' }}>Traditional grids are built on fragile, centralized nodes—one failure cascades into total darkness.</p>
                </div>
              </div>

              {/* Text content */}
              <div>
                <span style={{ color: 'var(--error)', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>
                  The Problem
                </span>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '2rem', lineHeight: 1.1 }}>
                  The invisible <br /> fragility of legacy.
                </h2>
                <p style={{ fontSize: '1.125rem', color: 'var(--on-surface-variant)', marginBottom: '3rem', lineHeight: 1.7 }}>
                  Yesterday&apos;s grid was designed for a different century. It&apos;s rigid, opaque, and increasingly
                  unable to handle the volatility of the modern climate and the surge of renewable peaks.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ background: 'var(--error-container)', padding: '1rem', borderRadius: '9999px', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--error)' }}>priority_high</span>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>Single Point of Failure</h4>
                      <p style={{ color: 'var(--on-surface-variant)' }}>Central power plants leave communities exposed to weather-related outages.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ background: 'var(--error-container)', padding: '1rem', borderRadius: '9999px', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--error)' }}>trending_down</span>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>Efficiency Loss</h4>
                      <p style={{ color: 'var(--on-surface-variant)' }}>Up to 15% of energy is lost during transmission before it reaches your home.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Distributed Harmony ───────────────── */}
        <section className="reveal-section" style={{
          padding: '6rem 2rem', textAlign: 'center', background: '#fff',
          position: 'relative', zIndex: 40,
        }}>
          <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block' }}>
              The Paradigm Shift
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 800, letterSpacing: '-0.05em', marginBottom: '3rem', lineHeight: 1.1 }}>
              From central command to{' '}
              <span className="text-gradient-primary">distributed harmony.</span>
            </h2>
            <div style={{ position: 'relative', height: '1px', width: '100%', background: 'linear-gradient(to right, transparent, var(--outline-variant), transparent)', margin: '4rem 0' }}>
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '-1rem', background: '#fff', padding: '0 1rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '2rem' }}>swap_horiz</span>
              </div>
            </div>
            <p style={{ fontSize: '1.25rem', color: 'var(--on-surface-variant)', fontStyle: 'italic', fontWeight: 500 }}>
              &quot;We are not just changing how we power our homes; we are changing how our homes empower the world.&quot;
            </p>
          </div>
        </section>

        {/* ── Section 4: Solution Reveal ────────────────────── */}
        <section className="reveal-section" style={{
          padding: '8rem 2rem', overflow: 'hidden',
          background: 'var(--surface-container-low)', position: 'relative', zIndex: 40,
        }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '4rem', alignItems: 'center',
            }}>
              <div>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '2rem', lineHeight: 1.1 }}>
                  Autonomous <br /> Energy Resilience.
                </h2>
                <p style={{ fontSize: '1.125rem', color: 'var(--on-surface-variant)', marginBottom: '3rem', lineHeight: 1.7 }}>
                  Your home becomes its own utility. AetherGrid microgrids store solar yield locally
                  and share surpluses with the neighborhood—creating a self-healing, living network.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {[
                    { icon: 'solar_power', label: 'Solar Harvesting', desc: 'Intelligent tracking optimizes every ray of light.', color: 'var(--primary)' },
                    { icon: 'battery_charging_full', label: 'Smart Storage', desc: 'Solid-state reserves for 24/7 reliability.', color: 'var(--secondary)' },
                    { icon: 'hub', label: 'Grid Sharing', desc: 'Monetize your excess energy automatically.', color: 'var(--primary)' },
                    { icon: 'verified_user', label: 'Total Autonomy', desc: 'Seamless island-mode during grid outages.', color: 'var(--secondary)' },
                  ].map((item) => (
                    <div key={item.label} style={{
                      background: 'var(--surface-container-lowest)', padding: '2rem',
                      borderRadius: '9999px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(188,202,187,0.1)', textAlign: 'center',
                    }}>
                      <span className="material-symbols-outlined" style={{ color: item.color, fontSize: '1.875rem', marginBottom: '1rem', display: 'block', fontVariationSettings: "'FILL' 1" }}>
                        {item.icon}
                      </span>
                      <h4 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem' }}>{item.label}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Circular image w/ spinning border */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  aspectRatio: '1', borderRadius: '9999px', border: '2px dashed rgba(0,109,54,0.2)',
                  position: 'absolute', inset: '-2.5rem',
                  animation: 'spin-slow 20s linear infinite',
                }} />
                <div style={{ position: 'relative', zIndex: 10, borderRadius: '9999px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsqcRS5WifMRpACcqsHIFleApuVmLmVev3EmtooKA0_00t58lXjCwStZZ07mIHfGAsD9DFMCCd3dnkfLtYbQQNZ1pRCwjL-frQOuPo5nhhfgtgPvyqC_azs-FwWdyTV6hpkkPAko4c4G5_IKegggDbWIUPRMSsph8S_sB7M5tiqhwQ9fpOcpj-Ja1w5Y-IXobCJ3YVZxQDBk9DxrnfsAZAqfP_GI4S4Yiek68hH2yczdve_Hlhc1llFTycuVMwgyL4M2a2qE-1fDQf"
                    alt="Futuristic city at sunset"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: AI Layer (dark) ────────────────────── */}
        <section className="reveal-section" style={{
          padding: '8rem 2rem', background: 'var(--on-background)', color: '#fff',
          position: 'relative', overflow: 'hidden', zIndex: 40,
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '33%', height: '100%', background: 'linear-gradient(to left, rgba(0,109,54,0.2), transparent)' }} />
          <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: '42rem', marginBottom: '5rem' }}>
              <span style={{ color: 'var(--primary-container)', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block' }}>
                Intelligence Layer
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '2rem', lineHeight: 1.1 }}>
                The Mind inside <br /> the Machine.
              </h2>
              <p style={{ fontSize: '1.25rem', color: '#71717a' }}>
                AetherGrid&apos;s AI doesn&apos;t just monitor—it predicts. Weather patterns, consumption habits,
                and grid pricing are processed in real-time to maximize impact.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {[
                { value: '98%', label: 'Predictive Accuracy', desc: 'Neural networks forecast demand based on behavioral signals and historical climate data.', color: 'var(--primary-container)' },
                { value: '0ms', label: 'Transfer Latency', desc: "Switching from grid to solar is instantaneous. Your electronics will never notice the transition.", color: 'var(--secondary-fixed-dim)' },
                { value: '40%', label: 'Avg. Efficiency Gain', desc: 'Machine learning optimizes battery discharge cycles to extend hardware life.', color: 'var(--primary-container)' },
              ].map((item) => (
                <div key={item.label} style={{
                  background: 'rgba(24,24,27,0.5)', backdropFilter: 'blur(20px)',
                  padding: '2.5rem', borderRadius: '1.5rem',
                  border: '1px solid rgba(63,63,70,1)',
                }}>
                  <div style={{ fontSize: '3rem', fontWeight: 300, color: item.color, marginBottom: '1.5rem' }}>
                    {item.value}
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{item.label}</h4>
                  <p style={{ color: '#71717a' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 6: Final CTA ─────────────────────────── */}
        <section className="reveal-section" style={{
          padding: '10rem 2rem', background: '#fff',
          position: 'relative', zIndex: 40,
        }}>
          <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span
                className="material-symbols-outlined"
                style={{ color: 'var(--primary)', fontSize: '4.5rem', fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800,
              letterSpacing: '-0.05em', marginBottom: '2.5rem', lineHeight: 1.1,
            }}>
              Ready to curate your <br />
              <span className="text-gradient-primary">energy future?</span>
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/simulation')}
                style={{
                  background: 'var(--primary)', color: '#fff',
                  padding: '1.25rem 3rem', borderRadius: '9999px',
                  fontWeight: 700, fontSize: '1.25rem', border: 'none', cursor: 'pointer',
                  boxShadow: '0 25px 50px -12px rgba(0,109,54,0.3)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Get Started Today
              </button>
              <button style={{
                background: 'var(--surface-container-low)', color: 'var(--on-surface)',
                padding: '1.25rem 3rem', borderRadius: '9999px',
                fontWeight: 700, fontSize: '1.25rem', border: 'none', cursor: 'pointer',
                transition: 'background 0.2s',
              }}>
                Request Consultation
              </button>
            </div>
            <p style={{ marginTop: '3rem', color: 'var(--on-surface-variant)' }}>
              Join 15,000+ homes powered by AetherGrid intelligence.
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{
        background: '#fafafa', padding: '4rem 2rem',
        borderTop: '1px solid rgba(228,228,231,0.3)', position: 'relative', zIndex: 40,
      }}>
        <div style={{
          maxWidth: '80rem', margin: '0 auto', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#18181b', marginBottom: '1rem' }}>AetherGrid</div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#71717a', maxWidth: '24rem' }}>
              © 2024 AetherGrid. Redefining the digital curation of sustainable energy. Built for the modern architect.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'flex-end' }}>
            {['Impact Report', 'Privacy Policy', 'Grid API', 'Contact Us'].map((link) => (
              <a key={link} href="#" style={{ color: '#71717a', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* bounce keyframe for scroll indicator */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
