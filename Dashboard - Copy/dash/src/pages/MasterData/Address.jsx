import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Address.css';

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  },
});

const Address = () => {
    const [streetName, setStreetName] = useState('');
    const [areaName, setAreaName] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Fetch countries from backend
    const fetchCountries = () => {
        apiClient.get('lookup/country')
            .then(response => {
                setCountries(response.data || []);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    };

    // Fetch states from backend based on selected country
    const fetchStates = (countryId) => {
        apiClient.get(`lookup/state?country_id=${countryId}`)
            .then(response => {
                setStates(response.data || []);
            })
            .catch(error => {
                console.error('Error fetching states:', error);
            });
    };

    // Fetch cities from backend based on selected state
    const fetchCities = (stateId) => {
        apiClient.get(`lookup/city?state_id=${stateId}`)
            .then(response => {
                setCities(response.data || []);
            })
            .catch(error => {
                console.error('Error fetching cities:', error);
            });
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        if (country) {
            fetchStates(country);
        } else {
            setStates([]);
            setState('');
            setCities([]);
            setCity('');
        }
    }, [country]);

    useEffect(() => {
        if (state) {
            fetchCities(state);
        } else {
            setCities([]);
            setCity('');
        }
    }, [state]);

    // Fetch data for pre-populating form fields (if applicable)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('masterdata/saas/address');

                if (response.data) {
                    const data = response.data;

                    setStreetName(data.street_name || '');
                    setAreaName(data.area_name || '');
                    setCountry(data.country_id || '');
                    setState(data.state_id || '');
                    setCity(data.city_id || '');
                    setPincode(data.pincode || '');
                }
            } catch (error) {
                console.error('No data found or error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    
    const handleUpdate = async () => {
        const updatedData = {
            street_name: streetName,
            area_name: areaName,
            country_id: parseInt(country, 10),
            state_id: parseInt(state, 10),
            city_id: parseInt(city, 10),
            pincode: pincode
        };

        try {
            const response = await apiClient.put('masterdata/saas/address', updatedData);

            if (response.status === 200) {
                alert('Data updated successfully!');
                setIsEditing(false); // Disable editing after update
            } else {
                alert('Failed to update data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating data.');
        }
    };

    return (
        <div className="form-container">
            <h2 className='saas-title'> Address</h2>
            <form className='address-form'>
                <div className="input-group">
                    <label htmlFor="streetName" className="label">STREET NAME</label>
                    <input
                        type="text"
                        id="streetName"
                        value={streetName}
                        placeholder='Street Name'
                        onChange={(e) => setStreetName(e.target.value)}
                        className="input-field"
                        disabled={!isEditing}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="areaName" className="label">AREA NAME</label>
                    <input
                        type="text"
                        id="areaName"
                        placeholder='Area Name'
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
                        className="input-field"
                        disabled={!isEditing}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="country" className="label">COUNTRY</label>
                    <select
                        id="country"
                        value={country}
                        onChange={(e) => {
                            setCountry(e.target.value);
                            setState('');
                            setCity('');
                        }}
                        className="select-field"
                        disabled={!isEditing}
                    >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="state" className="label">STATE</label>
                    <select
                        id="state"
                        value={state}
                        onChange={(e) => {
                            setState(e.target.value);
                            setCity('');
                        }}
                        className="select-field"
                        disabled={!country || !isEditing}
                    >
                        <option value="">Select State</option>
                        {states.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="city" className="label">CITY</label>
                    <select
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="select-field"
                        disabled={!state || !isEditing}
                    >
                        <option value="">Select City</option>
                        {cities.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="pincode" className="label">PINCODE</label>
                    <input
                        type="text"
                        id="pincode"
                        placeholder='Pincode'
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="input-field"
                        disabled={!isEditing}
                    />
                </div>
                <div className="button-group">
                    {isEditing ? (
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="save-button"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
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

export default Address;
