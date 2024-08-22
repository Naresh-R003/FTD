import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roles.css'; // Adjust this path if needed, or create a specific CSS file for Skills
import {CircumEdit,GravityUiTrashBin} from '../../icons'

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/lookup/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  }
});

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSkill, setCurrentSkill] = useState({ name: '', index: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch skills from backend when component mounts
  useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch skills data from the backend
  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('skills');
      setSkills(response.data || []); // Ensure skills is always an array
    } catch (error) {
      setError('There was an error fetching the skills!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentSkill({ name: '', index: null });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const skillData = {
      name: currentSkill.name,
    };

    try {
      if (currentSkill.index !== null) {
        // Edit existing skill
        const skillId = skills[currentSkill.index].id;
        await apiClient.put(`skills/${skillId}`, skillData);
      } else {
        // Add new skill
        await apiClient.post('skills', skillData);
      }
      fetchSkills();  // Fetch the updated skills
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the skill!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSkill(prevState => ({ ...prevState, [name]: value }));
  };

  const handleDelete = async (index) => {
    try {
      const skillId = skills[index].id;
      await apiClient.delete(`skills/${skillId}`);
      fetchSkills();  // Fetch the updated skills
    } catch (error) {
      setError('There was an error deleting the skill!');
    }
  };

  const handleEdit = (index) => {
    const skillToEdit = skills[index];
    setCurrentSkill({ ...skillToEdit, index });
    setShowPopup(true);
  };

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "Skills" details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='lookup-data'>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            {skills.length > 0 ? (
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
                  {skills.map((skill, index) => (
                    <tr key={skill.id}>
                      <td>{skill.name}</td>
                      <td>{new Date(skill.created_at).toLocaleString()}</td>
                      <td>{skill.created_by}</td>
                      <td>{new Date(skill.updated_at).toLocaleString()}</td>
                      <td>{skill.updated_by}</td>
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
                No skills found. Click "Add" to create a new skill.
              </div>
            )}
          </>
        )}
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>{currentSkill.index !== null ? 'Edit Skill' : 'Add Skill'}</h2>
            <div className='form-group'>
              <label>Name</label>
              <input
                type='text'
                name='name'
                value={currentSkill.name}
                onChange={handleChange}
              />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>{currentSkill.index !== null ? 'Save Changes' : 'Save'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
