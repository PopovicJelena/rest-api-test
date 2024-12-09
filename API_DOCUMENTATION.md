# API Documentation

**Project Name:** restapitest  
**Date Created:** 09.12.2024.  

## 1. Introduction

This documentation provides information about the RESTful API for **managing users and tasks**.


## 2. Technical Specification

- **Base URL:**  
  `http://localhost:3000/`  
- **Supported Request Methods:**  
  - `GET`
  - `POST`


## 3. Endpoints

### 3.1 Register New User
- **Endpoint:**  
  `POST /register`  
- **Description:**  
  Register a new user in the system. 
- **Request Body:**  
```
    {
        "first_name": "John",
        "last_name": "Doe",
        "username": "johndoe",
        "email": "john.doe@example.com",
        "password": "yourpassword"
    }
```
- **Response (Success):** 
```
    {
        "message": "User registered successfully."
    }
```
- **Response (Error):** 
```
    {
        "message": "Username or email already in use"
    }
```

### 3.2 Login User
- **Endpoint:**  
  `POST /login`  
- **Description:**  
  Login and retrieve a JWT token. 
- **Request Body:**  
```
    {
        "email": "john.doe@example.com",
        "password": "yourpassword"
    }
```
- **Response (Success):** 
```
    {
        "status": "success",
        "id": "id",
        "first_name": "Jane",
        "last_name": "Doe"
        "username": "JaneDoe",
        "email": "john.doe@example.com",
        "role": "basic", 
        "token": "your_jwt_token_here"
    }
```
- **Response (Error):** 
```
    {
        "status": "fail",
        "message": "Wrong password"
    }
```

### 3.3 Create New Task
- **Endpoint:**  
  `POST /createTask`  
- **Description:**  
  Create a new task. Only Basic Users can use this endpoint.  
#### Request Headers:
- `Authorization`: Bearer token (JWT token received from `/login`)  
- **Request Body:**    
```
{
  "body": "Task description here"
}
```
- **Response (Success):** 
```
    {
        "id": "task_id_string",
        "body": "Task description here",
        "created_by": "user_id_string",
        "created_at": 1672531199000
    }
```
- **Response (Error):** 
```
    {
        "status": "error",
        "message": "Admins cannot create tasks"
    }
```

### 3.4 Update Task
- **Endpoint:**  
  `POST /updateTask`  
- **Description:**  
  Update an existing task.  
  - Basic Users: Can only update their own tasks.  
  - Admins: Can update any task.   
#### Request Headers:
- `Authorization`: Bearer token (JWT token received from `/login`)  
- **Request Body:**    
```
{
  "taskId": "unique_task_id",
  "body": "Updated task description"
}
```
- **Response (Success):** 
```
    {
        "message": "Task updated successfully."
    }
```
- **Response (Error):** (for basic users)
```
    {
        "message": "You can only update your own tasks"
    }
```

### 3.5 Delete Task
- **Endpoint:**  
  `POST /deleteTask`  
- **Description:**  
    Deletes an existing task. Only Admins are allowed to delete tasks.    
#### Request Headers:
- `Authorization`: Bearer token (JWT token received from `/login`)  
- **Request Body:**    
```
{
  "taskId": "unique_task_id"
}
```
- **Response (Success):** 
```
    {
        "message": "Task deleted successfully"
    }
```
- **Response (Error):** (for basic users)
```
    {
        "message": "Only admin can delete tasks"
    }
```

### 3.6 List Task
- **Endpoint:**  
  `GET /tasks`  
- **Description:**  
    List all tasks with pagination and sorting.
#### Request Headers:
- `Authorization`: Bearer token (JWT token received from `/login`)  
#### Request Query Parameters

| Parameter   | Type    | Description                                          |
|-------------|---------|------------------------------------------------------|
| `page`      | number  | The page number to retrieve.                         |
| `pageSize`  | number  | The number of tasks per page.                        |
| `sort`      | string  | Sorting order. Possible values: `"asc"` or `"desc"`. |

- **Response (Success):** 
```
    {
        "tasks": [
            {
            "id": "string",
            "body": "string",
            "created_by": "string",
            "created_at": 1634033200000
            },
            {
            "id": "string",
            "body": "string",
            "created_by": "string",
            "created_at": 1634033220000
            }
        ],
        "page": 1,
        "pageSize": 10
    }
```

### 3.7 Update User
- **Endpoint:**  
  `POST /updateUser`  
- **Description:**  
    Update user details such as first name, last name, username, and email.  
    If `email` or `username` are not meant to be updated,
    their current values must still be included in the request body.
#### Request Headers:
- `Authorization`: Bearer token (JWT token received from `/login`)
- **Request Body**

| Field       | Type    | Description                     |
|-------------|---------|---------------------------------|
| `userId`    | string  | The unique ID of the user.      |
| `firstName` | string  | The updated first name.         |
| `lastName`  | string  | The updated last name.          |
| `username`  | string  | The updated username.           |
| `email`     | string  | The updated email address.      |

```
    {
        "userId": "76dkfhr-sjfhsdadg",
        "firstName": "John",
        "lastName": "Doe",
        "username": "john.doe",
        "email": "john.doe@example.com"
    }
```
- **Response (Success):** 
```
    {
        "message": "User updated successfully."
    }
```