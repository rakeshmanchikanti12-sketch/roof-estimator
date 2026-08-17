import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function AdminConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const auth = localStorage.getItem("adminAuth");

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/config`);

      if (!response.ok) {
        throw new Error("Failed to load configuration");
      }

      const data = await response.json();

      setConfig(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateBusiness(field, value) {
    setConfig((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        [field]: value
      }
    }));
  }

  function updateQuestion(index, field, value) {
    setConfig((prev) => {
      const questions = [...prev.questions];

      questions[index] = {
        ...questions[index],
        [field]: value
      };

      return {
        ...prev,
        questions
      };
    });
  }

  function updateOption(
    questionIndex,
    optionIndex,
    field,
    value
  ) {
    setConfig((prev) => {
      const questions = [...prev.questions];

      const options = [...questions[questionIndex].options];

      options[optionIndex] = {
        ...options[optionIndex],
        [field]: value
      };

      questions[questionIndex] = {
        ...questions[questionIndex],
        options
      };

      return {
        ...prev,
        questions
      };
    });
  }

  function updateModifier(field, value) {
    setConfig((prev) => ({
      ...prev,
      modifiers: {
        ...prev.modifiers,
        [field]: Number(value)
      }
    }));
  }

  async function saveConfig() {
    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/config`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`
          },
          body: JSON.stringify(config)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to save configuration"
        );
      }

      setConfig(data);
      setMessage(
        "Configuration saved successfully."
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-loading">
            Loading configuration...
          </div>
        </div>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="error-box">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* HEADER */}

        <div className="admin-header">

          <div>
            <p className="eyebrow">
              NORTHLINE ROOFING & EXTERIORS
            </p>

            <h1>
              Configuration
            </h1>

            <p className="admin-subtitle">
              Manage roof estimator settings.
            </p>
          </div>

          <button
            className="logout-button"
            onClick={() => {
              window.location.href =
                "/admin/leads";
            }}
          >
            Back to Leads
          </button>

        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* BUSINESS */}

        <div className="admin-card">

          <div className="admin-card-header">

            <div>
              <p className="eyebrow">
                BUSINESS
              </p>

              <h2>
                Business Information
              </h2>
            </div>

            <span className="version-badge">
              Version {config.config_version}
            </span>

          </div>

          <div className="admin-grid">

            <div className="field">

              <label>
                Business Name
              </label>

              <input
                type="text"
                value={
                  config.business?.name || ""
                }
                onChange={(e) =>
                  updateBusiness(
                    "name",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="field">

              <label>
                Region
              </label>

              <input
                type="text"
                value={
                  config.business?.region || ""
                }
                onChange={(e) =>
                  updateBusiness(
                    "region",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="field">

              <label>
                Currency
              </label>

              <input
                type="text"
                value={
                  config.business?.currency || ""
                }
                onChange={(e) =>
                  updateBusiness(
                    "currency",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* QUESTIONS */}

        <div className="admin-card">

          <div className="admin-card-header">

            <div>
              <p className="eyebrow">
                ESTIMATOR QUESTIONS
              </p>

              <h2>
                Questions
              </h2>
            </div>

          </div>

          {config.questions?.map(
            (question, questionIndex) => (

              <div
                className="question-admin-card"
                key={question.key}
              >

                {/* QUESTION HEADER */}

                <div className="question-admin-header">

                  <div>

                    <span className="question-key">
                      {question.key}
                    </span>

                    <h3>
                      {question.label}
                    </h3>

                  </div>

                  <label className="active-toggle">

                    <input
                      type="checkbox"
                      checked={
                        question.active !== false
                      }
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          "active",
                          e.target.checked
                        )
                      }
                    />

                    Active

                  </label>

                </div>

                {/* QUESTION FIELDS */}

                <div className="admin-grid">

                  <div className="field">

                    <label>
                      Label
                    </label>

                    <input
                      type="text"
                      value={
                        question.label || ""
                      }
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          "label",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="field">

                    <label>
                      Type
                    </label>

                    <input
                      type="text"
                      value={
                        question.type || ""
                      }
                      readOnly
                    />

                  </div>

                  {question.unit && (
                    <div className="field">

                      <label>
                        Unit
                      </label>

                      <input
                        type="text"
                        value={
                          question.unit
                        }
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "unit",
                            e.target.value
                          )
                        }
                      />

                    </div>
                  )}

                  {question.min !==
                    undefined && (
                    <div className="field">

                      <label>
                        Minimum
                      </label>

                      <input
                        type="number"
                        value={
                          question.min
                        }
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "min",
                            Number(
                              e.target.value
                            )
                          )
                        }
                      />

                    </div>
                  )}

                  {question.max !==
                    undefined && (
                    <div className="field">

                      <label>
                        Maximum
                      </label>

                      <input
                        type="number"
                        value={
                          question.max
                        }
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "max",
                            Number(
                              e.target.value
                            )
                          )
                        }
                      />

                    </div>
                  )}

                </div>

                {/* OPTIONS */}

                {question.options &&
                  question.options.length >
                    0 && (

                    <div className="options-admin">

                      <h4>
                        Options
                      </h4>

                      {question.options.map(
                        (
                          option,
                          optionIndex
                        ) => (

                          <div
                            className="option-admin"
                            key={
                              option.value
                            }
                          >

                            <div className="option-number">
                              {optionIndex + 1}
                            </div>

                            <div className="option-fields">

                              <div className="field">

                                <label>
                                  Value
                                </label>

                                <input
                                  type="text"
                                  value={
                                    option.value ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateOption(
                                      questionIndex,
                                      optionIndex,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />

                              </div>

                              <div className="field">

                                <label>
                                  Label
                                </label>

                                <input
                                  type="text"
                                  value={
                                    option.label ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateOption(
                                      questionIndex,
                                      optionIndex,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                />

                              </div>

                              {option.rate_per_sqft !==
                                undefined && (

                                <div className="field">

                                  <label>
                                    Rate / Sq Ft
                                  </label>

                                  <input
                                    type="number"
                                    step="0.01"
                                    value={
                                      option.rate_per_sqft
                                    }
                                    onChange={(e) =>
                                      updateOption(
                                        questionIndex,
                                        optionIndex,
                                        "rate_per_sqft",
                                        Number(
                                          e.target.value
                                        )
                                      )
                                    }
                                  />

                                </div>
                              )}

                              {option.multiplier !==
                                undefined && (

                                <div className="field">

                                  <label>
                                    Multiplier
                                  </label>

                                  <input
                                    type="number"
                                    step="0.01"
                                    value={
                                      option.multiplier
                                    }
                                    onChange={(e) =>
                                      updateOption(
                                        questionIndex,
                                        optionIndex,
                                        "multiplier",
                                        Number(
                                          e.target.value
                                        )
                                      )
                                    }
                                  />

                                </div>
                              )}

                              {option.tear_off_per_sqft !==
                                undefined && (

                                <div className="field">

                                  <label>
                                    Tear Off / Sq Ft
                                  </label>

                                  <input
                                    type="number"
                                    step="0.01"
                                    value={
                                      option.tear_off_per_sqft
                                    }
                                    onChange={(e) =>
                                      updateOption(
                                        questionIndex,
                                        optionIndex,
                                        "tear_off_per_sqft",
                                        Number(
                                          e.target.value
                                        )
                                      )
                                    }
                                  />

                                </div>
                              )}

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

              </div>
            )
          )}

        </div>

        {/* PRICING */}

        <div className="admin-card">

          <div className="admin-card-header">

            <div>

              <p className="eyebrow">
                PRICING
              </p>

              <h2>
                Pricing Modifiers
              </h2>

            </div>

          </div>

          <div className="admin-grid">

            <div className="field">

              <label>
                Waste Factor
              </label>

              <input
                type="number"
                step="0.01"
                value={
                  config.modifiers
                    ?.waste_factor ?? 0
                }
                onChange={(e) =>
                  updateModifier(
                    "waste_factor",
                    e.target.value
                  )
                }
              />

              <small>
                0.10 means 10%.
              </small>

            </div>

            <div className="field">

              <label>
                Permit Flat Fee
              </label>

              <input
                type="number"
                step="1"
                value={
                  config.modifiers
                    ?.permit_flat_fee ?? 0
                }
                onChange={(e) =>
                  updateModifier(
                    "permit_flat_fee",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="field">

              <label>
                Range Spread %
              </label>

              <input
                type="number"
                step="1"
                value={
                  config.modifiers
                    ?.range_spread_pct ?? 0
                }
                onChange={(e) =>
                  updateModifier(
                    "range_spread_pct",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* SAVE */}

        <div className="admin-save-section">

          <button
            className="admin-save-button"
            onClick={saveConfig}
          >
            Save Configuration
          </button>

        </div>

      </div>
    </div>
  );
}

export default AdminConfig;