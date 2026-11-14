# Employee Management System

A RESTful backend application for managing employee records, built using **Java, Spring Boot, MySQL, and Spring Data JPA**.

## Features

- Add a new employee
- Get all employees
- Get an employee by ID
- Update employee information
- Delete an employee
- Search employees by name
- Search employees by department
- Pagination
- Sorting
- Input validation
- Global exception handling
- Duplicate email prevention

##  Tech Stack

- **Java**
- **Spring Boot**
- **Spring Data JPA**
- **Hibernate**
- **MySQL**
- **Maven**
- **Postman**
- **Git & GitHub**

##  Architecture

The application follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL Database
```

### Controller Layer

Handles incoming HTTP requests and returns API responses.

### Service Layer

Contains the business logic of the application.

### Repository Layer

Handles database operations using Spring Data JPA.

### Entity Layer

Maps the Java `Employee` class to the database table.

## Project Structure

```text
src/main/java/com/hardik/employeemanagement
│
├── controller
│   └── EmployeeController.java
│
├── entity
│   └── Employee.java
│
├── exception
│   ├── EmployeeNotFoundException.java
│   └── GlobalExceptionHandler.java
│
├── repository
│   └── EmployeeRepository.java
│
├── service
│   ├── EmployeeService.java
│   └── EmployeeServiceImpl.java
│
└── EmployeeManagementApplication.java
```

## 📊 Employee Fields

| Field | Description |
|---|---|
| id | Unique employee ID |
| firstName | Employee's first name |
| lastName | Employee's last name |
| email | Unique employee email |
| phoneNumber | Employee phone number |
| department | Employee department |
| designation | Employee designation |
| salary | Employee salary |
| joiningDate | Employee joining date |

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees?page=0&size=5&sortBy=id` | Get employees with pagination and sorting |
| POST | `/api/employees` | Add a new employee |
| GET | `/api/employees/{id}` | Get employee by ID |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| GET | `/api/employees/search?name={name}` | Search employees by name |
| GET | `/api/employees/department/{department}` | Get employees by department |

## 🛡️ Validation

The application validates employee data using Jakarta Validation.

Examples:

- First name cannot be blank
- Last name cannot be blank
- Email is required and must have a valid format
- Department cannot be blank
- Salary must be positive

##  Exception Handling

The application uses centralized exception handling with `GlobalExceptionHandler`.

### Common Responses

| Scenario | HTTP Status |
|---|---|
| Invalid request data | `400 Bad Request` |
| Employee not found | `404 Not Found` |
| Duplicate email | `409 Conflict` |
| Successful creation | `201 Created` |

##  Database

The application uses **MySQL** with Spring Data JPA and Hibernate.

The employee email field has a database-level unique constraint to prevent duplicate employee emails.

## ▶ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/Hardiksingla15/employee-management-system.git
```

### 2. Navigate to the project

```bash
cd employee-management-system
```

### 3. Configure MySQL

Create the required MySQL database and configure your database credentials in:

```text
src/main/resources/application.properties
```

### 4. Run the application

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The application will start on:

```text
http://localhost:8080
```

##  API Testing

The REST APIs were tested using **Postman**.

Tested scenarios include:

- Valid CRUD operations
- Invalid input validation
- Employee not found handling
- Duplicate email handling
- Pagination and sorting

##  Author

**Hardik Singla**

Computer Science Engineering Student

---

### Key Learning Outcomes

Through this project, I gained practical experience with:

- Spring Boot application development
- REST API design
- Dependency Injection
- Spring Data JPA and Hibernate
- MySQL database integration
- CRUD operations
- Validation
- Global exception handling
- Pagination and sorting
- Git and GitHub