import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './CommissionPercentage.css';
import { CircumEdit, GravityUiTrashBin } from '../../icons';

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/masterdata/saas/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
    'User-Agent': 'insomnia/9.3.2'
  }
});

const CommissionPercentage = () => {
  const [commissions, setCommissions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentCommission, setCurrentCommission] = useState({
    country: null,
    percentage: '',
    id: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch commissions and countries from backend
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [commissionsResponse, countriesResponse] = await Promise.all([
        apiClient.get('commission'),
        axios.get('http://192.168.1.12:8080/lookup/country', {
          headers: {
            'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
          }
        })
      ]);
      setCommissions(commissionsResponse.data || []);
      setCountries(countriesResponse.data.map(country => ({ value: country.id, label: country.name })));
    } catch (error) {
      setError('There was an error fetching the data!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClick = () => {
    setCurrentCommission({
      country: null,
      percentage: '',
      id: null
    });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const commissionData = {
      country_id: currentCommission.country ? currentCommission.country.value : null,
      percentage: currentCommission.percentage
    };

    try {
      if (currentCommission.id) {
        // Edit existing commission
        await apiClient.put(`commission`, { id: currentCommission.id, ...commissionData });
      } else {
        // Add new commission
        await apiClient.post('commission', commissionData);
      }
      fetchData();  // Fetch the updated commissions
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the commission!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCommission(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setCurrentCommission(prevState => ({ ...prevState, country: selectedOption }));
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`commission/${id}`);
      fetchData();  // Fetch the updated commissions
    } catch (error) {
      setError('There was an error deleting the commission!');
    }
  };

  const handleEdit = (index) => {
    const commissionToEdit = commissions[index];
    setCurrentCommission({ 
      country: countries.find(c => c.value === commissionToEdit.country_id) || null,
      percentage: commissionToEdit.percentage,
      id: commissionToEdit.id
    });
    setShowPopup(true);
  };

  return (
    <div className='mastercomission-main'>
      <div className='mastercomission-title'>
        <div>You can add the commission details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='mastercomission-data'>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            {commissions.length > 0 ? (
              <table className='mastercomission-table'>
                <thead>
                  <tr>
                    <th>COUNTRY</th>
                    <th>PERCENTAGE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((commission, index) => (
                    <tr key={commission.id}>
                      <td className='row'>
                        <span className='row-content'>{countries.find(c => c.value === commission.country_id)?.label || ''}</span>
                      </td>
                      <td className='row'>
                        <span className='row-content'>{commission.percentage}</span>
                      </td>
                      <td>
                        <button className='action-button' onClick={() => handleEdit(index)}>
                          <div style={{ fontSize: "24px" }}><CircumEdit /></div>
                        </button>
                        <button className='action-button' onClick={() => handleDelete(commission.id)}>
                          <div style={{ fontSize: "22px" }}><GravityUiTrashBin /></div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='no-data-message'>
                No commission details found. Click "Add" to create a new commission.
              </div>
            )}
          </>
        )}
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>{currentCommission.id ? 'Edit Commission' : 'Add Commission'}</h2>
            <div className='form-group'>
              <label>Country</label>
              <Select
                name='country'
                value={currentCommission.country}
                onChange={handleSelectChange}
                options={countries}
              />
            </div>
            <div className='form-group'>
              <label>Percentage (%)</label>
              <input
                type='text'
                name='percentage'
                value={currentCommission.percentage}
                onChange={handleChange}
              />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>
                {currentCommission.id ? 'Save Changes' : 'Add Commission'}
              </button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionPercentage;
