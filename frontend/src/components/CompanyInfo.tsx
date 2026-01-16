import './CompanyInfo.css';

interface CompanyInfoProps {
  company: {
    id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  onEdit: () => void;
}

function CompanyInfo({ company, onEdit }: CompanyInfoProps) {
  return (
    <div className="company-info">
      <div className="company-header">
        <h2>🏢 Company Information</h2>
        <button onClick={onEdit} className="edit-company-btn">Edit</button>
      </div>
      
      <div className="company-details">
        <div className="detail-row">
          <label>Company Name:</label>
          <span>{company.name}</span>
        </div>
        
        <div className="detail-row">
          <label>Address:</label>
          <span>{company.address}</span>
        </div>
        
        <div className="detail-row">
          <label>Email:</label>
          <span>{company.email}</span>
        </div>
        
        <div className="detail-row">
          <label>Phone:</label>
          <span>{company.phone}</span>
        </div>
      </div>
    </div>
  );
}

export default CompanyInfo;
