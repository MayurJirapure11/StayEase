import React from 'react'
import Navbar from './components/Navbar'
import { Route,Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home';
import AllRooms from './Pages/AllRooms';
import Footer from './components/Footer';
import RoomDetails from './Pages/RoomDetails';
import MyBookings from './Pages/MyBookings';
import HotelRegistration from './components/HotelRegistration';
import Layout from './Pages/HotelOwner/Layout';
import DashBoard from './Pages/HotelOwner/DashBoard';
import AddRoom from './Pages/HotelOwner/AddRoom';
import ListRoom from './Pages/HotelOwner/ListRoom';


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
          <Route path='/owner' element={<Layout/>}>
            <Route index element={<DashBoard/>}/>
            <Route path='add-room' element={<AddRoom/>}/>
            <Route path='list-room' element={<ListRoom/>}/>
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App