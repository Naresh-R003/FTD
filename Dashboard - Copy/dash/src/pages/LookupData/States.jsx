import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roles.css'; // Assuming you have a similar CSS file
import {CircumEdit,GravityUiTrashBin} from '../../icons'

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/lookup/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  },
});

const States = () => {
  const [states, setStates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [currentState, setCurrentState] = useState({
    code: '',
    name: '',
    country_id: '', // Handle null values by defaulting to empty string
    index: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch states from backend when component mounts
  const fetchStates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('state');
      setStates(response.data || []); // Handle potential null response
    } catch (error) {
      setError('There was an error fetching the states!');
    } finally {
      setLoading(false);
    }
  };

  // Fetch countries from backend when component mounts
  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('country');
      setCountryOptions(response.data || []); // Handle potential null response
    } catch (error) {
      setError('There was an error fetching the countries!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  const handleAddClick = () => {
    setCurrentState({ code: '', name: '', country_id: '', index: null });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const stateData = {
      code: currentState.code || '', // Default to empty string if null
      name: currentState.name || '',
      country_id: parseInt(currentState.country_id, 10) || null // Default to null if invalid
    };

    try {
      if (currentState.index !== null) {
        // Edit existing state
        const stateId = states[currentState.index]?.id;
        if (stateId) {
          await apiClient.put(`states/${stateId}`, stateData);
        }
      } else {
        // Add new state
        await apiClient.post('states', stateData);
      }
      fetchStates();  // Fetch the updated states
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the state!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDelete = async (index) => {
    const stateId = states[index]?.id;
    if (!stateId) return;  // Ensure ID exists before attempting deletion

    try {
      await apiClient.delete(`states/${stateId}`);
      fetchStates();  // Fetch the updated states
    } catch (error) {
      setError('There was an error deleting the state!');
    }
  };

  const handleEdit = (index) => {
    const stateToEdit = states[index];
    setCurrentState({
      code: stateToEdit.code || '',
      name: stateToEdit.name || '',
      country_id: stateToEdit.country_id?.toString() || '', // Convert to string or default to empty
      index
    });
    setShowPopup(true);
  };

  // Find country name based on country_id
  const getCountryName = (country_id) => {
    const country = countryOptions.find(c => c.id === country_id);
    return country ? country.name : 'Unknown'; // Default to 'Unknown' if country is not found
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "States" details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='lookup-data'>
        {states.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>STATE CODE</th>
                <th>STATE NAME</th>
                <th>COUNTRY NAME</th>
                <th>CREATED AT</th>
                <th>CREATED BY</th>
                <th>UPDATED AT</th>
                <th>UPDATED BY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state, index) => (
                <tr key={state.id}>
                  <td>{state.code || '-'}</td>
                  <td>{state.name || '-'}</td>
                  <td>{getCountryName(state.country_id)}</td> {/* Map country name */}
                  <td>{state.created_at ? new Date(state.created_at).toLocaleString() : '-'}</td>
                  <td>{state.created_by || '-'}</td>
                  <td>{state.updated_at ? new Date(state.updated_at).toLocaleString() : '-'}</td>
                  <td>{state.updated_by || '-'}</td>
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
            <h2>{currentState.index !== null ? 'Edit State' : 'Add State'}</h2>
            <div className='form-group'>
              <label>State Code</label>
              <input
                type='text'
                name='code'
                value={currentState.code}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>State Name</label>
              <input
                type='text'
                name='name'
                value={currentState.name}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Country Name</label>
              <select
                name='country_id'
                value={currentState.country_id}
                onChange={handleChange}
                className='dropdown-input'
              >
                <option value='' disabled>Select a country</option>
                {countryOptions.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>{currentState.index !== null ? 'Save Changes' : 'Save'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default States;
