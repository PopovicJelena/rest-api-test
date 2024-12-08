# rest-api-test

This API is built with **Express.js** and **MySQL**, providing endpoints for managing users and tasks. It includes authentication, role-based access, and pagination features.

_____


## Features

- User Roles:
  - Basic Users: Create, update, and list their own tasks; update their personal details.
  - Admins: List, update, and delete tasks for all users; update personal and other users' details.
- Task Management:
  - Create, update, delete, and list tasks.
  - Pagination and sorting (newest to oldest and vice versa).
- Authentication: JSON Web Token (JWT) for secure access.

_____


## Prerequisites

- Node.js (v16 or newer)
- MySQL server
- Postman (or any API testing tool)

_____


## Setup Instructions

1. **Clone the Repository**

``` 
    git clone https://github.com/PopovicJelena/rest-api-test.git
    cd rest-api-test
```

2. **Install Dependencies**

`npm install`

3. **Configure Environment Variables**

Create a `.env` file in the root directory and add:

```
    DB_HOST=<your-database-host>
    DB_USER=<your-database-username>
    DB_PASSWORD=<your-database-password>
    DB_NAME=<your-database-name>
    JWT_SECRET=<your-jwt-secret>
```

4. **Run Migrations**
Ensure your MySQL database is running. Create required tables using the provided SQL schema.

5. **Start the Server**
**`npm run dev`**

The server runs on `http://localhost:3000` by default.

_____


## Endpoints

### Authentication
- **POST** `/register`: Register a new user.
- **POST** `/login`: Login and retrieve a JWT token.

### Tasks
- **POST** `/createTask`: Create a new task (Basic Users only).
- **POST** `/updateTask`: Update a task.
 - **Basic Users**: Can update their own tasks.
 - **Admins**: Can update any task.
- **POST** `/deleteTask`: Delete a task (Admins only).
- **GET** `/tasks`: List tasks with pagination and sorting.

### Users
- **POST**  `/updateUser`: Update user details.
  - **Basic Users**: Can update their own details.
  - **Admins**: Can update any user's details.


| Endpoint          | Method | Description                  | Auth Required |
|-------------------|--------|------------------------------|---------------|
| `/register`       | POST   | Register a new user          | No            |
| `/login`          | POST   | Authenticate a user          | No            |
| `/tasks`          | GET    | Get tasks (with pagination)  | Yes           |
| `/createTasks`    | POST   | Create new task              | Yes           |
| `/updateTask`     | POST   | Update a specific task       | Yes           |
| `/deleteTask`     | POST   | Delete a specific task       | Yes           |
| `/updateUser`     | POST   | Update a specific user       | Yes           |

_____


### Testing with Postman
1. Use the `/login` endpoint to get a JWT token.
2. Add the token to the Authorization header in the format
    `Bearer <your-token>`
3. Test the endpoints according to your user role.
