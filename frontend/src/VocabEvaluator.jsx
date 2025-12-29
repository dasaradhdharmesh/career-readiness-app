import React, { useRef, useState, useEffect } from "react";
import { postForm } from "./api";
import "./VocabEvaluator.css";

const TOPICS = [
  "Describe a challenge you solved recently",
  "Talk about a project you are proud of",
  "Explain a concept you recently learned",
  "Describe your career goals",
  "Talk about a problem you faced and how you solved it",
  "Describe a situation where you had to learn quickly",
  "Talk about a technology you find interesting",
  "Explain a decision you made under pressure",
  "Describe a time you worked in a team",
  "Talk about a failure and what you learned from it",
  "Explain handling feedback",
  "Describe staying motivated",
  "Explain problem-solving approach",
  "Talk about continuous learning",
  "Describe adapting to change",
  "Explain leadership experience",
  "Talk about communication challenges",
  "Describe managing deadlines",
  "Explain a professional value you believe in",
  "Talk about overcoming self-doubt"
];

export default function VocabEvaluator() {
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const thinkTimerRef = useRef(null);
  const speakTimerRef = useRef(null);

  const [topic, setTopic] = useState("");
  const [topicChangesLeft, setTopicChangesLeft] = useState(3);
  const [thinkingTime, setThinkingTime] = useState(null);
  const [speakingTime, setSpeakingTime] = useState(null);
  const [recording, setRecording] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePhase, setActivePhase] = useState(null); // 'thinking', 'speaking', 'evaluating'
  const [audioUrl, setAudioUrl] = useState(null);
  const [micPermission, setMicPermission] = useState(false);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (thinkTimerRef.current) clearInterval(thinkTimerRef.current);
      if (speakTimerRef.current) clearInterval(speakTimerRef.current);
      if (mediaRef.current) {
        mediaRef.current.stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  function randomTopic(exclude = null) {
    const pool = TOPICS.filter(t => t !== exclude);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function changeTopic() {
    if (topicChangesLeft === 0 || activePhase !== 'thinking') return;
    setTopic(randomTopic(topic));
    setTopicChangesLeft(v => v - 1);
  }

  async function checkMicPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission(true);
      return true;
    } catch (err) {
      console.error("Microphone access denied:", err);
      setMicPermission(false);
      return false;
    }
  }

  async function startFlow() {
    const hasPermission = await checkMicPermission();
    if (!hasPermission) {
      alert("Microphone access is required for this feature. Please allow microphone access and try again.");
      return;
    }

    setEvaluation(null);
    setAudioUrl(null);
    setTopic(randomTopic());
    setTopicChangesLeft(3);
    startThinkingPhase();
  }

  function startThinkingPhase() {
    setActivePhase('thinking');
    let t = 15;
    setThinkingTime(t);

    thinkTimerRef.current = setInterval(() => {
      t -= 1;
      if (t === 0) {
        clearInterval(thinkTimerRef.current);
        setThinkingTime(null);
        startSpeakingPhase();
      } else {
        setThinkingTime(t);
      }
    }, 1000);
  }

  async function startSpeakingPhase() {
    setActivePhase('speaking');
    let t = 20;
    setSpeakingTime(t);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRef.current = { recorder: mr, stream };
      chunksRef.current = [];

      mr.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        setActivePhase('evaluating');
        setLoading(true);
        
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        
        // Create audio URL for playback
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        const form = new FormData();
        form.append("file", blob, "speech.webm");

        try {
          // Simulate API calls (replace with actual endpoints)
          // await postForm("/vocab/upload", form);
          // const evalRes = await postForm("/vocab/evaluate", new FormData());
          
          // Mock evaluation for demo
          setTimeout(() => {
            const mockEvaluation = {
              score: Math.floor(Math.random() * 40) + 60, // 60-100
              verdict: ["Excellent", "Good", "Average", "Needs Improvement"][Math.floor(Math.random() * 4)],
              strengths: [
                "Clear articulation of thoughts",
                "Good use of professional vocabulary",
                "Structured response with clear beginning and end",
                "Appropriate pace and tone"
              ],
              improvements: [
                "Could use more industry-specific terminology",
                "Practice varying sentence structure",
                "Include more quantifiable achievements",
                "Work on reducing filler words"
              ],
              interviewer_feedback: "Good overall response with clear structure. Practice with more technical vocabulary to improve scores.",
              word_cloud: ["communication", "teamwork", "problem-solving", "adaptability"],
              fluency_score: Math.floor(Math.random() * 30) + 70,
              vocabulary_score: Math.floor(Math.random() * 30) + 70,
              coherence_score: Math.floor(Math.random() * 30) + 70
            };
            setEvaluation(mockEvaluation);
            setLoading(false);
          }, 2000);
          
        } catch (err) {
          console.error("Evaluation error:", err);
          setEvaluation({
            score: 0,
            verdict: "Error",
            strengths: [],
            improvements: ["Failed to process evaluation"],
            interviewer_feedback: "An error occurred during evaluation. Please try again."
          });
          setLoading(false);
        }
      };

      mr.start();
      setRecording(true);

      speakTimerRef.current = setInterval(() => {
        t -= 1;
        if (t === 0) {
          clearInterval(speakTimerRef.current);
          setSpeakingTime(null);
          setRecording(false);
          mr.stop();
          stream.getTracks().forEach(track => track.stop());
        } else {
          setSpeakingTime(t);
        }
      }, 1000);

    } catch (err) {
      console.error("Microphone error:", err);
      alert("Unable to access microphone. Please check permissions and try again.");
      setActivePhase(null);
    }
  }

  function cancelRecording() {
    if (thinkTimerRef.current) clearInterval(thinkTimerRef.current);
    if (speakTimerRef.current) clearInterval(speakTimerRef.current);
    if (mediaRef.current) {
      if (mediaRef.current.recorder?.state === 'recording') {
        mediaRef.current.recorder.stop();
      }
      mediaRef.current.stream?.getTracks().forEach(track => track.stop());
    }
    
    setThinkingTime(null);
    setSpeakingTime(null);
    setRecording(false);
    setActivePhase(null);
    setLoading(false);
  }

  function restartEvaluation() {
    cancelRecording();
    setEvaluation(null);
    setAudioUrl(null);
    setTopic("");
    setActivePhase(null);
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getVerdictColor = (verdict) => {
    switch(verdict) {
      case "Excellent": return "#10b981";
      case "Good": return "#3b82f6";
      case "Average": return "#f59e0b";
      case "Needs Improvement": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <div className="vocab-container">
      <div className="vocab-header">
        <h2>Vocabulary & Speech Evaluator</h2>
        <p className="vocab-subtitle">
          Practice your speaking skills with random topics and get instant feedback
        </p>
      </div>

      {!evaluation && !activePhase && (
        <div className="intro-section">
          <div className="intro-card">
            <div className="intro-icon">🎤</div>
            <h3>How it Works</h3>
            <ol className="instructions">
              <li>Start a new evaluation session</li>
              <li>You'll get 15 seconds to think about a random topic</li>
              <li>Then 20 seconds to speak your response</li>
              <li>Get instant feedback on your vocabulary and fluency</li>
            </ol>
            
            <div className="requirements">
              <h4>Requirements:</h4>
              <ul>
                <li>Microphone access</li>
                <li>Quiet environment</li>
                <li>Speak clearly and confidently</li>
              </ul>
            </div>

            <button
              className="start-btn"
              onClick={startFlow}
              disabled={!micPermission && navigator.mediaDevices === undefined}
            >
              Start New Evaluation
            </button>
            
            {!micPermission && (
              <p className="mic-warning">
                <span className="warning-icon">⚠️</span>
                Microphone access required
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active Evaluation Session */}
      {(activePhase || evaluation) && !loading && (
        <div className="session-section">
          {/* Topic Display */}
          <div className="topic-card">
            <div className="topic-header">
              <h3>Current Topic</h3>
              {activePhase === 'thinking' && topicChangesLeft > 0 && (
                <button 
                  className="change-topic-btn"
                  onClick={changeTopic}
                  disabled={topicChangesLeft === 0}
                >
                  Change Topic ({topicChangesLeft} left)
                </button>
              )}
            </div>
            <div className="topic-content">
              <div className="topic-text">{topic}</div>
              <div className="topic-actions">
                <button 
                  className="secondary-btn small"
                  onClick={restartEvaluation}
                >
                  Cancel & Restart
                </button>
              </div>
            </div>
          </div>

          {/* Timer Display */}
          {(thinkingTime !== null || speakingTime !== null) && (
            <div className={`timer-card ${activePhase}`}>
              <div className="timer-header">
                <h3>
                  {activePhase === 'thinking' ? '⏱️ Thinking Time' : '🎤 Speaking Time'}
                </h3>
                <span className="phase-label">
                  {activePhase === 'thinking' ? 'Prepare your thoughts' : 'Speak your response'}
                </span>
              </div>
              
              <div className="timer-display">
                <div className={`timer-circle ${activePhase}`}>
                  <div className="timer-value">
                    {activePhase === 'thinking' ? thinkingTime : speakingTime}s
                  </div>
                </div>
                <div className="timer-status">
                  {activePhase === 'thinking' ? (
                    <p>Think about your response. You'll speak when the timer ends.</p>
                  ) : (
                    <>
                      <p>Recording in progress... Speak clearly into your microphone.</p>
                      <div className="recording-indicator">
                        <span className="recording-dot"></span>
                        Recording
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Evaluation Loading */}
          {activePhase === 'evaluating' && (
            <div className="evaluating-card">
              <div className="loading-content">
                <div className="loading-spinner large"></div>
                <h3>Analyzing Your Response</h3>
                <p>Evaluating vocabulary, fluency, and coherence...</p>
              </div>
            </div>
          )}

          {/* Evaluation Results */}
          {evaluation && !loading && (
            <div className="results-section">
              <div className="results-header">
                <h3>Evaluation Results</h3>
                <button 
                  className="restart-btn"
                  onClick={restartEvaluation}
                >
                  Start New Evaluation
                </button>
              </div>

              {/* Overall Score */}
              <div className="overall-score">
                <div className="score-circle">
                  <div 
                    className="score-progress"
                    style={{
                      background: `conic-gradient(${getScoreColor(evaluation.score)} ${evaluation.score * 3.6}deg, #f3f4f6 0deg)`
                    }}
                  ></div>
                  <div className="score-value">
                    <span className="score-number">{evaluation.score}</span>
                    <span className="score-out-of">/100</span>
                  </div>
                </div>
                <div className="score-details">
                  <div className="verdict-badge" style={{ backgroundColor: getVerdictColor(evaluation.verdict) }}>
                    {evaluation.verdict}
                  </div>
                  <h4>Overall Performance</h4>
                  <p>{evaluation.interviewer_feedback}</p>
                  
                  {/* Audio Playback */}
                  {audioUrl && (
                    <div className="audio-playback">
                      <h5>Your Recording</h5>
                      <audio controls src={audioUrl} className="audio-player">
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Scores */}
              <div className="detailed-scores">
                <h4>Detailed Scores</h4>
                <div className="scores-grid">
                  <div className="score-item">
                    <span className="score-label">Fluency</span>
                    <div className="score-bar">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${evaluation.fluency_score || 70}%`,
                          backgroundColor: getScoreColor(evaluation.fluency_score || 70)
                        }}
                      ></div>
                    </div>
                    <span className="score-value">{evaluation.fluency_score || 70}%</span>
                  </div>
                  
                  <div className="score-item">
                    <span className="score-label">Vocabulary</span>
                    <div className="score-bar">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${evaluation.vocabulary_score || 70}%`,
                          backgroundColor: getScoreColor(evaluation.vocabulary_score || 70)
                        }}
                      ></div>
                    </div>
                    <span className="score-value">{evaluation.vocabulary_score || 70}%</span>
                  </div>
                  
                  <div className="score-item">
                    <span className="score-label">Coherence</span>
                    <div className="score-bar">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${evaluation.coherence_score || 70}%`,
                          backgroundColor: getScoreColor(evaluation.coherence_score || 70)
                        }}
                      ></div>
                    </div>
                    <span className="score-value">{evaluation.coherence_score || 70}%</span>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="feedback-grid">
                <div className="feedback-card strengths">
                  <h4>✅ Strengths</h4>
                  <ul className="feedback-list">
                    {evaluation.strengths.map((strength, i) => (
                      <li key={i} className="feedback-item">
                        <span className="feedback-icon">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="feedback-card improvements">
                  <h4>📈 Areas for Improvement</h4>
                  <ul className="feedback-list">
                    {evaluation.improvements.map((improvement, i) => (
                      <li key={i} className="feedback-item">
                        <span className="feedback-icon">⚡</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Word Cloud */}
              {evaluation.word_cloud && (
                <div className="word-cloud-section">
                  <h4>Key Words Used</h4>
                  <div className="word-cloud">
                    {evaluation.word_cloud.map((word, i) => (
                      <span 
                        key={i} 
                        className="word-tag"
                        style={{ fontSize: `${Math.random() * 0.8 + 0.8}rem` }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="demo-note">
                <span className="note-icon">ℹ️</span>
                Automated evaluation — demo mode
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner xlarge"></div>
            <h3>Processing Your Response</h3>
            <p>Analyzing speech patterns and vocabulary usage...</p>
          </div>
        </div>
      )}
    </div>
  );
}