# Voting System Frontend

This is the frontend application for the Voting System, built with React and TypeScript using Vite.

## Setup and Running

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

    The application will be accessible at `http://localhost:5173/` (or another port if 5173 is in use).

## Important Notes:

*   **Backend:** Ensure the Django backend is running at `http://127.0.0.1:8000/` for the API calls to work correctly. Refer to the main project `README.md` for instructions on how to start the Django backend.
*   **API URL:** The API base URL is configured in `src/services/api.ts`. If your Django backend is running on a different address or port, please update this file accordingly.