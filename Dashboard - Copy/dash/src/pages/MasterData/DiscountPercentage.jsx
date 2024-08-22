import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './DiscountPercentage.css';
import { CircumEdit, GravityUiTrashBin } from '../../icons';

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://192.168.1.12:8080/masterdata/saas/',
  headers: {
    'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
    'Content-Type': 'application/json',
    'User-Agent': 'insomnia/9.3.2'
  }
});

const DiscountPercentage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState({
    country: null,
    sla: null,
    fromHrs: '',
    toHrs: '',
    index: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch discounts and countries from backend
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [discountsResponse, countriesResponse] = await Promise.all([
        apiClient.get('discount'),
        axios.get('http://192.168.1.12:8080/lookup/country', {
          headers: {
            'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
          }
        })
      ]);
      setDiscounts(discountsResponse.data || []);
      setCountries(countriesResponse.data.map(country => ({ value: country.id, label: country.name })));
    } catch (error) {
      setError('There was an error fetching the data!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClick = () => {
    setCurrentDiscount({
      country: null,
      sla: null,
      fromHrs: '',
      toHrs: '',
      index: null
    });
    setShowPopup(true);
  };

  const handleSaveClick = async () => {
    const discountData = {
      country_id: currentDiscount.country ? parseInt(currentDiscount.country.value, 10) : null,
      sla_id: currentDiscount.sla ? parseInt(currentDiscount.sla.value, 10) : null,
      discount_from: parseInt(currentDiscount.fromHrs, 10),
      discount_to: parseInt(currentDiscount.toHrs, 10),
      id: currentDiscount.index !== null ? parseInt(discounts[currentDiscount.index].id, 10) : null // Include ID in payload for updates
    };

    try {
      if (currentDiscount.index !== null) {
        // Edit existing discount
        await apiClient.put('discount', discountData); // ID is now included in the payload
      } else {
        // Add new discount
        await apiClient.post('discount', discountData);
      }
      fetchData();  // Fetch the updated discounts
      setShowPopup(false);
    } catch (error) {
      setError('There was an error saving the discount!');
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDiscount(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setCurrentDiscount(prevState => ({ ...prevState, [name]: selectedOption }));
  };

  const handleDelete = async (index) => {
    try {
      await apiClient.delete(`discount/${discounts[index].id}`);
      fetchData();  // Fetch the updated discounts
    } catch (error) {
      setError('There was an error deleting the discount!');
    }
  };

  const handleEdit = (index) => {
    const discountToEdit = discounts[index];
    setCurrentDiscount({ 
      country: countries.find(c => c.value === discountToEdit.country_id) || null,
      sla: slaOptions.find(s => s.value === discountToEdit.sla_id) || null,
      fromHrs: discountToEdit.discount_from,
      toHrs: discountToEdit.discount_to,
      index 
    });
    setShowPopup(true);
  };

  // SLA options
  const slaOptions = [
    { value: 1, label: '4 Hours' },
    { value: 2, label: '6 Hours' },
    { value: 3, label: '24 Hours' }
  ];

  return (
    <div className='discount-main'>
      <div className='discount-title'>
        <div>You can add the discount details here.</div>
        <div>
          <button className='lookup-button' onClick={handleAddClick}>+ Add</button>
        </div>
      </div>
      <div className='discount-data'>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            {discounts.length > 0 ? (
              <table className='discount-table'>
                <thead>
                  <tr>
                    <th>COUNTRY</th>
                    <th>SLA</th>
                    <th>FROM (hrs)</th>
                    <th>TO (hrs)</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((discount, index) => (
                    <tr key={discount.id}>
                      <td className='row'>
                        <span className='row-content'>{countries.find(c => c.value === discount.country_id)?.label || ''}</span>
                      </td>
                      <td className='row'>
                        <span className='row-content'>{slaOptions.find(s => s.value === discount.sla_id)?.label || ''}</span>
                      </td>
                      <td className='row'>
                        <span className='row-content'>{discount.discount_from}</span>
                      </td>
                      <td className='row'>
                        <span className='row-content'>{discount.discount_to}</span>
                      </td>
                      <td>
                        <button className='action-button' onClick={() => handleEdit(index)}>
                          <div style={{ fontSize: "24px" }}><CircumEdit /></div>
                        </button>
                        <button className='action-button' onClick={() => handleDelete(index)}>
                          <div style={{ fontSize: "22px" }}><GravityUiTrashBin /></div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='no-data-message'>
                No discount details found. Click "Add" to create a new discount.
              </div>
            )}
          </>
        )}
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <h2>{currentDiscount.index !== null ? 'Edit Discount' : 'Add Discount'}</h2>
            <div className='form-group'>
              <label>Country</label>
              <Select
                name='country'
                value={currentDiscount.country}
                onChange={handleSelectChange}
                options={countries}
              />
            </div>
            <div className='form-group'>
              <label>SLA</label>
              <Select
                name='sla'
                value={currentDiscount.sla}
                onChange={handleSelectChange}
                options={slaOptions}
              />
            </div>
            <div className='form-group'>
              <label>From (hrs)</label>
              <input
                type='number'
                name='fromHrs'
                value={currentDiscount.fromHrs}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className='form-group'>
              <label>To (hrs)</label>
              <input
                type='number'
                name='toHrs'
                value={currentDiscount.toHrs}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className='popup-actions'>
              <button className='save-button' onClick={handleSaveClick}>Save</button>
              <button className='cancel-button' onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountPercentage;
