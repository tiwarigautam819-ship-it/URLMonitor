import { useEffect, useState } from "react";
import "./App.css";
import {
  loginUser,
  registerUser,
  loginWithGoogle,
  logoutUser,
  getUserProfile,
  onAuthStateChanged
} from "./firebase/authService";

function App() {
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authUser => {
      setUser(authUser);

      if (authUser) {
        getUserProfile(authUser.uid)
          .then(profile => setIsPro(profile.isPro === true))
          .catch(() => setIsPro(false));
      } else {
        setIsPro(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleEmailAuth = async (e) => {
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

  const handleGoogle = async () => {
    setMessage("");

    try {
      await loginWithGoogle();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <div className="center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="authPage">
        <div className="authCard">

          <div className="logo">U</div>

          <h1>URL Monitor</h1>
          <p className="subtitle">
            Monitor your websites easily
          </p>

          <button className="googleBtn" onClick={handleGoogle}>
            Continue with Google
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <form onSubmit={handleEmailAuth}>

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
                setMode(mode === "login" ? "register" : "login")
              }
            >
              {mode === "login" ? " Sign up" : " Login"}
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
          <p>{isPro ? "PRO Plan" : "Free Plan"}</p>
        </div>
      </header>

      <main className="card">

        <h2>Welcome 👋</h2>

        <p>
          {user.email}
        </p>

        <div className="planCard">
          <strong>
            {isPro ? "⭐ PRO MEMBER" : "FREE PLAN"}
          </strong>

          <p>
            {isPro
              ? "Multiple URL monitoring enabled."
              : "You can monitor 1 URL."}
          </p>
        </div>

        {!isPro && (
          <button
            onClick={() => {
              window.location.href =
                "https://wa.me/918955932061?text=Hello%2C%20I%20want%20to%20upgrade%20my%20URL%20Monitor%20account%20to%20Pro.";
            }}
          >
            ⭐ Upgrade to Pro — ₹49/year
          </button>
        )}

        <button className="stop" onClick={logoutUser}>
          Logout
        </button>

      </main>

      <footer>
        © Gautam Tiwari from Nexora ❤️‍🩹
      </footer>

    </div>
  );
}

export default App;
