import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roles.css';  // Assuming same CSS is used
import {CircumEdit,GravityUiTrashBin} from '../../icons'

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/lookup/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  },
});

const Services = () => {
  const [services, setServices] = useState([]);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentService, setCurrentService] = useState({ name: '', skill_id: [], service_type: '', index: null });
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [error, setError] = useState(null);

  // Fetch services and skills from backend when component mounts
  useEffect(() => {
    fetchServices();
    fetchSkills();
  }, []);

  // Fetch services data from the backend
  const fetchServices = async () => {
    setLoadingServices(true);
    setError(null);
    try {
      const response = await apiClient.get('service');
      setServices(response.data || []); // Ensure services is always an array
    } catch (error) {
      setError('There was an error fetching the services!');
    } finally {
      setLoadingServices(false);
    }
  };

  // Fetch skills data from the backend
  const fetchSkills = async () => {
    setLoadingSkills(true);
    setError(null);
    try {
      const response = await apiClient.get('skills');
      setSkillsOptions(response.data || []); // Ensure skillsOptions is always an array
    } catch (error) {
      setError('There was an error fetching the skills!');
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleAddClick = () => {
    setCurrentService({ name: '', skill_id: [], service_type: '', index: null });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const serviceData = {
      name: currentService.name,
      skill_id: currentService.skill_id, // Ensure this is an array
      service_type: currentService.service_type,
    };

    try {
      if (currentService.index !== null) {
        // Edit existing service
        const serviceId = services[currentService.index].id;
        await apiClient.put(`services/${serviceId}`, serviceData);
      } else {
        // Add new service
        await apiClient.post('services', serviceData);
      }
      fetchServices();  // Fetch the updated services
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the service!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentService(prevState => ({
      ...prevState,
      [name]: name === 'skill_id' ? [parseInt(value, 10)] : value
    }));
  };

  const handleDelete = async (index) => {
    try {
      const serviceId = services[index].id;
      await apiClient.delete(`services/${serviceId}`);
      fetchServices();  // Fetch the updated services
    } catch (error) {
      setError('There was an error deleting the service!');
    }
  };

  const handleEdit = (index) => {
    const serviceToEdit = services[index];
    setCurrentService({ 
      name: serviceToEdit.name, 
      skill_id: [parseInt(serviceToEdit.skill_id, 10)], // Convert skill_id to integer array
      service_type: serviceToEdit.service_type, 
      index 
    });
    setShowPopup(true);
  };

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "Services" details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='lookup-data'>
        {loadingServices ? (
          <div>Loading services...</div>
        ) : loadingSkills ? (
          <div>Loading skills...</div>
        ) : error ? (
          <div>{error}</div>
        ) : services.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>SERVICE NAME</th>
                <th>SKILLS</th>
                <th>SERVICE TYPE</th>
                <th>CREATED AT</th>
                <th>CREATED BY</th>
                <th>UPDATED AT</th>
                <th>UPDATED BY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{Array.isArray(service.skill_names) ? service.skill_names.join(', ') : 'No skills assigned'}</td> {/* Display skill_names as a comma-separated list */}
                  <td>{service.service_type}</td>
                  <td>{new Date(service.created_at).toLocaleString()}</td>
                  <td>{service.created_by}</td>
                  <td>{new Date(service.updated_at).toLocaleString()}</td>
                  <td>{service.updated_by}</td>
                  <td>
                        <button className='action-button'  onClick={() => handleEdit(index)}><div style={{fontSize:"24px"}}><CircumEdit/></div></button>
                        <button className='action-button' onClick={() => handleDelete(index)}><div style={{fontSize:"22px"}}><GravityUiTrashBin/></div></button>
                      </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className='no-data-message'>
            No services found. Click "Add" to create a new service.
          </div>
        )}
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>{currentService.index !== null ? 'Edit Service' : 'Add Service'}</h2>
            <div className='form-group'>
              <label>Service Name</label>
              <input
                type='text'
                name='name'
                value={currentService.name}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Skills</label>
              <select
                name='skill_id'
                value={currentService.skill_id[0] || ''}
                onChange={handleChange}
                className='dropdown-input'
              >
                <option value='' disabled>Select skills</option>
                {skillsOptions.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label>Service Type</label>
              <select
                name='service_type'
                value={currentService.service_type}
                onChange={handleChange}
                className='dropdown-input'
              >
                <option value='' disabled>Select a service type</option>
                <option value='Hardware'>Hardware</option>
                <option value='Software'>Software</option>
              </select>
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>{currentService.index !== null ? 'Save Changes' : 'Save'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
