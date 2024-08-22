import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Corporateaddress.css';
import { CompanyContext } from '../CompanyProvider';

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  },
});

const Corporateadress = () => {
  const { companyId } = useContext(CompanyContext);

  const [registeredAddress, setRegisteredAddress] = useState({
    streetName: '',
    areaName: '',
    country: '',
    state: '',
    city: '',
    pincode: ''
  });

  const [communicationAddress, setCommunicationAddress] = useState({
    streetName: '',
    areaName: '',
    country: '',
    state: '',
    city: '',
    pincode: ''
  });

  const [countries, setCountries] = useState([]);
  const [registeredStates, setRegisteredStates] = useState([]);
  const [registeredCities, setRegisteredCities] = useState([]);
  const [communicationStates, setCommunicationStates] = useState([]);
  const [communicationCities, setCommunicationCities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (companyId) {
      fetchCountries();
      fetchAddresses();
    }
  }, [companyId]);

  const fetchCountries = () => {
    apiClient.get('lookup/country')
      .then(response => {
        setCountries(response.data || []);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setError('Failed to fetch countries.');
      });
  };

  const fetchStates = (countryId, addressType) => {
    apiClient.get(`lookup/state?country_id=${countryId}`)
      .then(response => {
        const states = response.data || [];
        if (addressType === 'registered') {
          setRegisteredStates(states);
          setRegisteredCities([]);
          setRegisteredAddress(prev => ({ ...prev, state: '', city: '' }));
        } else {
          setCommunicationStates(states);
          setCommunicationCities([]);
          setCommunicationAddress(prev => ({ ...prev, state: '', city: '' }));
        }
      })
      .catch(error => {
        console.error('Error fetching states:', error);
        setError('Failed to fetch states.');
      });
  };

  const fetchCities = (stateId, addressType) => {
    apiClient.get(`lookup/city?state_id=${stateId}`)
      .then(response => {
        const cities = response.data || [];
        if (addressType === 'registered') {
          setRegisteredCities(cities);
          setRegisteredAddress(prev => ({ ...prev, city: '' }));
        } else {
          setCommunicationCities(cities);
          setCommunicationAddress(prev => ({ ...prev, city: '' }));
        }
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
        setError('Failed to fetch cities.');
      });
  };

  const fetchAddresses = () => {
    apiClient.get(`masterdata/corporate/${companyId}/address`)
      .then(response => {
        const { registered_address, communication_address } = response.data || {};
        setRegisteredAddress({
          streetName: registered_address.street_name || '',
          areaName: registered_address.area_name || '',
          country: registered_address.country_id || '',
          state: registered_address.state_id || '',
          city: registered_address.city_id || '',
          pincode: registered_address.pincode || ''
        });
        setCommunicationAddress({
          streetName: communication_address.street_name || '',
          areaName: communication_address.area_name || '',
          country: communication_address.country_id || '',
          state: communication_address.state_id || '',
          city: communication_address.city_id || '',
          pincode: communication_address.pincode || ''
        });
      })
      .catch(error => {
        console.error('Error fetching addresses:', error);
        setError('Failed to fetch addresses.');
      })
      .finally(() => setLoading(false));
  };

  const handleAddressChange = (addressType, field, value) => {
    if (addressType === 'registered') {
      setRegisteredAddress(prev => ({
        ...prev,
        [field]: value,
        ...(field === 'country' && { state: '', city: '' }),
        ...(field === 'state' && { city: '' })
      }));
      if (field === 'country') {
        fetchStates(value, 'registered');
      } else if (field === 'state') {
        fetchCities(value, 'registered');
      }
    } else {
      setCommunicationAddress(prev => ({
        ...prev,
        [field]: value,
        ...(field === 'country' && { state: '', city: '' }),
        ...(field === 'state' && { city: '' })
      }));
      if (field === 'country') {
        fetchStates(value, 'communication');
      } else if (field === 'state') {
        fetchCities(value, 'communication');
      }
    }
  };

  const handleSave = async () => {
    const formData = {
      registeredAddress,
      communicationAddress
    };

    try {
      const response = await apiClient.post(`masterdata/corporate/${companyId}/address`, formData);

      if (response.status === 200) {
        alert('Data saved successfully!');
      } else {
        alert('Failed to save data.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving data.');
    }
  };

  const handleUpdate = async () => {
    const formData = {
      registeredAddress,
      communicationAddress
    };

    try {
      const response = await apiClient.put(`masterdata/corporate/${companyId}/address`, formData);

      if (response.status === 200) {
        alert('Data updated successfully!');
      } else {
        alert('Failed to update data.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating data.');
    }
  };

  if (loading) {
    return <p>Loading addresses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="corporate-form-container">
      <h3 className="corporate-title">Registered Address</h3>
      <form className="corporate-address-form">
        <div className="corporate-input-group">
          <label htmlFor="registeredStreetName" className="corporate-label">STREET NAME</label>
          <input
            type="text"
            id="registeredStreetName"
            value={registeredAddress.streetName}
            onChange={(e) => handleAddressChange('registered', 'streetName', e.target.value)}
            className="corporate-input-field"
          />
        </div>
        <div className="corporate-input-group">
          <label htmlFor="registeredAreaName" className="corporate-label">AREA NAME</label>
          <input
            type="text"
            id="registeredAreaName"
            value={registeredAddress.areaName}
            onChange={(e) => handleAddressChange('registered', 'areaName', e.target.value)}
            className="corporate-input-field"
          />
        </div>
        <div className="corporate-input-group">
          <label htmlFor="registeredCountry" className="corporate-label">COUNTRY</label>
          <select
            id="registeredCountry"
            value={registeredAddress.country}
            onChange={(e) => handleAddressChange('registered', 'country', e.target.value)}
            className="corporate-select-field"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="corporate-input-group">
          <label htmlFor="registeredState" className="corporate-label">STATE</label>
          <select
            id="registeredState"
            value={registeredAddress.state}
            onChange={(e) => handleAddressChange('registered', 'state', e.target.value)}
            className="corporate-select-field"
            disabled={!registeredAddress.country}
          >
            <option value="">Select State</option>
            {registeredStates.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="corporate-input-group">
          <label htmlFor="registeredCity" className="corporate-label">CITY</label>
          <select
            id="registeredCity"
            value={registeredAddress.city}
            onChange={(e) => handleAddressChange('registered', 'city', e.target.value)}
            className="corporate-select-field"
            disabled={!registeredAddress.state}
          >
            <option value="">Select City</option>
            {registeredCities.map((ci) => (
              <option key={ci.id} value={ci.id}>{ci.name}</option>
            ))}
          </select>
        </div>
        <div className="corporate-input-group">
          <label htmlFor="registeredPincode" className="corporate-label">PIN CODE</label>
          <input
            type="text"
            id="registeredPincode"
            value={registeredAddress.pincode}
            onChange={(e) => handleAddressChange('registered', 'pincode', e.target.value)}
            className="corporate-input-field"
          />
        </div>
      </form>

      <h3 className="corporate-title">Communication Address</h3>
      <form className="corporate-address-form">
        <div className="corporate-input-group">
          <label htmlFor="communicationStreetName" className="corporate-label">STREET NAME</label>
          <input
            type="text"
            id="communicationStreetName"
            value={communicationAddress.streetName}
            onChange={(e) => handleAddressChange('communication', 'streetName', e.target.value)}
            className="corporate-input-field"
          />
        </div>
        <div className="corporate-input-group">
          <label htmlFor="communicationAreaName" className="corporate-label">AREA NAME</label>
          <input
            type="text"
            id="communicationAreaName"
            value={communicationAddress.areaName}
            onChange={(e) => handleAddressChange('communication', 'areaName', e.target.value)}
            className="corporate-input-field"
          />
        </div>
        <div className="corporate-input-group">
          <label htmlFor="communicationCountry" className="corporate-label">COUNTRY</label>
          <select
            id="communicationCountry"
            value={communicationAddress.country}
            onChange={(e) => handleAddressChange('communication', 'country', e.target.value)}
            className="corporate-select-field"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="corporate-input-group">
          <label htmlFor="communicationState" className="corporate-label">STATE</label>
          <select
            id="communicationState"
            value={communicationAddress.state}
            onChange={(e) => handleAddressChange('communication', 'state', e.target.value)}
            className="corporate-select-field"
            disabled={!communicationAddress.country}
          >
            <option value="">Select State</option>
            {communicationStates.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="corporate-input-group">
          <label htmlFor="communicationCity" className="corporate-label">CITY</label>
          <select
            id="communicationCity"
            value={communicationAddress.city}
            onChange={(e) => handleAddressChange('communication', 'city', e.target.value)}
            className="corporate-select-field"
            disabled={!communicationAddress.state}
          >
            <option value="">Select City</option>
            {communicationCities.map((ci) => (
              <option key={ci.id} value={ci.id}>{ci.name}</option>
            ))}
          </select>
        </div>
        <div className="corporate-input-group">
          <label htmlFor="communicationPincode" className="corporate-label">PIN CODE</label>
          <input
            type="text"
            id="communicationPincode"
            value={communicationAddress.pincode}
            onChange={(e) => handleAddressChange('communication', 'pincode', e.target.value)}
            className="corporate-input-field"
          />
        </div>
      </form>

      <div className="corporate-button-container">
        <button onClick={handleSave} className="corporate-button">Save</button>
        <button onClick={handleUpdate} className="corporate-button">Update</button>
      </div>
    </div>
  );
};

export default Corporateadress;
