import React from 'react'
import Navbar from './components/Navbar'
import { Route,Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home';
import AllRooms from './Pages/AllRooms';
import Footer from './components/Footer';
import RoomDetails from './Pages/RoomDetails';
import MyBookings from './Pages/MyBookings';
import HotelRegistration from './components/HotelRegistration';


const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar />}
      {false && <HotelRegistration />}
      <div className='min-h-70vh'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails/>}/>
          <Route path='/my-bookings' element={<MyBookings/>}/>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App