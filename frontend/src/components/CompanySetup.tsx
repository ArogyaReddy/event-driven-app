import { useState } from 'react';
import { Socket } from 'socket.io-client';
import './CompanySetup.css';

interface CompanySetupProps {
  socket: Socket | null;
  onClose: () => void;
  onCompanyCreated?: () => void;
}

interface CompanyData {
  name: string;
  address: string;
  email: string;
  phone: string;
}

function CompanySetup({ socket, onClose, onCompanyCreated }: CompanySetupProps) {
  const [formData, setFormData] = useState<CompanyData>({
    name: '',
    address: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        if (onCompanyCreated) {
          onCompanyCreated();
        }
        setTimeout(() => {
          setSuccess(false);
          setFormData({ name: '', address: '', email: '', phone: '' });
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating company:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-setup">
      <div className="form-header">
        <h2>🏢 Company Setup</h2>
        <button onClick={onClose} className="close-button">✕</button>
      </div>

      {success && (
        <div className="success-message">
          ✓ Company created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">Company Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter company name"
          />
        </div>

        <div className="form-row">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter company address"
            rows={3}
          />
        </div>

        <div className="form-row">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="company@example.com"
          />
        </div>

        <div className="form-row">
          <label htmlFor="phone">Phone *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save Company'}
        </button>
      </form>
    </div>
  );
}

export default CompanySetup;
