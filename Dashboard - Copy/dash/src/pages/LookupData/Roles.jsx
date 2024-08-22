import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roles.css';
import {CircumEdit,GravityUiTrashBin} from '../../icons'
// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/lookup/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
    'User-Agent': 'insomnia/9.3.2'
  }
});

const Roles = () => {
  const [roles, setRoles] = useState([]); // Initialize as empty array
  const [showPopup, setShowPopup] = useState(false);
  const [currentRole, setCurrentRole] = useState({ role: '', description: '', index: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch roles from backend when component mounts
  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('roles');
      setRoles(response.data || []); // Default to empty array if null
    } catch (error) {
      setError('There was an error fetching the roles!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddClick = () => {
    setCurrentRole({ role: '', description: '', index: null });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const roleData = {
      role: currentRole.role,
      description: currentRole.description,
    };

    try {
      if (currentRole.index !== null) {
        // Edit existing role
        await apiClient.put(`roles/${roles[currentRole.index].id}`, roleData);
      } else {
        // Add new role
        await apiClient.post('roles', roleData);
      }
      fetchRoles();  // Fetch the updated roles
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the role!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRole(prevState => ({ ...prevState, [name]: value }));
  };

  const handleDelete = async (index) => {
    try {
      await apiClient.delete(`roles/${roles[index].id}`);
      fetchRoles();  // Fetch the updated roles
    } catch (error) {
      setError('There was an error deleting the role!');
    }
  };

  const handleEdit = (index) => {
    const { role, description } = roles[index];
    setCurrentRole({ role, description, index });
    setShowPopup(true);
  };

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "Roles" details here.</div>
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
            {roles.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>ROLE NAME</th>
                    <th>DESCRIPTION</th>
                    <th>CREATED AT</th>
                    <th>CREATED BY</th>
                    <th>UPDATED AT</th>
                    <th>UPDATED BY</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role, index) => (
                    <tr key={role.id}>
                      <td>{role.role}</td>
                      <td>{role.description}</td>
                      <td>{new Date(role.created_at).toLocaleString()}</td>
                      <td>{role.created_by}</td>
                      <td>{new Date(role.updated_at).toLocaleString()}</td>
                      <td>{role.updated_by}</td>
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
                No roles found. Click "Add" to create a new role.
              </div>
            )}
          </>
        )}
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>{currentRole.index !== null ? 'Edit Role' : 'Add Role'}</h2>
            <div className='form-group'>
              <label>Role Name</label>
              <input
                type='text'
                name='role'
                value={currentRole.role}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Description</label>
              <input
                type='text'
                name='description'
                value={currentRole.description}
                onChange={handleChange}
              />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>{currentRole.index !== null ? 'Save Changes' : 'Save'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;

