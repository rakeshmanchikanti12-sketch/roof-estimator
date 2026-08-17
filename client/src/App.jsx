import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [config, setConfig] = useState(null);
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState({});

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const [estimate, setEstimate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/config`)
      .then((response) => {
        setConfig(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load estimator.");
        setLoading(false);
      });
  }, []);

  const questions = config?.questions || [];
  const totalSteps = questions.length + 1;
  const currentQuestion = questions[step];

  const handleAnswer = (key, value) => {
    setAnswers((previous) => ({
      ...previous,
      [key]: value
    }));

    setError("");
  };

  const handleCustomer = (key, value) => {
    setCustomer((previous) => ({
      ...previous,
      [key]: value
    }));

    setError("");
  };

  const validateCurrentStep = () => {
    if (step < questions.length) {
      const question = questions[step];

      if (
        question.required &&
        !answers[question.key]
      ) {
        setError(
          `Please answer: ${question.label}`
        );
        return false;
      }

      if (question.key === "roof_area") {
        const area = Number(answers.roof_area);

        if (
          Number.isNaN(area) ||
          area < question.min ||
          area > question.max
        ) {
          setError(
            `Roof area must be between ${question.min} and ${question.max} sq ft.`
          );
          return false;
        }
      }

      return true;
    }

    if (!customer.name.trim()) {
      setError("Please enter your name.");
      return false;
    }

    const phone = customer.phone.replace(/\D/g, "");

    if (phone.length < 10) {
      setError("Please enter a valid phone number.");
      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(customer.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    setStep((previous) => previous + 1);
    setError("");
  };

  const previousStep = () => {
    setStep((previous) =>
      Math.max(previous - 1, 0)
    );

    setError("");
  };

  const submitEstimate = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/api/estimate`,
        {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          answers: {
            ...answers,
            roof_area: Number(answers.roof_area)
          }
        }
      );

      setEstimate(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to calculate estimate."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetEstimator = () => {
    setStep(0);

    setAnswers({});

    setCustomer({
      name: "",
      phone: "",
      email: ""
    });

    setEstimate(null);
    setError("");
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          Loading estimator...
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="page">
        <div className="card error-box">
          {error || "Unable to load estimator."}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">

        <header className="header">

          <div className="logo">
            NR
          </div>

          <div>
            <h1>
              {config.business.name}
            </h1>

            <p>
              Roof Estimate
            </p>
          </div>

          <span className="location">
            {config.business.region} |{" "}
            {config.business.currency}
          </span>

        </header>

        {!estimate ? (
          <main className="card">

            <div className="intro">

              <p className="eyebrow">
                ROOF ESTIMATOR
              </p>

              <h2>
                Get Your Roof Estimate
              </h2>

              <p>
                Answer a few questions to get
                your estimate.
              </p>

            </div>

            <div className="progress-section">

              <div className="progress-info">

                <span>
                  Step {step + 1} of {totalSteps}
                </span>

                <span>
                  {Math.round(
                    ((step + 1) / totalSteps) * 100
                  )}
                  %
                </span>

              </div>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      ((step + 1) / totalSteps) * 100
                    }%`
                  }}
                />

              </div>

            </div>

            <div className="step-content">

              {step < questions.length ? (

                <div className="question">

                  <span className="question-number">
                    {String(step + 1).padStart(2, "0")}
                  </span>

                  <h3>
                    {currentQuestion.label}
                  </h3>

                  {currentQuestion.type === "number" && (

                    <div className="number-input">

                      <input
                        type="number"
                        min={currentQuestion.min}
                        max={currentQuestion.max}
                        value={
                          answers[
                            currentQuestion.key
                          ] || ""
                        }
                        onChange={(event) =>
                          handleAnswer(
                            currentQuestion.key,
                            event.target.value
                          )
                        }
                        placeholder="Enter roof size"
                        autoFocus
                      />

                      <span>
                        {currentQuestion.unit}
                      </span>

                    </div>

                  )}

                  {currentQuestion.type === "select" && (

                    <div className="options">

                      {currentQuestion.options.map(
                        (option) => (

                          <button
                            type="button"
                            key={option.value}
                            className={
                              answers[
                                currentQuestion.key
                              ] === option.value
                                ? "option selected"
                                : "option"
                            }
                            onClick={() =>
                              handleAnswer(
                                currentQuestion.key,
                                option.value
                              )
                            }
                          >

                            <span>
                              {option.label}
                            </span>

                            <span className="radio">

                              {answers[
                                currentQuestion.key
                              ] === option.value
                                ? "✓"
                                : ""}

                            </span>

                          </button>

                        )
                      )}

                    </div>

                  )}

                </div>

              ) : (

                <div className="customer-form">

                  <span className="question-number">
                    06
                  </span>

                  <h3>
                    Where should we send your estimate?
                  </h3>

                  <div className="field">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={customer.name}
                      onChange={(event) =>
                        handleCustomer(
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Your full name"
                    />

                  </div>

                  <div className="field">

                    <label>
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(event) =>
                        handleCustomer(
                          "phone",
                          event.target.value
                        )
                      }
                      placeholder="Your phone number"
                    />

                  </div>

                  <div className="field">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      value={customer.email}
                      onChange={(event) =>
                        handleCustomer(
                          "email",
                          event.target.value
                        )
                      }
                      placeholder="Your email address"
                    />

                  </div>

                </div>

              )}

              {error && (

                <div className="error-message">
                  {error}
                </div>

              )}

            </div>

            <div className="actions">

              {step > 0 && (

                <button
                  type="button"
                  className="back-button"
                  onClick={previousStep}
                >
                  ← Back
                </button>

              )}

              {step < questions.length ? (

                <button
                  type="button"
                  className="next-button"
                  onClick={nextStep}
                >
                  Next →
                </button>

              ) : (

                <button
                  type="button"
                  className="next-button"
                  onClick={submitEstimate}
                  disabled={submitting}
                >
                  {submitting
                    ? "Calculating..."
                    : "Get Estimate"}
                </button>

              )}

            </div>

          </main>

        ) : (

          <main className="card result-card">

            <div className="success-icon">
              ✓
            </div>

            <p className="eyebrow">
              ESTIMATE READY
            </p>

            <h2>
              Your Estimated Roof Cost
            </h2>

            <div className="estimate-range">

              $
              {estimate.estimate_low.toLocaleString()}
              {" - "}
              $
              {estimate.estimate_high.toLocaleString()}

            </div>

            <p className="result-text">
              Based on the information you provided,
              this is your estimated roofing cost range.
            </p>

            <div className="result-details">

              <div>

                <span>
                  Configuration
                </span>

                <strong>
                  Version {estimate.config_version}
                </strong>

              </div>

              <div>

                <span>
                  Customer
                </span>

                <strong>
                  {customer.name}
                </strong>

              </div>

            </div>

            <p className="success-message">
              Your information has been submitted
              successfully.
            </p>

            <button
              type="button"
              className="new-estimate"
              onClick={resetEstimator}
            >
              Start New Estimate
            </button>

          </main>

        )}

      </div>
    </div>
  );
}

export default App;