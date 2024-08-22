import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roles.css';  // Assuming same CSS is used
import {CircumEdit,GravityUiTrashBin} from '../../icons'

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.30:8080/lookup/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  },
});

const SafetyWears = () => {
  const [safetyWears, setSafetyWears] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSafetyWear, setCurrentSafetyWear] = useState({ name: '', description: '', index: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch safety wears from backend when component mounts
  const fetchSafetyWears = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('dress_codes');
      setSafetyWears(response.data || []); // Handle potential null response
    } catch (error) {
      setError('There was an error fetching the safety wears!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafetyWears();
  }, []);

  const handleAddClick = () => {
    setCurrentSafetyWear({ name: '', description: '', index: null });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const safetyWearData = {
      name: currentSafetyWear.name || '', // Default to empty string if null
      description: currentSafetyWear.description || ''
    };

    try {
      if (currentSafetyWear.index !== null) {
        // Edit existing safety wear
        const safetyWearId = safetyWears[currentSafetyWear.index]?.id;
        if (safetyWearId) {
          await apiClient.put(`dress_codes/${safetyWearId}`, safetyWearData);
        }
      } else {
        // Add new safety wear
        await apiClient.post('dress_codes', safetyWearData);
      }
      fetchSafetyWears();  // Fetch the updated safety wears
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the safety wear!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSafetyWear(prevState => ({
      ...prevState,
      [name]: value || '' // Default to empty string if value is null
    }));
  };

  const handleDelete = async (index) => {
    const safetyWearId = safetyWears[index]?.id;
    if (!safetyWearId) return;  // Ensure ID exists before attempting deletion

    try {
      await apiClient.delete(`dress_codes/${safetyWearId}`);
      fetchSafetyWears();  // Fetch the updated safety wears
    } catch (error) {
      setError('There was an error deleting the safety wear!');
    }
  };

  const handleEdit = (index) => {
    const safetyWearToEdit = safetyWears[index];
    setCurrentSafetyWear({
      name: safetyWearToEdit.name || '', // Default to empty string if null
      description: safetyWearToEdit.description || '',
      index
    });
    setShowPopup(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "Safety Wears" details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='lookup-data'>
        {safetyWears.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>DESCRIPTION</th>
                <th>CREATED AT</th>
                <th>CREATED BY</th>
                <th>UPDATED AT</th>
                <th>UPDATED BY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {safetyWears.map((safetyWear, index) => (
                <tr key={safetyWear.id}>
                  <td>{safetyWear.name || '-'}</td>
                  <td>{safetyWear.description || '-'}</td>
                  <td>{safetyWear.created_at ? new Date(safetyWear.created_at).toLocaleString() : '-'}</td>
                  <td>{safetyWear.created_by || '-'}</td>
                  <td>{safetyWear.updated_at ? new Date(safetyWear.updated_at).toLocaleString() : '-'}</td>
                  <td>{safetyWear.updated_by || '-'}</td>
                  <td>
                        <button className='action-button'  onClick={() => handleEdit(index)}><div style={{fontSize:"24px"}}><CircumEdit/></div></button>
                        <button className='action-button' onClick={() => handleDelete(index)}><div style={{fontSize:"22px"}}><GravityUiTrashBin/></div></button>
                      </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>{currentSafetyWear.index !== null ? 'Edit Safety Wear' : 'Add Safety Wear'}</h2>
            <div className='form-group'>
              <label>Name</label>
              <input
                type='text'
                name='name'
                value={currentSafetyWear.name || ''} // Default to empty string if null
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Description</label>
              <input
                type='text'
                name='description'
                value={currentSafetyWear.description || ''} // Default to empty string if null
                onChange={handleChange}
              />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>{currentSafetyWear.index !== null ? 'Save Changes' : 'Save'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SafetyWears;
