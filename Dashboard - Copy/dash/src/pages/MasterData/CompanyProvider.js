import React, { createContext, useState } from 'react';

// Create the context
export const CompanyContext = createContext();

// Create a provider component
export const CompanyProvider = ({ children }) => {
    const [companyId, setCompanyId] = useState(null);

    return (
        <CompanyContext.Provider value={{ companyId, setCompanyId }}>
            {children}
        </CompanyContext.Provider>
    );
};
