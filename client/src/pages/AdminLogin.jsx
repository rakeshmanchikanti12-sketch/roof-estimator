import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError("Enter username and password.");
      return;
    }

    const credentials = btoa(
      `${username}:${password}`
    );

    localStorage.setItem(
      "adminAuth",
      credentials
    );

    navigate("/admin/leads");
  };

  return (
    <div className="admin-page">

      <div className="admin-login-card">

        <div className="admin-logo">
          NR
        </div>

        <p className="eyebrow">
          OWNER PANEL
        </p>

        <h1>
          Admin Login
        </h1>

        <p className="admin-subtitle">
          Sign in to manage roofing leads.
        </p>

        <form onSubmit={handleLogin}>

          <div className="field">
            <label>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Admin username"
            />
          </div>

          <div className="field">
            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Admin password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="next-button admin-login-button"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminLogin;