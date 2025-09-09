# QMS Module - Interview Task Submission

This repository contains the complete, full-stack solution for the QMS Module Development interview task. The project is a web application designed for managing quality events in a Life Science context, built with a React frontend, a Python FastAPI backend, and an integrated AI assistant powered by Google Gemini.

This solution implements a secure, role-based authentication system, a data-rich dashboard, and full CRUD (Create, Read, Update, Delete) functionality for QMS events.

---
## ✨ Key Features

* **🔐 Secure Authentication:** Full sign-up and login system with three distinct user roles (`Operator`, `Investigator`, `QA Approver`).
* **📊 Interactive Dashboard:** A main dashboard that provides an at-a-glance overview of key QMS metrics with charts.
* ** wizard Event Creation Wizard:** A multi-step, user-friendly wizard for logging and editing events.
* **📝 Full CRUD Functionality:** Users can Create, Read, Update, and Delete quality events.
* **🔍 Advanced Filtering & Selection:** The event list can be filtered by multiple criteria, and users can select multiple events for bulk actions.
* **🤖 AI Assistant:** An integrated AI powered by Google Gemini provides smart summaries, trend analysis, and actionable recommendations.
* **🐳 Dockerized Backend:** The FastAPI backend is containerized with Docker to ensure a consistent and reliable runtime environment.
* **📱 Responsive UI:** The interface is designed to be fully responsive and usable on different screen sizes.

---
## 💻 Technology Stack

* **Frontend:** React, Vite, Redux Toolkit, Tailwind CSS, Chart.js, Axios
* **Backend:** Python, FastAPI, SQLAlchemy, Pydantic
* **Database:** SQLite
* **Security:** Passlib (for password hashing), Python-JOSE (for JWT)
* **AI:** Google Gemini
* **Containerization:** Docker

---
## 1. Setup and Installation Instructions

This section covers the setup for both the frontend and backend components of the application.

### Prerequisites

Before you begin, ensure you have the following software installed:
* **Node.js** (v18 or newer)
* **Python** (v3.9 or newer)
* **Docker Desktop** (must be running)

### Backend Setup (API Key)

The backend requires a Google Gemini API key to function.

1.  Navigate to the `backend/` directory.
2.  Create a new file named `.env`.
3.  Open the `.env` file and add the following line, replacing `YOUR_GEMINI_API_KEY` with your actual key from Google AI Studio:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

### Frontend Installation

All frontend dependencies are managed by `npm`.

1.  Open a terminal in the root `qms-project` folder.
2.  Run the following command to install all necessary Node.js packages:
    ```bash
    npm install
    ```

---
## 2. Instructions on How to Run the Application

The project is configured to run with two simple commands from the root directory.

1.  **Build the Backend Container:** This command uses Docker to build a containerized image of the FastAPI server. This needs to be run once, or whenever backend code or dependencies change.
    ```bash
    npm run build-backend
    ```
2.  **Start the Application:** This command starts both the frontend and the backend servers concurrently.
    ```bash
    npm start
    ```
    The application will be available at **[http://localhost:5173](http://localhost:5173)**.

### First-Time Use

The application is protected by a full authentication system. Upon first visiting the site, you will be directed to the login page. You must first **Sign Up** for a new account to be able to log in and use the features.

---
## 3. Design Choices & Assumptions

This section provides a brief explanation of the key architectural and design choices made during development.

### Architecture
* A **monorepo structure** was used to keep the frontend and backend code together in a single repository for easier management and versioning.
* The backend is **containerized with Docker** to provide a consistent, isolated, and reliable runtime environment. This choice was critical in overcoming local machine inconsistencies and ensures the application runs the same way everywhere.

### Technology Choices
* **Backend:** **FastAPI** was selected for its high performance and automatic data validation via **Pydantic**. **SQLAlchemy** was used as the ORM, with **SQLite** chosen for its simplicity in a development context. A secure, token-based authentication system using **JWT** and **passlib** for password hashing was implemented.
* **Frontend:** **React** with **Vite** was chosen for a fast and modern development experience. **Redux Toolkit** was implemented for robust and predictable state management. **Tailwind CSS** was used to build a professional, consistent, and responsive UI efficiently, with a centralized theme for easy maintenance.

### Assumptions
* **Role Permissions:** The application implements three user roles (`Operator`, `Investigator`, `QA Approver`). It is assumed that for this task, a full, granular permission system (e.g., preventing an `Operator` from deleting an event) was not required. The backend is protected, requiring any logged-in user to perform actions, but does not yet differentiate by role.
* **Filtering & Pagination:** Event filtering is handled on the client-side for performance with a moderate amount of data. It is assumed that for a larger-scale application, this logic would be moved to the backend API along with pagination.

---
## 4. Implemented AI Features

The integrated AI Assistant is powered by Google Gemini and is designed to provide actionable insights. You can interact with it using the following types of prompts:

* **🔍 Smart Filter & Query Engine**
    * **Objective:** Find specific events using natural language.
    * **Example Prompts:** `"Show all open deviations"`, `"Find events reported by Charlie Brown last month."`

* **📈 Trend & Pattern Analysis**
    * **Objective:** Analyze event data to identify recurring issues and potential systemic problems.
    * **Example Prompts:** `"What are the main trends in our quality events?"`, `"Is there a common root cause for issues in the Manufacturing department?"`

* **➡️ Next Step Advisor**
    * **Objective:** Provide clear, actionable guidance for a specific event.
    * **Example Prompts:** `"Suggest the next steps for event DEV-2025-001."`, `"What is the standard investigation plan for a documentation error?"`

* **✍️ Communication Assistant**
    * **Objective:** Help users draft professional communications related to QMS events.
    * **Example Prompts:** `"Draft an email to stakeholders for the closure of an audit."`, `"Write a brief summary of DEV-2025-003 for a meeting."`

* **🧠 Root Cause Analysis (RCA) Assistant**
    * **Objective:** Guide a user through the problem-solving process to identify the true root cause of an event.
    * **Example Prompts:** `"Help me find the root cause of the temperature deviation."`, `"What are potential causes for a batch failing its purity test?"`
