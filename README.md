# Zenith Project Management Tool

Zenith is a lightweight, modern, and developer-focused project management tool designed for small, agile software teams. It aims to provide a fast, beautiful, and intuitive alternative to bloated or outdated platforms, focusing only on the core features that teams use every day.

## About The Project

This project was built to address the need for a simple yet powerful project management tool that prioritizes user experience and performance. The core vision for Zenith is to be:

*   **Focused:** Includes only the most essential features for software development teams.
*   **Efficient:** A snappy, responsive UI that makes managing tasks a pleasure, not a chore.
*   **Visual:** Puts visual tools like Kanban boards and charts at the forefront.
*   **Collaborative:** Simplifies communication with features like real-time notifications and @-mentions.

## Core Features

*   **Project Management**: Create and manage separate project workspaces.
*   **Work Items**: A flexible system for creating Stories, Tasks, and Bugs.
*   **Kanban Board**: A fully interactive drag-and-drop board to visualize and update work item status.
*   **WBS / Tree View**: A hierarchical view to break down epics into smaller tasks and visualize dependencies.
*   **Gantt Chart View**: A timeline view of tasks and their durations.
*   **User Authentication**: Secure user registration and login using JWT.
*   **Comments & Notifications**: A complete commenting system on work items, with real-time notifications for users mentioned via `@email`.
*   **Project Dashboard**: A visual dashboard featuring a status distribution pie chart and a simplified burndown chart.

## Tech Stack

### Backend
*   **Framework**: [NestJS](https://nestjs.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [MySQL](https://www.mysql.com/) with [TypeORM](https://typeorm.io/)
*   **Authentication**: [JWT](https://jwt.io/) (JSON Web Tokens)
*   **Real-time Communication**: [WebSockets](https://socket.io/)

### Frontend
*   **Framework**: [React](https://reactjs.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **UI Library**: [Ant Design](https://ant.design/)
*   **State Management**: React Context API
*   **Charting**: [Recharts](https://recharts.org/)
*   **Drag & Drop**: [Dnd-Kit](https://dndkit.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   **Node.js & npm**: Make sure you have Node.js (v16 or later) and npm installed.
*   **MySQL**: You need a running instance of MySQL.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd zenith-backend
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Configure Database:**
    *   Create a new MySQL database named `zenith`.
    *   Open `src/app.module.ts`.
    *   Update the `TypeOrmModule.forRoot` configuration with your MySQL host, port, username, and password.
    *   **Note:** In a production environment, these credentials should be managed via environment variables, not hardcoded.
4.  **Run the application:**
    ```sh
    npm run start:dev
    ```
    The backend API will be running at `http://localhost:3001`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd zenith-frontend
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Run the application:**
    ```sh
    npm run dev
    ```
    The frontend development server will be running at `http://localhost:5173` (or the next available port). The application will automatically connect to the backend API.
