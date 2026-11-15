import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import EmployeeTable from './components/EmployeeTable';
import EmployeeForm from './components/EmployeeForm';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  getEmployeesByDepartment,
  parseApiError,
  searchEmployeesByName,
  updateEmployee,
} from './services/employeeService';
import './App.css';

const PAGE_SIZE = 5;

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [notice, setNotice] = useState('');
  const [formMode, setFormMode] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      if (activeSearch) {
        const response = await searchEmployeesByName(activeSearch);
        setEmployees(Array.isArray(response.data) ? response.data : []);
        setTotalPages(0);
      } else if (department) {
        const response = await getEmployeesByDepartment(department);
        setEmployees(Array.isArray(response.data) ? response.data : []);
        setTotalPages(0);
      } else {
        const response = await getEmployees(page, PAGE_SIZE, sortBy);
        const data = response.data;
        setEmployees(Array.isArray(data?.content) ? data.content : []);
        setTotalPages(Number(data?.totalPages) || 0);
      }
    } catch (error) {
      setListError(parseApiError(error).message);
      setEmployees([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [activeSearch, department, page, sortBy]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    if (!notice) return undefined;

    const timeoutId = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const departmentOptions = useMemo(
    () => [...new Set([...employees.map((employee) => employee.department), department].filter(Boolean))].sort(),
    [employees, department],
  );
  const isFiltered = Boolean(activeSearch || department);

  function startCreate() {
    setSelectedEmployee(null);
    setFormMode('create');
    setFormError('');
    setFieldErrors({});
  }

  async function startEdit(employee) {
    setFormMode('edit');
    setSelectedEmployee(null);
    setFormLoading(true);
    setFormError('');
    setFieldErrors({});
    try {
      const response = await getEmployeeById(employee.id);
      setSelectedEmployee(response.data);
    } catch (error) {
      setFormError(parseApiError(error).message);
    } finally {
      setFormLoading(false);
    }
  }

  function closeForm() {
    if (submitting) return;
    setFormMode('');
    setSelectedEmployee(null);
    setFormError('');
    setFieldErrors({});
  }

  async function handleSave(employee) {
    setSubmitting(true);
    setFormError('');
    setFieldErrors({});
    try {
      if (formMode === 'edit') {
        await updateEmployee(selectedEmployee.id, employee);
        setNotice('Employee details updated.');
      } else {
        await createEmployee(employee);
        setNotice('Employee added successfully.');
      }
      setFormMode('');
      setSelectedEmployee(null);
      setActiveSearch('');
      setSearchInput('');
      setDepartment('');
      setPage(0);
      // Refresh immediately even when page state was already zero.
      await loadEmployees();
    } catch (error) {
      const parsed = parseApiError(error);
      setFormError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(employee) {
    const name = `${employee.firstName} ${employee.lastName}`.trim();
    if (!window.confirm(`Delete ${name || 'this employee'}? This action cannot be undone.`)) return;
    setNotice('');
    try {
      await deleteEmployee(employee.id);
      setNotice('Employee deleted successfully.');
      if (!isFiltered && employees.length === 1 && page > 0) {
        setPage((current) => current - 1);
      } else {
        await loadEmployees();
      }
    } catch (error) {
      setListError(parseApiError(error).message);
    }
  }

  function handleSearch(value) {
    setActiveSearch(value);
    setDepartment('');
    setPage(0);
    setNotice('');
  }

  function handleDepartmentChange(value) {
    setDepartment(value);
    setActiveSearch('');
    setSearchInput('');
    setPage(0);
    setNotice('');
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <section className="page-heading">
          <h2>Employees</h2>
          <button className="btn" type="button" onClick={startCreate}>+ Add Employee</button>
        </section>

        {notice ? <div className="banner banner--success" role="status">{notice}</div> : null}

        <section className="panel" aria-label="Employee directory">
          <div className="toolbar">
            <SearchBar value={searchInput} onChange={setSearchInput} onSearch={handleSearch} />
            <label className="control-field">
              <span>Department</span>
              <select value={department} onChange={(event) => handleDepartmentChange(event.target.value)}>
                <option value="">All departments</option>
                {departmentOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="control-field control-field--sort">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(0); }} disabled={isFiltered}>
                <option value="id">ID</option>
                <option value="firstName">First name</option>
                <option value="lastName">Last name</option>
                <option value="department">Department</option>
              </select>
            </label>
          </div>

          {listError ? <div className="banner banner--error" role="alert">{listError}</div> : null}
          {loading ? <div className="state" role="status">Loading employees…</div> : null}
          {!loading && !listError && employees.length === 0 ? (
            <div className="empty-state">
              <h3>{isFiltered ? 'No matching employees' : 'No employees yet'}</h3>
              <p>{isFiltered ? 'Try another search or clear the department filter.' : 'Add an employee to get started.'}</p>
              {!isFiltered ? <button className="btn btn--secondary" type="button" onClick={startCreate}>Add your first employee</button> : null}
            </div>
          ) : null}
          {!loading && employees.length > 0 ? <EmployeeTable employees={employees} onEdit={startEdit} onDelete={handleDelete} /> : null}

          {!loading && !listError && !isFiltered && totalPages > 0 ? (
            <Pagination page={page} totalPages={totalPages} onPrevious={() => setPage((current) => Math.max(0, current - 1))} onNext={() => setPage((current) => Math.min(totalPages - 1, current + 1))} />
          ) : null}
          {!loading && isFiltered && employees.length > 0 ? <p className="result-count">{employees.length} {employees.length === 1 ? 'employee' : 'employees'} found</p> : null}
        </section>
      </main>

      {formMode ? (
        <EmployeeForm
          mode={formMode}
          employee={selectedEmployee}
          loading={formLoading}
          submitting={submitting}
          errorMessage={formError}
          fieldErrors={fieldErrors}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      ) : null}
    </div>
  );
}
