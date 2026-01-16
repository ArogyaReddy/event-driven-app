# Event-Driven Payroll System

A modern payroll management system built with event-driven microservices architecture.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Vite, Socket.IO Client
- **Backend**: Node.js, TypeScript, Express
- **Architecture**: Microservices, Event-Driven
- **Real-time Communication**: WebSocket (Socket.IO)

## 📁 Project Structure

```
event-driven-app/
├── backend/
│   ├── src/
│   │   ├── gateway/          # API Gateway with WebSocket
│   │   ├── services/
│   │   │   ├── auth/         # Authentication service
│   │   │   ├── company/      # Company management service
│   │   │   └── employee/     # Employee management service
│   │   └── shared/
│   │       ├── eventBus.ts   # Event bus for microservices
│   │       └── eventTypes.ts # Event type definitions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.tsx         # Login screen
│   │   │   ├── Dashboard.tsx     # Main dashboard with chat
│   │   │   ├── CompanySetup.tsx  # Company setup form
│   │   │   └── EmployeeTable.tsx # Employee management table
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── package.json
```

## ✨ Features

### 1. **Login Screen**
- Simple authentication with demo credentials
- JWT-based token authentication
- Persistent login sessions

### 2. **Chat Interface**
- Interactive chat-based command system
- Real-time WebSocket communication
- Command recognition and processing

### 3. **Company Setup**
- Triggered by typing "company setup" in chat
- Dynamic form for company details
- Event-driven data persistence

### 4. **Employee Management**
- Triggered by typing "employee add" in chat
- Inline editable table for employee data
- Real-time CRUD operations
- Fields: Name, Email, Position, Salary, Department

## 🏗️ Microservices Architecture

### Services:

1. **API Gateway** (Port 4000)
   - Routes requests to microservices
   - Manages WebSocket connections
   - Broadcasts events to clients

2. **Auth Service** (Port 4001)
   - Handles user authentication
   - JWT token generation and verification

3. **Company Service** (Port 4002)
   - Manages company data
   - Publishes company-related events

4. **Employee Service** (Port 4003)
   - Manages employee data
   - Publishes employee-related events

### Event Bus
- In-memory event emitter
- Enables loose coupling between services
- Publishes events for all data changes

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd /Users/arog/Learn/event-driven-app
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

### Running the Application

**Start all services (recommended):**
```bash
npm run dev
```

This command starts:
- API Gateway (http://localhost:4000)
- Auth Service (http://localhost:4001)
- Company Service (http://localhost:4002)
- Employee Service (http://localhost:4003)
- Frontend (http://localhost:3000)

**Or run individually:**

Backend services:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🔐 Demo Credentials

Use these credentials to login:

- **Admin User**
  - Username: `admin`
  - Password: `admin123`

- **Regular User**
  - Username: `user`
  - Password: `user123`

## 💬 How to Use

1. **Login** with demo credentials
2. **Chat Commands**:
   - Type `company setup` to open company registration form
   - Type `employee add` to open employee management table
3. **Company Setup**:
   - Fill in company details (name, address, email, phone)
   - Click "Save Company"
4. **Employee Management**:
   - Add new employees using the form
   - Click edit (✎) to modify employee details
   - Click save (✓) to confirm changes
   - Click delete (🗑) to remove an employee

## 🎯 Event Flow Example

### Adding an Employee:
1. User types "employee add" in chat
2. Chat component processes command
3. Employee table component appears
4. User fills employee form and submits
5. Frontend sends POST request to API Gateway
6. Gateway proxies request to Employee Service
7. Employee Service creates employee record
8. Employee Service publishes `EMPLOYEE_CREATED` event
9. Event Bus broadcasts event to all subscribers
10. Gateway receives event and broadcasts via WebSocket
11. Frontend receives real-time update

## 🛠️ Development

### Backend Structure
- TypeScript with Node.js
- Express for REST APIs
- Socket.IO for WebSocket
- In-memory data storage (replace with database for production)

### Frontend Structure
- React with TypeScript
- Vite for fast development
- Socket.IO Client for real-time updates
- CSS for styling

### Adding New Microservices

1. Create new service in `backend/src/services/`
2. Add service startup script in `backend/package.json`
3. Define event types in `backend/src/shared/eventTypes.ts`
4. Subscribe to relevant events in your service
5. Publish events for state changes

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token

### Company
- `GET /api/company` - Get all companies
- `POST /api/company` - Create company
- `PUT /api/company/:id` - Update company

### Employee
- `GET /api/employee` - Get all employees
- `POST /api/employee` - Create employee
- `PUT /api/employee/:id` - Update employee
- `DELETE /api/employee/:id` - Delete employee

## 🎨 Customization

### Styling
- Modify CSS files in `frontend/src/components/`
- Global styles in `frontend/src/index.css`
- Gradient theme can be changed in CSS variables

### Adding Features
- New chat commands in `Dashboard.tsx`
- New forms/components following existing patterns
- New microservices for additional domains

## 🔮 Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- Redis for event bus in distributed systems
- Docker containerization
- Kubernetes deployment
- Payment processing service
- Reporting and analytics service
- Email notifications
- File uploads for employee documents

## 📄 License

MIT License - feel free to use this project for learning and development!

---

Built with ❤️ using Event-Driven Architecture
