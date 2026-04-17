import React, { useEffect, useState } from "react";
import Header1 from "./Header1";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./Home.css";

import homepageImg from "../../../src/Images/homepage-img.png";

/* ── CSS mockup sub-components for the Features tab panel ── */
const DashboardMockup = () => (
  <div className="fm fm-dashboard">
    <div className="fm-topbar">
      <span className="fm-dot r" /><span className="fm-dot y" /><span className="fm-dot g" />
      <span className="fm-title">Transaction Dashboard</span>
    </div>
    <div className="fm-filters">
      {["Last 1 Week","Income","Table View"].map((f,i) => <span key={i} className="fm-filter-tag">{f}</span>)}
      <span className="fm-add-btn">+ Add New</span>
    </div>
    <div className="fm-table">
      <div className="fm-thead">
        <span>Date</span><span>Amount</span><span>Type</span><span>Category</span><span>Actions</span>
      </div>
      {[
        {date:"2025-04-10",amt:"₹3,200",type:"Income",cat:"Salary"},
        {date:"2025-04-11",amt:"₹450",type:"Expense",cat:"Food"},
        {date:"2025-04-12",amt:"₹1,200",type:"Expense",cat:"Bills"},
        {date:"2025-04-13",amt:"₹800",type:"Income",cat:"Freelancing"},
      ].map((r,i) => (
        <div key={i} className="fm-row">
          <span className="fm-cell">{r.date}</span>
          <span className="fm-cell fm-amt">{r.amt}</span>
          <span className={`fm-badge ${r.type === 'Income' ? 'fm-badge-inc' : 'fm-badge-exp'}`}>{r.type}</span>
          <span className="fm-cell">{r.cat}</span>
          <span className="fm-cell fm-actions">✏️ 🗑️</span>
        </div>
      ))}
    </div>
  </div>
);

const AddTransactionMockup = () => (
  <div className="fm fm-add">
    <div className="fm-topbar">
      <span className="fm-dot r" /><span className="fm-dot y" /><span className="fm-dot g" />
      <span className="fm-title">Add Transaction</span>
    </div>
    <div className="fm-form">
      {[
        {label:"Amount (₹)",placeholder:"e.g. 1500",icon:"💰"},
        {label:"Type",placeholder:"Income / Expense",icon:"🔀"},
        {label:"Category",placeholder:"Select category…",icon:"🏷️"},
        {label:"Date",placeholder:"2025-04-17",icon:"📅"},
        {label:"Reference",placeholder:"e.g. UPI / Cash",icon:"📝"},
      ].map((f,i) => (
        <div key={i} className="fm-field">
          <label className="fm-label">{f.label}</label>
          <div className="fm-input">
            <span className="fm-input-icon">{f.icon}</span>
            <span className="fm-input-ph">{f.placeholder}</span>
          </div>
        </div>
      ))}
      <div className="fm-save-btn">SAVE</div>
    </div>
  </div>
);

const AnalyticsMockup = () => (
  <div className="fm fm-analytics">
    <div className="fm-topbar">
      <span className="fm-dot r" /><span className="fm-dot y" /><span className="fm-dot g" />
      <span className="fm-title">Spending Analytics</span>
    </div>
    <div className="fm-analytics-body">
      <div className="fm-pie-wrap">
        <svg viewBox="0 0 36 36" className="fm-pie">
          <circle r="15.9" cx="18" cy="18" fill="none" stroke="#fde8b4" strokeWidth="3.2" />
          <circle r="15.9" cx="18" cy="18" fill="none" stroke="#e8722a" strokeWidth="3.2"
            strokeDasharray="40 60" strokeDashoffset="25" />
          <circle r="15.9" cx="18" cy="18" fill="none" stroke="#c95a18" strokeWidth="3.2"
            strokeDasharray="25 75" strokeDashoffset="-15" />
          <circle r="15.9" cx="18" cy="18" fill="none" stroke="#ffd5a8" strokeWidth="3.2"
            strokeDasharray="20 80" strokeDashoffset="-40" />
          <text x="18" y="20" textAnchor="middle" fontSize="5" fill="#2d2318" fontWeight="700">Expense</text>
        </svg>
      </div>
      <div className="fm-legend">
        {[
          {color:"#e8722a",label:"Food",pct:"40%"},
          {color:"#c95a18",label:"Bills",pct:"25%"},
          {color:"#ffd5a8",label:"Medical",pct:"20%"},
          {color:"#fde8b4",label:"Others",pct:"15%"},
        ].map((l,i) => (
          <div key={i} className="fm-legend-row">
            <span className="fm-legend-dot" style={{background:l.color}} />
            <span className="fm-legend-label">{l.label}</span>
            <span className="fm-legend-pct">{l.pct}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="fm-bars">
      {[
        {label:"Mon",h:60,color:"#e8722a"},
        {label:"Tue",h:40,color:"#ffd5a8"},
        {label:"Wed",h:75,color:"#e8722a"},
        {label:"Thu",h:50,color:"#ffd5a8"},
        {label:"Fri",h:90,color:"#c95a18"},
        {label:"Sat",h:35,color:"#ffd5a8"},
        {label:"Sun",h:55,color:"#e8722a"},
      ].map((b,i) => (
        <div key={i} className="fm-bar-col">
          <div className="fm-bar" style={{height:`${b.h}%`,background:b.color}} />
          <span className="fm-bar-label">{b.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const FiltersMockup = () => (
  <div className="fm fm-filters-panel">
    <div className="fm-topbar">
      <span className="fm-dot r" /><span className="fm-dot y" /><span className="fm-dot g" />
      <span className="fm-title">Smart Filters & Search</span>
    </div>
    <div className="fm-filter-section">
      <div className="fm-filter-group">
        <div className="fm-filter-heading">🗓️ Select Frequency</div>
        <div className="fm-pills">
          {["Last 1 Week","Last 1 Month","Last 1 Year","Custom"].map((p,i) => (
            <span key={i} className={`fm-pill ${i===0?"fm-pill-active":""}`}>{p}</span>
          ))}
        </div>
      </div>
      <div className="fm-filter-group">
        <div className="fm-filter-heading">💼 Select Type</div>
        <div className="fm-pills">
          {["ALL","INCOME","EXPENSE"].map((p,i) => (
            <span key={i} className={`fm-pill ${i===0?"fm-pill-active":""}`}>{p}</span>
          ))}
        </div>
      </div>
      <div className="fm-filter-group">
        <div className="fm-filter-heading">🔍 Search Transactions</div>
        <div className="fm-search-bar">
          <span className="fm-search-icon">🔍</span>
          <span className="fm-search-ph">Search by amount, category…</span>
        </div>
      </div>
      <div className="fm-filter-result">
        <span className="fm-result-dot" />
        <span>12 transactions found</span>
      </div>
    </div>
  </div>
);

/* ── Animated counter ── */
const Counter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 22);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("user")) navigate("/user");
  }, [navigate]);

  /* auto-rotate feature tabs */
  useEffect(() => {
    const t = setInterval(() => setActiveFeature(p => (p + 1) % 4), 4000);
    return () => clearInterval(t);
  }, []);

  const features = [
    {
      icon: "📊",
      label: "Dashboard",
      title: "Your Full Financial Dashboard",
      desc: "See all transactions at a glance. Filter by week, month, year, or a custom date range. Switch between table view and analytics instantly.",
      mockup: <DashboardMockup />,
    },
    {
      icon: "➕",
      label: "Add Transactions",
      title: "Log Income & Expenses in Seconds",
      desc: "Record any transaction with amount, type, category, date, and description. Supports 13+ categories for income and expenses.",
      mockup: <AddTransactionMockup />,
    },
    {
      icon: "📈",
      label: "Analytics",
      title: "Visual Spending Analytics",
      desc: "Pie charts and bar graphs break down your spending by category. Instantly see where your money goes and which areas to cut back.",
      mockup: <AnalyticsMockup />,
    },
    {
      icon: "🔍",
      label: "Smart Filters",
      title: "Powerful Filtering & Search",
      desc: "Filter transactions by type (Income / Expense), frequency, or a custom date range. Full-text search lets you find any record instantly.",
      mockup: <FiltersMockup />,
    },
  ];

  const steps = [
    { num: "01", icon: "✍️", title: "Create an Account", desc: "Sign up with email or continue with Google OAuth in under 30 seconds." },
    { num: "02", icon: "💳", title: "Log Your Transactions", desc: "Add income or expenses with category, date, and reference details." },
    { num: "03", icon: "📊", title: "Analyse & Visualise", desc: "Switch to analytics view to see charts and spending breakdowns." },
    { num: "04", icon: "📥", title: "Export to Excel", desc: "Download your transaction history as an Excel file any time." },
  ];

  const categories = [
    { icon: "🍽️", label: "Food" },
    { icon: "🏥", label: "Medical" },
    { icon: "📚", label: "Education" },
    { icon: "🎬", label: "Movies" },
    { icon: "📑", label: "Bills" },
    { icon: "💼", label: "Salary" },
    { icon: "💻", label: "Freelancing" },
    { icon: "🚕", label: "Transport" },
    { icon: "🛒", label: "Shopping" },
    { icon: "📦", label: "Stationary" },
    { icon: "💰", label: "Part-time" },
    { icon: "🧾", label: "TAX" },
  ];

  return (
    <>
      <Header1 />

      <div className="lp-root">

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section className="lp-hero">
          {/* decorative blobs */}
          <div className="lp-blob lp-blob-1" />
          <div className="lp-blob lp-blob-2" />

          <div className="lp-hero-inner">
            <div className="lp-hero-text">
              <div className="lp-chip">✦ Free Expense Tracker</div>
              <h1 className="lp-hero-h1">
                Take Control of<br />
                <span className="lp-gradient-text">Your Finances</span>
              </h1>
              <p className="lp-hero-sub">
                WalletWatch makes it effortless to track every rupee — income,
                expenses, and everything in between. Visualise trends, set goals,
                and export reports in one click.
              </p>
              <div className="lp-hero-cta">
                <Link to="/register" className="lp-btn-primary">
                  Get Started Free →
                </Link>
                <Link to="/login" className="lp-btn-ghost">
                  Sign In
                </Link>
              </div>
              <div className="lp-hero-proof">
                <span>✓ No credit card required</span>
                <span>✓ Google Sign-In support</span>
                <span>✓ Excel export</span>
              </div>
            </div>

            <div className="lp-hero-img-wrap">
              <div className="lp-hero-img-card">
                <img src={homepageImg} alt="WalletWatch dashboard preview" />
              </div>
              {/* floating stat cards */}
              <div className="lp-float-card lp-float-card-1">
                <span className="lp-float-icon">💰</span>
                <div>
                  <div className="lp-float-label">Income</div>
                  <div className="lp-float-value">₹ 82,500</div>
                </div>
              </div>
              <div className="lp-float-card lp-float-card-2">
                <span className="lp-float-icon">📉</span>
                <div>
                  <div className="lp-float-label">Saved this month</div>
                  <div className="lp-float-value">₹ 24,000</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════════ */}
        <section className="lp-stats">
          {[
            { value: 5000, suffix: "+", label: "Transactions Tracked" },
            { value: 13,   suffix: "",  label: "Expense Categories"   },
            { value: 100,  suffix: "%", label: "Free to Use"          },
            { value: 1,    suffix: " Click", label: "Excel Export"    },
          ].map((s, i) => (
            <div key={i} className="lp-stat-item">
              <div className="lp-stat-value">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="lp-stat-label">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ══════════════════════════════════════════
            FEATURES (interactive tabs)
        ══════════════════════════════════════════ */}
        <section className="lp-features">
          <div className="lp-section-header">
            <div className="lp-chip lp-chip-dark">Features</div>
            <h2 className="lp-section-h2">Everything You Need to<br />Manage Money Smarter</h2>
            <p className="lp-section-sub">
              Four powerful tools built into one clean interface.
            </p>
          </div>

          <div className="lp-features-body">
            {/* Tabs */}
            <div className="lp-feature-tabs">
              {features.map((f, i) => (
                <button
                  key={i}
                  className={`lp-feature-tab ${activeFeature === i ? "lp-feature-tab--active" : ""}`}
                  onClick={() => setActiveFeature(i)}
                >
                  <span className="lp-tab-icon">{f.icon}</span>
                  <span className="lp-tab-label">{f.label}</span>
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className="lp-feature-panel">
              <div className="lp-feature-panel-text">
                <h3 className="lp-feature-title">{features[activeFeature].title}</h3>
                <p className="lp-feature-desc">{features[activeFeature].desc}</p>
                <Link to="/register" className="lp-btn-primary lp-btn-sm">
                  Try it free
                </Link>
              </div>
              <div className="lp-feature-panel-img">
                <div key={activeFeature} className="lp-feature-mockup-wrap">
                  {features[activeFeature].mockup}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════ */}
        <section className="lp-how">
          <div className="lp-section-header">
            <div className="lp-chip">How It Works</div>
            <h2 className="lp-section-h2">Up &amp; Running in 4 Easy Steps</h2>
          </div>

          <div className="lp-steps">
            {steps.map((s, i) => (
              <div key={i} className="lp-step">
                <div className="lp-step-num">{s.num}</div>
                <div className="lp-step-icon">{s.icon}</div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="lp-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CATEGORIES
        ══════════════════════════════════════════ */}
        <section className="lp-categories">
          <div className="lp-section-header">
            <div className="lp-chip lp-chip-dark">Categories</div>
            <h2 className="lp-section-h2">Track Every Type of<br />Income &amp; Expense</h2>
            <p className="lp-section-sub">
              13+ built-in categories so you never have to guess where money went.
            </p>
          </div>
          <div className="lp-cat-grid">
            {categories.map((c, i) => (
              <div key={i} className="lp-cat-pill">
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BENEFIT CARDS
        ══════════════════════════════════════════ */}
        <section className="lp-benefits">
          {[
            {
              icon: "🔐",
              title: "Secure by Design",
              desc: "Passwords are bcrypt-hashed. All traffic is TLS-encrypted. JWT auth keeps your session safe.",
              color: "#fff8f0",
              border: "#ffd5a8",
            },
            {
              icon: "📱",
              title: "Works on Any Device",
              desc: "Fully responsive layout that feels great on desktop, tablet, or mobile browser.",
              color: "#f0fff8",
              border: "#a8ffd5",
            },
            {
              icon: "📥",
              title: "Excel Export",
              desc: "Download your entire transaction history as a formatted .xlsx file with one click.",
              color: "#f0f4ff",
              border: "#a8c0ff",
            },
            {
              icon: "⚡",
              title: "Lightning Fast",
              desc: "Built with React + Node.js. Pages load instantly and updates reflect in real time.",
              color: "#fff0f8",
              border: "#ffa8d8",
            },
          ].map((b, i) => (
            <div
              key={i}
              className="lp-benefit-card"
              style={{ background: b.color, borderColor: b.border }}
            >
              <span className="lp-benefit-icon">{b.icon}</span>
              <h3 className="lp-benefit-title">{b.title}</h3>
              <p className="lp-benefit-desc">{b.desc}</p>
            </div>
          ))}
        </section>

        {/* ══════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════ */}
        <section className="lp-cta">
          <div className="lp-cta-inner">
            <div className="lp-cta-blob" />
            <div className="lp-chip lp-chip-light">Start Today</div>
            <h2 className="lp-cta-h2">
              Stop Wondering<br />Where Your Money Goes
            </h2>
            <p className="lp-cta-sub">
              Join WalletWatch and gain clear visibility over your finances —
              completely free, no credit card required.
            </p>
            <div className="lp-cta-buttons">
              <Link to="/register" className="lp-btn-cta">
                Create Free Account
              </Link>
              <Link to="/login" className="lp-btn-cta-outline">
                Already have an account?
              </Link>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
};

export default Home;
