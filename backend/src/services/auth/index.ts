// Auth Service - Simple authentication microservice
import express from 'express';
import jwt from 'jsonwebtoken';
import { eventBus } from '../../shared/eventBus';
import { EventTypes } from '../../shared/eventTypes';

const app = express();
app.use(express.json());

const PORT = 4001;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Simple in-memory user store (replace with database in production)
const users = new Map([
  ['admin', { username: 'admin', password: 'admin123', id: '1' }],
  ['user', { username: 'user', password: 'user123', id: '2' }]
]);

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.get(username);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Publish login event
  eventBus.publish({
    type: EventTypes.USER_LOGIN,
    data: { userId: user.id, username: user.username },
    timestamp: Date.now(),
    source: 'auth-service'
  });
  
  res.json({ token, user: { id: user.id, username: user.username } });
});

// Verify token endpoint
app.post('/verify', (req, res) => {
  const { token } = req.body;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`[Auth Service] Running on port ${PORT}`);
});
