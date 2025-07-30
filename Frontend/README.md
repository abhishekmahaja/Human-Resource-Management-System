# Employee Management System

This project is an Employee Management System with a React frontend and a Node.js/Express backend.

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    ```

2.  **Backend Setup:**

    Navigate to the `Backend` directory:

    ```bash
    cd Backend
    ```

    Install dependencies:

    ```bash
    npm install
    ```

    Create a `.env` file in the `Backend` directory and add the following:

    ```
    PORT=5000
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

    Run the backend server:

    ```bash
    npm start
    ```

3.  **Frontend Setup:**

    Navigate to the `Frontend` directory:

    ```bash
    cd ../Frontend
    ```

    Install dependencies:

    ```bash
    npm install
    ```

    Run the frontend development server:

    ```bash
    npm run dev
    ```

    The frontend should now be running at `http://localhost:5173` (or another port if 5173 is in use).

## Technologies Used

*   **Frontend:** React, React Router, Axios
*   **Backend:** Node.js, Express, Mongoose, JWT for authentication
*   **Database:** MongoDB

## Role of AI

This project was developed with the assistance of an AI coding companion. The AI played a crucial role in:

*   **Code Generation:** Generating initial code structures for components, routes, and models.
*   **Debugging:** Identifying and suggesting fixes for errors.
*   **Code Explanation:** Explaining complex code snippets and concepts.
*   **Boilerplate Reduction:** Automating the creation of repetitive code.
*   **Overall Guidance:** Providing suggestions and best practices throughout the development process.

## Project Flow

1.  **User Authentication:** Users (Employees and Admins) can log in using their credentials.
2.  **Role-Based Routing:** After successful login, users are directed to their respective dashboards based on their roles (Admin or Employee).
3.  **Admin Dashboard:**
    *   View a list of all employees.
    *   Manage employee data (add, edit, delete - if implemented).
    *   View and manage leave requests (approve, reject).
    *   View and manage projects (create, assign - if implemented).
4.  **Employee Dashboard:**
    *   View their own profile information.
    *   Submit leave requests.
    *   View the status of their leave requests.
    *   View assigned projects (if implemented).
5.  **API Communication:** The frontend communicates with the backend API to fetch and update data.
6.  **Database Interaction:** The backend interacts with the MongoDB database to store and retrieve user, employee, leave, and project data.

The project utilizes JWT for authentication, ensuring that only authorized users can access protected routes and resources.