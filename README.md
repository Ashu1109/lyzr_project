
https://github.com/user-attachments/assets/0dffd36e-c35f-4166-be09-e60297331364


# Lyzr Agent - Unified Workspace Search & Chat

Lyzr Agent is a powerful AI-driven application designed to unify your workspace. It connects with your favorite tools—Google Drive, Slack, GitHub, and Gmail—to provide a single interface for searching, analyzing, and chatting with your data.

## 🏗 Architecture

The project consists of two main components:

1.  **Frontend (`lyzr_project`)**: A Next.js application providing the user interface for authentication, managing connections, and the chat interface. It uses Clerk for authentication and communicates with the backend via REST APIs and Server-Sent Events (SSE) for streaming chat responses.
2.  **Backend (`backend`)**: A FastAPI-based Python server that hosts the intelligent agents. It orchestrates the interaction between the user and various sub-agents (Data Science, Research, Memory) to fulfill requests.

**Agent Github URL**: https://github.com/Ashu1109/Lyzr_Agent

### Agent System
The backend utilizes a multi-agent architecture:
-   **Master Orchestrator**: The entry point that analyzes user queries and delegates tasks to specialized sub-agents.
-   **Data Science Agent**: Handles data retrieval from connected services (Gmail, Drive, Slack, GitHub, etc.).
-   **Research Agent**: Performs web research for external information.
-   **Memory Agent**: Manages long-term memory and user preferences.

## 📂 Directory Structure

-   `backend/`: Contains the Python FastAPI server, agent logic, and database services.
-   `lyzr_project/`: Contains the Next.js frontend application.

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   Python (v3.10+)
-   Docker (optional, for running PostgreSQL locally)
-   API Keys: OpenAI API Key, Google Cloud Credentials, Slack App Credentials, etc.

### 1. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Set up environment variables:
Create a `.env` file in the `backend` directory and add your keys (see `.env.example` if available, or refer to the code for required variables like `OPENAI_API_KEY`, `POSTGRES_URL`, etc.).

Run the server:
```bash
python server.py
```
The backend will start on `http://localhost:8000`.

### 2. Frontend Setup

Navigate to the `lyzr_project` directory:
```bash
cd lyzr_project
```

Install dependencies:
```bash
npm install
```

Set up environment variables:
Create a `.env.local` file with your Clerk keys and other frontend config.

Run the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`.

## ✨ Features

-   **Unified Integrations**: Seamlessly connect and search across Google Drive, Slack, GitHub, and Gmail.
-   **AI-Powered Chat**: Intelligent agents that understand context and can perform complex tasks.
-   **Context Awareness**: The system remembers past interactions and user preferences.
-   **Secure & Private**: Data is accessed securely via OAuth, and user sessions are managed with privacy in mind.

## � Demo & Screenshots

### Videos


https://github.com/user-attachments/assets/c37f5322-214a-4c47-8ae5-47fda96e4582

[Uploading Screen Recording 2025-12-03 at 2.18.51 AM.mov…](https://github.com/user-attachments/assets/7fa8d09d-74f2-4d25-ab71-1f85e90f446d)

### Screenshots
<img width="2816" height="1536" alt="Gemini_Generated_Image_2n7gmq2n7gmq2n7g" src="https://github.com/user-attachments/assets/72bf838c-ac1b-44db-bfc3-b353f15429da" />



## �🛠 Tech Stack

-   **Frontend**: Next.js, TypeScript, Tailwind CSS, Clerk (Auth), Lucide React (Icons).
-   **Backend**: Python, FastAPI, Google ADK (Agent Development Kit), LiteLLM, PostgreSQL (Session Storage), MongoDB (History).
