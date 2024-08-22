import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EngineerLevelConfiguration.css';
import { CircumEdit, GravityUiTrashBin } from '../../icons';

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/masterdata/saas',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
    'User-Agent': 'insomnia/9.3.2'
  }
});

const EngineerLevelConfiguration = () => {
  const [configurations, setConfigurations] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentConfig, setCurrentConfig] = useState({
    id: null,
    displayName: '',
    minYearsOfExperience: 0,
    maxYearsOfExperience: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch configurations from backend
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('engineer/level');
      setConfigurations(response.data || []);
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
    setCurrentConfig({
      id: null,
      displayName: '',
      minYearsOfExperience: 0,
      maxYearsOfExperience: 0,
    });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const configData = {
      id: currentConfig.id,
      display_name: currentConfig.displayName,
      min_yrs_exp: parseInt(currentConfig.minYearsOfExperience, 10),
      max_yrs_exp: parseInt(currentConfig.maxYearsOfExperience, 10),
    };

    try {
      if (currentConfig.id !== null) {
        // Edit existing configuration
        await apiClient.put('engineer/level', configData);
      } else {
        // Add new configuration
        await apiClient.post('engineer/level', configData);
      }
      fetchData();  // Fetch the updated configurations
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the configuration!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentConfig(prevState => ({
      ...prevState,
      [name]: name === 'minYearsOfExperience' || name === 'maxYearsOfExperience' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleDelete = async (index) => {
    try {
      const configData = { id: configurations[index].id };
      await apiClient.delete('engineer/level', { data: configData });
      fetchData();  // Fetch the updated configurations
    } catch (error) {
      setError('There was an error deleting the configuration!');
    }
  };

  const handleEdit = (index) => {
    const configToEdit = configurations[index];
    setCurrentConfig({
      id: configToEdit.id,
      displayName: configToEdit.display_name,
      minYearsOfExperience: configToEdit.min_yrs_exp,
      maxYearsOfExperience: configToEdit.max_yrs_exp,
    });
    setShowPopup(true);
  };

  return (
    <div className='engineer-level-configuration-main'>
      <div className='engineer-level-configuration-title'>
        <div>You can add or edit engineer level configurations here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='engineer-level-configuration-data'>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            {configurations.length > 0 ? (
              <table className='engineer-level-configuration-table'>
                <thead>
                  <tr>
                    <th>DISPLAY NAME</th>
                    <th>MIN YEARS OF EXPERIENCE</th>
                    <th>MAX YEARS OF EXPERIENCE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {configurations.map((config, index) => (
                    <tr key={config.id}>
                      <td className='row'>
                        <span className='row-content'>{config.display_name}</span>
                      </td>
                      <td className='row'>
                        <span className='row-content'>{config.min_yrs_exp}</span>
                      </td>
                      <td className='row'>
                        <span className='row-content'>{config.max_yrs_exp}</span>
                      </td>
                      <td>
                        <button className='action-button' onClick={() => handleEdit(index)}>
                          <div style={{ fontSize: "24px" }}><CircumEdit /></div>
                        </button>
                        <button className='action-button' onClick={() => handleDelete(index)}>
                          <div style={{ fontSize: "22px" }}><GravityUiTrashBin /></div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='no-data-message'>
                No configurations found. Click "Add" to create a new configuration.
              </div>
            )}
          </>
        )}
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>{currentConfig.id !== null ? 'Edit Configuration' : 'Add Configuration'}</h2>
            <div className='form-group'>
              <label>Display Name</label>
              <input
                type='text'
                name='displayName'
                value={currentConfig.displayName}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Min Years of Experience</label>
              <input
                type='number'
                name='minYearsOfExperience'
                value={currentConfig.minYearsOfExperience}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Max Years of Experience</label>
              <input
                type='number'
                name='maxYearsOfExperience'
                value={currentConfig.maxYearsOfExperience}
                onChange={handleChange}
              />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>
                {currentConfig.id !== null ? 'Save Changes' : 'Add Configuration'}
              </button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineerLevelConfiguration;
