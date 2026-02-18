# 🚀 CareerAI — Career Readiness & Resume Intelligence System

**CareerAI** is a full-stack career readiness platform designed to help students and fresh graduates evaluate resumes, identify skill gaps, and practice aptitude questions aligned with real-world job requirements.

The system combines resume analysis using NLP techniques with an interactive aptitude assessment module, all delivered through a modern web interface.

---

# 📌 Key Features

## 🔍 Resume Analyzer

- **Upload resumes** in **PDF / DOC / DOCX / TXT** formats  
- **Paste job descriptions** for comparison  
- **Resume–JD matching score** (out of 100)  
- **Skill gap identification**  
- **Keyword and experience relevance analysis**  
- **Improvement recommendations**

---

## 🧠 Aptitude Trainer

- **Topic-based aptitude question generation**  
- Supports **technical and logical topics**  
- **MCQ-based assessment**  
- **Answer submission and scoring**  
- Designed for **interview preparation**

---

## 📊 Dashboard

- **Centralized navigation** for all modules  
- **Clean, responsive UI**  
- **Real-time feedback and results display**

---

# 🏗️ System Architecture

## 💻 Frontend

- **React (Vite)**  
- **HTML5**  
- **CSS3**  
- **JavaScript (ES6+)**

## ⚙️ Backend

- **FastAPI (Python)**  
- **RESTful API architecture**  
- **NLP-based resume parsing and scoring**

## 🔗 Communication

- **Frontend ↔ Backend via HTTP APIs**  
- **JSON & FormData payloads**

---

# 📁 Project Structure

# 🚀 CareerAI — Career Readiness & Resume Intelligence System

**CareerAI** is a full-stack career readiness platform designed to help students and fresh graduates evaluate resumes, identify skill gaps, and practice aptitude questions aligned with real-world job requirements.

The system combines resume analysis using NLP techniques with an interactive aptitude assessment module, all delivered through a modern web interface.

---

# 📌 Key Features

## 🔍 Resume Analyzer

- **Upload resumes** in **PDF / DOC / DOCX / TXT** formats  
- **Paste job descriptions** for comparison  
- **Resume–JD matching score** (out of 100)  
- **Skill gap identification**  
- **Keyword and experience relevance analysis**  
- **Improvement recommendations**

---

## 🧠 Aptitude Trainer

- **Topic-based aptitude question generation**  
- Supports **technical and logical topics**  
- **MCQ-based assessment**  
- **Answer submission and scoring**  
- Designed for **interview preparation**

---

## 📊 Dashboard

- **Centralized navigation** for all modules  
- **Clean, responsive UI**  
- **Real-time feedback and results display**

---

# 🏗️ System Architecture

## 💻 Frontend

- **React (Vite)**  
- **HTML5**  
- **CSS3**  
- **JavaScript (ES6+)**

## ⚙️ Backend

- **FastAPI (Python)**  
- **RESTful API architecture**  
- **NLP-based resume parsing and scoring**

## 🔗 Communication

- **Frontend ↔ Backend via HTTP APIs**  
- **JSON & FormData payloads**

---

# 📁 Project Structure

# 🚀 CareerAI — Career Readiness & Resume Intelligence System

**CareerAI** is a full-stack career readiness platform designed to help students and fresh graduates evaluate resumes, identify skill gaps, and practice aptitude questions aligned with real-world job requirements.

The system combines resume analysis using NLP techniques with an interactive aptitude assessment module, all delivered through a modern web interface.

---

# 📌 Key Features

## 🔍 Resume Analyzer

- **Upload resumes** in **PDF / DOC / DOCX / TXT** formats  
- **Paste job descriptions** for comparison  
- **Resume–JD matching score** (out of 100)  
- **Skill gap identification**  
- **Keyword and experience relevance analysis**  
- **Improvement recommendations**

---

## 🧠 Aptitude Trainer

- **Topic-based aptitude question generation**  
- Supports **technical and logical topics**  
- **MCQ-based assessment**  
- **Answer submission and scoring**  
- Designed for **interview preparation**

---

## 📊 Dashboard

- **Centralized navigation** for all modules  
- **Clean, responsive UI**  
- **Real-time feedback and results display**

---

# 🏗️ System Architecture

## 💻 Frontend

- **React (Vite)**  
- **HTML5**  
- **CSS3**  
- **JavaScript (ES6+)**

## ⚙️ Backend

- **FastAPI (Python)**  
- **RESTful API architecture**  
- **NLP-based resume parsing and scoring**

## 🔗 Communication

- **Frontend ↔ Backend via HTTP APIs**  
- **JSON & FormData payloads**

---

# 📁 Project Structure

CareerAI/
│
├── backend/
│ ├── app/
│ │ ├── analyzer.py
│ │ ├── resume_parser.py
│ │ ├── scorer.py
│ │ ├── jd_parser.py
│ │ ├── auth.py
│ │ ├── llm_client.py
│ │ └── main.py
│ ├── data/
│ │ └── skills_master.json
│ └── db/
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── Signup.jsx
│ │ │ ├── ResumeAnalyzer.jsx
│ │ │ ├── Aptitude.jsx
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── api.js
│ ├── index.html
│ └── vite.config.js
│
└── README.md


⚙️ Installation & Setup
1️⃣ Backend Setup
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload


Backend runs at:

http://127.0.0.1:8000

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

🔗 API Endpoints
Endpoint	Method	Description
/analyze/resume/analyze	POST	Resume vs JD analysis
/aptitude/questions	POST	Generate aptitude questions
/auth/signup	POST	User registration
/auth/login	POST	User login
---

# 🧪 Testing & Validation

- **Resume analysis tested** with multiple file formats  
- **Aptitude module validated** across different topics  
- **Manual UI and API testing** performed  
- **Error handling implemented** for invalid inputs  

---

# 🎯 Use Case

- **Final year project submission**  
- **Career readiness assessment**  
- **Resume optimization tool**  
- **Aptitude practice for interviews**  

---

# 🚧 Limitations

- **Scoring logic is rule-based** (prototype level)  
- **No persistent user database** (demo authentication)  
- **Limited resume datasets**  

---

# 🔮 Future Enhancements

- **Machine learning-based resume scoring**  
- **Role-specific job recommendations**  
- **Interview question generator**  
- **Progress tracking and analytics**  
- **Admin dashboard**  

---

# 👨‍🎓 Academic Context

This project is developed as part of a **Final Year Academic Project** and demonstrates practical application of:

- **Web Development**  
- **REST APIs**  
- **Natural Language Processing**  
- **Software Engineering principles**  

---

# 📚 References

- **FastAPI Documentation**  
- **React & Vite Official Docs**  
- **NLP & Resume Parsing Research Papers**  

---

# ✅ Status

**Working Prototype – Stable Build**
