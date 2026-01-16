// Company Service - Handles company setup and management
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { eventBus } from '../../shared/eventBus';
import { EventTypes } from '../../shared/eventTypes';

const app = express();
app.use(express.json());

const PORT = 4002;

// In-memory company store
const companies = new Map();

// Subscribe to company setup events
eventBus.subscribe(EventTypes.COMPANY_SETUP_REQUESTED, (event) => {
  console.log('[Company Service] Received company setup request', event.data);
});

// Create company
app.post('/company', (req, res) => {
  const { name, address, email, phone } = req.body;
  
  const company = {
    id: uuidv4(),
    name,
    address,
    email,
    phone,
    createdAt: new Date().toISOString()
  };
  
  companies.set(company.id, company);
  
  // Publish company created event
  eventBus.publish({
    type: EventTypes.COMPANY_CREATED,
    data: company,
    timestamp: Date.now(),
    source: 'company-service'
  });
  
  res.status(201).json(company);
});

// Get all companies
app.get('/company', (req, res) => {
  res.json(Array.from(companies.values()));
});

// Get company by ID
app.get('/company/:id', (req, res) => {
  const company = companies.get(req.params.id);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  res.json(company);
});

// Update company
app.put('/company/:id', (req, res) => {
  const company = companies.get(req.params.id);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  
  const updated = { ...company, ...req.body };
  companies.set(req.params.id, updated);
  
  // Publish company updated event
  eventBus.publish({
    type: EventTypes.COMPANY_UPDATED,
    data: updated,
    timestamp: Date.now(),
    source: 'company-service'
  });
  
  res.json(updated);
});

app.listen(PORT, () => {
  console.log(`[Company Service] Running on port ${PORT}`);
});
