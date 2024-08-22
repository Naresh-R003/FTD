import './App.css'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'

import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Masterdata from './pages/Masterdata'
import Engineers from './pages/Engineers'
import Payments from './pages/Payments'
import Tickets from './pages/Tickets'
import Settings from './pages/Settings'
import Roles from "./pages/LookupData/Roles"
import Languages from './pages/LookupData/Languages'
import SafetyWears from './pages/LookupData/SafetyWears'
import Tools from './pages/LookupData/Tools'
import Skills from './pages/LookupData/Skills'
import Tasks from './pages/LookupData/Tasks'
import EmailTemplates from './pages/LookupData/EmailTemplates'
import Services from './pages/LookupData/Services'
import Countries from './pages/LookupData/Countries'
import States from './pages/LookupData/States'
import Cities from './pages/LookupData/Cities'
import Address from "./pages/MasterData/Address"
import CompanyDetails from './pages/MasterData/CompanyDetails'
import CommissionPercentage from './pages/MasterData/CommissionPercentage'
import JobConfiguration from './pages/MasterData/JobConfiguration'
import WaitingPeriod from './pages/MasterData/WaitingPeriod'
import EngineerLevelConfiguration from './pages/MasterData/EngineerLevelConfiguration'
import DiscountPercentage from './pages/MasterData/DiscountPercentage'
import CorporateJob from './pages/MasterData/Corporate/CorporateJob'
import CorporateCompanyDetails from './pages/MasterData/Corporate/CorporateCompanyDetails'
import CorporateWaitingPeriod from './pages/MasterData/Corporate/CorporateWaitingPeriod'
import Corporateadress from './pages/MasterData/Corporate/Corporateadress'
function App() {
  

  return (
    <div className='app'>
      <Sidebar/>
      <Routes>

        <Route path='/' element={<Dashboard/>}/>
        <Route path='/Engineers' element={<Engineers/>}/>
        <Route path='/Masterdata' element={<Masterdata/>}/>
        
        <Route path='/Payments' element={<Payments/>}/>
        <Route path='/Tickets' element={<Tickets/>}/>
        <Route path='/Settings' element={<Settings/>}/>


        <Route path='/Lookup-data/Roles' element={<Roles/>}/>
        <Route path='/Lookup-data/Languages' element={<Languages/>}/>
        <Route path='/Lookup-data/Tasks' element={<Tasks/>}/>
        <Route path='/Lookup-data/Skills' element={<Skills/>}/>
        <Route path='/Lookup-data/Services' element={<Services/>}/>
        <Route path='/Lookup-data/Tools' element={<Tools/>}/>
        <Route path='/Lookup-data/Safety-wears' element={<SafetyWears/>}/>
        <Route path='/Lookup-data/Email-Templates' element={<EmailTemplates/>}/>
        <Route path='/Lookup-data/Countries' element={<Countries/>}/>
        <Route path='/Lookup-data/Cities' element={<Cities/>}/>
        <Route path='/Lookup-data/States' element={<States/>}/>

          
        <Route path='/master-data/saas/address' element={<Address/>}/>
        <Route path='/master-data/saas/company-details' element={<CompanyDetails/>}/>
        <Route path='/master-data/saas/commission' element={<CommissionPercentage/>}/>
        <Route path='/master-data/saas/job' element={<JobConfiguration/>}/>
        <Route path='/master-data/saas/waiting' element={<WaitingPeriod/>}/>
        <Route path='/master-data/saas/engineer' element={<EngineerLevelConfiguration/>}/>
        <Route path='/master-data/saas/discount' element={<DiscountPercentage/>}/>
        <Route path='/master-data/corporate/address' element={<Corporateadress/>}/>
        <Route path='/master-data/corporate/company-details' element={<CorporateCompanyDetails/>}/>
        <Route path='/master-data/corporate/job-configuration' element={<CorporateJob/>}/>
        <Route path='/master-data/corporate/waiting-period' element={<CorporateWaitingPeriod/>}/>

        {/* <Route path='/Lookup-data/Roles' element={<Roles/>}/>
        <Route path='/Lookup-data/Languages' element={<Languages/>}/> */}

      </Routes>
     
    </div>
  )
}

export default App
