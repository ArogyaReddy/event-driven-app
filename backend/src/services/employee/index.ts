// Employee Service - Handles employee management
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { eventBus } from '../../shared/eventBus';
import { EventTypes } from '../../shared/eventTypes';

const app = express();
app.use(express.json());

const PORT = 4003;

// In-memory employee store
const employees = new Map();

// Subscribe to employee add events
eventBus.subscribe(EventTypes.EMPLOYEE_ADD_REQUESTED, (event) => {
  console.log('[Employee Service] Received employee add request', event.data);
});

// Create employee
app.post('/employee', (req, res) => {
  const { name, email, position, salary, department } = req.body;
  
  const employee = {
    id: uuidv4(),
    name,
    email,
    position,
    salary,
    department,
    createdAt: new Date().toISOString()
  };
  
  employees.set(employee.id, employee);
  
  // Publish employee created event
  eventBus.publish({
    type: EventTypes.EMPLOYEE_CREATED,
    data: employee,
    timestamp: Date.now(),
    source: 'employee-service'
  });
  
  res.status(201).json(employee);
});

// Get all employees
app.get('/employee', (req, res) => {
  res.json(Array.from(employees.values()));
});

// Get employee by ID
app.get('/employee/:id', (req, res) => {
  const employee = employees.get(req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  res.json(employee);
});

// Update employee
app.put('/employee/:id', (req, res) => {
  const employee = employees.get(req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  
  const updated = { ...employee, ...req.body };
  employees.set(req.params.id, updated);
  
  // Publish employee updated event
  eventBus.publish({
    type: EventTypes.EMPLOYEE_UPDATED,
    data: updated,
    timestamp: Date.now(),
    source: 'employee-service'
  });
  
  res.json(updated);
});

// Delete employee
app.delete('/employee/:id', (req, res) => {
  const employee = employees.get(req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  
  employees.delete(req.params.id);
  
  // Publish employee deleted event
  eventBus.publish({
    type: EventTypes.EMPLOYEE_DELETED,
    data: { id: req.params.id },
    timestamp: Date.now(),
    source: 'employee-service'
  });
  
  res.json({ message: 'Employee deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`[Employee Service] Running on port ${PORT}`);
});
