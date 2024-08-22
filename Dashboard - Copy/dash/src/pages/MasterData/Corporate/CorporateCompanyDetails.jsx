import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './CorporateCompanyDetails.css';
import { CompanyContext } from '../CompanyProvider';

const apiClient = axios.create({
    baseURL: 'http://192.168.1.12:8080/',
    headers: {
        'Authorization': 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJrYXJ0aGlja3NpdmEwODA1QGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImVuZF91c2VyIiwiaXNzIjoid3d3LnRlY2V6ZS5jb20ifQ.SNxEtjt6POhMG0VgFLJZQhWssdBA1tOs9pDVH_hSrRQ',
        'Content-Type': 'application/json',
    },
});

const CorporateCompanyDetails = () => {
    const { companyId, setCompanyId } = useContext(CompanyContext); // Using context to manage companyId
    const [companyName, setCompanyName] = useState('');
    const [registeredCountries, setRegisteredCountries] = useState([]);
    const [communicationCountries, setCommunicationCountries] = useState([]);
    const [additionalCountries, setAdditionalCountries] = useState([]);
    const [companyDescription, setCompanyDescription] = useState('');
    const [countries, setCountries] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch the list of countries
    const fetchCountries = () => {
        apiClient.get('lookup/country')
            .then(response => {
                setCountries(response.data || []);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    };

    // Fetch company details and set the companyId in the context
    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('masterdata/corporate/details');
                if (response.data) {
                    const data = response.data;

                    setCompanyId(data.id || null); // Setting companyId in the context
                    setCompanyName(data.company_name || '');
                    setRegisteredCountries(data.agreed_on_countries.map(countryId => {
                        const country = countries.find(c => c.id === countryId);
                        return { label: country?.name, value: countryId };
                    }));
                    setCommunicationCountries(data.on_site_countries.map(countryId => {
                        const country = countries.find(c => c.id === countryId);
                        return { label: country?.name, value: countryId };
                    }));
                    setAdditionalCountries(data.remote_countries.map(countryId => {
                        const country = countries.find(c => c.id === countryId);
                        return { label: country?.name, value: countryId };
                    }));
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

        if (countries.length > 0) {
            fetchData();
        }
    }, [countries, setCompanyId]); // Depend on setCompanyId

    // Handle saving the company details
    const handleSave = async () => {
        const formData = {
            id: companyId, // Include companyId in the payload
            company_name: companyName,
            agreed_on_countries: registeredCountries.map(country => country.value),
            on_site_countries: communicationCountries.map(country => country.value),
            remote_countries: additionalCountries.map(country => country.value),
            about: companyDescription,
        };

        try {
            const response = isEditMode
                ? await apiClient.put('masterdata/corporate/details', formData)
                : await apiClient.post('masterdata/corporate/details', formData);

            if (response.status === 200) {
                alert(isEditMode ? 'Corporate data updated successfully!' : 'Corporate data added successfully!');
            } else {
                alert('Failed to save corporate data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving corporate data.');
        }
    };

    return (
        <div className="form-container">
            <h2 className="saas-title">Corporate Company Details</h2>
            <form className="company-form">
                <div className="input-group">
                    <label htmlFor="companyName" className="companylabel">REGISTERED COMPANY NAME</label>
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
                    <label htmlFor="registeredCountries" className="companylabel">REGISTERED COUNTRIES</label>
                    <Select
                        id="registeredCountries"
                        options={countries.map(country => ({ value: country.id, label: country.name }))}
                        value={registeredCountries}
                        onChange={setRegisteredCountries}
                        isMulti
                        className="companyselect-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="communicationCountries" className="companylabel">COMMUNICATION COUNTRIES</label>
                    <Select
                        id="communicationCountries"
                        options={registeredCountries}
                        value={communicationCountries}
                        onChange={setCommunicationCountries}
                        isMulti
                        className="companyselect-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="additionalCountries" className="companylabel">ADDITIONAL COUNTRIES</label>
                    <Select
                        id="additionalCountries"
                        options={registeredCountries}
                        value={additionalCountries}
                        onChange={setAdditionalCountries}
                        isMulti
                        className="companyselect-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="companyDescription" className="companylabel">ABOUT THE CORPORATION</label>
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

export default CorporateCompanyDetails;
