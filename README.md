# Library Management System

This is a Library Management System built using NestJS, a progressive Node.js framework for building efficient and scalable server-side applications.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)

## Features

- User Authentication (Sign In)
- Book Management (CRUD operations)
- Modular and scalable architecture

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/library-management-system.git
   cd library-management-system
   ```

2. **Install dependencies**

   Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add the necessary environment variables. For example:

   ```plaintext
   POSTGRES_USERNAME=your_database_username
   POSTGRES_PASSWORD=your_database_password
   POSTGRES_DATABASE=your_database_name
   ```

## Running the App

1. **Start the development server**

   ```bash
   npm run start:dev
   ```

2. **Open your browser**

   Navigate to `http://localhost:3000` to access the application.

## API Endpoints

### Authentication

- **Sign In**

  ```http
  POST /auth/sign-in
  ```

  **Request Body:**

  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

  **Response:**

  ```json
  {
    "accessToken": "string"
  }
  ```

### Books

- **Get All Books**

  ```http
  GET /books
  ```

  **Response:**

  ```json
  [
    {
      "id": "string",
      "title": "string",
      "publishedDate": "string"
    }
  ]
  ```

- **Get Book by ID**

  ```http
  GET /books/:id
  ```

  **Response:**

  ```json
  {
    "id": "string",
    "title": "string",
    "publishedDate": "string"
  }
  ```

- **Create a New Book**

  ```http
  POST /books
  ```

  **Request Body:**

  ```json
  {
    "title": "string",
    "publishedDate": "string"
  }
  ```

  **Response:**

  ```json
  {
    "id": "string",
    "title": "string",
    "publishedDate": "string"
  }
  ```

- **Update a Book**

  ```http
  PUT /books/:id
  ```

  **Request Body:**

  ```json
  {
    "title": "string",
    "publishedDate": "string"
  }
  ```

  **Response:**

  ```json
  {
    "id": "string",
    "title": "string",
    "publishedDate": "string"
  }
  ```

- **Delete a Book**

  ```http
  DELETE /books/:id
  ```

  **Response:**

  ```json
  {
    "message": "Book deleted successfully"
  }
  ```
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  - **Borrow a Book**

  ```http
  POST /borrow/:id
  ```

 **Request Body:**

  ```json
  {
    "id": "number",
    "numberOfDays": "string"
  }
  ```

  **Response:**

  ```json
  {
    "requestId": "number"
  }
  ```

- **Return a Book**

  ```http
  POST /return/:id
  ```

**Request Body:**

  ```json
  {
    "id": "number",
  }
  ```
  
- **Approve a Reqeusted Book**

  ```http
  POST /aprrove/:requestedId
  ```

**Request Body:**

  ```json
  {
    "requestedId": "number",
  }
  ```

  **Response:**

  ```json
  {
    "requestedId": "number"
  }
  ```
  
- **Reject a Requested Book**

  ```http
  POST /reject/:id
  ```

**Request Body:**

  ```json
  {
    "id": "number",
  }
  ```

  **Response:**

  ```json
  {
    "id": "number"
  }
  ```
  
