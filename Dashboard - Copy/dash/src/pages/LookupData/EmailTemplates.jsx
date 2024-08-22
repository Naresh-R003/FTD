import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roles.css'; // Make sure to create this CSS file or adjust the path if needed
import {CircumEdit,GravityUiTrashBin} from '../../icons'

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/lookup/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
  }
});

const EmailTemplates = () => {
  const [emails, setEmails] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentEmail, setCurrentEmail] = useState({ event: '', subject: '', message: '', index: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch email templates from backend when component mounts
  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('email_templates');
      setEmails(response.data || []); // Handle potential null response
    } catch (error) {
      setError('There was an error fetching the email templates!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleAddClick = () => {
    setCurrentEmail({ event: '', subject: '', message: '', index: null });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const emailData = {
      event: currentEmail.event || '', // Default to empty string if null
      subject: currentEmail.subject || '',
      message: currentEmail.message || ''
    };

    try {
      if (currentEmail.index !== null) {
        // Edit existing email template
        const emailId = emails[currentEmail.index]?.id;
        if (emailId) {
          await apiClient.put(`email_templates/${emailId}`, emailData);
        }
      } else {
        // Add new email template
        await apiClient.post('email_templates', emailData);
      }
      fetchEmails();  // Fetch the updated email templates
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the email template!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmail(prevState => ({
      ...prevState,
      [name]: value || '' // Default to empty string if value is null
    }));
  };

  const handleDelete = async (index) => {
    const emailId = emails[index]?.id;
    if (!emailId) return;  // Ensure ID exists before attempting deletion

    try {
      await apiClient.delete(`email_templates/${emailId}`);
      fetchEmails();  // Fetch the updated email templates
    } catch (error) {
      setError('There was an error deleting the email template!');
    }
  };

  const handleEdit = (index) => {
    const emailToEdit = emails[index];
    setCurrentEmail({
      event: emailToEdit.event || '', // Default to empty string if null
      subject: emailToEdit.subject || '',
      message: emailToEdit.message || '',
      index
    });
    setShowPopup(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='lookup-main'>
      <div className='lookup-title'>
        <div>You can add the "Email Templates" details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='lookup-data'>
        {emails.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>EVENT</th>
                <th>SUBJECT</th>
                <th>MESSAGE</th>
                <th>CREATED AT</th>
                <th>CREATED BY</th>
                <th>UPDATED AT</th>
                <th>UPDATED BY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email, index) => (
                <tr key={email.id}>
                  <td>{email.event || '-'}</td>
                  <td>{email.subject || '-'}</td>
                  <td>{email.message || '-'}</td>
                  <td>{email.created_at ? new Date(email.created_at).toLocaleString() : '-'}</td>
                  <td>{email.created_by || '-'}</td>
                  <td>{email.updated_at ? new Date(email.updated_at).toLocaleString() : '-'}</td>
                  <td>{email.updated_by || '-'}</td>
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
            <h2>{currentEmail.index !== null ? 'Edit Email Template' : 'Add Email Template'}</h2>
            <div className='form-group'>
              <label>Event</label>
              <input
                type='text'
                name='event'
                value={currentEmail.event || ''} // Default to empty string if null
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Subject</label>
              <input
                type='text'
                name='subject'
                value={currentEmail.subject || ''} // Default to empty string if null
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label>Message</label>
              <textarea
                name='message'
                value={currentEmail.message || ''} // Default to empty string if null
                onChange={handleChange}
              />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSaveClick}>{currentEmail.index !== null ? 'Save Changes' : 'Save'}</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailTemplates;
