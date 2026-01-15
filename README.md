# Nisse Neumann: Interactive Learning Visualization

An interactive learning visualization tool using **Google Knowledge Graph** and **Gemini** to generate dynamic science content, powered by **Google Cloud Firebase** and **Spanner Graph**.

## Project Overview

This project aims to provide an immersive learning experience by leveraging:
- **Google Knowledge Graph API**: To fetch structured data about scientific entities.
- **Google Gemini (Generative AI)**: To generate dynamic, contextual explanations and learning content.
- **Google Cloud Spanner (Graph)**: To store and query the relationships between different scientific concepts in a graph database.
- **Firebase**: For user authentication, frontend hosting, and real-time data synchronization.

## Project Structure

```
.
├── backend/               # Python Backend (FastAPI)
│   ├── app/
│   │   ├── main.py        # Application entry point
│   │   ├── services/      # Integrations (Gemini, Spanner, KG)
│   ├── requirements.txt   # Python dependencies
├── frontend/              # Frontend Application (hosted on Firebase)
│   ├── firebase.json      # Firebase configuration
├── infra/                 # Infrastructure configuration
├── scripts/               # Helper scripts
```

## Prerequisites

- Python 3.9+
- Node.js (for frontend)
- Google Cloud Platform Account
- Firebase Project

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Set up environment variables (create a `.env` file):
    ```
    GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
    GEMINI_API_KEY=your_gemini_api_key
    KG_API_KEY=your_knowledge_graph_api_key
    SPANNER_INSTANCE=your_instance
    SPANNER_DATABASE=your_database
    ```
5.  Run the server:
    ```bash
    uvicorn app.main:app --reload
    ```

### 2. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Initialize your frontend framework of choice (e.g., React):
    ```bash
    npx create-react-app .
    ```
3.  Install Firebase tools if not already installed:
    ```bash
    npm install -g firebase-tools
    ```
4.  Login to Firebase:
    ```bash
    firebase login
    ```

### 3. Google Cloud Resources

- **Spanner**: Create a Spanner instance and a graph database.
- **Vertex AI / Gemini**: Enable the Vertex AI API.
- **Knowledge Graph**: Enable the Knowledge Graph Search API.

## Architecture

1.  **User Interface**: Users interact with the frontend app to explore science topics.
2.  **Request Handling**: The frontend sends requests to the Python backend (FastAPI) or interacts with Firebase directly.
3.  **Data Retrieval**:
    - The backend queries the **Knowledge Graph** for entity data.
    - It queries **Spanner Graph** for custom relationships and stored learning paths.
4.  **Content Generation**: The backend uses **Gemini** to synthesize the retrieved data into educational content (text, quizzes, summaries).
5.  **Response**: The processed content is sent back to the frontend for visualization.

## License

[Add License Here]
