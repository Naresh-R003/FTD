import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roles.css'; // Ensure CSS file is renamed accordingly
import {CircumEdit,GravityUiTrashBin} from '../../icons'

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/lookup/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  },
});

const Languages = () => {
  const [languages, setLanguages] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({
    name: '',
    index: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch languages from backend when component mounts
  const fetchLanguages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('languages');
      setLanguages(response.data || []); // Handle potential null response
    } catch (error) {
      setError('There was an error fetching the languages!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleAddClick = () => {
    setCurrentLanguage({ name: '', index: null });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const languageData = {
      name: currentLanguage.name || '', // Default to empty string if null
    };

    try {
      if (currentLanguage.index !== null) {
        // Edit existing language
        const languageId = languages[currentLanguage.index]?.id;
        if (languageId) {
          await apiClient.put(`languages/${languageId}`, languageData);
        }
      } else {
        // Add new language
        await apiClient.post('languages', languageData);
      }
      fetchLanguages();  // Fetch the updated languages
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the language!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentLanguage(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDelete = async (index) => {
    const languageId = languages[index]?.id;
    if (!languageId) return;  // Ensure ID exists before attempting deletion

    try {
      await apiClient.delete(`languages/${languageId}`);
      fetchLanguages();  // Fetch the updated languages
    } catch (error) {
      setError('There was an error deleting the language!');
    }
  };

  const handleEdit = (index) => {
    const languageToEdit = languages[index];
    setCurrentLanguage({
      name: languageToEdit.name || '',
      index
    });
    setShowPopup(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "Languages" details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='lookup-data'>
        {languages.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>CREATED AT</th>
                <th>CREATED BY</th>
                <th>UPDATED AT</th>
                <th>UPDATED BY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((language, index) => (
                <tr key={language.id}>
                  <td>{language.name || '-'}</td>
                  <td>{language.created_at ? new Date(language.created_at).toLocaleString() : '-'}</td>
                  <td>{language.created_by || '-'}</td>
                  <td>{language.updated_at ? new Date(language.updated_at).toLocaleString() : '-'}</td>
                  <td>{language.updated_by || '-'}</td>
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
            <h2>{currentLanguage.index !== null ? 'Edit Language' : 'Add Language'}</h2>
            <div className='form-group'>
              <label>Name</label>
              <input
                type='text'
                name='name'
                value={currentLanguage.name || ''} // Default to empty string if null
                onChange={handleChange}
              />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>{currentLanguage.index !== null ? 'Save Changes' : 'Save'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Languages;
