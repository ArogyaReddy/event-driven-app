import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import CompanySetup from './CompanySetup';
import CompanyInfo from './CompanyInfo';
import EmployeeTable from './EmployeeTable';
import './Dashboard.css';

interface DashboardProps {
  user: { id: string; username: string };
  socket: Socket | null;
  onLogout: () => void;
}

interface Message {
  text: string;
  timestamp: number;
  sender: 'user' | 'system';
}

interface Company {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}

function Dashboard({ user, socket, onLogout }: DashboardProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Welcome to the Payroll System! Type "company setup" to begin or "employee add" to add employees.', timestamp: Date.now(), sender: 'system' }
  ]);
  const [inputText, setInputText] = useState('');
  const [showCompanySetup, setShowCompanySetup] = useState(false);
  const [showEmployeeTable, setShowEmployeeTable] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [hasEmployees, setHasEmployees] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing data on mount
  useEffect(() => {
    loadCompanyData();
    loadEmployeeData();
  }, []);

  const loadCompanyData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/company');
      const data = await response.json();
      if (data.length > 0) {
        setCompany(data[0]); // Get the first company
      }
    } catch (err) {
      console.error('Error loading company:', err);
    }
  };

  const loadEmployeeData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/employee');
      const data = await response.json();
      if (data.length > 0) {
        setHasEmployees(true);
        setShowEmployeeTable(true);
      }
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  const processCommand = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    if (lowerText.includes('company setup')) {
      setShowCompanySetup(true);
      addSystemMessage('Opening company setup form...');
      return true;
    }
    
    if (lowerText.includes('employee add')) {
      setShowEmployeeTable(true);
      addSystemMessage('Opening employee management. You can now add employees to the table.');
      return true;
    }
    
    return false;
  };

  const handleCompanyCreated = () => {
    loadCompanyData();
    setShowCompanySetup(false);
  };

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, {
      text,
      timestamp: Date.now(),
      sender: 'system'
    }]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      text: inputText,
      timestamp: Date.now(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);

    // Process as command
    const isCommand = processCommand(inputText);
    
    if (socket) {
      if (isCommand) {
        socket.emit('chat:command', { text: inputText, user: user.username });
      } else {
        socket.emit('chat:message', { text: inputText, user: user.username });
      }
    }

    setInputText('');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Payroll System</h1>
        <div className="header-right">
          <span className="username">Welcome, {user.username}</span>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="chat-section">
          <div className="chat-header">
            <h2>💬 Chat Assistant</h2>
          </div>
          
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                <div className="message-content">
                  <span className="message-text">{msg.text}</span>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a command: 'company setup' or 'employee add'..."
              className="chat-input"
            />
            <button type="submit" className="send-button">Send</button>
          </form>
        </div>

        <div className="forms-section">
          {showCompanySetup && (
            <CompanySetup 
              socket={socket} 
              onClose={() => setShowCompanySetup(false)}
              onCompanyCreated={handleCompanyCreated}
            />
          )}
          
          {!showCompanySetup && (
            <>
              {company && (
                <CompanyInfo company={company} onEdit={() => setShowCompanySetup(true)} />
              )}
              
              {showEmployeeTable && (
                <EmployeeTable 
                  socket={socket} 
                  onClose={() => setShowEmployeeTable(false)} 
                />
              )}
              
              {!company && !showEmployeeTable && (
                <div className="placeholder">
                  <p>👈 Use the chat to get started</p>
                  <p className="hint">Try typing "company setup" or "employee add"</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
