import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://roof-estimator-api-ho7w.onrender.com";

function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const auth = localStorage.getItem("adminAuth");

      if (!auth) {
        navigate("/admin");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/admin/leads`,
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );

      setLeads(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminAuth");
        navigate("/admin");
        return;
      }

      setError("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const deleteLead = async (leadId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(leadId);
      setError("");

      const auth = localStorage.getItem("adminAuth");

      if (!auth) {
        navigate("/admin");
        return;
      }

      await axios.delete(
        `${API_URL}/api/admin/leads/${leadId}`,
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );

      setLeads((currentLeads) =>
        currentLeads.filter(
          (lead) => lead._id !== leadId
        )
      );
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminAuth");
        navigate("/admin");
        return;
      }

      setError("Failed to delete lead.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          Loading leads...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <div className="admin-container">

        <header className="admin-header">

          <div>
            <p className="eyebrow">
              NORTHLINE ROOFING & EXTERIORS
            </p>

            <h1>
              Leads
            </h1>

            <p className="admin-subtitle">
              Manage submitted roof estimates.
            </p>
          </div>

          <div className="admin-header-actions">

            <button
              type="button"
              className="config-button"
              onClick={() =>
                navigate("/admin/config")
              }
            >
              Configuration
            </button>

            <button
              type="button"
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="lead-summary">

          <strong>
            {leads.length}
          </strong>

          <span>
            Total Leads
          </span>

        </div>

        <div className="leads-table-container">

          <table className="leads-table">

            <thead>

              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Estimate</th>
                <th>Config</th>
                <th>Created</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {leads.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-state"
                  >
                    No leads found.
                  </td>

                </tr>

              ) : (

                leads.map((lead) => (

                  <tr key={lead._id}>

                    <td>
                      <strong>
                        {lead.name}
                      </strong>
                    </td>

                    <td>
                      {lead.phone}
                    </td>

                    <td>
                      {lead.email}
                    </td>

                    <td>
                      $
                      {lead.estimate_low.toLocaleString()}
                      {" - "}
                      $
                      {lead.estimate_high.toLocaleString()}
                    </td>

                    <td>
                      v{lead.config_version}
                    </td>

                    <td>
                      {new Date(
                        lead.createdAt
                      ).toLocaleString()}
                    </td>

                    <td>

                      <button
                        type="button"
                        className="delete-button"
                        disabled={
                          deletingId === lead._id
                        }
                        onClick={() =>
                          deleteLead(lead._id)
                        }
                      >
                        {deletingId === lead._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminLeads;
