package com.hardik.employeemanagement.repository;
import java.util.List;
import com.hardik.employeemanagement.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByFirstNameContainingIgnoreCase(String name);
    List<Employee> findByDepartmentIgnoreCase(String department);
}