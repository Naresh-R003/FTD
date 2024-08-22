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

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [currentCity, setCurrentCity] = useState({ code: '', name: '', state_id: '', country_id: '', index: null });

  // Fetch cities from backend when component mounts
  const fetchCities = () => {
    apiClient.get('city')
      .then(response => {
        setCities(response.data || []); // Ensure cities is an array
      })
      .catch(error => {
        console.error('There was an error fetching the cities!', error);
      });
  };

  // Fetch countries from backend when component mounts
  const fetchCountries = () => {
    apiClient.get('country')
      .then(response => {
        setCountryOptions(response.data || []); // Ensure countryOptions is an array
      })
      .catch(error => {
        console.error('There was an error fetching the countries!', error);
      });
  };

  // Fetch states from backend when component mounts
  const fetchStates = () => {
    apiClient.get('state')
      .then(response => {
        setStateOptions(response.data || []); // Ensure stateOptions is an array
      })
      .catch(error => {
        console.error('There was an error fetching the states!', error);
      });
  };

  useEffect(() => {
    fetchCities();
    fetchCountries();
    fetchStates();
  }, []);

  const handleAddClick = () => {
    setCurrentCity({ code: '', name: '', state_id: '', country_id: '', index: null });
    setShowPopup(true);
  };

  const handleSaveClick = () => {
    const cityData = {
      code: currentCity.code,
      name: currentCity.name,
      state_id: parseInt(currentCity.state_id, 10), // Ensure this is an integer
      country_id: parseInt(currentCity.country_id, 10), // Ensure this is an integer
    };

    if (currentCity.index !== null) {
      // Edit existing city
      const cityId = cities[currentCity.index].id;
      apiClient.put(`cities/${cityId}`, cityData)
        .then(() => {
          fetchCities();  // Fetch the updated cities
          setShowPopup(false);
        })
        .catch(error => {
          console.error('There was an error updating the city!', error);
        });
    } else {
      // Add new city
      apiClient.post('cities', cityData)
        .then(() => {
          fetchCities();  // Fetch the updated cities
          setShowPopup(false);
        })
        .catch(error => {
          console.error('There was an error adding the city!', error);
        });
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCity(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDelete = (index) => {
    const cityId = cities[index].id;
    apiClient.delete(`cities/${cityId}`)
      .then(() => {
        fetchCities();  // Fetch the updated cities
      })
      .catch(error => {
        console.error('There was an error deleting the city!', error);
      });
  };

  const handleEdit = (index) => {
    const cityToEdit = cities[index];
    setCurrentCity({ 
      code: cityToEdit.code, 
      name: cityToEdit.name, 
      state_id: cityToEdit.state_id.toString(), // Convert state_id to string
      country_id: cityToEdit.country_id.toString(), // Convert country_id to string
      index 
    });
    setShowPopup(true);
  };

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "Cities" details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='lookup-data'>
        {cities.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>CITY CODE</th>
                <th>CITY NAME</th>
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
              {cities.map((city, index) => (
                <tr key={city.id}>
                  <td>{city.code}</td>
                  <td>{city.name}</td>
                  <td>{city.state_name}</td> {/* Directly map state name */}
                  <td>{city.country_name}</td> {/* Directly map country name */}
                  <td>{new Date(city.created_at).toLocaleString()}</td>
                  <td>{city.created_by}</td>
                  <td>{new Date(city.updated_at).toLocaleString()}</td>
                  <td>{city.updated_by}</td>
                  <td>
                        <button className='action-button'  onClick={() => handleEdit(index)}><div style={{fontSize:"24px"}}><CircumEdit/></div></button>
                        <button className='action-button' onClick={() => handleDelete(index)}><div style={{fontSize:"22px"}}><GravityUiTrashBin/></div></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No cities found. Click "Add" to create a new city.</div>
        )}
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>{currentCity.index !== null ? 'Edit City' : 'Add City'}</h2>
            <div className='form-group'>
              <label>City Code</label>
              <input
                type='text'
                name='code'
                value={currentCity.code}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>City Name</label>
              <input
                type='text'
                name='name'
                value={currentCity.name}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>State Name</label>
              <select
                name='state_id'
                value={currentCity.state_id}
                onChange={handleChange}
                className='dropdown-input'
              >
                <option value='' disabled>Select a state</option>
                {stateOptions.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label>Country Name</label>
              <select
                name='country_id'
                value={currentCity.country_id}
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
              <button onClick={handleSaveClick}>{currentCity.index !== null ? 'Save Changes' : 'Save'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cities;
