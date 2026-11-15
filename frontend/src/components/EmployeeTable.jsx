function formatSalary(value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const [year, month, day] = String(value).split('-');
  if (!year || !month || !day) {
    return value;
  }

  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Department</th>
            <th scope="col">Designation</th>
            <th scope="col" className="num">
              Salary
            </th>
            <th scope="col">Joining Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>
                {employee.firstName} {employee.lastName}
              </td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.designation}</td>
              <td className="num">{formatSalary(employee.salary)}</td>
              <td>{formatDate(employee.joiningDate)}</td>
              <td className="actions">
                <button
                  className="btn btn--ghost btn--small"
                  type="button"
                  onClick={() => onEdit(employee)}
                >
                  Edit
                </button>
                <button
                  className="btn btn--danger btn--small"
                  type="button"
                  onClick={() => onDelete(employee)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
