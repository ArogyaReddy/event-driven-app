// API Gateway - Routes requests and handles WebSocket for real-time events
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { eventBus } from '../shared/eventBus';
import { EventTypes } from '../shared/eventTypes';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = 4000;

// Microservices endpoints
const AUTH_SERVICE = 'http://localhost:4001';
const COMPANY_SERVICE = 'http://localhost:4002';
const EMPLOYEE_SERVICE = 'http://localhost:4003';

// Proxy helper
async function proxyRequest(url: string, method: string, body?: any) {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  return response.json();
}

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await proxyRequest(`${AUTH_SERVICE}/login`, 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Auth service unavailable' });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const result = await proxyRequest(`${AUTH_SERVICE}/verify`, 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Auth service unavailable' });
  }
});

// Company routes
app.post('/api/company', async (req, res) => {
  try {
    const result = await proxyRequest(`${COMPANY_SERVICE}/company`, 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Company service unavailable' });
  }
});

app.get('/api/company', async (req, res) => {
  try {
    const result = await proxyRequest(`${COMPANY_SERVICE}/company`, 'GET');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Company service unavailable' });
  }
});

app.put('/api/company/:id', async (req, res) => {
  try {
    const result = await proxyRequest(`${COMPANY_SERVICE}/company/${req.params.id}`, 'PUT', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Company service unavailable' });
  }
});

// Employee routes
app.post('/api/employee', async (req, res) => {
  try {
    const result = await proxyRequest(`${EMPLOYEE_SERVICE}/employee`, 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Employee service unavailable' });
  }
});

app.get('/api/employee', async (req, res) => {
  try {
    const result = await proxyRequest(`${EMPLOYEE_SERVICE}/employee`, 'GET');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Employee service unavailable' });
  }
});

app.put('/api/employee/:id', async (req, res) => {
  try {
    const result = await proxyRequest(`${EMPLOYEE_SERVICE}/employee/${req.params.id}`, 'PUT', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Employee service unavailable' });
  }
});

app.delete('/api/employee/:id', async (req, res) => {
  try {
    const result = await proxyRequest(`${EMPLOYEE_SERVICE}/employee/${req.params.id}`, 'DELETE');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Employee service unavailable' });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('[Gateway] Client connected:', socket.id);
  
  // Handle chat messages
  socket.on('chat:message', (message) => {
    console.log('[Gateway] Chat message received:', message);
    
    // Publish chat event
    eventBus.publish({
      type: EventTypes.CHAT_MESSAGE,
      data: message,
      timestamp: Date.now(),
      source: 'gateway'
    });
    
    // Echo message back to client
    socket.emit('chat:message', {
      ...message,
      timestamp: Date.now()
    });
  });
  
  // Handle chat commands
  socket.on('chat:command', (command) => {
    console.log('[Gateway] Chat command received:', command);
    
    eventBus.publish({
      type: EventTypes.CHAT_COMMAND,
      data: command,
      timestamp: Date.now(),
      source: 'gateway'
    });
    
    socket.emit('chat:command', command);
  });
  
  socket.on('disconnect', () => {
    console.log('[Gateway] Client disconnected:', socket.id);
  });
});

// Subscribe to all events and broadcast to connected clients
eventBus.subscribe('*', (event) => {
  io.emit('event', event);
});

httpServer.listen(PORT, () => {
  console.log(`[API Gateway] Running on port ${PORT}`);
  console.log(`[API Gateway] WebSocket server ready`);
});
