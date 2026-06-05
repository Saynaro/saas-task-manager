import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  ArrowRight, Command, Check, Layers, Users,
  ChevronDown, Search, FileText, Globe, CheckSquare, BarChart3, Settings, Bell, Play, Info, Activity, Zap, History
} from 'lucide-react';
import LineWaves from '../components/background/LineWaves';
import LightRays from '../components/background/LightRays';
import { toast } from 'react-hot-toast';
import './LandingPage.css';

export function LandingPage({ currentUser }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoSlide, setDemoSlide] = useState(0);

  const demoSlides = [
    {
      title: 'Smart Dashboard',
      description: 'Track all your projects at a glance. Real-time metrics, project distribution charts, and priority breakdowns — all in one unified view.',
      icon: <BarChart3 size={20} />,
      accent: '#3b82f6',
      features: ['Real-time analytics', 'Priority charts', 'Team metrics'],
    },
    {
      title: 'Task Management',
      description: 'Create, assign, and track tasks with rich details — priorities, deadlines, labels, and attachments. Never miss a deadline again.',
      icon: <CheckSquare size={20} />,
      accent: '#8b5cf6',
      features: ['Priority levels', 'Smart deadlines', 'File attachments'],
    },
    {
      title: 'Team Collaboration',
      description: 'Invite teammates, set roles, and manage permissions with ease. Everyone stays aligned with a shared workspace and activity feed.',
      icon: <Users size={20} />,
      accent: '#06b6d4',
      features: ['Role management', 'Activity feed', 'Shared workspace'],
    },
    {
      title: 'Activity & History',
      description: 'Full audit trail of every action in your workspace. Know exactly what changed, when, and by whom — total transparency.',
      icon: <History size={20} />,
      accent: '#10b981',
      features: ['Full audit log', 'Change tracking', 'Team insights'],
    },
  ];

  const openDemo = () => {
    setDemoSlide(0);
    setIsDemoOpen(true);
  };

  const closeDemo = () => setIsDemoOpen(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Set viewport theme-color for Safari top bar
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    const previousTheme = meta.getAttribute('content');
    meta.setAttribute('content', '#030712');

    return () => {
      if (previousTheme) {
        meta.setAttribute('content', previousTheme);
      } else {
        meta.removeAttribute('content');
      }
    };
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('shouldScrollToFooter') === 'true') {
      sessionStorage.removeItem('shouldScrollToFooter');
      const timeoutId = setTimeout(() => {
        const footerElement = document.querySelector('.landing-site-footer');
        if (footerElement) {
          footerElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleLinkClick = (e, label) => {
    e.preventDefault();
    toast.success(`${label} section is coming soon!`, {
      icon: '',
      style: {
        background: '#1c3761ff',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }
    });
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <span className="nav-logo-text">SaaS Pro</span>
          </Link>
          <div className="nav-links-row">
            <a href="#features" className="nav-link-item" onClick={(e) => handleScroll(e, 'features')}>Features</a>
            <a href="#analytics" className="nav-link-item" onClick={(e) => handleScroll(e, 'analytics')}>Analytics</a>
            <a href="#about" className="nav-link-item" onClick={(e) => handleScroll(e, 'about')}>About Us</a>
          </div>
        </div>

        <div className="nav-right">
          {currentUser ? (
            <Link to="/dashboard" className="nav-btn nav-btn-primary">
              <span className="desktop-nav-txt">Go to Dashboard</span>
              <span className="mobile-nav-txt">Dashboard</span>
              <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-link-btn">Sign In</Link>
              <Link to="/register" className="nav-btn nav-btn-primary nav-btn-solid">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-canvas">
          <LineWaves
            speed={0.12}
            innerLineCount={isMobile ? 18 : 40}
            outerLineCount={isMobile ? 18 : 40}
            warpIntensity={0.3}
            rotation={isMobile ? -20 : -45}
            edgeFadeWidth={0.0}
            colorCycleSpeed={0.4}
            brightness={0.3}
            color1="#3b82f6"
            color2="#8b5cf6"
            color3="#06b6d4"
            enableMouseInteraction={true}
            mouseInfluence={1.5}
          />
        </div>
        <div className="hero-content">


          <h1 className="hero-title">
            Manage projects professionally with <span className="blue-text">SaaS Pro</span>
          </h1>
          <p className="hero-subtitle">
            Your ideal workspace for task planning, analytics, and team collaboration. All tools in one place.
          </p>

          <div className="hero-ctas">
            {currentUser ? (
              <button onClick={() => navigate('/dashboard')} className="hero-btn-primary">
                Open Workspace <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/register')} className="hero-btn-primary">
                  Get Started for Free
                </button>
                <button onClick={openDemo} className="hero-btn-secondary">
                  <Play size={14} className="play-icon-visual" /> Watch Demo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Real Product visual Mockup matching the screenshot */}
        <div className="hero-mockup-wrapper animate-slide-up">
          <div className="mockup-frame">
            {/* Top Browser Bar */}
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="mockup-search-bar">
                <Command size={12} />
                <span>saaspro.com/dashboard</span>
              </div>
            </div>

            {/* Core App Layout Mock */}
            <div className="mockup-body">
              {/* Main Panel */}
              <div className="sim-content-pane">
                {/* Header matching header in screenshot */}
                <div className="sim-content-header-bar">
                  <div className="header-left-mock">
                    <div className="workspace-trigger-mock">
                      <h3>Khalid's Workspace</h3>
                      <ChevronDown size={14} className="chevron" />
                    </div>
                  </div>

                  <div className="header-right-mock">
                    <div className="bell-mock">
                      <Bell size={18} color="#4f566b" />
                    </div>
                    <div className="user-info-mock">
                      <span className="role-badge-mock">OWNER</span>
                      <div className="avatar-mock">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png" alt="User avatar" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="sim-workspace-body-panel">
                  <div className="greeting-row">
                    <h1>Good Evening! Khalid Sainaro</h1>
                    <p className="overview-text">Thursday 28th May 2026</p>
                  </div>

                  {/* Metric cards matching Cards.jsx and Cards.css */}
                  <div className="sim-cards-grid">
                    <div className="metric-card card-total">
                      <div className="card-accent" />
                      <div className="card-content">
                        <div className="card-info">
                          <span className="card-label">Total Projects</span>
                          <h2 className="card-value">3</h2>
                        </div>
                        <div className="card-media">
                          <div className="icon-wrapper"><Layers size={20} /></div>
                          <span className="mom-growth-badge">↗ 100%</span>
                        </div>
                      </div>
                    </div>

                    <div className="metric-card card-pending">
                      <div className="card-accent" />
                      <div className="card-content">
                        <div className="card-info">
                          <span className="card-label">Pending Projects</span>
                          <h2 className="card-value">3</h2>
                        </div>
                        <div className="card-media">
                          <div className="icon-wrapper"><Layers size={20} /></div>
                          <span className="mom-growth-badge">↗ 100%</span>
                        </div>
                      </div>
                    </div>

                    <div className="metric-card card-progress">
                      <div className="card-accent" />
                      <div className="card-content">
                        <div className="card-info">
                          <span className="card-label">In Progress</span>
                          <h2 className="card-value">0</h2>
                        </div>
                        <div className="card-media">
                          <div className="icon-wrapper"><Layers size={20} /></div>
                          <span className="mom-growth-badge">↗ 100%</span>
                        </div>
                      </div>
                    </div>

                    <div className="metric-card card-completed">
                      <div className="card-accent" />
                      <div className="card-content">
                        <div className="card-info">
                          <span className="card-label">Completed Projects</span>
                          <h2 className="card-value">0</h2>
                        </div>
                        <div className="card-media">
                          <div className="icon-wrapper"><Layers size={20} /></div>
                          <span className="mom-growth-badge">↗ 100%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Screenshot Charts Grid */}
                  <div className="sim-charts-grid-wrapper">
                    {/* Left: Project Distribution Donut Chart */}
                    <div className="chart-panel-card">
                      <h4>Project Distribution</h4>
                      <div className="donut-chart-container">
                        <div className="donut-chart-core">
                          <div className="donut-chart-center">
                            <h3>3</h3>
                            <span>Total</span>
                          </div>
                        </div>
                      </div>
                      <div className="donut-legend-row">
                        <span className="legend-dot-item"><span className="legend-dot pending"></span> Pending <strong>(3)</strong></span>
                        <span className="legend-dot-item"><span className="legend-dot progress"></span> In Progress <strong>(0)</strong></span>
                        <span className="legend-dot-item"><span className="legend-dot completed"></span> Completed <strong>(0)</strong></span>
                      </div>
                    </div>

                    {/* Right: Project Priority Levels Bar Chart */}
                    <div className="chart-panel-card relative-panel">
                      <h4>Project Priority Levels</h4>
                      <div className="priority-bar-columns">
                        <div className="bar-axis-row">
                          <span>4</span>
                          <div className="axis-line"></div>
                        </div>
                        <div className="bar-axis-row">
                          <span>3</span>
                          <div className="axis-line"></div>
                        </div>
                        <div className="bar-axis-row">
                          <span>2</span>
                          <div className="axis-line"></div>
                        </div>
                        <div className="bar-axis-row">
                          <span>1</span>
                          <div className="axis-line"></div>
                        </div>
                        <div className="bar-axis-row">
                          <span>0</span>
                          <div className="axis-line"></div>
                        </div>

                        {/* Renders Columns */}
                        <div className="columns-container-flex">
                          <div className="priority-column-bar">
                            <div className="bar-fill color-low" style={{ height: '25%' }}></div>
                            <span className="bar-label-txt">Low</span>
                          </div>
                          <div className="priority-column-bar">
                            <div className="bar-fill color-medium" style={{ height: '25%' }}></div>
                            <span className="bar-label-txt">Medium</span>
                          </div>
                          <div className="priority-column-bar">
                            <div className="bar-fill color-high" style={{ height: '25%' }}></div>
                            <span className="bar-label-txt">High</span>
                          </div>
                        </div>
                      </div>

                      <div className="priority-legend-row">
                        <span className="legend-dot-item"><span className="legend-dot low"></span> Low <strong>(1)</strong></span>
                        <span className="legend-dot-item"><span className="legend-dot medium"></span> Medium <strong>(1)</strong></span>
                        <span className="legend-dot-item"><span className="legend-dot high"></span> High <strong>(1)</strong></span>
                      </div>

                      {/* Growth overlay badge */}
                      <div className="growth-overlay-badge-mock">
                        <div className="gob-icon"><Activity size={14} /></div>
                        <div className="gob-text">
                          <strong>+120% Efficiency</strong>
                          <p>Last quarter growth</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* BRIGHT FEATURES WRAPPER */}
      <div className="light-theme-wrapper">

        {/* SECTION 1: WHY CHOOSE US */}
        <section id="features" className="features-section text-center-section">
          <div className="features-bg-canvas">
            <LightRays
              raysOrigin="top-center"
              raysColor="#0055ff"
              raysSpeed={0.4}
              lightSpread={0.8}
              rayLength={2}
              pulsating={false}
              followMouse={true}
              mouseInfluence={0.05}
              noiseAmount={0.05}
              distortion={0.02}
            />
          </div>

          <h2 className="section-title text-dark text-center">Why Choose Us</h2>
          <p className="section-subtitle-dark text-center">Tools built for professional teams</p>

          <div className="why-choose-grid">
            <div className="why-card">
              <div className="wc-icon-box bg-light-blue">
                <Settings size={22} className="wc-icon color-blue" />
              </div>
              <h3>Smart Dashboards</h3>
              <p>Visualize progress in real-time. Track project distribution and team productivity with interactive charts and graphs.</p>
            </div>

            <div className="why-card">
              <div className="wc-icon-box bg-light-purple">
                <Users size={22} className="wc-icon color-purple" />
              </div>
              <h3>Team Collaboration</h3>
              <p>Manage roles and permissions effortlessly. Invite colleagues, assign responsibilities, and create a shared space for innovation.</p>
            </div>

            <div className="why-card">
              <div className="wc-icon-box bg-light-orange">
                <CheckSquare size={22} className="wc-icon color-orange" />
              </div>
              <h3>Detailed Tasks</h3>
              <p>Task cards with priorities, deadlines, and attachments. No detail will be missed thanks to a smart notification system.</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: ANALYTICS AT YOUR FINGERTIPS */}
        <section id="analytics" className="features-section grey-bg">
          <div className="max-width-restrictor">
            <h2 className="section-title text-dark text-center">Analytics at Your Fingertips</h2>
            <p className="section-subtitle-dark text-center">Get deep insights into your business performance with automated reporting and intelligent forecasting.</p>

            <div className="analytics-layout-grid">
              {/* Left Resource Allocation Card */}
              <div className="analytics-card resource-card">
                <div className="ac-left-text">
                  <div className="ac-icon-row">
                    <span className="ac-icon-circle"><Info size={16} /></span>
                    <h4>Resource Allocation</h4>
                  </div>
                  <p>Understand where your team's time goes and optimize workflows with precise tracking and visual reporting.</p>
                  <div className="ac-badges-row">
                    <span className="ac-badge"><Check size={12} /> Optimized</span>
                    <span className="ac-badge"><Activity size={12} /> Real-time</span>
                  </div>
                </div>

                {/* Visual bar columns representing resource allocation */}
                <div className="ac-visual-columns">
                  <div className="av-col" style={{ height: '30%' }}></div>
                  <div className="av-col" style={{ height: '40%' }}></div>
                  <div className="av-col" style={{ height: '60%' }}></div>
                  <div className="av-col" style={{ height: '80%' }}></div>
                  <div className="av-col" style={{ height: '90%' }}></div>
                </div>
              </div>

              {/* Right column (Forecast & Speed) */}
              <div className="analytics-right-col-cards">
                <div className="analytics-card metric-square-card">
                  <div className="asc-media">
                    <BarChart3 size={20} className="color-purple" />
                  </div>
                  <div className="asc-value-block">
                    <h2>98%</h2>
                    <span>FORECAST ACCURACY</span>
                  </div>
                </div>

                <div className="analytics-card metric-square-card">
                  <div className="asc-media">
                    <Zap size={20} className="color-blue" />
                  </div>
                  <div className="asc-value-block">
                    <h2>2x</h2>
                    <span>WORK SPEED</span>
                  </div>
                </div>
              </div>

              {/* Bottom Full-width Change History Card */}
              <div className="analytics-card full-width-card">
                <div className="fw-left-block">
                  <span className="ac-icon-circle"><History size={16} /></span>
                  <div className="fw-text-details">
                    <h4>Change History</h4>
                    <p>Transparent audit of every action in the system for full project control. Never lose track of what happened and when.</p>
                  </div>
                </div>
                <button onClick={() => navigate('/login')} className="fw-action-btn">
                  View Logs
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: JOIN THOUSANDS OF TEAMS */}
        <section className="join-teams-section">
          <div className="join-content-box">
            <h2>Join Thousands of Teams</h2>
            <p>Start managing projects more effectively today. Registration takes less than a minute.</p>
            <div className="join-ctas-row">
              <button onClick={() => navigate('/register')} className="join-btn btn-white">Sign Up</button>
              <button onClick={() => navigate('/login')} className="join-btn btn-outline">Sign In</button>
            </div>
          </div>
        </section>

      </div>


      {/* FULL SITE FOOTER */}
      <footer id="about" className="landing-site-footer">
        <div className="footer-links-grid">
          <div className="footer-brand-col">
            <span className="footer-logo-text">SaaS Pro</span>
            <p className="footer-brand-desc">
              Professional project management platform and team collaboration for the next generation.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>PRODUCT</h4>
            <a href="#features" onClick={(e) => handleScroll(e, 'features')}>Features</a>
            <a href="#integrations" onClick={(e) => handleLinkClick(e, 'Integrations')}>Integrations</a>
            <a href="#updates" onClick={(e) => handleLinkClick(e, 'Product Updates')}>Updates</a>
          </div>

          <div className="footer-links-col">
            <h4>COMPANY</h4>
            <a href="#about" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>About Us</a>
            <a href="#blog" onClick={(e) => handleLinkClick(e, 'Blog')}>Blog</a>
            <a href="mailto:khalidsainaro@gmail.com">Contact</a>
          </div>

          <div className="footer-links-col">
            <h4>LEGAL</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <a href="mailto:khalidsainaro@gmail.com">Support</a>
          </div>
        </div>

        <div className="footer-bottom-copyright">
          <div className="footer-bottom-flex">
            <span>© 2026 SaaS Pro Inc. All rights reserved.</span>
            {/* TODO: Add Language Switcher */}
            {/* <div className="footer-bottom-right-icons">
              <Globe size={14} />
              <ChevronDown size={12} />
            </div> */}
          </div>
        </div>
      </footer>

      {/* DEMO MODAL */}
      {isDemoOpen && (
        <div className="demo-modal-overlay" onClick={closeDemo}>
          <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="demo-modal-header">
              <div className="demo-modal-header-left">
                <div className="demo-modal-logo">SaaS Pro</div>
                <span className="demo-modal-badge">Product Tour</span>
              </div>
              <button className="demo-modal-close" onClick={closeDemo} aria-label="Close demo">
                ✕
              </button>
            </div>

            {/* Slide Content */}
            <div className="demo-modal-body">
              {/* Left: Slide Info */}
              <div className="demo-modal-info">
                <div className="demo-slide-steps">
                  {demoSlides.map((_, i) => (
                    <button
                      key={i}
                      className={`demo-step-dot ${i === demoSlide ? 'active' : ''}`}
                      onClick={() => setDemoSlide(i)}
                      style={i === demoSlide ? { backgroundColor: demoSlides[i].accent } : {}}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="demo-slide-counter">
                  {demoSlide + 1} / {demoSlides.length}
                </div>

                <div
                  className="demo-slide-icon"
                  style={{ backgroundColor: demoSlides[demoSlide].accent + '22', color: demoSlides[demoSlide].accent }}
                >
                  {demoSlides[demoSlide].icon}
                </div>

                <h2 className="demo-slide-title">{demoSlides[demoSlide].title}</h2>
                <p className="demo-slide-desc">{demoSlides[demoSlide].description}</p>

                <ul className="demo-slide-features">
                  {demoSlides[demoSlide].features.map((f, i) => (
                    <li key={i}>
                      <span className="demo-feature-check" style={{ color: demoSlides[demoSlide].accent }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="demo-modal-nav">
                  <button
                    className="demo-nav-btn"
                    onClick={() => setDemoSlide((s) => Math.max(0, s - 1))}
                    disabled={demoSlide === 0}
                  >
                    ← Prev
                  </button>
                  {demoSlide < demoSlides.length - 1 ? (
                    <button
                      className="demo-nav-btn demo-nav-btn-primary"
                      style={{ backgroundColor: demoSlides[demoSlide].accent }}
                      onClick={() => setDemoSlide((s) => s + 1)}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      className="demo-nav-btn demo-nav-btn-primary"
                      style={{ backgroundColor: demoSlides[demoSlide].accent }}
                      onClick={() => { closeDemo(); navigate('/register'); }}
                    >
                      Get Started →
                    </button>
                  )}
                </div>
              </div>

              {/* Right: Animated App Preview */}
              <div className="demo-modal-preview" style={{ '--slide-accent': demoSlides[demoSlide].accent }}>
                <div className="demo-preview-browser">
                  <div className="demo-browser-bar">
                    <span className="demo-dot" style={{ backgroundColor: '#ef4444' }} />
                    <span className="demo-dot" style={{ backgroundColor: '#eab308' }} />
                    <span className="demo-dot" style={{ backgroundColor: '#22c55e' }} />
                    <span className="demo-browser-url">saaspro.com/{demoSlides[demoSlide].title.toLowerCase().replace(/ /g, '-')}</span>
                  </div>
                  <div className="demo-preview-screen">
                    {/* Slide 0: Dashboard */}
                    {demoSlide === 0 && (
                      <div className="demo-screen-content anim-fade-in">
                        <div className="dp-header">
                          <span className="dp-greeting">Good morning, User</span>
                          <span className="dp-date">Thursday, 5 Jun 2026</span>
                        </div>
                        <div className="dp-cards">
                          {[{ l: 'Total Projects', v: '12', c: '#3b82f6' }, { l: 'In Progress', v: '5', c: '#06b6d4' }, { l: 'Completed', v: '7', c: '#10b981' }, { l: 'Team Members', v: '8', c: '#8b5cf6' }].map((c, i) => (
                            <div key={i} className="dp-card" style={{ borderLeftColor: c.c }}>
                              <span className="dp-card-label">{c.l}</span>
                              <strong className="dp-card-val" style={{ color: c.c }}>{c.v}</strong>
                            </div>
                          ))}
                        </div>
                        <div className="dp-chart-row">
                          <div className="dp-chart-block">
                            <span className="dp-chart-title">Project Distribution</span>
                            <div className="dp-donut" style={{ background: `conic-gradient(#8b5cf6 0% 42%, #06b6d4 42% 83%, #10b981 83% 100%)` }}>
                              <div className="dp-donut-inner"><strong>12</strong><small>total</small></div>
                            </div>
                          </div>
                          <div className="dp-chart-block dp-bar-block">
                            <span className="dp-chart-title">Priority Levels</span>
                            <div className="dp-bars">
                              {[{ h: '40%', c: '#10b981', l: 'Low' }, { h: '65%', c: '#f59e0b', l: 'Med' }, { h: '85%', c: '#ef4444', l: 'High' }].map((b, i) => (
                                <div key={i} className="dp-bar-col">
                                  <div className="dp-bar-fill" style={{ height: b.h, backgroundColor: b.c }} />
                                  <span className="dp-bar-lbl">{b.l}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Slide 1: Tasks */}
                    {demoSlide === 1 && (
                      <div className="demo-screen-content anim-fade-in">
                        <div className="dp-header">
                          <span className="dp-greeting">Tasks — Sprint 3</span>
                          <span className="dp-tag" style={{ background: '#8b5cf620', color: '#8b5cf6' }}>12 tasks</span>
                        </div>
                        <div className="dp-task-list">
                          {[
                            { title: 'Design new onboarding flow', priority: 'High', status: 'In Progress', color: '#ef4444' },
                            { title: 'Fix authentication bug', priority: 'High', status: 'Pending', color: '#ef4444' },
                            { title: 'Write API documentation', priority: 'Medium', status: 'Completed', color: '#f59e0b' },
                            { title: 'Update dashboard analytics', priority: 'Low', status: 'In Progress', color: '#10b981' },
                            { title: 'Review pull requests', priority: 'Medium', status: 'Pending', color: '#f59e0b' },
                          ].map((t, i) => (
                            <div key={i} className="dp-task-row">
                              <span className="dp-task-check" style={{ borderColor: t.status === 'Completed' ? '#10b981' : '#e2e8f0', backgroundColor: t.status === 'Completed' ? '#10b981' : 'transparent' }}>
                                {t.status === 'Completed' && '✓'}
                              </span>
                              <span className="dp-task-name" style={{ textDecoration: t.status === 'Completed' ? 'line-through' : 'none', color: t.status === 'Completed' ? '#94a3b8' : '#1e293b' }}>{t.title}</span>
                              <span className="dp-task-priority" style={{ background: t.color + '18', color: t.color }}>{t.priority}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Slide 2: Team */}
                    {demoSlide === 2 && (
                      <div className="demo-screen-content anim-fade-in">
                        <div className="dp-header">
                          <span className="dp-greeting">Team Members</span>
                          <span className="dp-tag" style={{ background: '#06b6d420', color: '#06b6d4' }}>8 members</span>
                        </div>
                        <div className="dp-team-list">
                          {[
                            { name: 'Khalid Sainaro', role: 'Owner', tasks: 5, avatar: 'KS', color: '#3b82f6' },
                            { name: 'Member 1', role: 'Manager', tasks: 8, avatar: 'M1', color: '#8b5cf6' },
                            { name: 'Member 2', role: 'Developer', tasks: 6, avatar: 'M2', color: '#06b6d4' },
                            { name: 'Member 3', role: 'Designer', tasks: 4, avatar: 'M3', color: '#f59e0b' },
                            { name: 'Member 4', role: 'Developer', tasks: 7, avatar: 'M4', color: '#10b981' },
                          ].map((m, i) => (
                            <div key={i} className="dp-team-row">
                              <div className="dp-team-avatar" style={{ backgroundColor: m.color + '22', color: m.color }}>{m.avatar}</div>
                              <div className="dp-team-info">
                                <strong>{m.name}</strong>
                                <span>{m.role}</span>
                              </div>
                              <span className="dp-team-tasks">{m.tasks} tasks</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Slide 3: Activity */}
                    {demoSlide === 3 && (
                      <div className="demo-screen-content anim-fade-in">
                        <div className="dp-header">
                          <span className="dp-greeting">Activity Log</span>
                          <span className="dp-tag" style={{ background: '#10b98120', color: '#10b981' }}>Live</span>
                        </div>
                        <div className="dp-activity-list">
                          {[
                            { action: 'Member 1 created task', detail: '"Design onboarding flow"', time: '2m ago', color: '#8b5cf6', icon: '✦' },
                            { action: 'Member 2 completed task', detail: '"API documentation"', time: '15m ago', color: '#10b981', icon: '✓' },
                            { action: 'Member 3 updated project', detail: 'Sprint 3 → deadline extended', time: '1h ago', color: '#3b82f6', icon: '✎' },
                            { action: 'Member 4 added comment', detail: '"This is urgent"', time: '2h ago', color: '#f59e0b', icon: '✎' },
                            { action: 'Member 5 joined workspace', detail: 'Role: Developer', time: '1d ago', color: '#06b6d4', icon: '+' },
                          ].map((a, i) => (
                            <div key={i} className="dp-activity-row">
                              <span className="dp-activity-icon" style={{ background: a.color + '20', color: a.color }}>{a.icon}</span>
                              <div className="dp-activity-text">
                                <span className="dp-act-action">{a.action}</span>
                                <span className="dp-act-detail">{a.detail}</span>
                              </div>
                              <span className="dp-act-time">{a.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
