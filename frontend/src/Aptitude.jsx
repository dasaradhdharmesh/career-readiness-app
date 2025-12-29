import React, { useState, useEffect } from "react";
import { postForm } from "./api";
import "./Aptitude.css";

const TOPICS = [
  "Data Analysis",
  "Logical Reasoning",
  "Quantitative Aptitude",
  "Verbal Ability",
  "Programming Concepts",
  "Data Structures",
  "Algorithms",
  "SQL Queries",
  "Problem Solving",
  "Critical Thinking"
];

export default function Aptitude() {
  const [topic, setTopic] = useState("Data Analysis");
  const [questions, setQuestions] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [customTopic, setCustomTopic] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  async function getQuestions(e) {
    e.preventDefault();
    const selectedTopic = showCustomInput && customTopic.trim() ? customTopic : topic;
    
    if (!selectedTopic.trim()) {
      alert("Please select or enter a topic");
      return;
    }

    setLoading(true);
    setQuestions(null);
    setUserAnswers({});
    setSubmitted(false);
    setScore(null);

    const form = new FormData();
    form.append("topic", selectedTopic);
    form.append("count", 5);

    try {
      const response = await postForm("/aptitude/questions", form);
      console.log("API Response:", response); // Debug log
      setQuestions(response);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleAnswerChange = (questionIndex, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleSubmitAnswers = (e) => {
    e.preventDefault();
    
    if (!questions || !questions.questions) {
      alert("No questions available to submit");
      return;
    }

    // Calculate actual score based on correct answers
    let correctCount = 0;
    const questionsArray = formatQuestionsData(questions);
    
    questionsArray.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = question.correct_answer || question.answer;
      const correctIndex = question.correct_index;
      
      // Check if answer is correct (handle both string and index-based answers)
      if (correctIndex !== undefined) {
        // Index-based checking
        const options = question.options || [];
        if (userAnswer === options[correctIndex]) {
          correctCount++;
        }
      } else if (correctAnswer && userAnswer === correctAnswer) {
        // String-based checking
        correctCount++;
      }
    });
    
    const totalQuestions = questionsArray.length;
    const calculatedScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    setSubmitted(true);
    setScore(calculatedScore);
  };

  const handleReset = () => {
    setQuestions(null);
    setUserAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  const handleCustomTopicClick = () => {
    setShowCustomInput(!showCustomInput);
    if (!showCustomInput) {
      setCustomTopic("");
    }
  };

  const formatQuestionsData = (data) => {
    console.log("Formatting data:", data); // Debug log
    
    if (Array.isArray(data)) {
      return data;
    } else if (data.questions && Array.isArray(data.questions)) {
      return data.questions;
    } else if (typeof data === 'object') {
      // Handle single question object
      return [data];
    }
    return [];
  };

  const renderQuestion = (question, index) => {
    const q = question.question || question.text || "Question not available";
    const options = question.options || ["Option A", "Option B", "Option C", "Option D"];
    const correctAnswer = question.answer || question.correct_answer;
    const correctIndex = question.correct_index;
    const userAnswer = userAnswers[index];
    
    // Determine if answer is correct
    let isCorrect = false;
    if (submitted) {
      if (correctIndex !== undefined) {
        // Check by index
        isCorrect = userAnswer === options[correctIndex];
      } else if (correctAnswer) {
        // Check by string match
        isCorrect = userAnswer === correctAnswer;
      }
    }

    return (
      <div key={index} className="question-card">
        <div className="question-header">
          <span className="question-number">Question {index + 1}</span>
          {submitted && (
            <span className={`answer-status ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? '✓ Correct' : '✗ Incorrect'}
            </span>
          )}
        </div>
        
        <h4 className="question-text">{q}</h4>
        
        <div className="options-grid">
          {options.map((option, optIndex) => (
            <label key={optIndex} className="option-label">
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={userAnswer === option}
                onChange={() => handleAnswerChange(index, option)}
                disabled={submitted}
                className="option-radio"
              />
              <span className="option-text">
                {String.fromCharCode(65 + optIndex)}. {option}
              </span>
            </label>
          ))}
        </div>

        {submitted && (correctAnswer !== undefined || correctIndex !== undefined) && (
          <div className="correct-answer">
            <span className="correct-label">Correct Answer:</span>
            <span className="correct-value">
              {correctIndex !== undefined 
                ? `${String.fromCharCode(65 + correctIndex)}. ${options[correctIndex]}`
                : correctAnswer
              }
            </span>
          </div>
        )}
      </div>
    );
  };

  const questionsArray = questions ? formatQuestionsData(questions) : [];

  return (
    <div className="aptitude-container">
      <div className="aptitude-header">
        <h2>Aptitude Trainer</h2>
        <p className="aptitude-subtitle">
          Practice aptitude questions tailored to your chosen topic
        </p>
      </div>

      {/* Topic Selection Form */}
      <div className="topic-section">
        <form onSubmit={getQuestions} className="topic-form">
          <div className="form-group">
            <label className="form-label">Select Topic</label>
            <div className="topic-options">
              <div className="topic-buttons">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`topic-btn ${topic === t ? 'active' : ''}`}
                    onClick={() => {
                      setTopic(t);
                      setShowCustomInput(false);
                    }}
                    disabled={loading}
                  >
                    {t}
                  </button>
                ))}
              </div>
              
              <div className="custom-topic">
                <button
                  type="button"
                  className={`custom-toggle ${showCustomInput ? 'active' : ''}`}
                  onClick={handleCustomTopicClick}
                  disabled={loading}
                >
                  {showCustomInput ? '← Back to Topics' : '+ Custom Topic'}
                </button>
                
                {showCustomInput && (
                  <div className="custom-input-group">
                    <input
                      type="text"
                      placeholder="Enter your own topic (e.g., Machine Learning)"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      className="custom-input"
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="action-row">
            <div className="selected-topic-display">
              <span className="selected-label">Selected Topic:</span>
              <span className="selected-value">
                {showCustomInput && customTopic.trim() ? customTopic : topic}
              </span>
            </div>
            
            <button
              type="submit"
              className="generate-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Generating Questions...
                </>
              ) : (
                'Generate 5 Questions'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Questions Section */}
      {questionsArray.length > 0 && (
        <div className="questions-section">
          <div className="section-header">
            <h3>Practice Questions ({questionsArray.length} questions)</h3>
            <div className="section-actions">
              {!submitted && (
                <button
                  className="submit-btn"
                  onClick={handleSubmitAnswers}
                  disabled={Object.keys(userAnswers).length < questionsArray.length}
                >
                  Submit Answers ({Object.keys(userAnswers).length}/{questionsArray.length})
                </button>
              )}
              <button
                className="secondary-btn"
                onClick={handleReset}
              >
                Start New Test
              </button>
            </div>
          </div>

          <div className="questions-list">
            {questionsArray.map((question, index) => renderQuestion(question, index))}
          </div>

          {/* Score Display */}
          {submitted && score !== null && (
            <div className="score-section">
              <div className="score-card">
                <div className="score-circle">
                  <div 
                    className="score-circle-inner"
                    style={{
                      background: `conic-gradient(
                        ${score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'} 
                        ${score * 3.6}deg, 
                        #f3f4f6 0deg
                      )`
                    }}
                  ></div>
                  <div className="score-value">{score}</div>
                  <div className="score-label">Score</div>
                </div>
                <div className="score-details">
                  <h4>Test Complete!</h4>
                  <p>
                    You scored {score}% on {questionsArray.length} questions.
                    {score >= 80 ? " Excellent work!" : 
                     score >= 60 ? " Good job! Keep practicing." : 
                     " Keep practicing to improve!"}
                  </p>
                  <div className="score-breakdown">
                    <p>Correct: {Math.round((score / 100) * questionsArray.length)} / {questionsArray.length}</p>
                  </div>
                  <button className="retry-btn" onClick={handleReset}>
                    Try Another Topic
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner large"></div>
            <p>Generating questions for "{showCustomInput && customTopic.trim() ? customTopic : topic}"...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !questions && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>Ready to Practice?</h3>
          <p>Select a topic above to generate 5 aptitude questions</p>
          <div className="tips">
            <h4>💡 Tips for Better Performance:</h4>
            <ul>
              <li>Read each question carefully before answering</li>
              <li>Manage your time effectively</li>
              <li>Review answers before submission</li>
              <li>Practice regularly to improve speed and accuracy</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}