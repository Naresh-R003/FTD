import React, { useState } from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import logo from '../assets/Fieldtechy_logo.png';
import database from '../assets/database.png';
import payment from '../assets/credit-card.png';
import ticket from '../assets/ticket.png';
import setting from '../assets/settings.png';
import signout from '../assets/sign-out.png';
import { SolarHome2Linear } from '../icons';

const Sidebar = () => {
    const [showMasterData, setShowMasterData] = useState(false);
    const [showSaasSubmenu, setShowSaasSubmenu] = useState(false);
    const [showCorporateSubmenu, setShowCorporateSubmenu] = useState(false);
    const [showLookupData, setShowLookupData] = useState(false);

    const toggleMasterData = () => {
        setShowMasterData(!showMasterData);
        setShowSaasSubmenu(false); // Hide Saas submenu when Master Data is toggled
        setShowCorporateSubmenu(false); // Hide Corporate submenu when Master Data is toggled
    };

    const toggleSaasSubmenu = () => {
        setShowSaasSubmenu(!showSaasSubmenu);
    };

    const toggleCorporateSubmenu = () => {
        setShowCorporateSubmenu(!showCorporateSubmenu);
    };

    const toggleLookupData = () => {
        setShowLookupData(!showLookupData);
    };

    return (
        <div className='main-side'>
            <div className="imglogo">
                <NavLink to="/">
                    <img className='main-img' style={{ width: "100px" }} src={logo} alt="Logo" />
                </NavLink>
            </div>

            <div className='sidebar'>
                <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? 'sidebaritem isActive' : 'sidebaritem'}
                >
                    <div className="nav-icons">
                        <SolarHome2Linear />
                    </div>
                    <span className='sidebartext'>Home</span>
                </NavLink>

                <div 
                    className={`sidebaritem ${showMasterData ? 'isActive' : ''}`}
                    onClick={toggleMasterData}
                >
                    <img className='sidebaricon' src={database} alt="Database Icon" />
                    <span className='sidebartext'>Master Data</span>
                </div>
                {showMasterData && (
                    <div className='sublinks'>
                        <div 
                            className={`sublink ${showSaasSubmenu ? 'isActive' : ''}`} 
                            onClick={toggleSaasSubmenu}
                        >
                            Saas
                        </div>
                        {showSaasSubmenu && (
                            <div className='subsublinks'>
                                <NavLink 
                                    to="/master-data/saas/address" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Address
                                </NavLink>
                                <NavLink 
                                    to="/master-data/saas/company-details" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Company details
                                </NavLink>
                                <NavLink 
                                    to="/master-data/saas/rate-card" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Rate Card
                                </NavLink>
                                <NavLink 
                                    to="/master-data/saas/commission" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Commission percentage
                                </NavLink>
                                <NavLink 
                                    to="/master-data/saas/job" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Job configuration
                                </NavLink>
                                <NavLink 
                                    to="/master-data/saas/waiting" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Waiting period
                                </NavLink>
                                <NavLink 
                                    to="/master-data/saas/engineer" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Engineer level configuration
                                </NavLink>
                                <NavLink 
                                    to="/master-data/saas/discount" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Discount percentage
                                </NavLink>
                            </div>
                        )}
                        <div 
                            className={`sublink ${showCorporateSubmenu ? 'isActive' : ''}`} 
                            onClick={toggleCorporateSubmenu}
                        >
                            Corporate
                        </div>
                        {showCorporateSubmenu && (
                            <div className='subsublinks'>
                                <NavLink 
                                    to="/master-data/corporate/company-details" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Corporate Company Details
                                </NavLink>
                                <NavLink 
                                    to="/master-data/corporate/address" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Corporate Address
                                </NavLink>
                                <NavLink 
                                    to="/master-data/corporate/job-configuration" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Corporate Job Configuration
                                </NavLink>
                                <NavLink 
                                    to="/master-data/corporate/waiting-period" 
                                    className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                                >
                                    Corporate Waiting Period
                                </NavLink>
                            </div>
                        )}
                        <NavLink 
                            to="/master-data/user" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            User
                        </NavLink>
                        <NavLink 
                            to="/master-data/role" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Role
                        </NavLink>
                    </div>
                )}

                <div 
                    className={`sidebaritem ${showLookupData ? 'isActive' : ''}`} 
                    onClick={toggleLookupData}
                >
                    <img className='sidebaricon' src={payment} alt="Payment Icon" />
                    <span className='sidebartext'>Lookup Data</span>
                </div>
                {showLookupData && (
                    <div className='sublinks'>
                        <NavLink 
                            to="/Lookup-data/Roles" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Roles
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/Skills" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Skills
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/Services" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Services
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/Tools" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Tools
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/Tasks" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Tasks
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/Countries" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Country
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/States" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            State
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/Cities" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            City
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/Languages" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Language
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/Safety-wears" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Safety wears
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/Shipping-companies" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Shipping companies
                        </NavLink>
                        <NavLink 
                            to="/Lookup-data/Tax" 
                            className={({ isActive }) => isActive ? 'sublink isActive' : 'sublink'}
                        >
                            Tax
                        </NavLink>
                    </div>
                )}

                <NavLink 
                    to="/Transaction" 
                    className={({ isActive }) => isActive ? 'sidebaritem isActive' : 'sidebaritem'}
                >
                    <img className='sidebaricon' src={ticket} alt="Ticket Icon" />
                    <span className='sidebartext'>Transaction</span>
                </NavLink>

                <NavLink 
                    to="/Settings" 
                    className={({ isActive }) => isActive ? 'sidebaritem isActive' : 'sidebaritem'}
                >
                    <img className='sidebaricon' src={setting} alt="Setting Icon" />
                    <span className='sidebartext'>Settings</span>
                </NavLink>

                <NavLink 
                    to="/Signout" 
                    className={({ isActive }) => isActive ? 'sidebaritem isActive' : 'sidebaritem'}
                >
                    <img className='sidebaricon' src={signout} alt="Signout Icon" />
                    <span className='sidebartext'>Signout</span>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
