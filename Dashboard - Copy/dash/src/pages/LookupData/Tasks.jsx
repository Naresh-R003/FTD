import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roles.css';  // Assuming you have a similar CSS file for Tasks
import {CircumEdit,GravityUiTrashBin} from '../../icons'

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/lookup/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  }
});

const Tasks = () => {
  const [tasks, setTasks] = useState([]); // Initialize as an empty array
  const [showPopup, setShowPopup] = useState(false);
  const [currentTask, setCurrentTask] = useState({ name: '', description: '', index: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks from backend when component mounts
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('tasks');
      setTasks(response.data || []); // Ensure tasks is always an array
    } catch (error) {
      setError('There was an error fetching the tasks!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddClick = () => {
    setCurrentTask({ name: '', description: '', index: null });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const taskData = {
      name: currentTask.name,
      description: currentTask.description,
    };

    try {
      if (currentTask.index !== null) {
        // Edit existing task
        const taskId = tasks[currentTask.index].id;
        await apiClient.put(`tasks/${taskId}`, taskData);
      } else {
        // Add new task
        await apiClient.post('tasks', taskData);
      }
      fetchTasks();  // Fetch the updated tasks
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the task!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
  };

  const handleDelete = async (index) => {
    try {
      const taskId = tasks[index].id;
      await apiClient.delete(`tasks/${taskId}`);
      fetchTasks();  // Fetch the updated tasks
    } catch (error) {
      setError('There was an error deleting the task!');
    }
  };

  const handleEdit = (index) => {
    const taskToEdit = tasks[index];
    setCurrentTask({ ...taskToEdit, index });
    setShowPopup(true);
  };

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "Tasks" details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='lookup-data'>
        {loading ? (
          <div>Loading tasks...</div>
        ) : error ? (
          <div>{error}</div>
        ) : tasks.length > 0 ? (
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
              {tasks.map((task, index) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{new Date(task.created_at).toLocaleString()}</td>
                  <td>{task.created_by}</td>
                  <td>{new Date(task.updated_at).toLocaleString()}</td>
                  <td>{task.updated_by}</td>
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
            No tasks found. Click "Add" to create a new task.
          </div>
        )}
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>{currentTask.index !== null ? 'Edit Task' : 'Add Task'}</h2>
            <div className='form-group'>
              <label>Name</label>
              <input
                type='text'
                name='name'
                value={currentTask.name}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Description</label>
              <input
                type='text'
                name='description'
                value={currentTask.description}
                onChange={handleChange}
              />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>{currentTask.index !== null ? 'Save Changes' : 'Save'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
