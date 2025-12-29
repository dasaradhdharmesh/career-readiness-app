import React, { useState } from "react";
import ResumeAnalyzer from "./ResumeAnalyzer";
import SelfIntro from "./SelfIntro";
import Aptitude from "../Aptitude";
import VocabEvaluator from "../VocabEvaluator";
import "./Dashboard.css";

export default function Dashboard({ onLogout, userName = "Alex Johnson" }) {
  const [view, setView] = useState("resume");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Navigation items with icons
  const navItems = [
    { id: "resume", label: "Resume Analyzer", icon: "📄" },
    { id: "selfintro", label: "Self Introduction", icon: "🎤" },
    { id: "aptitude", label: "Aptitude Tests", icon: "🧠" },
    { id: "vocab", label: "Vocabulary Evaluator", icon: "📚" },
  ];

  // Get current date for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="app-brand">
            <h1>Career Readiness</h1>
            <span className="app-subtitle">Your Career Development Companion</span>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-greeting">{getGreeting()},</span>
              <span className="user-name">{userName}</span>
            </div>
          </div>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            title="Logout"
          >
            <span className="logout-icon">↪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="dashboard-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${view === item.id ? "active" : ""}`}
            onClick={() => setView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
<main className="dashboard-content">
  <div className="content-header">
    <h2>
      {navItems.find(item => item.id === view)?.icon || "📊"}
      {" "}
      {navItems.find(item => item.id === view)?.label || "Dashboard"}
    </h2>
    
  </div>
  
  <div className="view-content">
    {view === "resume" && <ResumeAnalyzer />}
    {view === "selfintro" && <SelfIntro />}
    {view === "aptitude" && <Aptitude />}
    {view === "vocab" && <VocabEvaluator />}
  </div>
</main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
              <button className="modal-close" onClick={cancelLogout}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
              <p className="modal-subtext">Your progress will be saved automatically.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Career Readiness v1.0 • Your progress is automatically saved</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </div>
      </footer>
    </div>
  );
}