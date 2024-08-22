import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../JobConfiguration.css';

const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/masterdata/saas',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  },
});

const CorporateJob = () => {
  const [roles, setRoles] = useState({
    client_cancellation_hour_charges: '',
    engineer_cancellation_hour_charges: '',
    client_cancellation_percent_charges: '',
    engineer_cancellation_percent_charges: '',
    max_engineers: '',
    max_tools: '',
    max_skills: '',
    max_safety_wears: '',
    max_tasks: '',
    dispatch_job_max_hours: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    apiClient.get('job/configuration')
      .then(response => {
        if (response.data) {
          setRoles(response.data);
          setIsUpdate(true); // Data exists, so we'll perform an update (PUT) operation
        }
      })
      .catch(error => {
        console.error('There was an error fetching the job configuration!', error);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Create a new object to format the data before sending
      const formattedRoles = {
        client_cancellation_hour_charges: parseInt(roles.client_cancellation_hour_charges, 10),
        engineer_cancellation_hour_charges: parseInt(roles.engineer_cancellation_hour_charges, 10),
        client_cancellation_percent_charges: roles.client_cancellation_percent_charges, // keep as string
        engineer_cancellation_percent_charges: roles.engineer_cancellation_percent_charges, // keep as string
        max_engineers: parseInt(roles.max_engineers, 10),
        max_tools: parseInt(roles.max_tools, 10),
        max_skills: parseInt(roles.max_skills, 10),
        max_safety_wears: parseInt(roles.max_safety_wears, 10),
        max_tasks: parseInt(roles.max_tasks, 10),
        dispatch_job_max_hours: parseInt(roles.dispatch_job_max_hours, 10),
      };
  
      if (isUpdate) {
        await apiClient.put('job/configuration', formattedRoles);
        alert('Details updated successfully!');
      } else {
        await apiClient.post('job/configuration', formattedRoles);
        alert('Details saved successfully!');
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving details:', error);
      alert('An error occurred while saving data.');
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoles({ ...roles, [name]: value });
  };

  return (
    <div className='config-form-container'>
      <h2 className='saas-title'>Job Configuration</h2>
      <form className='job-config-form'>
        <div className="input-group">
          <label htmlFor="client_cancellation_hour_charges" className="config-label">CLIENT CANCELLATION CHARGES (Hours)</label>
          <input
            type="number"
            id="client_cancellation_hour_charges"
            name="client_cancellation_hour_charges"
            value={roles.client_cancellation_hour_charges || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input-field"
            placeholder='Enter here'
          />
        </div>
        <div className="input-group">
          <label htmlFor="engineer_cancellation_hour_charges" className="config-label">ENGINEER CANCELLATION CHARGES (Hours)</label>
          <input
            type="number"
            id="engineer_cancellation_hour_charges"
            name="engineer_cancellation_hour_charges"
            value={roles.engineer_cancellation_hour_charges || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input-field"
            placeholder='Enter here'
          />
        </div>
        <div className="input-group">
          <label htmlFor="client_cancellation_percent_charges" className="config-label">CLIENT CANCELLATION CHARGES (%)</label>
          <input
            type="text"
            id="client_cancellation_percent_charges"
            name="client_cancellation_percent_charges"
            value={roles.client_cancellation_percent_charges || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input-field"
            placeholder='Enter here'
          />
        </div>
        <div className="input-group">
          <label htmlFor="engineer_cancellation_percent_charges" className="config-label">ENGINEER CANCELLATION CHARGES (%)</label>
          <input
            type="text"
            id="engineer_cancellation_percent_charges"
            name="engineer_cancellation_percent_charges"
            value={roles.engineer_cancellation_percent_charges || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input-field"
            placeholder='Enter here'
          />
        </div>
        <div className="input-group">
          <label htmlFor="max_engineers" className="config-label">NUMBER OF ENGINEERS ALLOWED</label>
          <input
            type="number"
            id="max_engineers"
            name="max_engineers"
            value={roles.max_engineers || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input-field"
            placeholder='Enter here'
          />
        </div>
        <div className="input-group">
          <label htmlFor="max_tools" className="config-label">NUMBER OF TOOLS ALLOWED</label>
          <input
            type="number"
            id="max_tools"
            name="max_tools"
            value={roles.max_tools || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input-field"
            placeholder='Enter here'
          />
        </div>
        <div className="input-group">
          <label htmlFor="max_skills" className="config-label">NUMBER OF SKILLS ALLOWED</label>
          <input
            type="number"
            id="max_skills"
            name="max_skills"
            value={roles.max_skills || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input-field"
            placeholder='Enter here'
          />
        </div>
        <div className="input-group">
          <label htmlFor="max_safety_wears" className="config-label">NUMBER OF SAFETY WEARS ALLOWED</label>
          <input
            type="number"
            id="max_safety_wears"
            name="max_safety_wears"
            value={roles.max_safety_wears || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input-field"
            placeholder='Enter here'
          />
        </div>
        <div className="input-group">
          <label htmlFor="max_tasks" className="config-label">NUMBER OF TASKS ALLOWED</label>
          <input
            type="number"
            id="max_tasks"
            name="max_tasks"
            value={roles.max_tasks || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input-field"
            placeholder='Enter here'
          />
        </div>
        <div className="input-group last-input-group">
          <label htmlFor="dispatch_job_max_hours" className="config-label">MAXIMUM HOURS FOR DISPATCH JOB</label>
          <input
            type="number"
            id="dispatch_job_max_hours"
            name="dispatch_job_max_hours"
            value={roles.dispatch_job_max_hours || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input-field"
            placeholder='Enter here'
          />
        </div>
        <div className="form-actions">
          {!isEditing ? (
            <button type="button" onClick={handleEdit} className="edit-button">Edit</button>
          ) : (
            <button type="button" onClick={handleSave} className="save-button">Save</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CorporateJob;
