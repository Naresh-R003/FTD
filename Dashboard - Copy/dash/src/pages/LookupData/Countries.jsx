import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roles.css';  // Assuming the same CSS is used
import { CircumEdit, GravityUiTrashBin } from '../../icons';

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/lookup/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
    'User-Agent': 'insomnia/9.3.2'
  }
});

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentCountry, setCurrentCountry] = useState({
    code: '',
    name: '',
    currency_code: '',
    currency_symbol: '',
    decimal_value: '',
    calling_code: '',
    language: [],  // Initialize as an empty array
    engineer_payout_currency: '',
    engineer_payout_currency_symbol: '',
    zipcode_pattern: '',
    index: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch countries from backend when component mounts
  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('country');
      setCountries(response.data || []);  // Handle potential null response
    } catch (error) {
      setError('There was an error fetching the countries!');
    } finally {
      setLoading(false);
    }
  };

  // Fetch languages from backend when component mounts
  const fetchLanguages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('languages');
      setLanguages(response.data || []);  // Handle potential null response
    } catch (error) {
      setError('There was an error fetching the languages!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchLanguages();
  }, []);

  const handleAddClick = () => {
    setCurrentCountry({
      code: '',
      name: '',
      currency_code: '',
      currency_symbol: '',
      decimal_value: '',
      calling_code: '',
      language: [],  // Reset to an empty array
      engineer_payout_currency: '',
      engineer_payout_currency_symbol: '',
      zipcode_pattern: '',
      index: null
    });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const countryData = {
      code: currentCountry.code || '',  // Default to empty string if null
      name: currentCountry.name || '',
      currency_code: currentCountry.currency_code || '',
      currency_symbol: currentCountry.currency_symbol || '',
      decimal_value: currentCountry.decimal_value || '',
      calling_code: currentCountry.calling_code || '',
      language: currentCountry.language || [],  // Default to empty array if null
      engineer_payout_currency: currentCountry.engineer_payout_currency || '',
      engineer_payout_currency_symbol: currentCountry.engineer_payout_currency_symbol || '',
      zipcode_pattern: currentCountry.zipcode_pattern || '',
    };

    try {
      if (currentCountry.index !== null) {
        // Edit existing country
        await apiClient.put(`countries/${countries[currentCountry.index].id}`, countryData);
      } else {
        // Add new country
        await apiClient.post('countries', countryData);
      }
      fetchCountries();  // Fetch the updated countries
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the country!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCountry(prevState => ({
      ...prevState,
      [name]: name === 'language' ? [parseInt(value, 10)] : value
    }));
  };

  const handleDelete = async (index) => {
    const countryId = countries[index]?.id;
    if (!countryId) return;  // Ensure ID exists before attempting deletion

    try {
      await apiClient.delete(`countries/${countryId}`);
      fetchCountries();  // Fetch the updated countries
    } catch (error) {
      setError('There was an error deleting the country!');
    }
  };

  const handleEdit = (index) => {
    const countryToEdit = countries[index];
    setCurrentCountry({
      code: countryToEdit?.code || '',
      name: countryToEdit?.name || '',
      currency_code: countryToEdit?.currency_code || '',
      currency_symbol: countryToEdit?.currency_symbol || '',
      decimal_value: countryToEdit?.decimal_value || '',
      calling_code: countryToEdit?.calling_code || '',
      language: countryToEdit?.language ? [parseInt(countryToEdit.language_id, 10)] : [],  // Convert to integer array
      engineer_payout_currency: countryToEdit?.engineer_payout_currency || '',
      engineer_payout_currency_symbol: countryToEdit?.engineer_payout_currency_symbol || '',
      zipcode_pattern: countryToEdit?.zipcode_pattern || '',
      index
    });
    setShowPopup(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "Countries" details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='lookup-data'>
        {countries.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>COUNTRY CODE</th>
                <th>COUNTRY NAME</th>
                <th>CURRENCY CODE</th>
                <th>CURRENCY SYMBOL</th>
                <th>DECIMAL VALUE</th>
                <th>CALLING CODE</th>
                <th>LANGUAGES</th>
                <th>ENGINEER PAYOUT CURRENCY</th>
                <th>ENGINEER PAYOUT CURRENCY SYMBOL</th>
                <th>ZIPCODE PATTERN</th>
                <th>CREATED AT</th>
                <th>CREATED BY</th>
                <th>UPDATED AT</th>
                <th>UPDATED BY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country, index) => (
                <tr key={country.id}>
                  <td>{country.code || '-'}</td>
                  <td>{country.name || '-'}</td>
                  <td>{country.currency_code || '-'}</td>
                  <td>{country.currency_symbol || '-'}</td>
                  <td>{country.decimal_value || '-'}</td>
                  <td>{country.calling_code || '-'}</td>
                  <td>{(country.language_names || []).join(', ')}</td> {/* Handle potential null values */}
                  <td>{country.engineer_payout_currency || '-'}</td>
                  <td>{country.engineer_payout_currency_symbol || '-'}</td>
                  <td>{country.zipcode_pattern || '-'}</td>
                  <td>{country.created_at ? new Date(country.created_at).toLocaleString() : '-'}</td>
                  <td>{country.created_by || '-'}</td>
                  <td>{country.updated_at ? new Date(country.updated_at).toLocaleString() : '-'}</td>
                  <td>{country.updated_by || '-'}</td>
                  <td>
                    <button className='action-button' onClick={() => handleEdit(index)}>
                      <div style={{ fontSize: '24px' }}>
                        <CircumEdit />
                      </div>
                    </button>
                    <button className='action-button' onClick={() => handleDelete(index)}>
                      <div style={{ fontSize: '22px' }}>
                        <GravityUiTrashBin />
                      </div>
                    </button>
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
            <h2>{currentCountry.index !== null ? 'Edit Country' : 'Add Country'}</h2>
            <div className='form-group'>
              <label>Country Code</label>
              <input
                type='text'
                name='code'
                value={currentCountry.code}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Country Name</label>
              <input
                type='text'
                name='name'
                value={currentCountry.name}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Currency Code</label>
              <input
                type='text'
                name='currency_code'
                value={currentCountry.currency_code}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Currency Symbol</label>
              <input
                type='text'
                name='currency_symbol'
                value={currentCountry.currency_symbol}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Decimal Value</label>
              <input
                type='text'
                name='decimal_value'
                value={currentCountry.decimal_value}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Calling Code</label>
              <input
                type='text'
                name='calling_code'
                value={currentCountry.calling_code}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Language</label>
              <select
                name='language'
                value={currentCountry.language[0] || ''} // Access the first element of the language array
                onChange={handleChange}
              >
                <option value=''>Select a language</option>
                {languages.map(language => (
                  <option key={language.id} value={language.id}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label>Engineer Payout Currency</label>
              <input
                type='text'
                name='engineer_payout_currency'
                value={currentCountry.engineer_payout_currency}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Engineer Payout Currency Symbol</label>
              <input
                type='text'
                name='engineer_payout_currency_symbol'
                value={currentCountry.engineer_payout_currency_symbol}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Zipcode Pattern</label>
              <input
                type='text'
                name='zipcode_pattern'
                value={currentCountry.zipcode_pattern}
                onChange={handleChange}
              />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>{currentCountry.index !== null ? 'Save' : 'Add'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Countries;
