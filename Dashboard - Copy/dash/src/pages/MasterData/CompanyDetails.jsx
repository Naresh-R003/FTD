import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './CompanyDetails.css';

const apiClient = axios.create({
    baseURL: 'http://192.168.1.12:8080/',
    headers: {
        'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
        'Content-Type': 'application/json',
    },
});

const CompanyDetails = () => {
    const [companyName, setCompanyName] = useState('');
    const [agreedCountriesNames, setAgreedCountriesNames] = useState([]);
    const [onSiteCountriesNames, setOnSiteCountriesNames] = useState([]);
    const [remoteCountriesNames, setRemoteCountriesNames] = useState([]);
    const [companyDescription, setCompanyDescription] = useState('');
    const [countries, setCountries] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchCountries = () => {
        apiClient.get('lookup/country')
            .then(response => {
                setCountries(response.data || []);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('masterdata/saas/details');
                if (response.data) {
                    const data = response.data;

                    setCompanyName(data.company_name || '');
                    setAgreedCountriesNames(data.agreed_on_countries_names.map(name => ({ label: name, value: name })));
                    setOnSiteCountriesNames(data.on_site_countries_names.map(name => ({ label: name, value: name })));
                    setRemoteCountriesNames(data.remote_countries_names.map(name => ({ label: name, value: name })));
                    setCompanyDescription(data.about || '');
                    setIsEditMode(true); // Set edit mode if data exists
                } else {
                    setIsEditMode(false); // No data, so we're in add mode
                }
            } catch (error) {
                console.error('No data found or error fetching data:', error);
                setIsEditMode(false); // Error fetching data, assume add mode
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        const formData = {
            company_name: companyName,
            agreed_on_countries_names: agreedCountriesNames.map(country => country.value),
            on_site_countries_names: onSiteCountriesNames.map(country => country.value),
            remote_countries_names: remoteCountriesNames.map(country => country.value),
            about: companyDescription,
        };

        try {
            const response = isEditMode
                ? await apiClient.put('masterdata/saas/details', formData) // Update existing data
                : await apiClient.post('masterdata/saas/details', formData); // Add new data

            if (response.status === 200) {
                alert(isEditMode ? 'Data updated successfully!' : 'Data added successfully!');
            } else {
                alert('Failed to save data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving data.');
        }
    };

    return (
        <div className="form-container">
            <h2 className="saas-title">Company Details</h2>
            <form className="company-form">
                <div className="input-group">
                    <label htmlFor="companyName" className="companylabel">COMPANY NAME</label>
                    <input
                        type="text"
                        id="companyName"
                        placeholder="Company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="companyinput-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="agreedCountriesNames" className="companylabel">AGREED COUNTRIES</label>
                    <Select
                        id="agreedCountriesNames"
                        options={countries.map(country => ({ value: country.name, label: country.name }))}
                        value={agreedCountriesNames}
                        onChange={setAgreedCountriesNames}
                        isMulti
                        className="companyselect-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="onSiteCountriesNames" className="companylabel">ON-SITE COUNTRIES</label>
                    <Select
                        id="onSiteCountriesNames"
                        options={agreedCountriesNames}
                        value={onSiteCountriesNames}
                        onChange={setOnSiteCountriesNames}
                        isMulti
                        className="companyselect-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="remoteCountriesNames" className="companylabel">REMOTE COUNTRIES</label>
                    <Select
                        id="remoteCountriesNames"
                        options={agreedCountriesNames}
                        value={remoteCountriesNames}
                        onChange={setRemoteCountriesNames}
                        isMulti
                        className="companyselect-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="companyDescription" className="companylabel">ABOUT THE COMPANY</label>
                    <input
                        type="text"
                        id="companyDescription"
                        placeholder="Company Description"
                        value={companyDescription}
                        onChange={(e) => setCompanyDescription(e.target.value)}
                        className="companyinput-field"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    className="save-button"
                >
                    {isEditMode ? 'Update' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default CompanyDetails;
