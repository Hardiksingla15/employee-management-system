import axios from 'axios';

// All employee requests go through this file.
// The path is /api because Vite proxies it to http://localhost:8080.
const api = axios.create({
  baseURL: '/api/employees',
  headers: {
    'Content-Type': 'application/json',
  },
});

const FORM_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'department',
  'designation',
  'salary',
  'joiningDate',
];

export function getEmployees(page, size, sortBy) {
  return api.get('', {
    params: { page, size, sortBy },
  });
}

export function getEmployeeById(id) {
  return api.get(`/${id}`);
}

export function createEmployee(employee) {
  return api.post('', employee);
}

export function updateEmployee(id, employee) {
  return api.put(`/${id}`, employee);
}

export function deleteEmployee(id) {
  return api.delete(`/${id}`);
}

export function searchEmployeesByName(name) {
  return api.get('/search', {
    params: { name },
  });
}

export function getEmployeesByDepartment(department) {
  return api.get(`/department/${encodeURIComponent(department)}`);
}

// Spring Boot returns:
// 400 validation -> { firstName: "First name is required", email: "..." }
// 404 not found  -> { message: "Employee not found with id: 1" }
// 409 duplicate  -> { message: "Email already exists" }
export function parseApiError(error) {
  if (!error.response) {
    return {
      message:
        'Cannot connect to the server. Start the Spring Boot backend on http://localhost:8080.',
      fieldErrors: {},
    };
  }

  const { status, data } = error.response;
  const fieldErrors = {};

  if (data && typeof data === 'object') {
    FORM_FIELDS.forEach((field) => {
      if (typeof data[field] === 'string') {
        fieldErrors[field] = data[field];
      }
    });
  }

  const serverMessage =
    data && typeof data === 'object' && typeof data.message === 'string'
      ? data.message
      : '';

  if (status === 409) {
    const message = serverMessage || 'Email already exists';
    return {
      message,
      fieldErrors: { email: message, ...fieldErrors },
    };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      message: serverMessage || 'Please correct the highlighted fields.',
      fieldErrors,
    };
  }

  if (serverMessage) {
    return { message: serverMessage, fieldErrors: {} };
  }

  if (status === 404) {
    return { message: 'Employee not found.', fieldErrors: {} };
  }

  if (status === 400) {
    return {
      message: 'The request was not valid. Check the form and try again.',
      fieldErrors: {},
    };
  }

  return {
    message: 'Something went wrong. Please try again.',
    fieldErrors: {},
  };
}
