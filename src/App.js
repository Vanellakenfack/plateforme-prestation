import React from "react";
import { BrowserRouter,Routes,Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfessionalPage from "./components/ProfessionalPage";
import Services from "./components/pages/pro/Services"
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./HomePage";
import Professionel from './components/pages/pro/Professionel';
import Login from './components/pages/Login';
import Signin from './components/pages/Signin'
import Profiles from './components/pages/pro/Profiles'
import Messages from './components/pages/pro/Messages'
import Service from './components/pages/Service'
import ClientDashboard from "./components/pages/client/ClientDashbord";
import Reservation from "./components/pages/client/Reservation";
import Dashboard from "./components/pages/pro/Dashboard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import Profile from './components/pages/pro/Profile'
import Calendrier from './components/pages/pro/Calendrier'
import AvailabilityCalendar from "./components/pages/pro/AvailabilityCalendar";
import { SiG2 } from "react-icons/si";
import ProfessionalsPage from "./components/ProfessionalPage";
import Portfolio from "./components/pages/pro/Portfolio";
import Message from "./components/pages/client/Message";
import AdminDashboard from "./components/pages/admin/AdminDashbord";
import User from "./components/pages/admin/User";
import Search from "./Search";
function App() {
  return (
   
     <>
     <BrowserRouter>
        <Routes>
          <Route  path='/' element={<HomePage/>}></Route>
          <Route  path='/login' element={<Login/>}></Route>
          <Route  path='/signin' element={<Signin/>}></Route>
          <Route  path='/services' element={<Service/>}></Route>
          <Route  path='/search' element={<Search/>}></Route>

          {/** route  du professionel */}
          <Route  path='/professionel' element={<Professionel/>}></Route>
          <Route  path='/profile' element={<Profiles/>}></Route>
        
         <Route  path='/dashboard' element={<Dashboard/>}></Route>
         <Route  path='/message' element={<Messages/>}></Route>
                  <Route  path='/disponibilite' element={<AvailabilityCalendar/>}></Route>

          <Route  path='/professional' element={<ProfessionalsPage/>}></Route>
          <Route  path='/service' element={<Services/>}></Route>
          <Route  path='/calendrier' element={<Calendrier/>}></Route>
          <Route  path='/portfolio' element={<Portfolio/>}></Route>

          {/** route  du client */}
          <Route  path='/clientdashboard' element={<ClientDashboard/>}></Route>
          <Route  path='/reservation' element={<Reservation/>}></Route>
          <Route  path='/messageclient' element={<Message/>}></Route>
         {/** route  du admin */}
         <Route  path='/admindash' element={<AdminDashboard/>}></Route>
         <Route  path='/user' element={<User/>}></Route>






        </Routes>
      </BrowserRouter>    
            
       <ToastContainer />
    
     </>
   
  )
  
  
}

export default App;
