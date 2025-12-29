import React, { useState, useRef } from "react";
import { postForm } from "../api";
import "./ResumeAnalyzer.css";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Less restrictive file validation
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      '.pdf',
      '.doc',
      '.docx',
      '.txt'
    ];
    
    const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();
    const fileType = selectedFile.type.toLowerCase();
    
    const isValidType = validTypes.includes(fileType) || 
                       validTypes.includes(fileExtension) ||
                       fileType.includes('pdf') ||
                       fileType.includes('word') ||
                       fileType.includes('document');
    
    if (!isValidType) {
      setError(`Unsupported file type: ${fileType}. Please upload PDF, DOC, DOCX, or TXT files.`);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume file");
      return;
    }
    
    if (!jd.trim()) {
      setError("Please paste a job description");
      return;
    }

    setLoading(true);
    setError("");
    
    const form = new FormData();
    form.append("file", file);
    form.append("job_description", jd);

    try {
      const resp = await postForm("/analyze/resume/analyze", form);
      setResult(resp);
      setError("");
    } catch (err) {
      setError(`Analysis failed: ${err.message || "Please check your file and try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName("");
    setJd("");
    setResult(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(files[0]);
      fileInputRef.current.files = dataTransfer.files;
      handleFileChange({ target: fileInputRef.current });
    }
  };

  const handlePasteJd = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJd(text);
    } catch (err) {
      setError("Unable to access clipboard. Please paste manually.");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Green
    if (score >= 60) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  };

  const getScoreText = (score) => {
    if (score >= 80) return "Excellent match!";
    if (score >= 60) return "Good match, needs improvements";
    return "Needs significant improvements";
  };

  return (
    <div className="resume-analyzer">
      <div className="analyzer-header">
        <h2>Resume Analyzer</h2>
        <p className="analyzer-subtitle">
          Upload your resume and compare it with a job description to get instant feedback
        </p>
      </div>

      <div className="analyzer-container">
        {/* Left Column - Inputs */}
        <div className="input-section">
          {/* File Upload */}
          <div className="upload-area">
            <h3>Upload Resume</h3>
            <div 
              className="file-dropzone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">📄</div>
              <p className="upload-text">
                {fileName || "Click to upload or drag & drop"}
              </p>
              <p className="upload-subtext">
                Supports PDF, DOC, DOCX, TXT (Max 10MB)
              </p>
              {fileName && (
                <div className="file-info">
                  <span className="file-name">{fileName}</span>
                  <button 
                    className="remove-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden-input"
                id="resume-file"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="jd-section">
            <div className="jd-header">
              <h3>Job Description</h3>
              <button 
                className="paste-btn"
                onClick={handlePasteJd}
                type="button"
              >
                📋 Paste from clipboard
              </button>
            </div>
            <div className="textarea-wrapper">
              <textarea
                rows={8}
                placeholder="Paste the job description here to analyze how well your resume matches..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="jd-textarea"
              />
              <div className="textarea-footer">
                <span className="char-count">{jd.length}/2000 characters</span>
                <span className="word-count">{jd.trim() ? jd.trim().split(/\s+/).length : 0} words</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="result-section">
          {!result ? (
            <div className="result-placeholder">
              <div className="placeholder-icon">📊</div>
              <h3>Your Analysis Results</h3>
              <p>Upload your resume and job description to see detailed analysis</p>
              <div className="placeholder-tips">
                <div className="tip">
                  <span className="tip-icon">💡</span>
                  <span>Ensure your resume includes relevant keywords from the job description</span>
                </div>
                <div className="tip">
                  <span className="tip-icon">💡</span>
                  <span>Quantify achievements with numbers and metrics</span>
                </div>
                <div className="tip">
                  <span className="tip-icon">💡</span>
                  <span>Tailor your skills section to match job requirements</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="analysis-results">
              <div className="score-header">
                <h3>Analysis Results</h3>
                <button className="new-analysis" onClick={handleReset}>
                  ↻ New Analysis
                </button>
              </div>

              {/* Overall Score */}
              <div className="overall-score">
                <div className="score-circle">
                  <div 
                    className="score-progress"
                    style={{
                      background: `conic-gradient(${getScoreColor(result.total_score)} ${result.total_score * 3.6}deg, #f3f4f6 0deg)`
                    }}
                  ></div>
                  <div className="score-value">
                    <span className="score-number">{result.total_score}</span>
                    <span className="score-out-of">/100</span>
                  </div>
                </div>
                <div className="score-details">
                  <h4 className="score-title">{getScoreText(result.total_score)}</h4>
                  <p className="score-description">
                    Your resume matches {result.total_score}% of the job requirements
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="breakdown">
                <h4>Detailed Breakdown</h4>
                <div className="breakdown-grid">

                  {/* Keywords Match */}
                  <div className="breakdown-item">
                    <span className="breakdown-label">Keywords Match</span>
                    <div className="breakdown-bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${result.breakdown?.keywords_match ?? 0}%`,
                          backgroundColor: getScoreColor(result.breakdown?.keywords_match ?? 0)
                        }}
                      ></div>
                    </div>
                    <span className="breakdown-value">
                      {result.breakdown?.keywords_match ?? 0}%
                    </span>
                  </div>

                  {/* Skills Match */}
                  <div className="breakdown-item">
                    <span className="breakdown-label">Skills Match</span>
                    <div className="breakdown-bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${result.breakdown?.skills_match ?? 0}%`,
                          backgroundColor: getScoreColor(result.breakdown?.skills_match ?? 0)
                        }}
                      ></div>
                    </div>
                    <span className="breakdown-value">
                      {result.breakdown?.skills_match ?? 0}%
                    </span>
                  </div>

                  {/* Experience Relevance */}
                  <div className="breakdown-item">
                    <span className="breakdown-label">Experience Relevance</span>
                    <div className="breakdown-bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${result.breakdown?.experience_relevance ?? 0}%`,
                          backgroundColor: getScoreColor(result.breakdown?.experience_relevance ?? 0)
                        }}
                      ></div>
                    </div>
                    <span className="breakdown-value">
                      {result.breakdown?.experience_relevance ?? 0}%
                    </span>
                  </div>

                </div>
              </div>
{/* Missing Skills */}
{result.missing_skills && result.missing_skills.length > 0 && (
  <div className="missing-skills">
    <h4>Missing Skills</h4>
    <p className="missing-skills-hint">
      Consider adding these skills to better match the job description:
    </p>
    <div className="skills-chip-container">
      {result.missing_skills.map((skill, index) => (
        <span key={index} className="skill-chip">
          {skill}
        </span>
      ))}
    </div>
  </div>
)}

              {/* Recommendations */}
              {result.recommendations && (
                <div className="recommendations">
                  <h4>Recommendations</h4>
                  <ul className="recommendations-list">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="recommendation-item">
                        <span className="rec-icon">✨</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Keywords */}
              {result.missing_keywords && (
                <div className="missing-keywords">
                  <h4>Missing Keywords</h4>
                  <div className="keywords-list">
                    {result.missing_keywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="secondary-btn"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </button>
        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || !file || !jd.trim()}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Analyzing...
            </>
          ) : (
            "Analyze Resume"
          )}
        </button>
      </div>
    </div>
  );
}