# Query Assistant

A web application that allows users to submit queries to an AI model (Hugging Face's `mistralai/Mixtral-8x7B-Instruct-v0.1`) and view their query history. The frontend is built with Next.js, and the backend uses FastAPI to communicate with the Hugging Face Inference API.

## Features

- **Query Submission**: Users can submit questions via a sticky input form and receive AI-generated answers.
- **Query History**: Past queries and responses are displayed in a scrollable history panel, toggleable on mobile. History is persisted using SQLite.
- **Responsive Design**: Works on both desktop and mobile devices with a clean, user-friendly interface.
- **Loading Feedback**: Shows a spinner during query processing and success/error notifications.
- **Auto-Focus**: The input field is automatically focused on page load and after submission for seamless interaction.

## Tech Stack

- **Frontend**: Next.js 14.2.15, React, Tailwind CSS, `react-markdown`, `framer-motion`, `react-hot-toast`, `axios`, `lodash`
- **Backend**: FastAPI, Pydantic, `httpx`, `python-dotenv`, `pydantic-settings`, `aiosqlite`
- **LLM**: Hugging Face Inference API (`mistralai/Mixtral-8x7B-Instruct-v0.1`)

## Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Hugging Face API Key**: Sign up at [Hugging Face](https://huggingface.co/) and get an API key from the [settings page](https://huggingface.co/settings/tokens).

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
   
2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash

   pip install -r requirements.txt
   ```

4. **Create a .env file**:
   ```bash

   LLM_API_URL=https://api-inference.huggingface.co/models/mistralai/   Mixtral-8x7B-Instruct-v0.1
   LLM_API_KEY=your-huggingface-api-key
   ENVIRONMENT=development
   ```

5 **Run the backend**:
  ```bash

  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  ```

The API will be available at `http://localhost:8000`.

## Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash

   cd frontend
   ```

2. **Install dependencies**:
   ```bash

   npm install
   ```

3. **Create a .env.local file**:
   ```bash

   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the frontend**:
   ```bash

   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Usage
- Open `http://localhost:3000` in your browser.
- Type a question in the input field (e.g., "What is 2+2?") and click "Submit".
- View the AI's response below the form.
- Check the query history on the right panel (toggleable on mobile).
- The input field will auto-focus after each submission for quick follow-up questions.

## API Endpoints
- **POST** `/api/query`: Submit a query to the LLM.
    - **Request**:
      ```json

      { "question": "Your question here" }
      ```

    - **Response**:
      ```json

      { "question": "Your question", "answer": "AI response", "timestamp": "ISO timestamp" }
      ```

- **GET** `/api/history`: Retrieve the query history.
    - **Response**: Array of `{ question, answer, timestamp }` objects.

## Architecture

  - **Frontend**:
    - `index.js`: Main page managing state and rendering components.
    - `ChatInput.js`: Handles query input with validation and auto-focus.
    - `ChatResponse.js`: Displays responses with markdown formatting and loading animation.
    - `QueryHistory.js`: Shows scrollable query history, toggleable on mobile.
  - **Backend**:
    - `main.py`: FastAPI app setup with CORS and routing.
    - `routes/query.py`: Endpoints for submitting queries and retrieving history, with SQLite persistence.
    - `services/llm.py`: Communicates with the Hugging Face API.
    - `config.py`: Manages environment variables with validation.
    - `models/query.py`: Defines request and response models.

## Deployment

You can deploy the Query Assistant app using free hosting services like Vercel (for the frontend) and Render (for the backend). Follow these steps:

### Deploy Frontend on Vercel

1. **Sign Up for Vercel**:
   - Go to [Vercel](https://vercel.com) and sign up using your GitHub account.

2. **Import Your Repository**:
   - Click “New Project” and import your `query-assistant` repository.

3. **Configure the Project**:
   - Set the root directory to `frontend/`.
   - Add the `NEXT_PUBLIC_API_URL` environment variable (update this after deploying the backend).
   - Deploy the app.

### Deploy Backend on Render

1. **Sign Up for Render**:
   - Go to [Render](https://render.com) and sign up using your GitHub account.

2. **Create a Web Service**:
   - Click “New” > “Web Service” and select your `query-assistant` repository.

3. **Configure the Service**:
   - Set the root directory to `backend/`.
   - Runtime: Python.
   - Build Command: `pip install -r requirements.txt`.
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
   - Add environment variables:
     ```
     LLM_API_URL=https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1
     LLM_API_KEY=your-huggingface-api-key
     ENVIRONMENT=production
     ```
   - Add a persistent disk for SQLite:
     - Name: `sqlite-disk`
     - Mount Path: `/app/history.db`
     - Size: 1 GB
   - Select the free tier and deploy.

4. **Update Frontend**:
   - In Vercel, update `NEXT_PUBLIC_API_URL` with the Render backend URL (e.g., `https://query-assistant-backend.onrender.com`).
   - Redeploy the frontend.

### Test the App

- Open the Vercel frontend URL and test submitting queries.
- Verify that the history persists using SQLite on Render.


