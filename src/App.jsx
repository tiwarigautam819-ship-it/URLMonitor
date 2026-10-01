import { useEffect, useState } from "react";
import "./App.css";

import {
  loginUser,
  registerUser,
  loginWithGoogle,
  logoutUser,
  getUserProfile,
  watchAuthState
} from "./firebase/authService";

import AdminPanel from "./AdminPanel";

const ADMIN_EMAIL = "tiwarigautam819@gmail.com";

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("login");
  const [page, setPage] = useState("home");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [url, setUrl] = useState("");
  const [interval, setIntervalValue] = useState(15);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Not started");
  const [responseTime, setResponseTime] = useState(null);

  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const unsubscribe = watchAuthState(async (authUser) => {
      setUser(authUser);

      if (authUser) {
        const data = await getUserProfile(authUser.uid);
        setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;
  const isPro = profile?.isPro === true;

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (mode === "login") {
        await loginUser(email, password);
      } else {
        await registerUser(email, password);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const googleLogin = async () => {
    setMessage("");

    try {
      await loginWithGoogle();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const checkUrl = async () => {
    const target = url.trim();

    if (!target) {
      setStatus("Enter a URL first");
      return;
    }

    const start = Date.now();
    setStatus("Checking...");
    setResponseTime(null);

    try {
      await fetch(target, {
        method: "GET",
        mode: "no-cors",
        cache: "no-store"
      });

      const time = Date.now() - start;

      setResponseTime(time);
      setStatus("Website checked");
    } catch {
      setStatus("Check failed");
    }
  };

  const addUrl = () => {
    const target = url.trim();

    if (!target) {
      setStatus("Enter a URL first");
      return;
    }

    if (!isPro && urls.length >= 1) {
      setStatus("Free plan allows only 1 URL");
      return;
    }

    if (urls.includes(target)) {
      setStatus("URL already added");
      return;
    }

    setUrls((old) => [...old, target]);
    setUrl("");
    setStatus("URL added");
  };

  const startMonitoring = () => {
    if (!url.trim() && urls.length === 0) {
      setStatus("Enter or add a URL first");
      return;
    }

    setRunning(true);
    setStatus("Monitoring started");
    checkUrl();
  };

  const stopMonitoring = () => {
    setRunning(false);
    setStatus("Monitoring stopped");
  };

  if (!user) {
    return (
      <div className="authPage">

        <div className="authCard">

          <div className="logo">U</div>

          <h1>URL Monitor</h1>
          <p className="subtitle">
            Website & API monitoring
          </p>

          <button className="googleBtn" onClick={googleLogin}>
            Continue with Google
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <form onSubmit={handleAuth}>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              {mode === "login" ? "Login" : "Create Account"}
            </button>

          </form>

          {message && (
            <p className="error">{message}</p>
          )}

          <p className="switch">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              className="linkBtn"
              onClick={() =>
                setMode(
                  mode === "login"
                    ? "register"
                    : "login"
                )
              }
            >
              {mode === "login"
                ? " Sign up"
                : " Login"}
            </button>
          </p>

        </div>

        <footer>
          © Gautam Tiwari from Nexora ❤️‍🩹
        </footer>

      </div>
    );
  }

  return (
    <div className="app">

      <header className="topbar">

        <div className="logo">U</div>

        <div>
          <h1>URL Monitor</h1>
          <p>
            {isPro ? "⭐ Pro Plan" : "Free Plan"}
          </p>
        </div>

      </header>

      <main className="mainContent">

        {page === "home" && (
          <section className="card">

            <h2>Monitor your URL</h2>

            <p className="muted">
              Check your website or API status.
            </p>

            <label>Website / API URL</label>

            <div className="urlBox">

              <span>🔗</span>

              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
              />

            </div>

            <label>Check interval</label>

            <select
              value={interval}
              onChange={(e) =>
                setIntervalValue(
                  Number(e.target.value)
                )
              }
            >
              <option value="10">
                Every 10 minutes
              </option>

              <option value="15">
                Every 15 minutes
              </option>

              <option value="30">
                Every 30 minutes
              </option>

              <option value="60">
                Every 60 minutes
              </option>
            </select>

            <button onClick={addUrl}>
              + Add URL
            </button>

            {!running ? (
              <button onClick={startMonitoring}>
                ▶ Start Monitoring
              </button>
            ) : (
              <button
                className="stop"
                onClick={stopMonitoring}
              >
                ■ Stop Monitoring
              </button>
            )}

            <div className="statusCard">

              <div className="statusDot"></div>

              <div>
                <small>Status</small>

                <strong>{status}</strong>

                {responseTime !== null && (
                  <p>
                    Response: {responseTime} ms
                  </p>
                )}
              </div>

            </div>

            {!isPro && (
              <div className="proCard">

                <strong>
                  ⭐ Upgrade to Pro
                </strong>

                <p>
                  Monitor multiple URLs for
                  ₹49/year.
                </p>

                <button
                  onClick={() => {
                    window.location.href =
                      "https://wa.me/918955932061?text=Hello%2C%20I%20want%20to%20upgrade%20my%20URL%20Monitor%20account%20to%20Pro.";
                  }}
                >
                  Upgrade via WhatsApp
                </button>

              </div>
            )}

          </section>
        )}

        {page === "monitor" && (
          <section className="card">

            <h2>Monitor</h2>

            <p className="muted">
              Your monitored URLs
            </p>

            {urls.length === 0 ? (
              <p>No URLs added yet.</p>
            ) : (
              urls.map((item, index) => (
                <div
                  className="urlCard"
                  key={index}
                >
                  <strong>{item}</strong>

                  <span>
                    {running
                      ? "🟢 Monitoring"
                      : "⚪ Stopped"}
                  </span>
                </div>
              ))
            )}

          </section>
        )}

        {page === "account" && (
          <section className="card">

            <h2>Account</h2>

            <p>{user.email}</p>

            <div className="planCard">

              <strong>
                {isPro
                  ? "⭐ PRO MEMBER"
                  : "FREE PLAN"}
              </strong>

              <p>
                {isPro
                  ? "Multiple URL monitoring enabled."
                  : "Free plan: 1 URL."}
              </p>

            </div>

            <button
              className="stop"
              onClick={logoutUser}
            >
              Logout
            </button>

          </section>
        )}

        {page === "admin" && isAdmin && (
          <AdminPanel />
        )}

      </main>

      <nav className="bottomNav">

        <button
          className={page === "home" ? "active" : ""}
          onClick={() => setPage("home")}
        >
          🏠
          <span>Home</span>
        </button>

        <button
          className={page === "monitor" ? "active" : ""}
          onClick={() => setPage("monitor")}
        >
          📊
          <span>Monitor</span>
        </button>

        <button
          className={page === "account" ? "active" : ""}
          onClick={() => setPage("account")}
        >
          👤
          <span>Account</span>
        </button>

        {isAdmin && (
          <button
            className={page === "admin" ? "active" : ""}
            onClick={() => setPage("admin")}
          >
            👑
            <span>Admin</span>
          </button>
        )}

      </nav>

      <footer>
        © Gautam Tiwari from Nexora ❤️‍🩹
      </footer>

    </div>
  );
}

export default App;
