import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  department: '',
  designation: '',
  salary: '',
  joiningDate: '',
};

function toFormValues(employee) {
  if (!employee) {
    return EMPTY_FORM;
  }

  return {
    firstName: employee.firstName ?? '',
    lastName: employee.lastName ?? '',
    email: employee.email ?? '',
    phoneNumber: employee.phoneNumber ?? '',
    department: employee.department ?? '',
    designation: employee.designation ?? '',
    salary: employee.salary ?? '',
    joiningDate: employee.joiningDate ?? '',
  };
}

function Field({ label, name, type = 'text', value, onChange, error, required = true, ...rest }) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error ? <small className="field-error">{error}</small> : null}
    </label>
  );
}

export default function EmployeeForm({
  mode,
  employee,
  loading,
  submitting,
  errorMessage,
  fieldErrors,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = mode === 'edit';

  useEffect(() => {
    setForm(toFormValues(employee));
  }, [employee]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      department: form.department.trim(),
      designation: form.designation.trim(),
      salary: form.salary === '' ? null : Number(form.salary),
      joiningDate: form.joiningDate || null,
    });
  }

  const canSubmit = !loading && !submitting && (!isEdit || employee);

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id="employee-form-title">{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {errorMessage ? (
          <div className="banner banner--error" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {loading ? <p className="state">Loading employee...</p> : null}

        {!loading && isEdit && !employee ? null : (
          <form className="employee-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <Field
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={fieldErrors.firstName}
              />
              <Field
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={fieldErrors.lastName}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={fieldErrors.email}
              />
              <Field
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                error={fieldErrors.phoneNumber}
              />
              <Field
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                error={fieldErrors.department}
              />
              <Field
                label="Designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                error={fieldErrors.designation}
              />
              <Field
                label="Salary"
                name="salary"
                type="number"
                min="1"
                step="0.01"
                value={form.salary}
                onChange={handleChange}
                error={fieldErrors.salary}
              />
              <Field
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={handleChange}
                error={fieldErrors.joiningDate}
                required={false}
              />
            </div>

            <div className="form-actions">
              <button className="btn btn--ghost" type="button" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button className="btn" type="submit" disabled={!canSubmit}>
                {submitting ? 'Saving...' : isEdit ? 'Update Employee' : 'Save Employee'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
