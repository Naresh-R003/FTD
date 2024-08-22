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

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentTool, setCurrentTool] = useState({ name: '', description: '', index: null });

  // Fetch tools from backend when component mounts
  const fetchTools = () => {
    apiClient.get('tools')
      .then(response => {
        setTools(response.data || []);  // Ensure tools is an array
      })
      .catch(error => {
        console.error('There was an error fetching the tools!', error);
      });
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleAddClick = () => {
    setCurrentTool({ name: '', description: '', index: null });
    setShowPopup(true);
  };

  const handleSaveClick = () => {
    const toolData = {
      name: currentTool.name,
      description: currentTool.description,
    };

    if (currentTool.index !== null) {
      // Edit existing tool
      const toolId = tools[currentTool.index].id;
      apiClient.put(`tools/${toolId}`, toolData)
        .then(() => {
          fetchTools();  // Fetch the updated tools
          setShowPopup(false);
        })
        .catch(error => {
          console.error('There was an error updating the tool!', error);
        });
    } else {
      // Add new tool
      apiClient.post('tools', toolData)
        .then(() => {
          fetchTools();  // Fetch the updated tools
          setShowPopup(false);
        })
        .catch(error => {
          console.error('There was an error adding the tool!', error);
        });
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTool({ ...currentTool, [name]: value });
  };

  const handleDelete = (index) => {
    const toolId = tools[index].id;
    apiClient.delete(`tools/${toolId}`)
      .then(() => {
        fetchTools();  // Fetch the updated tools
      })
      .catch(error => {
        console.error('There was an error deleting the tool!', error);
      });
  };

  const handleEdit = (index) => {
    const toolToEdit = tools[index];
    setCurrentTool({ ...toolToEdit, index });
    setShowPopup(true);
  };

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "Tools" details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='lookup-data'>
        {tools.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>DESCRIPTION</th>
                <th>CREATED AT</th>
                <th>CREATED BY</th>
                <th>UPDATED AT</th>
                <th>UPDATED BY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool, index) => (
                <tr key={tool.id}>
                  <td>{tool.name}</td>
                  <td>{tool.description}</td>
                  <td>{new Date(tool.created_at).toLocaleString()}</td>
                  <td>{tool.created_by}</td>
                  <td>{new Date(tool.updated_at).toLocaleString()}</td>
                  <td>{tool.updated_by}</td>
                  <td>
                        <button className='action-button'  onClick={() => handleEdit(index)}><div style={{fontSize:"24px"}}><CircumEdit/></div></button>
                        <button className='action-button' onClick={() => handleDelete(index)}><div style={{fontSize:"22px"}}><GravityUiTrashBin/></div></button>
                      </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No tools found. Click "Add" to create a new tool.</div>
        )}
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>{currentTool.index !== null ? 'Edit Tool' : 'Add Tool'}</h2>
            <div className='form-group'>
              <label>Name</label>
              <input
                type='text'
                name='name'
                value={currentTool.name}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Description</label>
              <input
                type='text'
                name='description'
                value={currentTool.description}
                onChange={handleChange}
              />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>{currentTool.index !== null ? 'Save Changes' : 'Save'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tools;
