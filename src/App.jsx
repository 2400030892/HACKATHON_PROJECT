// App.jsx
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // NEW IMPORT
import "./App.css";

// YOUR GOOGLE SITE KEY
// (I corrected the typo from 'Q' to 'O' based on your previous screenshot so it works)
const SITE_KEY = "6LeWRRwsAAAAAIaKYD8OLWuOP7CY5SdQqTTTxl2v";

/* ------------- Sample Data ------------- */

const mutualFunds = [
  {
    id: 1,
    name: "ICICI Prudential Large Cap Fund",
    type: "Equity – Large Cap",
    risk: "High",
    returns: "18.1% p.a.",
    minInvestment: "₹100",
    objective: "Large-cap equity exposure in leading Indian companies.",
  },
  {
    id: 2,
    name: "SBI Large Cap Fund",
    type: "Equity – Large Cap",
    risk: "High",
    returns: "17.4% p.a.",
    minInvestment: "₹500",
    objective: "Long-term capital growth through bluechip stocks.",
  },
  {
    id: 3,
    name: "Nippon India Large Cap Fund",
    type: "Equity – Large Cap",
    risk: "High",
    returns: "19.2% p.a.",
    minInvestment: "₹100",
    objective: "Invests in top 100 companies by market capitalisation.",
  },
  {
    id: 4,
    name: "HDFC Flexi Cap Fund",
    type: "Equity – Flexi Cap",
    risk: "High",
    returns: "16.8% p.a.",
    minInvestment: "₹500",
    objective: "Invests flexibly across large, mid and small caps.",
  },
  {
    id: 5,
    name: "Parag Parikh Flexi Cap Fund",
    type: "Equity – Flexi Cap",
    risk: "High",
    returns: "20.3% p.a.",
    minInvestment: "₹1,000",
    objective: "Long-term wealth creation with domestic + global equity.",
  },
  {
    id: 6,
    name: "Kotak Emerging Equity Fund",
    type: "Equity – Mid Cap",
    risk: "High",
    returns: "18.5% p.a.",
    minInvestment: "₹1,000",
    objective: "Mid-cap oriented emerging business portfolio.",
  },
  {
    id: 7,
    name: "HDFC Mid-Cap Opportunities Fund",
    type: "Equity – Mid Cap",
    risk: "High",
    returns: "19.7% p.a.",
    minInvestment: "₹1,000",
    objective: "Focus on mid-sized businesses with growth potential.",
  },
  {
    id: 8,
    name: "Nippon India Small Cap Fund",
    type: "Equity – Small Cap",
    risk: "High",
    returns: "24.5% p.a.",
    minInvestment: "₹1,000",
    objective: "High-growth potential small-cap companies.",
  },
  {
    id: 9,
    name: "Quant Small Cap Fund",
    type: "Equity – Small Cap",
    risk: "High",
    returns: "25.1% p.a.",
    minInvestment: "₹1,000",
    objective: "Aggressive strategy in small-cap segment.",
  },
  {
    id: 10,
    name: "SBI Equity Hybrid Fund",
    type: "Hybrid – Equity Oriented",
    risk: "Medium",
    returns: "12.3% p.a.",
    minInvestment: "₹500",
    objective: "Mix of equity and debt for balanced growth.",
  },
  {
    id: 11,
    name: "ICICI Prudential Equity & Debt Fund",
    type: "Hybrid – Aggressive",
    risk: "Medium",
    returns: "13.1% p.a.",
    minInvestment: "₹1,000",
    objective: "Long-term capital appreciation with some income.",
  },
  {
    id: 12,
    name: "HDFC Balanced Advantage Fund",
    type: "Hybrid – Dynamic Asset Allocation",
    risk: "Medium",
    returns: "11.9% p.a.",
    minInvestment: "₹1,000",
    objective: "Dynamic allocation between equity and debt.",
  },
  {
    id: 13,
    name: "UTI Nifty 50 Index Fund",
    type: "Index – Nifty 50",
    risk: "High",
    returns: "14.0% p.a.",
    minInvestment: "₹500",
    objective: "Replicate performance of the Nifty 50 index.",
  },
  {
    id: 14,
    name: "HDFC NIFTY50 Equal Weight Index Fund",
    type: "Index – Nifty 50 Equal Weight",
    risk: "High",
    returns: "15.2% p.a.",
    minInvestment: "₹500",
    objective: "Equal-weight exposure to Nifty 50 stocks.",
  },
  {
    id: 15,
    name: "Motilal Oswal Nasdaq 100 FOF",
    type: "International – US Equity",
    risk: "High",
    returns: "18.9% p.a.",
    minInvestment: "₹500",
    objective: "Tracks Nasdaq 100 via fund-of-funds route.",
  },
  {
    id: 16,
    name: "SBI Magnum Gilt Fund",
    type: "Debt – Gilt",
    risk: "Low",
    returns: "6.7% p.a.",
    minInvestment: "₹1,000",
    objective: "Invests primarily in government securities.",
  },
  {
    id: 17,
    name: "HDFC Corporate Bond Fund",
    type: "Debt – Corporate Bond",
    risk: "Low",
    returns: "6.4% p.a.",
    minInvestment: "₹1,000",
    objective: "Invests in high quality corporate bonds.",
  },
  {
    id: 18,
    name: "ICICI Prudential Liquid Fund",
    type: "Debt – Liquid",
    risk: "Low",
    returns: "5.3% p.a.",
    minInvestment: "₹1,000",
    objective: "Very short-term debt and money market instruments.",
  },
  {
    id: 19,
    name: "Axis ELSS Tax Saver Fund",
    type: "Equity – ELSS (Tax Saving)",
    risk: "High",
    returns: "13.9% p.a.",
    minInvestment: "₹500",
    objective: "Tax-saving ELSS with 3-year lock-in.",
  },
  {
    id: 20,
    name: "Aditya Birla Sun Life Tax Relief 96",
    type: "Equity – ELSS (Tax Saving)",
    risk: "High",
    returns: "12.7% p.a.",
    minInvestment: "₹500",
    objective: "Tax deduction under Section 80C via equity.",
  },
];

const decisionFactors = [
  "Clarity about financial goals and investment horizon.",
  "Comfort level with short-term ups and downs (risk tolerance).",
  "Historical performance and consistency of the fund.",
  "Total cost: expense ratio and other charges.",
  "Experience and track record of the fund manager.",
  "Diversification across sectors and asset classes.",
];

/* ------------- LocalStorage Hook ------------- */

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue];
}

/* ------------- Root App ------------- */

function App() {
  const [currentUser, setCurrentUser] = useLocalStorage("mf-current-user", null);
  const isAuthenticated = !!currentUser;

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <MainLayout user={currentUser} setCurrentUser={setCurrentUser} />
      ) : (
        <AuthScreen setCurrentUser={setCurrentUser} />
      )}
    </BrowserRouter>
  );
}

/* ------------- Auth Screen (WITH CAPTCHA) ------------- */

function AuthScreen({ setCurrentUser }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [registeredUser, setRegisteredUser] = useLocalStorage(
    "mf-registered-user",
    null
  );

  // NEW: Captcha State
  const [captchaToken, setCaptchaToken] = useState(null);

  const [signinData, setSigninData] = useState({
    identifier: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSigninChange = (e) => {
    setError("");
    setMessage("");
    const { name, value } = e.target;
    setSigninData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    setError("");
    setMessage("");
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  // NEW: Verify function talking to Vercel Backend
  const verifyCaptcha = async () => {
    if (!captchaToken) {
      setError("Please verify you are not a robot.");
      return false;
    }
    try {
      // Connecting to your LIVE Vercel backend
      const res = await fetch('https://mutualfunds-mauve.vercel.app/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaToken })
      });
      const data = await res.json();
      if (data.success) return true;
      setError("Captcha check failed.");
      return false;
    } catch (err) {
      setError("Captcha server error.");
      return false;
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirm } = signupData;

    if (!username.trim() || !email.trim() || !password || !confirm) {
      setError("All fields are required.");
      return;
    }

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // CHECK CAPTCHA
    const isHuman = await verifyCaptcha();
    if (!isHuman) return;

    const newUser = {
      username: username.trim(),
      email: email.trim(),
      password,
    };

    setRegisteredUser(newUser);
    setMessage("Registration successful! You can now sign in.");
    setError("");
    setMode("signin");
    setCaptchaToken(null);
  };

  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = signinData;

    if (!identifier.trim() || !password) {
      setError("Username / Email and password are required.");
      return;
    }

    if (!registeredUser) {
      setError("No user found. Please create an account first.");
      return;
    }

    const matchesIdentifier =
      identifier.trim().toLowerCase() === registeredUser.username.toLowerCase() ||
      identifier.trim().toLowerCase() === registeredUser.email.toLowerCase();

    if (!matchesIdentifier || password !== registeredUser.password) {
      setError("Invalid credentials. Check username/email or password.");
      return;
    }

    // CHECK CAPTCHA
    const isHuman = await verifyCaptcha();
    if (!isHuman) return;

    setCurrentUser(registeredUser);
    setError("");
    setMessage("Sign in successful! Opening dashboard…");
    setTimeout(() => navigate("/"), 500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">MF</div>
        <h1 className="auth-title">Mutual Fund Portfolio Studio</h1>
        <p className="auth-subtitle">
          Sign in or create an account to explore funds, maintain a simple
          portfolio and use role-based workspaces.
        </p>

        <div className="auth-toggle">
          <button
            className={mode === "signin" ? "chip chip-active" : "chip chip-ghost"}
            onClick={() => {
              setMode("signin");
              setError("");
              setMessage("");
              setCaptchaToken(null);
            }}
          >
            Sign In
          </button>
          <button
            className={mode === "signup" ? "chip chip-active" : "chip chip-ghost"}
            onClick={() => {
              setMode("signup");
              setError("");
              setMessage("");
              setCaptchaToken(null);
            }}
          >
            Sign Up
          </button>
        </div>

        {mode === "signin" ? (
          <form className="auth-form" onSubmit={handleSigninSubmit}>
            <div className="form-control">
              <label>Username or Email</label>
              <input
                type="text"
                name="identifier"
                placeholder="eg. ilyas / you@example.com"
                value={signinData.identifier}
                onChange={handleSigninChange}
              />
            </div>
            <div className="form-control">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="•••••••"
                value={signinData.password}
                onChange={handleSigninChange}
              />
            </div>

            {/* CAPTCHA WIDGET */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <ReCAPTCHA
                    sitekey={SITE_KEY}
                    onChange={setCaptchaToken}
                    theme="dark"
                />
            </div>

            {error && <p className="error-text">{error}</p>}
            {message && <p className="success-text">{message}</p>}

            <button type="submit" className="primary-btn full-width-btn">
              Sign In
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="form-control">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={signupData.username}
                onChange={handleSignupChange}
              />
            </div>
            <div className="form-control">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={signupData.email}
                onChange={handleSignupChange}
              />
            </div>
            <div className="form-control">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={signupData.password}
                onChange={handleSignupChange}
              />
            </div>
            <div className="form-control">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirm"
                placeholder="Re-enter password"
                value={signupData.confirm}
                onChange={handleSignupChange}
              />
            </div>

            {/* CAPTCHA WIDGET */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <ReCAPTCHA
                    sitekey={SITE_KEY}
                    onChange={setCaptchaToken}
                    theme="dark"
                />
            </div>

            {error && <p className="error-text">{error}</p>}
            {message && <p className="success-text">{message}</p>}

            <button type="submit" className="primary-btn full-width-btn">
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ------------- Main Layout ------------- */

function MainLayout({ user, setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Do you want to sign out?")) {
      setCurrentUser(null);
      navigate("/");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-circle">MF</div>
        <div className="title-block">
          <h1>Mutual Fund Dashboard</h1>
          <p>Role-based workspace for investors, advisors, analysts and admins.</p>
        </div>
        <div className="user-badge">
          <div className="user-name">
            {user?.username || user?.email || "User"}
          </div>
          <button className="secondary-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <div className="layout">
        <nav className="side-nav">
          <NavItem to="/" label="Overview" icon="🏠" />
          <NavItem to="/investor" label="Investor" icon="📊" />
          <NavItem to="/advisor" label="Advisor" icon="👨‍💼" />
          <NavItem to="/analyst" label="Analyst" icon="📈" />
          <NavItem to="/admin" label="Admin" icon="🛠️" />
        </nav>

        <main className="main-panel">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/investor" element={<InvestorView />} />
            <Route path="/advisor" element={<AdvisorView />} />
            <Route path="/advisor/modules/new" element={<ModuleCreatorView />} />
            <Route path="/advisor/modules" element={<ModulesListView />} />
            <Route path="/advisor/risk-profiles" element={<RiskProfilesView />} />
            <Route path="/analyst" element={<DataAnalystView />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>

      <footer className="app-footer">
        Mutual Fund Dashboard • Demo Web Application
      </footer>
    </div>
  );
}

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        isActive ? "nav-link nav-link-active" : "nav-link"
      }
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

/* ------------- Home ------------- */

function Home() {
  return (
    <section className="section">
      <div className="section-header">
        <h2>Overview</h2>
        <p>
          This dashboard shows how different users interact with the mutual fund
          platform — browsing funds, guiding investors and analysing
          performance.
        </p>
      </div>

      <div className="grid responsive-grid">
        <RoleCard
          title="Admin"
          description="Oversees platform settings, users and data."
          items={[
            "Manage mutual fund master data",
            "Control user roles and access",
            "Monitor activity and usage",
            "Publish updates or announcements",
          ]}
        />
        <RoleCard
          title="Investor"
          description="Uses the platform to explore funds and track a basic portfolio."
          items={[
            "Browse mutual funds by risk category",
            "Add funds to a personal watchlist",
            "Record simple investments",
            "Compare options based on returns",
          ]}
        />
        <RoleCard
          title="Financial Advisor"
          description="Prepares learning material and model portfolios for investors."
          items={[
            "Create educational modules",
            "Map basic risk profiles to sample portfolios",
            "Observe common doubts from investors",
            "Design simple guidance flows",
          ]}
        />
        <RoleCard
          title="Data Analyst"
          description="Works with return data and user activity to derive insights."
          items={[
            "Review static performance snapshots",
            "Prepare perception vs outcome summaries",
            "Track trends by risk level",
            "Support reporting and documentation",
          ]}
        />
      </div>

      <div className="section-sub">
        <h3>Things Investors Usually Check Before Choosing a Fund</h3>
        <ul className="pill-list">
          {decisionFactors.map((f) => (
            <li key={f} className="pill">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------- Investor View (CONNECTED TO DATABASE) ------------- */

function InvestorView() {
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [watchlist, setWatchlist] = useLocalStorage("mf-watchlist", []);
  
  // CHANGED: Using standard state to fetch from MongoDB
  const [investments, setInvestments] = useState([]);
  
  const [form, setForm] = useState({ fundId: "", amount: "", mode: "SIP" });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  const filteredFunds =
    selectedRisk === "All"
      ? mutualFunds
      : mutualFunds.filter((f) => f.risk === selectedRisk);

  // NEW: Fetch data from MongoDB on component load
  useEffect(() => {
    fetch('https://mutualfunds-mauve.vercel.app/getInvestments')
      .then(res => res.json())
      .then(data => setInvestments(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const toggleWatchlist = (fund) => {
    const exists = watchlist.find((f) => f.id === fund.id);
    if (exists) {
      setWatchlist(watchlist.filter((f) => f.id !== fund.id));
    } else {
      setWatchlist([...watchlist, fund]);
    }
  };

  const handleFormChange = (e) => {
    setFormError("");
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fundId) {
      setFormError("Please choose a mutual fund from the list.");
      return;
    }

    const selectedFund = mutualFunds.find(
      (f) => f.id === Number(form.fundId)
    );

    if (!selectedFund) {
      setFormError("Selected fund is not available in the catalog.");
      return;
    }

    if (!form.amount.trim()) {
      setFormError("Amount is required.");
      return;
    }

    const amount = Number(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setFormError("Amount must be a positive number.");
      return;
    }

    // Min investment check
    const minAmount = parseInt(
      selectedFund.minInvestment.replace(/[^\d]/g, ""),
      10
    );

    if (amount < minAmount) {
      setFormError(
        `Amount must be at least the minimum investment for this fund (₹${minAmount.toLocaleString("en-IN")}).`
      );
      return;
    }

    // Backend object
    const newInvestment = {
      fund: selectedFund.name,
      amount: amount,
      mode: form.mode
    };

    try {
      // NEW: Save to DB
      const response = await fetch('https://mutualfunds-mauve.vercel.app/addInvestment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvestment)
      });

      if (response.ok) {
        const savedData = await response.json();
        setInvestments([...investments, savedData]);
        setForm({ fundId: "", amount: "", mode: "SIP" });
        setEditingId(null);
        setFormError("");
      } else {
        setFormError("Failed to save to database.");
      }
    } catch (error) {
      setFormError("Server error.");
    }
  };

  const handleEdit = (investment) => {
    alert("Edit is local only for this demo.");
  };

  const handleSell = async (investment) => {
    const current = investment.amount;
    const input = window.prompt(
      `You currently hold ₹${current.toLocaleString("en-IN")}.\nType "DELETE" to remove this investment.`,
    );

    if (input === "DELETE") {
        // NEW: Delete from DB
        try {
            await fetch(`https://mutualfunds-mauve.vercel.app/deleteInvestment/${investment._id}`, {
                method: 'DELETE'
            });
            setInvestments(prev => prev.filter(inv => inv._id !== investment._id));
        } catch (e) {
            alert("Error deleting.");
        }
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>Investor Workspace</h2>
        <p>
          Explore mutual funds, maintain a watchlist and record a simple
          portfolio. <strong>Data is saved to MongoDB.</strong>
        </p>
      </div>

      <div className="filter-bar">
        <span className="filter-label">Risk Filter:</span>
        {["All", "Low", "Medium", "High"].map((level) => (
          <button
            key={level}
            className={
              selectedRisk === level ? "chip chip-active" : "chip chip-ghost"
            }
            onClick={() => setSelectedRisk(level)}
          >
            {level}
          </button>
        ))}
        <span className="filter-summary">
          Showing {filteredFunds.length} / {mutualFunds.length} funds
        </span>
      </div>

      <div className="grid responsive-grid">
        {filteredFunds.map((fund) => {
          const inWatchlist = watchlist.some((f) => f.id === fund.id);
          return (
            <div key={fund.id} className="card fund-card">
              <div className="card-header">
                <h3>{fund.name}</h3>
                <span
                  className={`risk-tag risk-${fund.risk.toLowerCase()}`}
                >
                  {fund.risk} risk
                </span>
              </div>
              <p className="muted">{fund.type}</p>
              <p>
                <strong>3Y Avg Returns:</strong> {fund.returns}
              </p>
              <p>
                <strong>Min Investment:</strong> {fund.minInvestment}
              </p>
              <p className="small-text">
                <strong>Objective:</strong> {fund.objective}
              </p>
              <div className="card-footer">
                <button
                  className={inWatchlist ? "secondary-btn" : "primary-btn"}
                  onClick={() => toggleWatchlist(fund)}
                >
                  {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-sub">
        <h3>Your Watchlist</h3>
        {watchlist.length === 0 ? (
          <p className="muted">No funds added yet.</p>
        ) : (
          <ul className="watchlist">
            {watchlist.map((f) => (
              <li key={f.id}>
                <span>{f.name}</span>
                <span
                  className={`risk-pill risk-${f.risk.toLowerCase()}`}
                >
                  {f.risk}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section-sub portfolio-section">
        <h3>Your Portfolio (Buy / Edit / Sell)</h3>
        <p className="small-text">
          You can only buy funds that exist in the catalog. Amount must be at
          least the fund&apos;s minimum investment. Selling can be partial or
          full.
        </p>

        <form className="portfolio-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-control">
              <label>Fund *</label>
              <select
                name="fundId"
                value={form.fundId}
                onChange={handleFormChange}
              >
                <option value="">Select a fund</option>
                {mutualFunds.map((fund) => (
                  <option key={fund.id} value={fund.id}>
                    {fund.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label>Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleFormChange}
                placeholder="1000"
              />
            </div>
            <div className="form-control">
              <label>Mode</label>
              <select
                name="mode"
                value={form.mode}
                onChange={handleFormChange}
              >
                <option value="SIP">SIP</option>
                <option value="Lump Sum">Lump Sum</option>
              </select>
            </div>
          </div>

          {formError && <p className="error-text">{formError}</p>}

          <button type="submit" className="primary-btn">
            {editingId ? "Update Investment" : "Add Investment"}
          </button>
          {editingId && (
            <button
              type="button"
              className="secondary-btn inline-btn"
              onClick={() => {
                setEditingId(null);
                setForm({ fundId: "", amount: "", mode: "SIP" });
                setFormError("");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {investments.length === 0 ? (
          <p className="muted">No investments found in database.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fund</th>
                  <th>Amount (₹)</th>
                  <th>Mode</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => {
                  return (
                    <tr key={inv._id}>
                      {/* Backend stores Name directly now, so we display inv.fund */}
                      <td>{inv.fund}</td>
                      <td>{inv.amount.toLocaleString("en-IN")}</td>
                      <td>{inv.mode}</td>
                      <td>
                        <button
                          className="link-btn"
                          onClick={() => handleEdit(inv)}
                        >
                          Edit
                        </button>
                        <button
                          className="link-btn link-danger"
                          onClick={() => handleSell(inv)}
                        >
                          Sell
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------- Advisor View + Modules + Profiles ------------- */

function AdvisorView() {
  const navigate = useNavigate();

  const handleCreateModule = () => {
    navigate("/advisor/modules/new");
  };

  const handleViewModules = () => {
    navigate("/advisor/modules");
  };

  const handleViewProfiles = () => {
    navigate("/advisor/risk-profiles");
  };

  const handleMapPortfolio = () => {
    alert(
      "Demo: Here you could map a basic investor profile to a sample portfolio."
    );
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>Advisor Desk</h2>
        <p>
          Prepare simple educational content and model portfolios that can help
          new investors understand mutual funds.
        </p>
      </div>

      <div className="grid two-col">
        <div className="card">
          <h3>Educational Content Planner</h3>
          <ul className="bullet-list">
            <li>Introduction to mutual funds & NAV</li>
            <li>Risk, return and volatility basics</li>
            <li>Why SIPs can smooth market fluctuations</li>
            <li>Overview of tax-saving fund categories</li>
          </ul>
          <button
            className="primary-btn full-width-btn"
            onClick={handleCreateModule}
          >
            Create Learning Module
          </button>
          <button
            className="secondary-btn full-width-btn"
            onClick={handleViewModules}
          >
            View Published Modules
          </button>
        </div>
        <div className="card">
          <h3>Risk Profiles</h3>
          <p className="small-text">
            View profiles of different analysts and how they think about risk,
            return and portfolio construction.
          </p>
          <button
            className="secondary-btn full-width-btn"
            onClick={handleViewProfiles}
          >
            View Analyst Profiles
          </button>

          <div style={{ marginTop: "0.6rem" }}>
            <h4 style={{ margin: 0, fontSize: "0.92rem" }}>Sample Text Profiles</h4>
            <ul className="bullet-list">
              <li>Conservative Investor — Prefers stability, higher debt allocation.</li>
              <li>Balanced Investor — Mix of equity and debt, moderate risk.</li>
              <li>Aggressive Investor — Equity heavy, comfortable with volatility.</li>
            </ul>
          </div>

          <button
            className="secondary-btn full-width-btn"
            onClick={handleMapPortfolio}
          >
            Map Profile → Portfolio
          </button>
        </div>
      </div>
    </section>
  );
}

/* --- Module Creator / Editor --- */

function ModuleCreatorView() {
  const navigate = useNavigate();
  const [modules, setModules] = useLocalStorage("mf-modules", []);
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get("id");

  const editingModule = editingId
    ? modules.find((m) => String(m.id) === String(editingId))
    : null;

  const [form, setForm] = useState({
    title: editingModule?.title || "",
    summary: editingModule?.summary || "",
    difficulty: editingModule?.difficulty || "Beginner",
    audience: editingModule?.audience || "New investors",
    content: editingModule?.content || "",
    publisher: editingModule?.publisher || "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setError("Title, summary and content are required.");
      return;
    }

    if (!form.publisher.trim()) {
      setError("Publisher name is required.");
      return;
    }

    if (editingModule) {
      setModules((prev) =>
        prev.map((m) =>
          m.id === editingModule.id
            ? { ...m, ...form, updatedAt: new Date().toISOString() }
            : m
        )
      );
    } else {
      setModules((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    navigate("/advisor/modules");
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>{editingModule ? "Edit Learning Module" : "Create Learning Module"}</h2>
        <p>
          Draft and publish a simple learning module that can be shared with investors.
        </p>
      </div>

      <form className="portfolio-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-control">
            <label>Module Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Basics of Mutual Funds"
            />
          </div>
          <div className="form-control">
            <label>Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="form-control">
            <label>Target Audience</label>
            <input
              type="text"
              name="audience"
              value={form.audience}
              onChange={handleChange}
              placeholder="First-time equity investors"
            />
          </div>
        </div>

        <div className="form-control">
          <label>Short Summary *</label>
          <input
            type="text"
            name="summary"
            value={form.summary}
            onChange={handleChange}
            placeholder="One line overview of the module"
          />
        </div>

        <div className="form-control">
          <label>Publisher Name *</label>
          <input
            type="text"
            name="publisher"
            value={form.publisher}
            onChange={handleChange}
            placeholder="Advisor / Faculty name"
          />
        </div>

        <div className="form-control">
          <label>Detailed Content *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={8}
            style={{
              borderRadius: 10,
              border: "1px solid var(--border-subtle)",
              padding: "0.6rem 0.7rem",
              background: "#0d1021",
              color: "var(--text-main)",
              fontSize: "0.9rem",
              resize: "vertical",
            }}
            placeholder="Write the body of your learning module here…"
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div style={{ marginTop: "0.4rem" }}>
          <button type="submit" className="primary-btn">
            {editingModule ? "Update Module" : "Publish Module"}
          </button>
          <button
            type="button"
            className="secondary-btn inline-btn"
            onClick={() => navigate("/advisor/modules")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

/* --- Modules List (with edit & delete) --- */

function ModulesListView() {
  const [modules, setModules] = useLocalStorage("mf-modules", []);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const module = modules.find((m) => m.id === id);
    if (
      window.confirm(
        `Delete the module "${module?.title}"? This cannot be undone.`
      )
    ) {
      setModules((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/advisor/modules/new?id=${id}`);
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>Published Learning Modules</h2>
        <p>
          All modules you&apos;ve created are stored locally in your browser.
          You can edit or delete them any time.
        </p>
      </div>

      <button
        className="primary-btn"
        onClick={() => navigate("/advisor/modules/new")}
        style={{ alignSelf: "flex-start" }}
      >
        + New Module
      </button>

      {modules.length === 0 ? (
        <p className="muted" style={{ marginTop: "0.6rem" }}>
          No modules published yet. Use &quot;New Module&quot; to create one.
        </p>
      ) : (
        <div className="grid responsive-grid" style={{ marginTop: "0.8rem" }}>
          {modules.map((m) => (
            <div key={m.id} className="card">
              <h3>{m.title}</h3>
              <p className="small-text">{m.summary}</p>
              <p className="small-text">
                <strong>Difficulty:</strong> {m.difficulty} •{" "}
                <strong>Audience:</strong> {m.audience}
              </p>
              <p className="small-text">
                <strong>Publisher:</strong> {m.publisher}
              </p>
              <p className="small-text">
                <strong>Created:</strong>{" "}
                {m.createdAt
                  ? new Date(m.createdAt).toLocaleString()
                  : "—"}
              </p>
              {m.updatedAt && (
                <p className="small-text">
                  <strong>Last Updated:</strong>{" "}
                  {new Date(m.updatedAt).toLocaleString()}
                </p>
              )}
              <div style={{ marginTop: "0.5rem" }}>
                <details>
                  <summary className="link-btn">View Content</summary>
                  <p className="small-text" style={{ marginTop: "0.4rem" }}>
                    {m.content}
                  </p>
                </details>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  className="link-btn"
                  onClick={() => handleEdit(m.id)}
                >
                  Edit
                </button>
                <button
                  className="link-btn link-danger"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* --- Risk Profiles View (Analyst profiles) --- */

const analystProfiles = [
  {
    id: 1,
    name: "Aisha Mehta",
    title: "Senior Equity Analyst",
    experience: "8+ years in Indian equities",
    style: "Aggressive growth, sector rotation",
    focus: "Mid & small cap opportunities",
    avatar:
      "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 2,
    name: "Rohan Gupta",
    title: "Quantitative Research Analyst",
    experience: "6+ years in quant & factor models",
    style: "Balanced, rule-based factor investing",
    focus: "Large & flexi-cap multi-factor portfolios",
    avatar:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 3,
    name: "Sneha Iyer",
    title: "Fixed Income Strategist",
    experience: "10+ years in debt markets",
    style: "Conservative, duration and credit-aware",
    focus: "Gilt, corporate bond & hybrid funds",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 4,
    name: "Arjun Rao",
    title: "Global Markets Analyst",
    experience: "7+ years in international equity",
    style: "Aggressive, thematic international exposure",
    focus: "US tech, Nasdaq & international FOFs",
    avatar:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 5,
    name: "Priya Nair",
    title: "Risk & Compliance Analyst",
    experience: "9+ years in risk management",
    style: "Conservative, risk-first thinking",
    focus: "Hybrid, balanced advantage & asset allocation",
    avatar:
      "https://images.pexels.com/photos/3760852/pexels-photo-3760852.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
];

function RiskProfilesView() {
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="section-header">
        <h2>Analyst Risk Profiles</h2>
        <p>
          Profiles of analysts with different experience levels and investing
          styles. Use these examples to explain how professionals think about
          risk and asset allocation.
        </p>
      </div>

      <button
        className="secondary-btn"
        onClick={() => navigate("/advisor")}
        style={{ alignSelf: "flex-start" }}
      >
        ← Back to Advisor Desk
      </button>

      <div className="grid responsive-grid" style={{ marginTop: "0.9rem" }}>
        {analystProfiles.map((profile) => (
          <AnalystProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </section>
  );
}

function AnalystProfileCard({ profile }) {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          gap: "0.7rem",
          alignItems: "center",
          marginBottom: "0.4rem",
        }}
      >
        <img
          src={profile.avatar}
          alt={profile.name}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid var(--border-subtle)",
          }}
        />
        <div>
          <h3 style={{ margin: 0, fontSize: "0.98rem" }}>{profile.name}</h3>
          <p className="small-text" style={{ margin: 0 }}>
            {profile.title}
          </p>
        </div>
      </div>

      <p className="small-text">
        <strong>Experience:</strong> {profile.experience}
      </p>
      <p className="small-text">
        <strong>Style:</strong> {profile.style}
      </p>
      <p className="small-text">
        <strong>Focus:</strong> {profile.focus}
      </p>
    </div>
  );
}

/* ------------- Analyst View (REAL APIs) ------------- */

function DataAnalystView() {
  const performanceData = [
    {
      fund: "ICICI Prudential Large Cap Fund",
      oneYear: "18.1%",
      threeYear: "16.4%",
      risk: "High",
    },
    {
      fund: "Parag Parikh Flexi Cap Fund",
      oneYear: "20.3%",
      threeYear: "18.9%",
      risk: "High",
    },
    {
      fund: "SBI Equity Hybrid Fund",
      oneYear: "12.3%",
      threeYear: "11.2%",
      risk: "Medium",
    },
    {
      fund: "SBI Magnum Gilt Fund",
      oneYear: "6.7%",
      threeYear: "6.3%",
      risk: "Low",
    },
  ];

  const [btcData, setBtcData] = useState(null);
  const [fxData, setFxData] = useState(null);
  const [loadingLive, setLoadingLive] = useState(false);
  const [liveError, setLiveError] = useState("");

  useEffect(() => {
    const fetchLiveData = async () => {
      setLoadingLive(true);
      setLiveError("");

      try {
        const [btcRes, fxRes] = await Promise.all([
          fetch("https://api.coindesk.com/v1/bpi/currentprice/INR.json"),
          fetch("https://api.exchangerate-api.com/v4/latest/INR"),
        ]);

        if (!btcRes.ok) throw new Error("Bitcoin API failed");
        if (!fxRes.ok) throw new Error("FX API failed");

        const btcJson = await btcRes.json();
        const fxJson = await fxRes.json();

        const usdRateRaw =
          btcJson.bpi?.USD?.rate_float ??
          (btcJson.bpi?.USD?.rate
            ? parseFloat(String(btcJson.bpi.USD.rate).replace(/,/g, ""))
            : null);

        const inrRateRaw =
          btcJson.bpi?.INR?.rate_float ??
          (btcJson.bpi?.INR?.rate
            ? parseFloat(String(btcJson.bpi.INR.rate).replace(/,/g, ""))
            : null);

        setBtcData({
          priceUSD: usdRateRaw,
          priceINR: inrRateRaw,
          updated: btcJson.time?.updated || "",
        });

        setFxData({
          base: fxJson.base,
          date: fxJson.date,
          rates: fxJson.rates,
        });
      } catch (err) {
        console.error(err);
        setLiveError(
          "Unable to fetch live crypto / FX data from public APIs."
        );
      } finally {
        setLoadingLive(false);
      }
    };

    fetchLiveData();
  }, []);

  return (
    <section className="section">
      <div className="section-header">
        <h2>Analytics Console</h2>
        <p>
          View a static mutual fund performance snapshot and live market data
          using real public APIs (crypto and FX rates).
        </p>
      </div>

      <div className="card">
        <h3>Fund Performance Snapshot</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fund</th>
                <th>1-Year Return</th>
                <th>3-Year Return</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((row) => (
                <tr key={row.fund}>
                  <td>{row.fund}</td>
                  <td>{row.oneYear}</td>
                  <td>{row.threeYear}</td>
                  <td>{row.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small-text">
          * Numbers shown here are sample values for demonstration only.
        </p>
      </div>

      <div className="card">
        <h3>Live Market Snapshot (Real APIs)</h3>
        <p className="small-text">
          Data fetched from <strong>CoinDesk Bitcoin Price API</strong> and{" "}
          <strong>ExchangeRate-API</strong>. These are real public APIs, not
          placeholder endpoints.
        </p>

        {loadingLive && <p className="muted">Loading live market data…</p>}
        {liveError && <p className="error-text">{liveError}</p>}

        {!loadingLive && !liveError && (
          <>
            <div
              className="grid"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
            >
              <div>
                <h4 style={{ marginBottom: "0.3rem", fontSize: "0.95rem" }}>
                  Bitcoin (BTC) Price
                </h4>
                {btcData ? (
                  <>
                    <p className="small-text">
                      <strong>USD:</strong>{" "}
                      {btcData.priceUSD
                        ? `$${btcData.priceUSD.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}`
                        : "N/A"}
                    </p>
                    <p className="small-text">
                      <strong>INR:</strong>{" "}
                      {btcData.priceINR
                        ? `₹${btcData.priceINR.toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}`
                        : "N/A"}
                    </p>
                    <p className="small-text">
                      <strong>Last Updated:</strong> {btcData.updated || "N/A"}
                    </p>
                  </>
                ) : (
                  <p className="muted">No BTC data available.</p>
                )}
              </div>

              <div>
                <h4 style={{ marginBottom: "0.3rem", fontSize: "0.95rem" }}>
                  INR FX Rates
                </h4>
                {fxData ? (
                  <>
                    <p className="small-text">
                      <strong>Base:</strong> {fxData.base} on {fxData.date}
                    </p>
                    <p className="small-text">
                      <strong>1 INR → USD:</strong>{" "}
                      {fxData.rates?.USD
                        ? fxData.rates.USD.toFixed(4)
                        : "N/A"}
                    </p>
                    <p className="small-text">
                      <strong>1 INR → EUR:</strong>{" "}
                      {fxData.rates?.EUR
                        ? fxData.rates.EUR.toFixed(4)
                        : "N/A"}
                    </p>
                  </>
                ) : (
                  <p className="muted">No FX data available.</p>
                )}
              </div>
            </div>

            <p className="small-text" style={{ marginTop: "0.6rem" }}>
              * API calls are made directly from the browser and may be limited by
              CORS or free-tier restrictions depending on your network.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

/* ------------- Admin View (UPDATED) ------------- */

function AdminView() {
  const navigate = useNavigate();

  const [modules] = useLocalStorage("mf-modules", []);
  const [investments] = useLocalStorage("mf-investments", []);
  const [watchlist] = useLocalStorage("mf-watchlist", []);

  const totalInvested = investments.reduce(
    (sum, inv) => sum + (Number(inv.amount) || 0),
    0
  );

  const riskBreakdown = investments.reduce(
    (acc, inv) => {
      const fund = mutualFunds.find((f) => f.id === inv.fundId);
      const risk = fund?.risk || "Unknown";
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    },
    {}
  );

  const goInvestor = () => navigate("/investor");
  const goModules = () => navigate("/advisor/modules");
  const goAnalyst = () => navigate("/analyst");
  const goProfiles = () => navigate("/advisor/risk-profiles");

  const exportSummary = () => {
    const summary = {
      totalFundsInCatalog: mutualFunds.length,
      totalWatchlistItems: watchlist.length,
      totalInvestments: investments.length,
      totalInvested,
      modulesPublished: modules.length,
      riskBreakdown,
    };
    alert(
      "Demo export:\n\n" +
        JSON.stringify(summary, null, 2)
    );
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>Admin Panel</h2>
        <p>
          High-level overview of platform activity plus quick shortcuts to other
          workspaces.
        </p>
      </div>

      <div className="grid two-col">
        {/* Platform snapshot with dynamic numbers */}
        <div className="card">
          <h3>Platform Snapshot</h3>
          <ul className="stats-list">
            <li>
              <span>Registered Investors</span>
              <strong>124</strong>
            </li>
            <li>
              <span>Financial Advisors</span>
              <strong>5</strong>
            </li>
            <li>
              <span>Data Analysts</span>
              <strong>3</strong>
            </li>
            <li>
              <span>Mutual Funds in Catalog</span>
              <strong>{mutualFunds.length}</strong>
            </li>
            <li>
              <span>Watchlist Entries (all users)</span>
              <strong>{watchlist.length}</strong>
            </li>
            <li>
              <span>Portfolio Records</span>
              <strong>{investments.length}</strong>
            </li>
            <li>
              <span>Published Modules</span>
              <strong>{modules.length}</strong>
            </li>
          </ul>

          <p className="small-text" style={{ marginTop: "0.6rem" }}>
            <strong>Total Recorded Investment:</strong>{" "}
            {totalInvested > 0
              ? `₹${totalInvested.toLocaleString("en-IN")}`
              : "No investments recorded yet."}
          </p>

          <div style={{ marginTop: "0.4rem" }}>
            <p className="small-text">
              <strong>Risk Distribution (by portfolio rows)</strong>
            </p>
            <ul className="stats-list">
              <li>
                <span>High Risk</span>
                <strong>{riskBreakdown["High"] || 0}</strong>
              </li>
              <li>
                <span>Medium Risk</span>
                <strong>{riskBreakdown["Medium"] || 0}</strong>
              </li>
              <li>
                <span>Low Risk</span>
                <strong>{riskBreakdown["Low"] || 0}</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Admin tools & shortcuts */}
        <div className="card">
          <h3>Admin Tools & Shortcuts</h3>
          <p className="small-text">
            Jump directly into different workspaces or run simple admin actions
            on top of locally stored demo data.
          </p>

          <div className="admin-actions" style={{ marginTop: "0.6rem" }}>
            <button className="primary-btn" onClick={goInvestor}>
              Open Investor Workspace
            </button>
            <button className="secondary-btn" onClick={goModules}>
              Review Learning Modules
            </button>
            <button className="secondary-btn" onClick={goAnalyst}>
              View Analyst Console
            </button>
            <button className="secondary-btn" onClick={goProfiles}>
              View Analyst Risk Profiles
            </button>
            <button className="secondary-btn" onClick={exportSummary}>
              Export Platform Summary (Demo)
            </button>
          </div>

          <p className="small-text" style={{ marginTop: "0.6rem" }}>
            All numbers are based on data stored in{" "}
            <strong>localStorage</strong> in this browser. In a real system,
            this panel would connect to your backend / admin APIs.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------- Reusable Role Card ------------- */

function RoleCard({ title, description, items }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="small-text">{description}</p>
      <ul className="bullet-list">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
