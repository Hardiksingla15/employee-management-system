package com.hardik.employeemanagement.service;

import java.util.List;
import org.springframework.data.domain.Page;
import com.hardik.employeemanagement.entity.Employee;

public interface EmployeeService {

    Page<Employee> getAllEmployees(
        int page,
        int size,
        String sortBy
);
    Employee addEmployee(Employee employee);
    Employee getEmployeeById(Long id);
    Employee updateEmployee(Long id, Employee employee);
    void deleteEmployee(Long id);
    List<Employee> searchEmployeesByName(String name);
    List<Employee> getEmployeesByDepartment(String department);
}