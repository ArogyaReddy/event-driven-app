import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import './EmployeeTable.css';

interface EmployeeTableProps {
  socket: Socket | null;
  onClose: () => void;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  salary: string;
  department: string;
}

function EmployeeTable({ socket, onClose }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    salary: '',
    department: ''
  });

  useEffect(() => {
    loadEmployees();
    
    if (socket) {
      socket.on('event', (event: any) => {
        if (event.type === 'employee.created' || event.type === 'employee.updated') {
          loadEmployees();
        }
      });
    }
  }, [socket]);

  const loadEmployees = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/employee');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:4000/api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        setNewEmployee({
          name: '',
          email: '',
          position: '',
          salary: '',
          department: ''
        });
        loadEmployees();
      }
    } catch (err) {
      console.error('Error adding employee:', err);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
  };

  const handleSave = async (employee: Employee) => {
    try {
      const response = await fetch(`http://localhost:4000/api/employee/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (response.ok) {
        setEditingId(null);
        loadEmployees();
      }
    } catch (err) {
      console.error('Error updating employee:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/employee/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadEmployees();
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  const handleFieldChange = (id: string, field: keyof Employee, value: string) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    );
  };

  return (
    <div className="employee-table">
      <div className="form-header">
        <h2>👥 Employee Management</h2>
        <button onClick={onClose} className="close-button">✕</button>
      </div>

      <form onSubmit={handleAddEmployee} className="add-employee-form">
        <h3>Add New Employee</h3>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Position"
            value={newEmployee.position}
            onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Salary"
            value={newEmployee.salary}
            onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Department"
            value={newEmployee.department}
            onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
            required
          />
          <button type="submit" className="add-button">Add Employee</button>
        </div>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  {editingId === employee.id ? (
                    <input
                      type="text"
                      value={employee.name}
                      onChange={(e) => handleFieldChange(employee.id, 'name', e.target.value)}
                    />
                  ) : (
                    employee.name
                  )}
                </td>
                <td>
                  {editingId === employee.id ? (
                    <input
                      type="email"
                      value={employee.email}
                      onChange={(e) => handleFieldChange(employee.id, 'email', e.target.value)}
                    />
                  ) : (
                    employee.email
                  )}
                </td>
                <td>
                  {editingId === employee.id ? (
                    <input
                      type="text"
                      value={employee.position}
                      onChange={(e) => handleFieldChange(employee.id, 'position', e.target.value)}
                    />
                  ) : (
                    employee.position
                  )}
                </td>
                <td>
                  {editingId === employee.id ? (
                    <input
                      type="text"
                      value={employee.salary}
                      onChange={(e) => handleFieldChange(employee.id, 'salary', e.target.value)}
                    />
                  ) : (
                    employee.salary
                  )}
                </td>
                <td>
                  {editingId === employee.id ? (
                    <input
                      type="text"
                      value={employee.department}
                      onChange={(e) => handleFieldChange(employee.id, 'department', e.target.value)}
                    />
                  ) : (
                    employee.department
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingId === employee.id ? (
                      <>
                        <button
                          onClick={() => handleSave(employee)}
                          className="save-btn"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="cancel-btn"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(employee)}
                          className="edit-btn"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="delete-btn"
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {employees.length === 0 && (
          <div className="empty-state">
            <p>No employees yet. Add your first employee above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeTable;
