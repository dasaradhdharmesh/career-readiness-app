import React, { useState } from "react";
import { postForm } from "../api";
import "./SelfIntro.css";

const JOB_ROLES = [
  "Data Analyst",
  "Data Scientist",
  "Business Analyst",
  "Machine Learning Engineer",
  "Software Engineer",
  "Full Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "Product Analyst",
  "AI Engineer"
];

const TONE_OPTIONS = [
  { value: "Formal", description: "Professional and corporate style" },
  { value: "Neutral", description: "Balanced and straightforward" },
  { value: "Confident", description: "Assertive and achievement-focused" },
  { value: "Friendly", description: "Warm and approachable" }
];

const DURATION_OPTIONS = [
  { value: "15s", label: "15 seconds", description: "Quick elevator pitch" },
  { value: "30s", label: "30 seconds", description: "Standard interview intro" },
  { value: "60s", label: "60 seconds", description: "Detailed introduction" }
];

export default function SelfIntro() {
  const [name, setName] = useState("");
  const [role, setRole] = useState(JOB_ROLES[0]);
  const [length, setLength] = useState("15s");
  const [tone, setTone] = useState("Formal");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  async function generate() {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    setLoading(true);
    setResult("");
    setCopySuccess(false);

    const form = new FormData();
    form.append("name", name);
    form.append("role", role);
    form.append("length", length);
    form.append("tone", tone);

    try {
      const res = await postForm("/selfintro/generate", form);
      setResult(res.result || "No response generated.");
    } catch (err) {
      setResult("Something went wrong while generating the self introduction. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(() => {
        alert("Failed to copy to clipboard");
      });
  };

  const handleClear = () => {
    setName("");
    setRole(JOB_ROLES[0]);
    setLength("15s");
    setTone("Formal");
    setResult("");
    setCopySuccess(false);
  };

  const getSelectedDuration = () => {
    return DURATION_OPTIONS.find(d => d.value === length)?.label || "15 seconds";
  };

  const getSelectedTone = () => {
    return TONE_OPTIONS.find(t => t.value === tone)?.description || "Professional style";
  };

  return (
    <div className="selfintro-container">
      <div className="selfintro-header">
        <h2>Self-Introduction Creator</h2>
        <p className="subtitle">Generate a professional introduction tailored for your target role</p>
      </div>

      <div className="form-section">
        <div className="form-grid">
          {/* Name Input */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Your Name</span>
              <span className="label-required">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Job Role Selection */}
          <div className="form-group">
            <label className="form-label">Target Job Role</label>
            <div className="select-wrapper">
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
                disabled={loading}
              >
                {JOB_ROLES.map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
              </select>
              <div className="select-arrow">▼</div>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="form-group">
            <label className="form-label">Duration</label>
            <div className="duration-options">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`duration-btn ${length === option.value ? 'active' : ''}`}
                  onClick={() => setLength(option.value)}
                  disabled={loading}
                >
                  <span className="duration-label">{option.label}</span>
                  <span className="duration-desc">{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="form-group">
            <label className="form-label">Tone & Style</label>
            <div className="tone-grid">
              {TONE_OPTIONS.map((option) => (
                <div 
                  key={option.value}
                  className={`tone-card ${tone === option.value ? 'active' : ''}`}
                  onClick={() => setTone(option.value)}
                >
                  <div className="tone-header">
                    <div className="tone-radio">
                      <div className={`radio-dot ${tone === option.value ? 'checked' : ''}`}></div>
                    </div>
                    <span className="tone-title">{option.value}</span>
                  </div>
                  <p className="tone-description">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="secondary-btn"
            onClick={handleClear}
            disabled={loading}
            type="button"
          >
            Clear All
          </button>
          <button
            className="generate-btn"
            onClick={generate}
            disabled={loading || !name.trim()}
            type="button"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Generating...
              </>
            ) : (
              "Generate Introduction"
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="result-section">
          <div className="result-header">
            <h3>Your Generated Introduction</h3>
            <div className="result-meta">
              <span className="meta-item">
                <span className="meta-label">Role:</span>
                <span className="meta-value">{role}</span>
              </span>
              <span className="meta-item">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{getSelectedDuration()}</span>
              </span>
              <span className="meta-item">
                <span className="meta-label">Tone:</span>
                <span className="meta-value">{getSelectedTone()}</span>
              </span>
            </div>
          </div>

          <div className="result-card">
            <div className="result-content">
              {result}
            </div>
            <div className="result-actions">
              <button
                className="copy-btn"
                onClick={handleCopy}
                type="button"
              >
                {copySuccess ? (
                  <>
                    <span className="copy-icon">✓</span>
                    Copied!
                  </>
                ) : (
                  <>
                    <span className="copy-icon">📋</span>
                    Copy to Clipboard
                  </>
                )}
              </button>
              <button
                className="refresh-btn"
                onClick={generate}
                disabled={loading}
                type="button"
              >
                <span className="refresh-icon">⟳</span>
                Regenerate
              </button>
            </div>
          </div>

          <div className="usage-tips">
            <h4>💡 Tips for Using Your Introduction</h4>
            <ul className="tips-list">
              <li>Practice saying it out loud multiple times</li>
              <li>Adapt it slightly based on the specific company</li>
              <li>Maintain eye contact and confident body language</li>
              <li>End with a question about the role or company</li>
            </ul>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !result && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner large"></div>
            <p>Creating your personalized introduction...</p>
          </div>
        </div>
      )}
    </div>
  );
}