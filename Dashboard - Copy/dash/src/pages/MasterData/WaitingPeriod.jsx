import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WaitingPeriod.css';

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/masterdata/saas',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  },
});

const WaitingPeriod = () => {
  const [sla1Radius2, setSla1Radius2] = useState('');
  const [sla1Radius3, setSla1Radius3] = useState('');
  const [sla2Radius2, setSla2Radius2] = useState('');
  const [sla2Radius3, setSla2Radius3] = useState('');
  const [sla3Radius2, setSla3Radius2] = useState('');
  const [sla3Radius3, setSla3Radius3] = useState('');
  const [sla4Radius2, setSla4Radius2] = useState('');
  const [sla4Radius3, setSla4Radius3] = useState('');
  const [isEditing, setIsEditing] = useState(false); // New state to track edit mode

  useEffect(() => {
    // Fetch data for pre-populating form fields
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/sla/waitingperiod');
        if (response.data) {
          const data = response.data;

          setSla1Radius2(data.sla_1_radius_2 || '');
          setSla1Radius3(data.sla_1_radius_3 || '');
          setSla2Radius2(data.sla_2_radius_2 || '');
          setSla2Radius3(data.sla_2_radius_3 || '');
          setSla3Radius2(data.sla_3_radius_2 || '');
          setSla3Radius3(data.sla_3_radius_3 || '');
          setSla4Radius2(data.sla_4_radius_2 || '');
          setSla4Radius3(data.sla_4_radius_3 || '');
        }
      } catch (error) {
        console.error('No data found or error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const formData = {
      sla_1_radius_2: parseInt(sla1Radius2, 10),
      sla_1_radius_3: parseInt(sla1Radius3, 10),
      sla_2_radius_2: parseInt(sla2Radius2, 10),
      sla_2_radius_3: parseInt(sla2Radius3, 10),
      sla_3_radius_2: parseInt(sla3Radius2, 10),
      sla_3_radius_3: parseInt(sla3Radius3, 10),
      sla_4_radius_2: parseInt(sla4Radius2, 10),
      sla_4_radius_3: parseInt(sla4Radius3, 10),
    };

    try {
      if (isEditing) {
        // PUT request for update
        await apiClient.put('/sla/waitingperiod', formData);
        alert('Data updated successfully!');
      } else {
        // POST request for create
        await apiClient.post('/sla/waitingperiod', formData);
        alert('Data saved successfully!');
      }
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving data.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="form-container">
      <h2 className="waiting-period-title">Waiting Period Configuration</h2>
      <form className="waiting-period-form">
        <div className="input-group">
          <label htmlFor="sla1Radius2" className="label">SLA 1-RADIUS 2 WAITING PERIOD</label>
          <input
            type="number"
            id="sla1Radius2"
            value={sla1Radius2}
            onChange={(e) => setSla1Radius2(e.target.value)}
            className="input-field"
            placeholder='hours'
            disabled={!isEditing}
          />
        </div>
        <div className="input-group">
          <label htmlFor="sla1Radius3" className="label">SLA 1-RADIUS 3 WAITING PERIOD</label>
          <input
            type="number"
            id="sla1Radius3"
            value={sla1Radius3}
            onChange={(e) => setSla1Radius3(e.target.value)}
            className="input-field"
            placeholder='hours'
            disabled={!isEditing}
          />
        </div>
        <div className="input-group">
          <label htmlFor="sla2Radius2" className="label">SLA 2-RADIUS 2 WAITING PERIOD</label>
          <input
            type="number"
            id="sla2Radius2"
            value={sla2Radius2}
            onChange={(e) => setSla2Radius2(e.target.value)}
            className="input-field"
            placeholder='hours'
            disabled={!isEditing}
          />
        </div>
        <div className="input-group">
          <label htmlFor="sla2Radius3" className="label">SLA 2-RADIUS 3 WAITING PERIOD</label>
          <input
            type="number"
            id="sla2Radius3"
            value={sla2Radius3}
            onChange={(e) => setSla2Radius3(e.target.value)}
            className="input-field"
            placeholder='hours'
            disabled={!isEditing}
          />
        </div>
        <div className="input-group">
          <label htmlFor="sla3Radius2" className="label">SLA 3-RADIUS 2 WAITING PERIOD</label>
          <input
            type="number"
            id="sla3Radius2"
            value={sla3Radius2}
            onChange={(e) => setSla3Radius2(e.target.value)}
            className="input-field"
            placeholder='hours'
            disabled={!isEditing}
          />
        </div>
        <div className="input-group">
          <label htmlFor="sla3Radius3" className="label">SLA 3-RADIUS 3 WAITING PERIOD</label>
          <input
            type="number"
            id="sla3Radius3"
            value={sla3Radius3}
            onChange={(e) => setSla3Radius3(e.target.value)}
            className="input-field"
            placeholder='hours'
            disabled={!isEditing}
          />
        </div>
        <div className="input-group">
          <label htmlFor="sla4Radius2" className="label">SLA 4-RADIUS 2 WAITING PERIOD</label>
          <input
            type="number"
            id="sla4Radius2"
            value={sla4Radius2}
            onChange={(e) => setSla4Radius2(e.target.value)}
            className="input-field"
            placeholder='hours'
            disabled={!isEditing}
          />
        </div>
        <div className="input-group">
          <label htmlFor="sla4Radius3" className="label">SLA 4-RADIUS 3 WAITING PERIOD</label>
          <input
            type="number"
            id="sla4Radius3"
            value={sla4Radius3}
            onChange={(e) => setSla4Radius3(e.target.value)}
            className="input-field"
            placeholder='hours'
            disabled={!isEditing}
          />
        </div>
        <div className="button-group">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              className="save-button"
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="edit-button"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WaitingPeriod;
